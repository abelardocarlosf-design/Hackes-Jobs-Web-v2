import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import {
  RUTAS_POR_ROL,
  RUTAS_SOLO_SESION,
  inicioDe,
  puedeEntrar,
  rutaCoincide,
  zonaDe,
} from '@/lib/navegacion';

// Sin fallback: la literal de desarrollo que había aquí está publicada en el
// repositorio, así que cualquiera podía firmarse un token con role:'admin'.
// Si falta la variable tratamos toda sesión como inválida (falla cerrado). No
// lanzamos: una excepción aquí tumbaría absolutamente todas las peticiones.
const JWT_SECRET = process.env.JWT_SECRET;
const SECRET = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

/** Zonas privadas: las de rol (/crm, /admin, …) más las que solo piden sesión. */
const RUTAS_PRIVADAS = [...Object.keys(RUTAS_POR_ROL), ...RUTAS_SOLO_SESION];

function aLogin(request: NextRequest, pathname: string, borrarCookie = false) {
  const url = new URL('/login', request.url);
  url.searchParams.set('redirect', pathname);
  const response = NextResponse.redirect(url);
  if (borrarCookie) response.cookies.delete('hj_token');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const esPrivada = RUTAS_PRIVADAS.some(ruta => rutaCoincide(pathname, ruta));

  if (esPrivada) {
    if (!SECRET) {
      console.error('[middleware] Falta JWT_SECRET: se rechaza toda sesión.');
      return aLogin(request, pathname);
    }

    const token = request.cookies.get('hj_token')?.value;
    if (!token) return aLogin(request, pathname);

    try {
      const { payload } = await jwtVerify(token, SECRET, {
        issuer: 'hackesjobs',
        audience: 'hackesjobs-app',
      });

      const rol = payload.role as string | undefined;

      // Cada zona declara sus roles en src/lib/navegacion.ts, el mismo archivo
      // del que salen los menús. Así los permisos y la navegación no pueden
      // divergir, que es lo que pasaba antes: el CRM existía y nadie lo veía.
      if (!puedeEntrar(rol, pathname)) {
        const destino = inicioDe(rol);
        // Anti-bucle: si el inicio del rol tampoco es accesible (rol
        // desconocido o corrupto), sacamos a la portada en vez de redirigir
        // en círculos.
        if (zonaDe(destino) && !puedeEntrar(rol, destino)) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.redirect(new URL(destino, request.url));
      }

      return NextResponse.next();
    } catch {
      // Token inválido o expirado.
      return aLogin(request, pathname, true);
    }
  }

  // ─── Quien ya tiene sesión no necesita ver login/register ──────────
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get('hj_token')?.value;
    if (token && SECRET) {
      try {
        const { payload } = await jwtVerify(token, SECRET, {
          issuer: 'hackesjobs',
          audience: 'hackesjobs-app',
        });
        return NextResponse.redirect(
          new URL(inicioDe(payload.role as string | undefined), request.url)
        );
      } catch {
        // Token inválido: que pase al login y se autentique de nuevo.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Las rutas /api/* no pasan por aquí: cada handler valida su propia sesión
  // con requireAuth() de src/lib/api-helpers.ts.
  matcher: [
    '/dashboard/:path*',
    '/crm/:path*',
    '/admin/:path*',
    '/mi-empresa/:path*',
    '/portal/:path*',
    '/login',
    '/register',
  ],
};
