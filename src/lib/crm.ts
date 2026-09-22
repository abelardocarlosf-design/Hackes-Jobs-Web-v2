// Constantes y helpers del CRM compartidos por servidor y cliente.
// IMPORTANTE: este archivo lo importan componentes 'use client', así que no
// puede tocar APIs de servidor (next/headers, prisma, fs). La sesión vive
// aparte, en `src/lib/crm-session.ts`.

/** Etapas del pipeline, en el orden real del proceso de reclutamiento. */
export const ETAPAS = [
  { id: 'atraccion', label: 'Atracción', color: 'slate' },
  { id: 'filtro_cv', label: 'Filtro CV', color: 'blue' },
  { id: 'psicometria', label: 'Psicometría', color: 'violet' },
  { id: 'entrevista', label: 'Entrevista', color: 'amber' },
  { id: 'terna', label: 'Terna', color: 'orange' },
  { id: 'contratado', label: 'Contratado', color: 'emerald' },
  { id: 'descartado', label: 'Descartado', color: 'red' },
] as const;

export type EtapaId = (typeof ETAPAS)[number]['id'];

export const ETAPAS_ACTIVAS: EtapaId[] = [
  'atraccion',
  'filtro_cv',
  'psicometria',
  'entrevista',
  'terna',
];

export function etapaLabel(id: string) {
  return ETAPAS.find((e) => e.id === id)?.label ?? id;
}

/** Clases Tailwind por etapa. Literales completos: Tailwind no puede purgar dinámicos. */
export const ETAPA_CLASES: Record<string, string> = {
  atraccion: 'bg-slate-500/15 text-slate-300 border-slate-500/25',
  filtro_cv: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  psicometria: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  entrevista: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  terna: 'bg-brand-orange/15 text-brand-orange border-brand-orange/25',
  contratado: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  descartado: 'bg-red-500/15 text-red-300 border-red-500/25',
};

export const TIPOS_SEGUIMIENTO = [
  { id: 'llamada', label: 'Llamada' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'correo', label: 'Correo' },
  { id: 'psicometria', label: 'Enviar psicometría' },
  { id: 'documentos', label: 'Pedir documentos' },
  { id: 'entrevista', label: 'Agendar entrevista' },
  { id: 'otro', label: 'Otro' },
] as const;

export function tipoSeguimientoLabel(id: string) {
  return TIPOS_SEGUIMIENTO.find((t) => t.id === id)?.label ?? id;
}

/**
 * Seguimiento que se agenda solo al mover un candidato de etapa.
 * Es la parte "automática" del CRM: mover una tarjeta deja siempre una tarea
 * concreta con fecha, para que ningún candidato se quede sin siguiente paso.
 */
export const SEGUIMIENTO_AUTOMATICO: Partial<
  Record<EtapaId, { tipo: string; dias: number; nota: string }>
> = {
  filtro_cv: { tipo: 'llamada', dias: 2, nota: 'Contactar para validar experiencia y disponibilidad.' },
  psicometria: { tipo: 'psicometria', dias: 1, nota: 'Enviar liga de psicometría y confirmar recepción.' },
  entrevista: { tipo: 'entrevista', dias: 3, nota: 'Agendar y confirmar entrevista con el cliente.' },
  terna: { tipo: 'documentos', dias: 2, nota: 'Solicitar documentación completa para la terna.' },
};

// ─── Match candidato ↔ requisición ────────────────────────────────
//
// Cálculo POR REGLAS, no por IA. Pondera señales que ya están en la base:
// coincidencia de puesto, de zona, si hay CV y los años de experiencia.
// Es determinista y auditable — el reclutador puede entender por qué salió
// ese número. Cuando se conecte un modelo, este mismo campo (`Proceso.scoreMatch`)
// puede alimentarse desde ahí sin tocar la interfaz.

// Rango Unicode de tildes combinantes que NFD separa de la letra base.
const TILDE_MIN = 0x300;
const TILDE_MAX = 0x36f;

function sinTildes(s: string) {
  // Se filtra por punto de código en vez de con un regex literal: las tildes
  // combinantes son invisibles en el código fuente y se corrompen fácil al editar.
  let out = '';
  for (const ch of s.normalize('NFD')) {
    const c = ch.codePointAt(0) ?? 0;
    if (c < TILDE_MIN || c > TILDE_MAX) out += ch;
  }
  return out;
}

function normalizar(s: string) {
  // Importante quitar la tilde, no sustituirla por espacio: si no,
  // "producción" se parte en "produccio" + "n" y deja de coincidir con
  // "produccion" escrito sin acento, que es como se captura casi siempre.
  return sinTildes(s.toLowerCase())
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

const VACIAS = new Set(['del', 'las', 'los', 'para', 'con', 'por', 'una', 'que']);

export interface EntradaMatch {
  puestoInteres?: string | null;
  zona?: string | null;
  tieneCV: boolean;
  experienciaAnios?: number | null;
}

export interface EntradaRequisicion {
  puesto: string;
  zona?: string | null;
}

export function calcularMatch(c: EntradaMatch, r: EntradaRequisicion): number {
  let score = 0;

  // Puesto: solapamiento de palabras significativas (máx 45)
  if (c.puestoInteres) {
    const tokensReq = normalizar(r.puesto).filter((t) => !VACIAS.has(t));
    const tokensCand = new Set(normalizar(c.puestoInteres).filter((t) => !VACIAS.has(t)));
    if (tokensReq.length > 0) {
      const comunes = tokensReq.filter((t) => tokensCand.has(t)).length;
      score += Math.round((comunes / tokensReq.length) * 45);
    }
  }

  // Zona (máx 25): coincidencia por contención, "Toluca" ≈ "Toluca centro"
  if (c.zona && r.zona) {
    const a = normalizar(c.zona).join(' ');
    const b = normalizar(r.zona).join(' ');
    if (a && b && (a.includes(b) || b.includes(a))) score += 25;
  }

  // Expediente completo (máx 15): tener CV es señal de candidato trabajable
  if (c.tieneCV) score += 15;

  // Experiencia (máx 15)
  if (typeof c.experienciaAnios === 'number') {
    score += Math.min(15, c.experienciaAnios * 3);
  }

  return Math.max(0, Math.min(100, score));
}

export type CalidadMatch = 'sobresaliente' | 'potencial' | 'descartable';

export function calidadMatch(score: number | null | undefined): CalidadMatch | null {
  if (score === null || score === undefined) return null;
  if (score >= 70) return 'sobresaliente';
  if (score >= 40) return 'potencial';
  return 'descartable';
}

export const CALIDAD_META: Record<CalidadMatch, { label: string; clases: string }> = {
  sobresaliente: { label: 'Sobresaliente', clases: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  potencial: { label: 'Potencial', clases: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
  descartable: { label: 'Descartable', clases: 'bg-red-500/15 text-red-300 border-red-500/25' },
};

/** "hace 3 días", "hace 2 horas" — como el tiempo transcurrido de la referencia. */
export function tiempoTranscurrido(d: Date | string) {
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return 'hace un momento';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
  const meses = Math.floor(dias / 30);
  return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
}

export function formatoFecha(d: Date | string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function diasRelativos(d: Date | string) {
  const dias = Math.round((new Date(d).getTime() - Date.now()) / 86_400_000);
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'mañana';
  if (dias === -1) return 'ayer';
  return dias < 0 ? `hace ${Math.abs(dias)} días` : `en ${dias} días`;
}
