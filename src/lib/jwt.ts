import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

// Sin fallback a propósito. Antes había una literal de desarrollo aquí, y como
// está publicada en el repositorio cualquiera podía firmarse un token con
// role:'admin' y entrar al CRM. Es preferible que la aplicación no arranque a
// que arranque con una sesión falsificable.
if (!process.env.JWT_SECRET) {
  throw new Error(
    'Falta JWT_SECRET. Defínelo en .env (local) y en las variables de entorno de Vercel.'
  );
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const ISSUER = 'hackesjobs';
const AUDIENCE = 'hackesjobs-app';
const EXPIRATION = '7d';

/**
 * Genera un JWT firmado con los datos del usuario.
 */
export async function signToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(EXPIRATION)
    .sign(SECRET);
}

/**
 * Verifica un JWT y retorna el payload decodificado.
 * Lanza error si el token es inválido o expirado.
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, SECRET, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });
  return payload as TokenPayload;
}

/**
 * Extrae el token de un header Authorization: Bearer <token>
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

/**
 * Alias for verifyToken — used in some modules as verifyAuth.
 */
export const verifyAuth = verifyToken;
