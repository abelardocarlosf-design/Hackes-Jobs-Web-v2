import { NextResponse } from 'next/server';
import { N8N_BASE_URL, testWebhookPaths } from '@/lib/psicometriasServer';
import { sendOpsAlert } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health/n8n — chequeo diario (cron de Vercel, ver vercel.json).
 *
 * Detecta ANTES de que un candidato lo sufra lo que tumbó las psicometrías el
 * 2026-09-17: el host de `N8N_BASE_URL` dejó de resolver y nadie se enteró.
 * Revisa que el host configurado responda y que cada webhook esté publicado,
 * sin disparar ningún workflow: un GET a un webhook POST publicado devuelve
 * "not registered for GET requests", y a uno despublicado "is not registered".
 *
 * Vercel manda `Authorization: Bearer $CRON_SECRET` en cada ejecución del cron.
 */
const WEBHOOK_PATHS: Record<string, string> = {
  ...testWebhookPaths,
  requisicion: 'webhook/wf-002-requisicion',
};

const TIMEOUT_MS = 10_000;

type Check = { nombre: string; ok: boolean; detalle: string };

async function probe(url: string): Promise<{ status: number | null; text: string; error?: string }> {
  try {
    const resp = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
    return { status: resp.status, text: await resp.text().catch(() => '') };
  } catch (err: any) {
    return { status: null, text: '', error: err?.cause?.code || err?.name || err?.message || String(err) };
  }
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, message: 'No autorizado' }, { status: 401 });
  }

  const checks: Check[] = [];

  const salud = await probe(`${N8N_BASE_URL}/healthz`);
  checks.push({
    nombre: `Servidor n8n (${N8N_BASE_URL})`,
    ok: salud.status === 200,
    detalle: salud.status === null ? `sin conexión: ${salud.error}` : `HTTP ${salud.status}`,
  });

  // Si el servidor no contesta, revisar cada webhook solo repetiría el mismo error.
  if (checks[0].ok) {
    const resultados = await Promise.all(
      Object.entries(WEBHOOK_PATHS).map(async ([nombre, path]) => {
        const r = await probe(`${N8N_BASE_URL}/${path}`);
        const publicado = r.text.includes('not registered for GET');
        return {
          nombre: `Webhook ${nombre} (/${path})`,
          ok: publicado,
          detalle: publicado
            ? 'publicado'
            : r.status === null
              ? `sin conexión: ${r.error}`
              : `NO publicado o inexistente (HTTP ${r.status})`,
        };
      })
    );
    checks.push(...resultados);
  }

  const fallas = checks.filter((c) => !c.ok);
  if (fallas.length > 0) {
    await sendOpsAlert(
      `n8n con fallas: ${fallas.length} de ${checks.length} revisiones`,
      [
        `El chequeo diario encontró problemas. Mientras sigan, las psicometrías o requisiciones`,
        `afectadas no generan reporte (cada envío fallido manda su propia alerta con el payload).`,
        ``,
        ...checks.map((c) => `${c.ok ? '✔' : '✘'} ${c.nombre}: ${c.detalle}`),
        ``,
        `Si falla el servidor: revisa N8N_BASE_URL en Vercel y el DNS del dominio en Hostinger.`,
        `Si falla un webhook: abre ese workflow en n8n y confirma que esté publicado.`,
      ].join('\n')
    );
  }

  return NextResponse.json({ ok: fallas.length === 0, checks }, { status: fallas.length ? 503 : 200 });
}
