import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { fetchN8n } from '@/lib/psicometriasServer';
import { sendOpsAlert } from '@/lib/mailer';

// ── WF-002 Requisicion → Perfil Estructurado ──────────────────────
// Webhook n8n de producción para el perfilador de requisiciones B2B.
// El workflow valida, enriquece con Gemini, respalda en Sheets y
// envía correos al equipo de reclutamiento y al cliente.
const WEBHOOK_PATH = '/webhook/wf-002-requisicion';
const TIMEOUT_MS = 15_000; // 15 s — suficiente para el round-trip n8n

/** Avisa al buzón interno con la requisición adjunta para reprocesarla a mano. */
function alertRequisicion(body: any, idempotencyKey: string, reason: string) {
  return sendOpsAlert(
    `Requisición sin procesar: ${body?.vacante?.titulo || 'vacante'} · ${body?.empresa?.nombre || 'empresa'}`,
    [
      `Una requisición de empresa NO llegó a n8n (${WEBHOOK_PATH}).`,
      ``,
      `Empresa:  ${body?.empresa?.nombre || '-'}`,
      `Contacto: ${body?.contacto?.email || '-'}`,
      `Vacante:  ${body?.vacante?.titulo || '-'}`,
      `Motivo:   ${reason}`,
      `Clave:    ${idempotencyKey}`,
      ``,
      `El JSON adjunto es la requisición completa para reenviarla cuando n8n esté arriba.`,
    ].join('\n'),
    [{ filename: `requisicion-${idempotencyKey.slice(0, 8)}.json`, content: JSON.stringify(body, null, 2) }]
  );
}

export async function POST(request: Request) {
  const idempotencyKey = randomUUID();
  const started = Date.now();

  let body: any = null;
  try {
    body = await request.json();

    // Minimal server-side guard: empresa.nombre + contacto.email + vacante.titulo
    const e = body?.empresa;
    const c = body?.contacto;
    const v = body?.vacante;
    if (!e?.nombre?.trim() || !c?.email?.trim() || !v?.titulo?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos críticos: empresa, email o título de vacante.' },
        { status: 422 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetchN8n(WEBHOOK_PATH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error(
          `[WF-002] n8n respondió ${response.status} | key=${idempotencyKey} | body=${errText.slice(0, 200)}`
        );
        await alertRequisicion(body, idempotencyKey, `n8n respondió HTTP ${response.status}`);
        return NextResponse.json(
          { success: false, message: `Error del servidor n8n: ${response.status}` },
          { status: response.status >= 500 ? 502 : response.status }
        );
      }

      console.log(
        `[WF-002] OK ${Date.now() - started}ms | key=${idempotencyKey} | vacante=${v.titulo} | empresa=${e.nombre}`
      );

      return NextResponse.json({ success: true, idempotencyKey });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        console.error(`[WF-002] Timeout ${TIMEOUT_MS}ms | key=${idempotencyKey}`);
        await alertRequisicion(body, idempotencyKey, `n8n no respondió en ${TIMEOUT_MS / 1000} s`);
        return NextResponse.json(
          { success: false, message: 'El servidor de workflows no respondió a tiempo. Tu borrador se ha guardado localmente.' },
          { status: 504 }
        );
      }
      throw fetchErr; // re-throw for outer catch
    }
  } catch (error: any) {
    console.error(`[WF-002] Error proxy perfilador | key=${idempotencyKey}`, error?.message || error);
    if (body) await alertRequisicion(body, idempotencyKey, `error de red: ${error?.cause?.code || error?.message || error}`);
    return NextResponse.json(
      { success: false, message: 'Error interno del proxy al conectar con el webhook de requisiciones.' },
      { status: 500 }
    );
  }
}
