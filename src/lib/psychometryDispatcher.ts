/**
 * psychometryDispatcher — Punto ÚNICO de envío de psicometrías al backend.
 *
 * Contrato v1 (sección 4 del prompt de auditoría). Esta capa:
 *   1) construye el payload normalizado (mapper + extras por prueba),
 *   2) lo entrega al endpoint server-side `/api/psicometrias/submit` (donde
 *      vive el backup local-primero y la URL de n8n),
 *   3) si falla por red, encola en localStorage y reintenta al próximo `online`.
 *
 * IMPORTANTE: este módulo NO conoce las URLs de n8n. Solo el `testId`.
 * El servidor resuelve el destino (ver `src/lib/psicometriasServer.ts`).
 *
 * Para sumar la psicometría #10:
 *   - Agregar entrada en TEST_REGISTRY con su `code`, `name`, `priceTier`, `mapper`.
 *   - Agregar el path en `src/lib/psicometriasServer.ts` (`testWebhookPaths`).
 *   - Listo. No hay que tocar este archivo más.
 */

export type TestId =
  | 'luscher'
  | 'disc'
  | 'allport'
  | 'moss'
  | 'zavic'
  | 'kostick'
  | 'terman'
  | '16pf'
  | 'mmpi';

export type PriceTier = 'free' | '349' | '519' | '867';

export const CONTRACT_VERSION = '1.0.0';

export interface TestConfig {
  id: TestId;
  code: string;           // WF-001 … WF-009
  name: string;
  priceTier: PriceTier;
  version: string;
}

export interface CandidateData {
  nombre_completo: string;
  email: string;
  telefono?: string;
  empresa?: string;
  cargo_postulado?: string;
}

export interface TestRunMetrics {
  total_preguntas: number;
  preguntas_contestadas: number;
  fecha_aplicacion: string;          // ISO 8601 UTC
  duracion_segundos: number;
  estado_finalizacion: 'completa' | 'parcial' | 'abandonada';
  time_out_agotado?: boolean;
}

export interface SubmitInput {
  testId: TestId;
  candidate: CandidateData;
  metrics: TestRunMetrics;
  respuestas: Record<string, unknown>;
  extras?: Record<string, unknown>;
}

export type SubmitResult =
  | { ok: true; idempotencyKey: string; attempts?: number; webhook?: 'ok' | 'unmapped' | 'error' | 'exhausted' }
  | { ok: false; error: string; queued: boolean };

/**
 * Registro declarativo de las 9 psicometrías activas.
 * Raven está intencionalmente fuera (comingSoon, sin workflow en n8n).
 */
export const TEST_REGISTRY: Readonly<Record<TestId, TestConfig>> = Object.freeze({
  luscher: { id: 'luscher', code: 'WF-001', name: 'Lüscher',  priceTier: 'free', version: '1.0.0' },
  disc:    { id: 'disc',    code: 'WF-002', name: 'DISC',     priceTier: 'free', version: '1.0.0' },
  allport: { id: 'allport', code: 'WF-003', name: 'Allport',  priceTier: 'free', version: '1.0.0' },
  moss:    { id: 'moss',    code: 'WF-004', name: 'Moss',     priceTier: '349',  version: '1.0.0' },
  zavic:   { id: 'zavic',   code: 'WF-005', name: 'Zavic',    priceTier: '349',  version: '1.0.0' },
  kostick: { id: 'kostick', code: 'WF-006', name: 'Kostick',  priceTier: '349',  version: '1.0.0' },
  terman:  { id: 'terman',  code: 'WF-007', name: 'Terman',   priceTier: '519',  version: '1.0.0' },
  '16pf':  { id: '16pf',    code: 'WF-008', name: '16PF',     priceTier: '867',  version: '1.0.0' },
  mmpi:    { id: 'mmpi',    code: 'WF-009', name: 'MMPI-2',   priceTier: '867',  version: '1.0.0' },
});

const QUEUE_KEY = 'hj_psych_queue_v1';
const SUBMIT_ENDPOINT = '/api/psicometrias/submit';

interface QueuedItem {
  enqueuedAt: string;
  slug: TestId;
  body: Record<string, unknown>;
}

function loadQueue(): QueuedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedItem[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(items: QueuedItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('[dispatcher] No se pudo persistir cola offline:', e);
  }
}

function uuidV4(): string {
  if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
  // RFC4122 v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function deriveEstadoFinalizacion(m: TestRunMetrics): 'completa' | 'parcial' | 'abandonada' {
  if (m.estado_finalizacion) return m.estado_finalizacion;
  if (m.preguntas_contestadas === 0) return 'abandonada';
  if (m.preguntas_contestadas >= m.total_preguntas) return 'completa';
  return 'parcial';
}

/**
 * Construye el payload contrato-v1 que el endpoint enviará a n8n.
 * Mantiene compatibilidad con campos legacy que ya consumían flujos anteriores
 * (`test_slug`, `test_nombre`, `nombre_paciente`, etc.) para no romper nada.
 */
function buildPayload(input: SubmitInput): Record<string, unknown> {
  const cfg = TEST_REGISTRY[input.testId];
  if (!cfg) throw new Error(`[dispatcher] testId no registrado: ${input.testId}`);

  const candidate = input.candidate;
  const metrics = input.metrics;
  const estado = deriveEstadoFinalizacion(metrics);
  const completitudPct = metrics.total_preguntas > 0
    ? Math.round((metrics.preguntas_contestadas / metrics.total_preguntas) * 100)
    : 0;
  const pruebaIncompleta = metrics.preguntas_contestadas < metrics.total_preguntas;

  const sessionId = uuidV4();
  const clientTs = new Date().toISOString();
  const candidateId = candidate.email
    ? `${candidate.email.trim().toLowerCase()}::${metrics.fecha_aplicacion}`
    : `anon::${Date.now()}`;

  return {
    // === Contrato v1 (raíz canónica) ===
    contract_version: CONTRACT_VERSION,
    test: {
      id: cfg.id,
      code: cfg.code,
      name: cfg.name,
      price_tier: cfg.priceTier,
      version: cfg.version,
    },

    datos_paciente: {
      nombre_completo: (candidate.nombre_completo || '').trim(),
      email: (candidate.email || '').trim().toLowerCase(),
      empresa: candidate.empresa?.trim() || 'No especificado',
      cargo_postulado: candidate.cargo_postulado?.trim() || 'No especificado',
      telefono: candidate.telefono || '',     // legacy/backup-only, n8n no lo lee
    },

    datos_prueba: {
      total_preguntas: metrics.total_preguntas,
      preguntas_contestadas: metrics.preguntas_contestadas,
      fecha_aplicacion: metrics.fecha_aplicacion,
      duracion_segundos: metrics.duracion_segundos,
      estado_finalizacion: estado,

      // legacy mantenido para compatibilidad con plantillas de correo n8n
      test_slug: cfg.id,
      test_nombre: cfg.name,
      tiempo_completado_minutos: metrics.duracion_segundos / 60,
      time_out_agotado: !!metrics.time_out_agotado,
      total_preguntas_test: metrics.total_preguntas,
      total_preguntas_respondidas: metrics.preguntas_contestadas,
      porcentaje_completitud: completitudPct,
      prueba_incompleta: pruebaIncompleta,
    },

    respuestas: input.respuestas,

    metadata: {
      candidate_id: candidateId,
      session_id: sessionId,
      source: 'web-public',
      origin_url: typeof window !== 'undefined' ? window.location.href : '',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      client_timestamp: clientTs,
      locale: 'es-MX',
    },

    extras: input.extras || {},

    // === Top-level legacy (n8n templates de correo los referencian directamente) ===
    test_slug: cfg.id,
    test_nombre: cfg.name,
    nombre_paciente: (candidate.nombre_completo || '').trim(),
    email_paciente: (candidate.email || '').trim().toLowerCase(),
    telefono_paciente: candidate.telefono || '',
    total_preguntas_test: metrics.total_preguntas,
    total_preguntas_respondidas: metrics.preguntas_contestadas,
    porcentaje_completitud: completitudPct,
    prueba_incompleta: pruebaIncompleta,
    time_out_agotado: !!metrics.time_out_agotado,
  };
}

async function postOnce(slug: TestId, body: Record<string, unknown>): Promise<Response> {
  return fetch(SUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, body }),
  });
}

/**
 * Envía una psicometría. Server-side se encarga del backup local-primero, los
 * reintentos y la entrega a n8n. Si la llamada falla por red (cliente offline),
 * encolamos para reintento automático.
 */
export async function submitPsychometry(testId: TestId, input: Omit<SubmitInput, 'testId'>): Promise<SubmitResult> {
  if (!TEST_REGISTRY[testId]) {
    return { ok: false, error: `Test desconocido: ${testId}`, queued: false };
  }

  const full: SubmitInput = { testId, ...input };
  const body = buildPayload(full);

  try {
    const res = await postOnce(testId, body);
    if (!res.ok) {
      // El server-side ya respaldó. Devolvemos error pero NO encolamos
      // (el backup local del server-side es la verdad de respaldo).
      return { ok: false, error: `HTTP ${res.status}`, queued: false };
    }
    const json = await res.json().catch(() => ({} as any));
    return {
      ok: true,
      idempotencyKey: json.idempotencyKey || '',
      attempts: json.attempts,
      webhook: json.webhook,
    };
  } catch (err: any) {
    // Network-level failure (cliente offline o servidor inalcanzable):
    // encolar para reintento al próximo 'online'.
    const queue = loadQueue();
    queue.push({ enqueuedAt: new Date().toISOString(), slug: testId, body });
    saveQueue(queue);
    return { ok: false, error: err?.message || 'network', queued: true };
  }
}

/**
 * Procesa la cola offline. Llamar manualmente o vincular al evento `window.online`.
 * Cada item exitoso se quita de la cola; los que fallen permanecen para el próximo intento.
 */
export async function flushQueue(): Promise<{ processed: number; remaining: number }> {
  if (typeof window === 'undefined') return { processed: 0, remaining: 0 };
  const queue = loadQueue();
  if (queue.length === 0) return { processed: 0, remaining: 0 };

  const remaining: QueuedItem[] = [];
  let processed = 0;

  for (const item of queue) {
    try {
      const res = await postOnce(item.slug, item.body);
      if (res.ok) processed += 1;
      else remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }

  saveQueue(remaining);
  return { processed, remaining: remaining.length };
}

/**
 * Engancha el flush automático al recuperar conectividad. Llamar una vez en el
 * arranque del cliente (p. ej. desde un Providers root o desde TestAplicacionBase).
 */
export function registerOnlineFlush(): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    flushQueue().catch((e) => console.error('[dispatcher] flushQueue error:', e));
  };
  window.addEventListener('online', handler);
  // Intento inicial al cargar (por si quedaron items de sesiones previas y ya hay red)
  if (navigator.onLine) handler();
  return () => window.removeEventListener('online', handler);
}
