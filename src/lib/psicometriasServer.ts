/**
 * SERVER-ONLY. NO importar desde componentes client.
 * Mantiene la lista de paths de webhook por psicometría y resuelve la URL final
 * combinándolas con N8N_BASE_URL.
 *
 * Por qué vive aquí y no en psicometriasConfig.ts:
 *   - psicometriasConfig se importa desde el cliente (TestInfoProps, testsConfig).
 *   - Aunque los strings de URL no son secretos, mantenerlos server-side reduce
 *     el riesgo de leakeo en bundles y obliga a pasar por el endpoint /api/psicometrias/submit.
 *
 * Auditoría 2026-05-15: los paths se sincronizaron contra los nodos
 * `Webhook Recepcion` de los 9 archivos `n8n-workflows/WF-00X *.json`.
 * Fixes aplicados respecto al estado previo (`psicometriasConfig.webhookUrlMap`):
 *   - allport: cambiado de `webhook-test/` a `webhook/` (estaba apuntando al modo Listen-only de n8n)
 *   - zavic:   cambiado de `webhook-test/` a `webhook/` (idem)
 *   - terman:  era `wf-008-terman` → ahora `wf-007-terman` (off-by-one)
 *   - 16pf:    era `wf-009-16pf`  → ahora `wf-008-16pf`  (off-by-one)
 *   - mmpi:    era `wf-010-mmpi-2` → ahora `wf-009-mmpi2` (off-by-one + slug roto)
 *   - raven:   eliminado del map (la prueba está `comingSoon` y el workflow WF-007 ahora corresponde a Terman)
 */

// Runtime guard: si este módulo se cargara accidentalmente en el bundle del cliente,
// el `window` existiría y queremos romper temprano y ruidoso.
// (Equivalente artesanal a `import 'server-only'` sin agregar dependencia.)
if (typeof window !== 'undefined') {
  throw new Error('[psicometriasServer] Este módulo es SERVER-ONLY. No lo importes desde componentes cliente.');
}

const DEFAULT_N8N_BASE = 'https://hackesjobs-n8n.3hrktu.easypanel.host';

/**
 * Base URL del servidor de n8n. Sobrescribible vía `N8N_BASE_URL`.
 * Sin trailing slash.
 */
export const N8N_BASE_URL: string = (process.env.N8N_BASE_URL || DEFAULT_N8N_BASE).replace(/\/+$/, '');

/**
 * Mapa de psicometría → path del webhook (path únicamente, sin host).
 * Las claves son los `slug` del catálogo `testsConfig`.
 */
export const testWebhookPaths: Record<string, string> = {
  luscher: 'webhook/wf-001-luscher',
  disc:    'webhook/wf-002-disc',
  allport: 'webhook/wf-003-allport',
  moss:    'webhook/wf-004-moss',
  zavic:   'webhook/wf-005-zavic',
  kostick: 'webhook/wf-006-kostick',
  terman:  'webhook/wf-007-terman',
  '16pf':  'webhook/wf-008-16pf',
  mmpi:    'webhook/wf-009-mmpi2',
};

/**
 * Resuelve la URL completa del webhook para una psicometría dada.
 * Devuelve `null` si el slug no está registrado (p. ej. Raven, que está `comingSoon`).
 */
export function resolveWebhookUrl(slug: string): string | null {
  const path = testWebhookPaths[slug];
  if (!path) return null;
  return `${N8N_BASE_URL}/${path}`;
}
