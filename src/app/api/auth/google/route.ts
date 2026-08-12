import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { verifyGoogleToken, googleEstaConfigurado } from '@/lib/googleAuth';
import { triggerWebhookAsync } from '@/lib/webhook';

export async function POST(request: Request) {
  try {
    // 503 y no 401: el problema es de configuración del servidor, no de las
    // credenciales de quien intenta entrar.
    if (!googleEstaConfigurado) {
      return NextResponse.json(
        { success: false, message: 'Google Sign-In no está configurado en este entorno.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ success: false, message: 'Falta la credencial de Google' }, { status: 400 });
    }

    const payload = await verifyGoogleToken(credential);

    if (!payload || !payload.email) {
      return NextResponse.json({ success: false, message: 'Token de Google inválido' }, { status: 401 });
    }

    const { email, name, picture } = payload;

    // Buscar si el usuario existe
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // El alta automática es solo como candidato, nunca con más privilegios.
      // A un usuario que ya existe no se le toca el rol: entra con el suyo.
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'Candidato',
          role: 'candidate',
          // Sin contraseña, no con un centinela 'GOOGLE_AUTH'. Eso rompía
          // /api/auth/password, que pedía "la contraseña actual" a alguien
          // que nunca tuvo una.
          passwordHash: null,
          authProvider: 'google',
          avatar: picture,
          candidate: {
            create: {} // Crea el perfil de candidato vacío
          }
        },
      });

      // Notificar a n8n sobre el nuevo usuario de Google
      triggerWebhookAsync('crear-usuario-hj', {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        provider: 'google',
      });
    }

    // Generar JWT propio
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });

    response.cookies.set('hj_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Google Auth Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
