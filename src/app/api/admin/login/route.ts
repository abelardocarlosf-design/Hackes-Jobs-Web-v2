import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.BLOG_ADMIN_USER;
    const adminPass = process.env.BLOG_ADMIN_PASS;

    // Falla cerrado: sin credenciales configuradas no se entra.
    // Antes había valores por defecto ('admin' / 'hackesjobs2025'), lo que dejaba
    // el panel abierto con credenciales públicas si el entorno no estaba completo.
    if (!adminUser || !adminPass) {
      console.error('[Admin Login] BLOG_ADMIN_USER o BLOG_ADMIN_PASS no configuradas.');
      return NextResponse.json(
        { error: 'Acceso administrativo no configurado en el servidor.' },
        { status: 503 }
      );
    }

    if (username === adminUser && password === adminPass) {
      // Firmar token JWT real con rol administrador
      const token = await signToken({
        userId: 'admin-id',
        email: 'admin@hackesjobs.com',
        role: 'admin',
        name: 'Administrador Principal',
      });

      const response = NextResponse.json({ success: true });

      // Configurar cookie segura de administrador HTTP-Only
      response.cookies.set('hj_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 día
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

