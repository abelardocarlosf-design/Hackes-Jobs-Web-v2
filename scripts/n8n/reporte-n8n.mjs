// Regenera el workflow de n8n de una psicometría con el reporte corregido.
//
// Problema que resuelve (reporte del 2026-10-05): Gemini devolvía fortalezas,
// riesgos y puntajes como listas u objetos, y la plantilla de Gmail los pintaba
// como "[object Object]". Además la recomendación llegaba vacía porque el correo
// leía la salida de Google Sheets (cuya columna se llama "justificiacion_…").
//
// Cambios:
//  · Prompt propio de cada prueba (p. ej. los 20 factores del PAPI en Kostick,
//    el ICG en Moss) con la orden explícita de devolver solo texto plano.
//  · "Parser Blindado" convierte cualquier lista u objeto en viñetas de texto y
//    quita el markdown (**).
//  · Nodo nuevo "Formato Reporte" (después del parser o del reporte anulado):
//    deja todos los campos como texto, normaliza la recomendación y toma la
//    tabla de puntajes calculada por el sitio, no la del modelo.
//  · Sheets y los correos leen de "Formato Reporte".
//
// Uso: node scripts/n8n/reporte-n8n.mjs kostick|moss   (reescribe el JSON en n8n-workflows/)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ARCHIVOS = { kostick: 'WF-006 Kostick.json', moss: 'WF-004 Moss.json' };
const prueba = process.argv[2];
if (!ARCHIVOS[prueba]) throw new Error(`Uso: node scripts/n8n/reporte-n8n.mjs ${Object.keys(ARCHIVOS).join('|')}`);
const archivo = path.join(raiz, 'n8n-workflows', ARCHIVOS[prueba]);
const wf = JSON.parse(fs.readFileSync(archivo, 'utf8'));
const nodo = nombre => {
  const n = wf.nodes.find(x => x.name === nombre);
  if (!n) throw new Error(`No existe el nodo ${nombre}`);
  return n;
};

// ─── Normalizar y Validar ────────────────────────────────────────────────────
export const CODIGO_NORMALIZAR = String.raw`
const body = ($input.item.json.body) || {};
const dp = body.datos_paciente || {};
const dt = body.datos_prueba || {};
const total = Number(dt.total_preguntas || 0);
const contestadas = Number(dt.preguntas_contestadas || 0);
const completitud = total > 0 ? Math.round((contestadas / total) * 100) : 0;
const es_valido = completitud >= 85;
const email = (dp.email || '').trim().toLowerCase();
const candidate_id = email ? email + '::' + (dt.fecha_aplicacion || Date.now()) : 'anon::' + Date.now();
const r = body.respuestas || {};
const p = r.puntajes || {};
// Puntajes calculados en el sitio (formato v2). Si llegara un envío viejo, se
// manda lo que haya para que el modelo al menos vea las respuestas.
const puntajes = Object.assign({}, p);
delete puntajes.tabla;
return { json: {
  candidate_id,
  nombre: (dp.nombre_completo || '').trim(),
  email,
  empresa: dp.empresa || 'No especificado',
  cargo: dp.cargo_postulado || 'No especificado',
  fecha: dt.fecha_aplicacion || new Date().toISOString(),
  total, contestadas, completitud, es_valido,
  validez_flag: es_valido ? 'VALIDO' : 'INVALIDO_INCOMPLETO',
  puntajes_str: Object.keys(p).length ? JSON.stringify(puntajes) : JSON.stringify(r),
  tabla_puntajes: typeof p.tabla === 'string' ? p.tabla : '',
  respuestas_str: JSON.stringify(r),
} };
`.trim();

// ─── Prompt ──────────────────────────────────────────────────────────────────
const PROMPT_KOSTICK = `=ROL: Analista psicométrico senior de Hacke's Jobs. Tono ejecutivo, basado en evidencia, sin inventar datos.

PRUEBA: Kostick (PAPI, Perception And Preference Inventory). 20 factores agrupados en 7 áreas. Cada factor va de 0 a 9 (aparece en 9 pares de elección forzada; la suma de los 20 factores es 90). Alto >= 7, medio 3-6, bajo <= 2. Es una prueba ipsativa: un puntaje alto en un factor implica bajos en otros, así que interpreta los factores en relación entre sí, no como absolutos.

SIGNIFICADO DE CADA FACTOR (alto / bajo):
Dirección del trabajo
- N Necesidad de terminar una tarea: persevera y cierra pendientes / deja tareas abiertas, cambia de foco.
- G Papel de trabajador intenso: alta disposición al esfuerzo y a la carga / prefiere carga moderada.
- A Necesidad de logro: metas ambiciosas, competitivo / poca orientación a metas retadoras.
Liderazgo
- L Papel de líder: asume el mando con naturalidad / prefiere seguir a otros.
- P Necesidad de controlar a otros: dirige y supervisa de cerca / evita dar órdenes.
- I Facilidad para tomar decisiones: decide rápido y asume riesgos / cauteloso, consulta mucho.
Ritmo de trabajo
- T Ritmo: trabaja rápido, impaciente con la lentitud / ritmo pausado.
- V Vigor físico: prefiere actividad física y trabajo de campo / prefiere trabajo de escritorio.
Naturaleza social
- X Necesidad de ser notado: busca reconocimiento visible / discreto.
- S Extensión social: amplia red de relaciones / reservado, círculo reducido.
- B Necesidad de pertenecer a grupos: necesita el equipo y su aceptación / independiente del grupo.
- O Necesidad de cercanía y afecto: busca vínculos cercanos / trato más distante y profesional.
Estilo de trabajo
- R Tipo teórico: analiza y conceptualiza / práctico, orientado a la acción.
- D Interés en los detalles: meticuloso / visión general, puede pasar por alto detalles.
- C Organización: ordenado y planificado / flexible, poco estructurado.
Temperamento
- Z Necesidad de cambio: busca novedad y variedad / prefiere estabilidad y rutina.
- E Control emocional: contiene sus emociones / expresivo.
- K Necesidad de defenderse (agresividad): confronta y defiende su postura / evita el conflicto.
Subordinación
- F Apoyo a la autoridad: leal y alineado con el jefe / independiente de la autoridad.
- W Necesidad de reglas y supervisión: necesita estructura e instrucciones claras / prefiere autonomía.

DATOS DEL CANDIDATO
- Nombre: {{ $json.nombre }}
- Empresa / cargo: {{ $json.empresa }} / {{ $json.cargo }}
- Completitud: {{ $json.completitud }}% ({{ $json.contestadas }} de {{ $json.total }} pares)
- Puntajes ya calculados por el sistema (son la fuente de verdad; no los recalcules ni los cambies): {{ $json.puntajes_str }}

INSTRUCCIONES DE REDACCIÓN
- Cada campo del JSON es TEXTO PLANO (string). Prohibido devolver listas, arreglos u objetos. Prohibido usar markdown (**, #, guiones de lista).
- validez: "VALIDO" si la completitud es >= 85%; si no, "INVALIDO_INCOMPLETO".
- resumen_validez: una oración sobre la confiabilidad del resultado.
- resumen_ejecutivo: un párrafo de 4 a 6 oraciones con el perfil dominante (los 3 o 4 factores más altos), cómo se combina y qué tipo de colaborador describe.
- fortalezas_operativas: de 3 a 5 viñetas, una por línea, cada una empieza con "• " y cita factor y puntaje. Ejemplo: "• Decide con rapidez (I=9): resuelve sin esperar validación, útil en operación con imprevistos."
- riesgos_potenciales: de 3 a 5 viñetas con el mismo formato, sobre factores bajos, combinaciones en tensión (p. ej. I alto con D bajo) o excesos de un factor alto.
- recomendacion_contratacion: exactamente uno de estos textos: "Recomendado", "Recomendado con reservas", "No recomendado".
- justificacion_recomendacion: de 3 a 5 oraciones que conecten los factores con el cargo. Si el cargo es "No especificado", dilo y recomienda para qué tipo de puesto encaja mejor el perfil.
- puntajes_crudos: déjalo vacío (""); lo llena el sistema.
- feedback_candidato: 2 o 3 oraciones dirigidas al candidato en segunda persona, tono constructivo, sin puntajes.
- No uses "excelente", "excepcional", "sobresaliente", "perfecto" ni "ideal". Nada de lenguaje clínico ni diagnóstico: es apoyo a decisiones de RH.

RESPONDE SOLO CON ESTE JSON, sin texto adicional:
{"validez":"","resumen_validez":"","resumen_ejecutivo":"","fortalezas_operativas":"","riesgos_potenciales":"","recomendacion_contratacion":"","justificacion_recomendacion":"","puntajes_crudos":"","feedback_candidato":""}`;

const PROMPT_MOSS = `=ROL: Analista psicométrico senior de Hacke's Jobs. Tono ejecutivo, basado en evidencia, sin inventar datos.

PRUEBA: Moss (habilidades de supervisión y relaciones humanas en el trabajo). 30 situaciones laborales con una respuesta correcta cada una, 6 por dimensión:
- HS Habilidad de supervisión: dirigir, corregir y dar seguimiento al trabajo de otros.
- CDRH Capacidad de decisión en las relaciones humanas: decidir con criterio cuando hay personas, metas y recursos en juego.
- CEMT Capacidad de evaluación de problemas interpersonales: diagnosticar conflictos y conductas antes de actuar.
- HERI Habilidad para establecer relaciones interpersonales: reconocer, retener y construir confianza con el equipo.
- SCMT Sentido común y tacto: comunicar decisiones difíciles, asumir errores y manejar críticas con prudencia.

CÓMO LEER LOS DATOS
- "porcentaje" es el % de aciertos en la dimensión (aciertos de 6). NO es un percentil: nunca lo llames percentil.
- ICG (Índice de Capacidad Gerencial) ya calculado: < 40 bajo, 40-60 medio, 61-80 adecuado, > 80 alto.
- Dimensión con 2 aciertos o menos (<= 33%) = área de desarrollo prioritaria.
- "errores" lista las situaciones que falló, con lo que eligió y la respuesta correcta: úsalas como evidencia concreta.

DATOS DEL CANDIDATO
- Nombre: {{ $json.nombre }}
- Empresa / cargo: {{ $json.empresa }} / {{ $json.cargo }}
- Completitud: {{ $json.completitud }}% ({{ $json.contestadas }} de {{ $json.total }} situaciones)
- Puntajes ya calculados por el sistema (son la fuente de verdad; no los recalcules ni los cambies): {{ $json.puntajes_str }}

INSTRUCCIONES DE REDACCIÓN
- Cada campo del JSON es TEXTO PLANO (string). Prohibido devolver listas, arreglos u objetos. Prohibido usar markdown (**, #, guiones de lista).
- validez: "VALIDO" si la completitud es >= 85%; si no, "INVALIDO_INCOMPLETO".
- resumen_validez: una oración sobre la confiabilidad del resultado.
- resumen_ejecutivo: un párrafo de 4 a 6 oraciones con el ICG y su nivel, las dimensiones más fuertes y las más débiles, y qué tipo de supervisor describe.
- fortalezas_operativas: de 2 a 4 viñetas, una por línea, cada una empieza con "• " y cita dimensión y aciertos. Ejemplo: "• Supervisión (HS 5/6): corrige en privado y da seguimiento."
- riesgos_potenciales: de 2 a 4 viñetas con el mismo formato, apoyadas en las situaciones falladas (menciona qué eligió y por qué es un riesgo). Si no falló ninguna, señala el riesgo de sobreestimar un resultado de autoinforme.
- recomendacion_contratacion: exactamente uno de estos textos: "Recomendado", "Recomendado con reservas", "No recomendado".
- justificacion_recomendacion: de 3 a 5 oraciones que conecten el ICG y las dimensiones con el cargo, más una acción de desarrollo concreta. Si el cargo es "No especificado", dilo.
- puntajes_crudos: déjalo vacío (""); lo llena el sistema.
- feedback_candidato: 2 o 3 oraciones dirigidas al candidato en segunda persona, tono constructivo, sin puntajes.
- No uses "excelente", "excepcional", "sobresaliente", "perfecto" ni "ideal". Nada de lenguaje clínico ni diagnóstico: es apoyo a decisiones de RH.

RESPONDE SOLO CON ESTE JSON, sin texto adicional:
{"validez":"","resumen_validez":"","resumen_ejecutivo":"","fortalezas_operativas":"","riesgos_potenciales":"","recomendacion_contratacion":"","justificacion_recomendacion":"","puntajes_crudos":"","feedback_candidato":""}`;

// ─── Parser Blindado ─────────────────────────────────────────────────────────
export const CODIGO_PARSER = String.raw`
const REQ = ['validez','resumen_validez','resumen_ejecutivo','fortalezas_operativas','riesgos_potenciales','recomendacion_contratacion','justificacion_recomendacion','puntajes_crudos','feedback_candidato'];
const errShape = (r) => ({ validez: 'ERROR_PARSEO', resumen_validez: 'No se pudo leer la respuesta del modelo.', resumen_ejecutivo: 'ERROR DE PARSEO: ' + r, fortalezas_operativas: 'N/A', riesgos_potenciales: 'N/A', recomendacion_contratacion: 'Revisión manual requerida', justificacion_recomendacion: 'La respuesta del modelo no se pudo interpretar.', puntajes_crudos: '', feedback_candidato: 'Tu evaluación está siendo revisada por nuestro equipo.', _parse_error: r });
function extractText(r) {
  if (r == null) return '';
  if (typeof r === 'string') return r;
  const c = [r.text, r.output_text, r.response, r.message && r.message.content, r.content && typeof r.content === 'string' ? r.content : null, r.content && r.content.parts && r.content.parts[0] && r.content.parts[0].text, r.candidates && r.candidates[0] && r.candidates[0].content && r.candidates[0].content.parts && r.candidates[0].content.parts[0] && r.candidates[0].content.parts[0].text];
  for (const x of c) if (typeof x === 'string' && x.trim()) return x;
  if (r.content && typeof r.content === 'object' && !Array.isArray(r.content) && REQ.some(k => k in r.content)) return JSON.stringify(r.content);
  if (REQ.some(k => k in r)) return JSON.stringify(r);
  return JSON.stringify(r);
}
// Cualquier lista u objeto se vuelve texto: así nunca llega "[object Object]" al correo.
function aTexto(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.replace(/\*\*/g, '').replace(/^\s*[-*]\s+/gm, '• ').trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(x => { const t = aTexto(x); return t.startsWith('• ') ? t : '• ' + t; }).filter(t => t !== '• ').join('\n');
  const vals = Object.entries(v).map(([k, x]) => [k, aTexto(x)]).filter(([, x]) => x);
  const titulo = vals.find(([k]) => /factor|nombre|titulo|fortaleza|riesgo|aspecto|area/i.test(k));
  const desc = vals.filter(([k]) => !titulo || k !== titulo[0]).map(([, x]) => x).join(' — ');
  return titulo ? titulo[1] + (desc ? ': ' + desc : '') : vals.map(([k, x]) => k + ': ' + x).join('; ');
}
const raw = $input.item.json;
try {
  let t = extractText(raw);
  if (!t || !t.trim()) return { json: errShape('Respuesta vacía') };
  t = String(t).replace(/^\s*` + '```' + String.raw`(?:json)?\s*/i, '').replace(/\s*` + '```' + String.raw`\s*$/i, '').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  const j = (a === -1 || b <= a) ? t : t.slice(a, b + 1);
  let p;
  try { p = JSON.parse(j); } catch (_) { p = JSON.parse(j.replace(/,\s*([}\]])/g, '$1')); }
  const out = {};
  for (const k of REQ) out[k] = aTexto(p[k]);
  const miss = REQ.filter(k => !(k in p) && k !== 'puntajes_crudos');
  if (miss.length) out._faltantes = miss.join(',');
  return { json: out };
} catch (e) {
  return { json: errShape(e.message || String(e)) };
}
`.trim();

// ─── Formato Reporte (nuevo) ─────────────────────────────────────────────────
export const CODIGO_FORMATO = String.raw`
const n = $('Normalizar y Validar').item.json;
const r = $input.item.json;
const txt = v => (v == null ? '' : typeof v === 'string' ? v : JSON.stringify(v)).trim();
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function recomendacion(v) {
  const s = txt(v).toLowerCase();
  if (!s) return 'Revisión manual requerida';
  if (s.includes('no recomend')) return 'No recomendado';
  if (s.includes('reserva') || s.includes('condicion') || s.includes('consider')) return 'Recomendado con reservas';
  if (s.includes('recomend')) return 'Recomendado';
  return txt(v);
}
const out = {
  validez: txt(r.validez) || n.validez_flag,
  resumen_validez: txt(r.resumen_validez) || ('Completitud ' + n.completitud + '% (' + n.contestadas + ' de ' + n.total + ' reactivos).'),
  resumen_ejecutivo: txt(r.resumen_ejecutivo),
  fortalezas_operativas: txt(r.fortalezas_operativas) || 'Sin información.',
  riesgos_potenciales: txt(r.riesgos_potenciales) || 'Sin información.',
  recomendacion_contratacion: recomendacion(r.recomendacion_contratacion),
  justificacion_recomendacion: txt(r.justificacion_recomendacion) || 'El modelo no devolvió justificación; revisar manualmente.',
  // La tabla sale del cálculo del sitio, no del modelo.
  puntajes_crudos: n.tabla_puntajes || txt(r.puntajes_crudos) || 'Sin puntajes.',
  feedback_candidato: txt(r.feedback_candidato),
};
for (const k of Object.keys(out)) out[k] = esc(out[k]);
return { json: out };
`.trim();

nodo('Normalizar y Validar').parameters.jsCode = CODIGO_NORMALIZAR;
nodo('Gemini Analisis').parameters.messages.values[0].content = { kostick: PROMPT_KOSTICK, moss: PROMPT_MOSS }[prueba];
nodo('Gemini Analisis').parameters.options = { ...(nodo('Gemini Analisis').parameters.options || {}), temperature: 0.3 };
nodo('Parser Blindado').parameters.jsCode = CODIGO_PARSER;

if (!wf.nodes.some(x => x.name === 'Formato Reporte')) {
  const parser = nodo('Parser Blindado');
  wf.nodes.push({
    parameters: { mode: 'runOnceForEachItem', jsCode: CODIGO_FORMATO },
    id: 'f3a1c2d4-6b7e-4c9a-9e1f-0f6c1e2a7b11',
    name: 'Formato Reporte',
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [parser.position[0] + 220, parser.position[1] + 120],
  });
} else {
  nodo('Formato Reporte').parameters.jsCode = CODIGO_FORMATO;
}

// Conexiones: Parser / Anulado → Formato Reporte → Sheets → correos
wf.connections['Parser Blindado'] = { main: [[{ node: 'Formato Reporte', type: 'main', index: 0 }]] };
wf.connections['Reporte Anulado'] = { main: [[{ node: 'Formato Reporte', type: 'main', index: 0 }]] };
wf.connections['Formato Reporte'] = { main: [[{ node: 'Sheets Respaldar', type: 'main', index: 0 }]] };

// Sheets: mismas columnas, valores desde Formato Reporte
const cols = nodo('Sheets Respaldar').parameters.columns.value;
for (const k of Object.keys(cols)) {
  cols[k] = cols[k].replace(/\$json\.(\w+)/g, "$('Formato Reporte').item.json.$1");
}

// Correos: leían $json (la salida de Sheets). Ahora leen Formato Reporte.
for (const nombre of ['Gmail RH', 'Gmail Candidato']) {
  const g = nodo(nombre);
  g.parameters.message = g.parameters.message.replace(/\$json\.(\w+)/g, "$('Formato Reporte').item.json.$1");
}
// La justificación se ve mejor con saltos de línea respetados.
const rh = nodo('Gmail RH');
rh.parameters.message = rh.parameters.message.replace(
  '<p style="margin:10px 0 0;font-size:13px;color:#555;line-height:1.6;text-align:left;">',
  '<p style="margin:10px 0 0;font-size:13px;color:#555;line-height:1.6;text-align:left;white-space:pre-line;">'
);

fs.writeFileSync(archivo, JSON.stringify(wf, null, 2) + '\n', 'utf8');
console.log('Workflow actualizado:', archivo);
