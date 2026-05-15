import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { resolveWebhookUrl } from '@/lib/psicometriasServer';

export const dynamic = 'force-dynamic';

const CONTRACT_VERSION = '1.0.0';
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 2000;
const JITTER_MS = 250;
const REQUEST_TIMEOUT_MS = 15000;

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
    // ACCIÓN 1 — BACKUP LOCAL (FAIL-SAFE). Pasa primero, siempre.
    // Si el backup local falla, NO enviamos al webhook (regla no negociable).
    // ════════════════════════════════════════════════════════════════════════
    let backupOk = false;
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
      logStructured('error', 'backup.local.failed', {
        testId: slug,
        candidateId,
        idempotencyKey,
        attempt: 0,
        errorMessage: backupError instanceof Error ? backupError.message : String(backupError),
      });
      // Política: backup falla → no enviar (regla "Backup local primero, red después").
      return NextResponse.json(
        { success: false, message: 'No fue posible respaldar la prueba. Reintenta en unos segundos.' },
        { status: 500 }
      );
    }

    // ════════════════════════════════════════════════════════════════════════
    // ACCIÓN 2 — Despacho a n8n con reintentos
    // ════════════════════════════════════════════════════════════════════════
    const webhookUrl = resolveWebhookUrl(slug);
    if (!webhookUrl) {
      logStructured('warn', 'webhook.unmapped', {
        testId: slug,
        candidateId,
        idempotencyKey,
        attempt: 0,
      });
      // Backup OK pero no hay webhook: consideramos éxito parcial documentado.
      return NextResponse.json({
        success: true,
        backup: true,
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
        const resp = await fetch(webhookUrl, {
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
            backup: true,
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
          return NextResponse.json({
            success: true, // el respaldo está OK; reportamos al cliente como éxito de su parte
            backup: true,
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
