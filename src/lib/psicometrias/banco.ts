/**
 * Tipos y utilidades comunes a los bancos de preguntas de opción única.
 *
 * Cada opción puede llevar una `clave` (la escala, factor o dimensión que
 * puntúa). Con eso el sitio calcula los puntajes y los manda junto con el
 * texto de cada pregunta y respuesta: el análisis en n8n deja de recibir solo
 * identificadores como "moss_3_opt_2", que no le decían nada.
 */

export interface ChoiceOption {
  id: string;
  text: string;
  /** Escala, factor o dimensión que suma esta opción. */
  clave?: string;
  /** Peso de la opción en su escala (1 si no se indica). */
  valor?: number;
}

export interface ChoiceQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  options: ChoiceOption[];
}

export type Puntajes = Record<string, unknown>;

/** Lo que se envía a n8n en `respuestas` para las pruebas de opción única. */
export interface RespuestasCalificadas {
  formato: 'v2';
  puntajes: Puntajes;
  detalle: Record<string, string>;
}

/** "Texto de la pregunta → Texto de la respuesta [escala]" por cada pregunta contestada. */
export function detalleRespuestas(
  questions: ChoiceQuestion[],
  answers: Record<string, string>
): Record<string, string> {
  const detalle: Record<string, string> = {};
  for (const q of questions) {
    const opt = q.options.find(o => o.id === answers[q.id]);
    if (!opt) continue;
    detalle[q.id] = `${q.question} → ${opt.text}${opt.clave ? ` [${opt.clave}]` : ''}`;
  }
  return detalle;
}

/** Suma por clave de las opciones elegidas. Las claves sin respuesta quedan en 0. */
export function sumarClaves(
  questions: ChoiceQuestion[],
  answers: Record<string, string>,
  claves: readonly string[]
): Record<string, number> {
  const total: Record<string, number> = Object.fromEntries(claves.map(c => [c, 0]));
  for (const q of questions) {
    const opt = q.options.find(o => o.id === answers[q.id]);
    if (opt?.clave && opt.clave in total) total[opt.clave] += opt.valor ?? 1;
  }
  return total;
}

/** Barajado determinista (mismo resultado en servidor y navegador, y entre visitas). */
export function barajar<T>(items: readonly T[], semilla: number): T[] {
  const out = [...items];
  // Mezcla la semilla (finalizador de murmur3) y descarta los primeros valores:
  // con semillas pequeñas, xorshift arranca con números muy bajos y la opción
  // que iba primero casi nunca quedaba en primer lugar.
  let s = (semilla ^ 0x9e3779b9) >>> 0;
  s = Math.imul(s ^ (s >>> 16), 0x85ebca6b) >>> 0;
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35) >>> 0;
  s = (s ^ (s >>> 16)) >>> 0 || 1;
  const rnd = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 0x100000000;
  };
  for (let k = 0; k < 8; k++) rnd();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
