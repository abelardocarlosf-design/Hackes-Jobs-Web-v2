/**
 * Canal de contacto directo — única fuente de verdad.
 * Cambiar el número aquí lo actualiza en todo el sitio
 * (botón flotante, heros, botones de vacantes).
 */
export const WHATSAPP_NUMBER = '525650405218';

export const WHATSAPP_DEFAULT_MESSAGE = 'Hola, quiero cotizar una vacante';

/** URL de wa.me con mensaje pre-llenado (o el default de cotización). */
export function waUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
