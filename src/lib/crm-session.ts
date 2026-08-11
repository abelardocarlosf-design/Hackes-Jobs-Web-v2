import 'server-only';
import { cookies } from 'next/headers';
import { verifyToken, type TokenPayload } from '@/lib/jwt';

/**
 * Lee la sesión desde la cookie en Server Components del CRM.
 * El middleware ya bloqueó el acceso antes de llegar aquí; esto solo recupera
 * los datos del usuario para pintarlos.
 *
 * Vive separado de `crm.ts` porque aquel lo importan componentes de cliente y
 * `next/headers` no puede entrar al bundle del navegador.
 */
export async function getCrmUser(): Promise<TokenPayload | null> {
  const token = cookies().get('hj_token')?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}
