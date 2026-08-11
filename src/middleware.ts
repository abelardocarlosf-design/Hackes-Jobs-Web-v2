import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hackesjobs-dev-secret-change-in-production-2026'
);

// Rutas que requieren autenticación.
// Las rutas /api/* no pasan por aquí (ver `matcher` al final): cada handler
// valida su propia sesión con requireAuth() de src/lib/api-helpers.ts.
const PROTECTED_ROUTES = ['/dashboard', '/crm'];

// El CRM maneja datos personales de candidatos (CV, teléfono, psicometrías),
// así que además de sesión exige rol de reclutador o admin.
const CRM_ROLES = ['admin', 'recruiter'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Proteger rutas del dashboard ──────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const token = request.cookies.get('hj_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET, {
        issuer: 'hackesjobs',
        audience: 'hackesjobs-app',
      });

      const role = payload.role as string | undefined;
      const tenantId = payload.tenantId as string | undefined;

      // ─── RBAC Logic ────────────────────────────────────
      // Restrict /dashboard/admin to only 'admin' role
      if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // El CRM es solo para reclutadores y admin. Una empresa o un candidato
      // con sesión válida no debe ver la cartera de talento.
      if (pathname.startsWith('/crm') && !CRM_ROLES.includes(role || '')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Add custom headers for downstream API usage
      const response = NextResponse.next();
      if (role) response.headers.set('x-user-role', role);
      if (tenantId) response.headers.set('x-tenant-id', tenantId);
      
      return response;
    } catch {
      // Token inválido o expirado
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('hj_token');
      return response;
    }
  }

  // ─── Redirigir usuarios autenticados lejos del login ─
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get('hj_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET, {
          issuer: 'hackesjobs',
          audience: 'hackesjobs-app',
        });
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Token inválido, dejar pasar al login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/crm/:path*',
    '/login',
    '/register',
  ],
};
