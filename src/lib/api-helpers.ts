import { NextResponse } from 'next/server';
import { verifyToken, type TokenPayload } from '@/lib/jwt';

export interface AuthenticatedRequest {
  user: TokenPayload;
}

type UserRole = 'admin' | 'recruiter' | 'company' | 'candidate';

/**
 * Extrae y verifica el JWT del request.
 * Busca en: Authorization header → hj_token cookie
 */
export async function getAuthUser(request: Request): Promise<TokenPayload | null> {
  // 1. Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      return await verifyToken(authHeader.slice(7));
    } catch {
      return null;
    }
  }

  // 2. Check cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/hj_token=([^;]+)/);
  if (tokenMatch?.[1]) {
    try {
      return await verifyToken(tokenMatch[1]);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Middleware helper: verifica autenticación y opcionalmente rol.
 * Retorna el usuario o un NextResponse de error.
 */
export async function requireAuth(
  request: Request,
  allowedRoles?: UserRole[]
): Promise<TokenPayload | NextResponse> {
  const user = await getAuthUser(request);

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'No autenticado. Inicia sesión.' },
      { status: 401 }
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
    return NextResponse.json(
      { success: false, message: 'No tienes permiso para esta acción.' },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Respuesta de error estándar.
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

/**
 * Respuesta de éxito estándar.
 */
export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
