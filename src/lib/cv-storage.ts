/**
 * Almacenamiento de CVs.
 *
 * Un CV es dato personal bajo LFPDPPP, así que NUNCA se guarda en `public/`:
 * ahí quedaría accesible por URL sin autenticación. Se guarda fuera del árbol
 * servido y se entrega por `/api/candidatos/[id]/cv`, que exige sesión de
 * reclutador o admin.
 *
 * Dos backends, elegidos según el entorno:
 *   - Producción (Vercel): Blob privado. El filesystem de Vercel es de solo
 *     lectura salvo /tmp, que además es efímero, así que escribir a disco no
 *     es una opción.
 *   - Desarrollo: carpeta local `storage/cv/`, ignorada por git.
 */

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const LOCAL_DIR = path.resolve(process.cwd(), 'storage', 'cv');

export const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

export const TIPOS_CV_PERMITIDOS: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

function usarBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Genera una clave impredecible: el nombre no debe permitir adivinar otros CVs. */
function nuevaClave(extension: string) {
  return `cv/${randomUUID()}.${extension}`;
}

/**
 * Guarda el CV y devuelve la clave opaca con la que se recupera después.
 * En Blob la clave es la URL; en local, la ruta relativa.
 */
export async function guardarCV(
  buffer: Buffer,
  extension: string,
  contentType: string
): Promise<string> {
  const clave = nuevaClave(extension);

  if (usarBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(clave, buffer, {
      access: 'private',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const nombreArchivo = path.basename(clave);
  await fs.writeFile(path.join(LOCAL_DIR, nombreArchivo), buffer);
  return `local:${nombreArchivo}`;
}

/**
 * Borra un CV del almacenamiento. Se usa al reemplazar el CV de un candidato:
 * conservar la versión anterior sería retener dato personal sin necesidad
 * (LFPDPPP) y dejaría archivos huérfanos acumulándose.
 * No lanza: que falle un borrado no debe tumbar la subida del CV nuevo.
 */
export async function borrarCV(clave: string): Promise<void> {
  try {
    if (clave.startsWith('local:')) {
      const nombreArchivo = path.basename(clave.slice('local:'.length));
      await fs.unlink(path.join(LOCAL_DIR, nombreArchivo));
      return;
    }
    const { del } = await import('@vercel/blob');
    await del(clave, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (e) {
    console.error('[cv-storage] No se pudo borrar el CV anterior:', e);
  }
}

/** Recupera un CV a partir de su clave. Devuelve null si ya no existe. */
export async function leerCV(clave: string): Promise<Buffer | null> {
  if (clave.startsWith('local:')) {
    const nombreArchivo = path.basename(clave.slice('local:'.length));
    try {
      return await fs.readFile(path.join(LOCAL_DIR, nombreArchivo));
    } catch {
      return null;
    }
  }

  try {
    // Un blob privado no se descarga con fetch(): requiere `get()` del SDK,
    // que firma la petición con el token.
    const { get } = await import('@vercel/blob');
    const res = await get(clave, {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // `get` devuelve una unión discriminada por statusCode; solo 200 trae stream.
    if (!res || res.statusCode !== 200 || !res.stream) return null;

    const chunks: Uint8Array[] = [];
    const reader = res.stream.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return Buffer.concat(chunks);
  } catch (e) {
    console.error('[cv-storage] No se pudo leer el CV desde Blob:', e);
    return null;
  }
}
