import { OAuth2Client } from 'google-auth-library';

/**
 * El Client ID de Google Identity Services **no es secreto**: viaja en el HTML
 * de cada página. Por eso usamos la misma variable NEXT_PUBLIC_ en cliente y
 * servidor. Antes el servidor leía `GOOGLE_CLIENT_ID`, una variable que no
 * estaba definida en ningún archivo, con una consecuencia grave: ver abajo.
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export const googleEstaConfigurado = GOOGLE_CLIENT_ID.length > 0;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token: string) {
  // Falla cerrado. `google-auth-library` **omite la verificación de `aud`
  // cuando `audience` es undefined**: sin esta guarda aceptaríamos un ID token
  // con firma válida de Google pero emitido para cualquier otra aplicación, y
  // como abajo se auto-crea la cuenta, bastaría para entrar con el email que
  // se quisiera.
  if (!googleEstaConfigurado) {
    console.error('[Google Auth] Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID; se rechaza el token.');
    return null;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Un email sin verificar no prueba nada: cualquiera puede poner el correo
    // de otra persona en un proyecto propio de Google.
    if (!payload?.email || payload.email_verified !== true) {
      console.error('[Google Auth] Token sin email verificado.');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('[Google Auth] Token inválido:', error);
    return null;
  }
}
