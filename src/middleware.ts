import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hackesjobs-dev-secret-change-in-production-2026'
);

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ['/dashboard'];

// Rutas de API que NO requieren autenticación
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/webhooks',
  '/api/jobs', // GET público
];

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
      await jwtVerify(token, SECRET, {
        issuer: 'hackesjobs',
        audience: 'hackesjobs-app',
      });
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
    '/login',
    '/register',
  ],
};
