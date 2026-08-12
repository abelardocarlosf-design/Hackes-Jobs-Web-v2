import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { signToken } from '@/lib/jwt';
import { consumirIntento, limpiarIntentos, ipDe } from '@/lib/rate-limit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Datos inválidos';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Freno a la fuerza bruta. La clave combina IP y correo: así un atacante
    // que prueba mil contraseñas contra una cuenta se topa con el límite, pero
    // varias personas de una misma oficina (misma IP saliente) no se bloquean
    // entre sí.
    const claveLimite = `login:${ipDe(request)}:${email.toLowerCase()}`;
    const limite = consumirIntento(claveLimite);
    if (!limite.permitido) {
      return NextResponse.json(
        {
          success: false,
          message: `Demasiados intentos fallidos. Vuelve a intentarlo en ${Math.ceil(
            limite.reintentarEn / 60
          )} minutos.`,
        },
        { status: 429, headers: { 'Retry-After': String(limite.reintentarEn) } }
      );
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Cuentas creadas con Google: no tienen contraseña que comparar. Sin este
    // caso el usuario recibiría "credenciales incorrectas" para siempre, sin
    // pista de que su cuenta va por Google.
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Esta cuenta usa Google. Inicia sesión con el botón de Google.' },
        { status: 401 }
      );
    }

    // Verificar password
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Acceso correcto: se borra el contador para que unos cuantos fallos
    // previos no arrastren castigo a la siguiente sesión legítima.
    limpiarIntentos(claveLimite);

    // Generar JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Respuesta con cookie httpOnly
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
    console.error('[Login Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
