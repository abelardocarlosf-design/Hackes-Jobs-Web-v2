/**
 * Límite de intentos en memoria para endpoints de autenticación.
 *
 * Alcance real: el contador vive en el proceso. En Vercel, con Fluid Compute,
 * las instancias se reutilizan entre peticiones, así que frena de verdad el
 * caso normal —alguien probando contraseñas desde una IP— pero un atacante
 * repartido entre varias instancias vería un límite más alto que el nominal.
 * Para un límite estricto haría falta un almacén compartido (Upstash Redis).
 * Se deja así a propósito: sin dependencias nuevas y sin coste, y es mucho
 * mejor que no tener nada.
 */

type Registro = { intentos: number; expiraEn: number };

const registros = new Map<string, Registro>();

/**
 * Evita que el Map crezca sin fin en un proceso de larga vida.
 * Se recogen las claves antes de borrar: `forEach` en vez de `for...of` porque
 * el target de TypeScript del proyecto (es5) no itera Maps directamente.
 */
function purgar(ahora: number) {
  if (registros.size < 5000) return;
  const caducadas: string[] = [];
  registros.forEach((registro, clave) => {
    if (registro.expiraEn <= ahora) caducadas.push(clave);
  });
  caducadas.forEach((clave) => registros.delete(clave));
}

export type ResultadoLimite = {
  permitido: boolean;
  /** Segundos que faltan para poder reintentar. Solo si `permitido` es false. */
  reintentarEn: number;
};

/**
 * Consume un intento para `clave`. Devuelve si la petición puede seguir.
 *
 * @param clave     Identificador del cubo, p. ej. `login:1.2.3.4:ana@x.com`.
 * @param maximo    Intentos permitidos dentro de la ventana.
 * @param ventanaMs Duración de la ventana en milisegundos.
 */
export function consumirIntento(
  clave: string,
  maximo = 10,
  ventanaMs = 15 * 60 * 1000
): ResultadoLimite {
  const ahora = Date.now();
  purgar(ahora);

  const registro = registros.get(clave);

  if (!registro || registro.expiraEn <= ahora) {
    registros.set(clave, { intentos: 1, expiraEn: ahora + ventanaMs });
    return { permitido: true, reintentarEn: 0 };
  }

  if (registro.intentos >= maximo) {
    return {
      permitido: false,
      reintentarEn: Math.ceil((registro.expiraEn - ahora) / 1000),
    };
  }

  registro.intentos += 1;
  return { permitido: true, reintentarEn: 0 };
}

/**
 * Borra el contador tras un acceso correcto, para que una sesión legítima que
 * falló un par de veces no arrastre el castigo.
 */
export function limpiarIntentos(clave: string) {
  registros.delete(clave);
}

/**
 * IP del cliente. En Vercel la real llega en `x-forwarded-for`; `request.ip`
 * no existe en el runtime de Node. Si no hay cabecera, se agrupa todo bajo
 * `desconocida`, que es el lado seguro: limita de más, nunca de menos.
 */
export function ipDe(request: Request): string {
  const reenviada = request.headers.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'desconocida';
}
