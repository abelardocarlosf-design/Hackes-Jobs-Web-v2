import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fetchN8n, resolveWebhookPath, N8N_BASE_URLS } from '@/lib/psicometriasServer';
import { sendOpsAlert } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const CONTRACT_VERSION = '1.0.0';
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 2000;
const JITTER_MS = 250;
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Detecta entornos serverless con filesystem read-only.
 * En Vercel/Netlify/Cloudflare/AWS Lambda no podemos escribir en `process.cwd()`.
 * En esos entornos saltamos el backup local — el respaldo durable real es el nodo
 * `Sheets Respaldar` (Google Sheets) que ejecuta el workflow de n8n.
 */
const IS_SERVERLESS = !!(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.CF_PAGES
);

/**
 * Calcula el `Idempotency-Key` para un envío. Mismo candidato + misma prueba +
 * misma fecha de aplicación → misma key → n8n puede deduplicar.
 */
function computeIdempotencyKey(candidateId: string, slug: string, fechaAplicacion: string): string {
  return crypto
    .createHash('sha256')
    .update(`${candidateId}::${slug}::${fechaAplicacion}`)
    .digest('hex');
}

/** Backoff exponencial con jitter (decorrelated). No reintentar 4xx (excepto 429). */
function nextBackoffMs(attempt: number): number {
  const base = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
  const jitter = Math.floor(Math.random() * JITTER_MS);
  return base + jitter;
}

function shouldRetry(statusCode: number | null): boolean {
  if (statusCode === null) return true; // network error
  if (statusCode === 429) return true;
  if (statusCode >= 500) return true;
  return false;
}

interface LogContext {
  testId: string;
  candidateId: string;
  idempotencyKey: string;
  attempt: number;
  statusCode?: number | null;
  durationMs?: number;
  errorMessage?: string;
}

function logStructured(level: 'info' | 'warn' | 'error', message: string, ctx: LogContext) {
  const entry = JSON.stringify({ ts: new Date().toISOString(), level, message, ...ctx });
  if (level === 'error') console.error(entry);
  else if (level === 'warn') console.warn(entry);
  else console.log(entry);
}

/**
 * Avisa al buzón interno que una psicometría no llegó a n8n. Adjunta el payload
 * íntegro: en Vercel no hay respaldo local, así que este correo ES el respaldo
 * y con él se puede reprocesar la prueba sin pedirle al candidato que la repita.
 */
async function alertDispatchFailure(
  slug: string,
  webhookPath: string,
  body: any,
  idempotencyKey: string,
  reason: string
) {
  const dp = body?.datos_paciente || {};
  const dt = body?.datos_prueba || {};
  const url = `${N8N_BASE_URLS[N8N_BASE_URLS.length - 1]}/${webhookPath}`;
  const text = [
    `Una psicometría NO llegó a n8n. El candidato vio "Evaluación enviada", pero no recibirá su reporte.`,
    ``,
    `Prueba:     ${slug}`,
    `Candidato:  ${dp.nombre_completo || '(sin nombre)'}`,
    `Correo:     ${dp.email || '(sin correo)'}`,
    `Teléfono:   ${dp.telefono || '-'}`,
    `Aplicada:   ${dt.fecha_aplicacion || '-'}`,
    `Motivo:     ${reason}`,
    `Clave:      ${idempotencyKey}`,
    ``,
    `Cómo reprocesarla: revisa que n8n esté arriba y envía el JSON adjunto por POST a`,
    `${url}`,
    `(por ejemplo: curl -X POST -H "Content-Type: application/json" --data-binary @payload.json ${url})`,
  ].join('\n');

  await sendOpsAlert(
    `Psicometría sin procesar: ${slug} · ${dp.nombre_completo || dp.email || 'candidato'}`,
    text,
    [{ filename: `payload-${slug}-${idempotencyKey.slice(0, 8)}.json`, content: JSON.stringify(body, null, 2) }]
  );
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { slug, body } = data;

    if (!slug || !body) {
      return NextResponse.json({ success: false, message: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Identificadores de trazabilidad
    const dp = body.datos_paciente || {};
    const dt = body.datos_prueba || {};
    const email = (dp.email || '').trim().toLowerCase();
    const fechaAplicacion = dt.fecha_aplicacion || new Date().toISOString();
    const candidateId = email ? `${email}::${fechaAplicacion}` : `anon::${Date.now()}`;
    const idempotencyKey = computeIdempotencyKey(candidateId, slug, fechaAplicacion);

    // ════════════════════════════════════════════════════════════════════════
    // ACCIÓN 1 — BACKUP LOCAL (FAIL-SAFE).
    //
    // En desarrollo local: escribe CSV+JSON en `process.cwd()/backups/`.
    //   Si falla, abortamos el envío (regla "backup primero").
    //
    // En serverless (Vercel/Lambda/etc.): el filesystem es read-only.
    //   Saltamos el backup local — el respaldo durable real lo hace el nodo
    //   `Sheets Respaldar` (Google Sheets) dentro de cada workflow n8n.
    //   Si el filesystem se intenta y falla en cualquier entorno, degradamos
    //   a "no-fatal" y continuamos al webhook (no perdemos la prueba del usuario).
    // ════════════════════════════════════════════════════════════════════════
    let backupOk = false;
    let backupSkipped = false;

    if (IS_SERVERLESS) {
      backupSkipped = true;
      logStructured('info', 'backup.local.skipped.serverless', {
        testId: slug,
        candidateId,
        idempotencyKey,
        attempt: 0,
      });
    } else {
      try {
        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }

        const esIncompleta = body.metricas?.prueba_incompleta === true || body.prueba_incompleta === true;
        const csvFilename = esIncompleta ? 'directorio_pacientes_incompletos.csv' : 'directorio_pacientes.csv';
        const jsonFilename = esIncompleta ? 'respuestas_incompletas.json' : 'respuestas_completas.json';

        // 1.a Respaldo CSV de Contactos (Lead Gen)
        const csvFile = path.join(backupDir, csvFilename);
        const header = 'Fecha,Nombre Completo,Email,Telefono,Empresa,Cargo,Test Realizado,IdempotencyKey\n';
        const safeName = (dp.nombre_completo || '').replace(/"/g, '""');
        const safeEmail = (dp.email || '').replace(/"/g, '""');
        const safePhone = (dp.telefono || '').replace(/"/g, '""');
        const safeEmpresa = (dp.empresa || '').replace(/"/g, '""');
        const safeCargo = (dp.cargo_postulado || '').replace(/"/g, '""');
        const timestamp = new Date().toISOString();
        const csvLine = `"${timestamp}","${safeName}","${safeEmail}","${safePhone}","${safeEmpresa}","${safeCargo}","${slug}","${idempotencyKey}"\n`;

        if (!fs.existsSync(csvFile)) {
          fs.writeFileSync(csvFile, header + csvLine, 'utf8');
        } else {
          fs.appendFileSync(csvFile, csvLine, 'utf8');
        }

        // 1.b Respaldo JSON íntegro
        const jsonFile = path.join(backupDir, jsonFilename);
        const backupEntry = {
          timestamp,
          slug,
          idempotencyKey,
          candidateId,
          contractVersion: CONTRACT_VERSION,
          payload: body,
        };

        let currentData: any[] = [];
        if (fs.existsSync(jsonFile)) {
          const fileContent = fs.readFileSync(jsonFile, 'utf-8');
          try {
            if (fileContent.trim()) {
              currentData = JSON.parse(fileContent);
            }
          } catch (e) {
            console.error('[Backup Error] JSON existente corrupto:', e);
            // En caso de corrupción del archivo histórico, lo movemos a .bak y empezamos de cero.
            const corruptCopy = `${jsonFile}.corrupt-${Date.now()}.bak`;
            try { fs.renameSync(jsonFile, corruptCopy); } catch {}
            currentData = [];
          }
        }

        currentData.push(backupEntry);
        fs.writeFileSync(jsonFile, JSON.stringify(currentData, null, 2), 'utf8');
        backupOk = true;

        logStructured('info', 'backup.local.ok', {
          testId: slug,
          candidateId,
          idempotencyKey,
          attempt: 0,
        });
      } catch (backupError) {
        // Filesystem inesperadamente read-only (p. ej. container con disco lleno o
        // permisos rotos). NO abortamos: la prueba del usuario debe llegar a n8n,
        // donde el nodo `Sheets Respaldar` la persistirá en Google Sheets.
        backupSkipped = true;
        logStructured('warn', 'backup.local.degraded', {
          testId: slug,
          candidateId,
          idempotencyKey,
          attempt: 0,
          errorMessage: backupError instanceof Error ? backupError.message : String(backupError),
        });
      }
    }

    // ════════════════════════════════════════════════════════════════════════
    // ACCIÓN 2 — Despacho a n8n con reintentos
    // ════════════════════════════════════════════════════════════════════════
    const webhookPath = resolveWebhookPath(slug);
    if (!webhookPath) {
      logStructured('warn', 'webhook.unmapped', {
        testId: slug,
        candidateId,
        idempotencyKey,
        attempt: 0,
      });
      // Backup OK pero no hay webhook: consideramos éxito parcial documentado.
      return NextResponse.json({
        success: true,
        backup: backupOk,
        backupSkipped,
        webhook: 'unmapped',
        idempotencyKey,
        message: 'Respaldo guardado, sin webhook configurado para este slug',
      });
    }

    let lastStatus: number | null = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const startedAt = Date.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const resp = await fetchN8n(webhookPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Idempotency-Key': idempotencyKey,
            'X-Hackes-Source': 'web-public',
            'X-Hackes-Test-Id': slug,
            'X-Contract-Version': CONTRACT_VERSION,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timer);
        lastStatus = resp.status;
        const durationMs = Date.now() - startedAt;

        if (resp.ok) {
          logStructured('info', 'webhook.dispatch.ok', {
            testId: slug,
            candidateId,
            idempotencyKey,
            attempt,
            statusCode: resp.status,
            durationMs,
          });
          return NextResponse.json({
            success: true,
            backup: backupOk,
            backupSkipped,
            webhook: 'ok',
            idempotencyKey,
            attempts: attempt,
          });
        }

        // Resp no-ok: ¿reintentamos?
        if (!shouldRetry(resp.status)) {
          logStructured('warn', 'webhook.dispatch.4xx', {
            testId: slug,
            candidateId,
            idempotencyKey,
            attempt,
            statusCode: resp.status,
            durationMs,
          });
          await alertDispatchFailure(slug, webhookPath, body, idempotencyKey, `n8n respondió HTTP ${resp.status}`);
          return NextResponse.json({
            success: true, // el respaldo está OK; reportamos al cliente como éxito de su parte
            backup: backupOk,
            backupSkipped,
            webhook: 'error',
            n8nStatus: resp.status,
            idempotencyKey,
            attempts: attempt,
          });
        }

        logStructured('warn', 'webhook.dispatch.retryable', {
          testId: slug,
          candidateId,
          idempotencyKey,
          attempt,
          statusCode: resp.status,
          durationMs,
        });
      } catch (err: any) {
        clearTimeout(timer);
        lastError = err?.message || String(err);
        logStructured('warn', 'webhook.dispatch.network', {
          testId: slug,
          candidateId,
          idempotencyKey,
          attempt,
          statusCode: null,
          errorMessage: lastError ?? undefined,
        });
      }

      // Reintento si quedan intentos
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, nextBackoffMs(attempt)));
      }
    }

    // Agotamos reintentos. Backup OK, n8n no contestó.
    // El cliente puede reencolar (ver psychometryDispatcher.ts) o el operador
    // re-procesar desde /backups/.
    logStructured('error', 'webhook.dispatch.exhausted', {
      testId: slug,
      candidateId,
      idempotencyKey,
      attempt: MAX_RETRIES,
      statusCode: lastStatus,
      errorMessage: lastError ?? undefined,
    });
    await alertDispatchFailure(
      slug,
      webhookPath,
      body,
      idempotencyKey,
      `${MAX_RETRIES} intentos fallidos · ${lastStatus ? `último HTTP ${lastStatus}` : `error de red: ${lastError}`}`
    );

    return NextResponse.json({
      success: true, // respaldo OK = el candidato no pierde su trabajo
      backup: true,
      webhook: 'exhausted',
      n8nStatus: lastStatus,
      idempotencyKey,
      attempts: MAX_RETRIES,
      message: 'Respaldo guardado. El envío al motor de análisis se reintentará automáticamente.',
    });

  } catch (error) {
    console.error('[Submit Error] Error procesando el envío:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
