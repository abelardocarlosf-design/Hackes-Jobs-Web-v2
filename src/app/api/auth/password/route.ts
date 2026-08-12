import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/password';
import { getAuthUser } from '@/lib/api-helpers';
import { consumirIntento, limpiarIntentos } from '@/lib/rate-limit';
import { z } from 'zod';

const schema = z.object({
  actual: z.string().min(1, 'Escribe tu contraseña actual'),
  nueva: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
});

/**
 * Cambio de contraseña del usuario en sesión.
 * Exige la contraseña actual: sin eso, una sesión robada bastaría para
 * apoderarse de la cuenta.
 */
export async function POST(request: Request) {
  const sesion = await getAuthUser(request);
  if (!sesion) {
    return NextResponse.json({ success: false, message: 'No autenticado.' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message || 'Datos inválidos' },
      { status: 400 }
    );
  }

  // Este endpoint también adivina contraseñas: con una sesión robada se podría
  // ir probando `actual` hasta acertar. Se limita por usuario, no por IP,
  // porque la sesión ya identifica a la cuenta.
  const claveLimite = `password:${sesion.userId}`;
  const limite = consumirIntento(claveLimite);
  if (!limite.permitido) {
    return NextResponse.json(
      {
        success: false,
        message: `Demasiados intentos. Vuelve a intentarlo en ${Math.ceil(
          limite.reintentarEn / 60
        )} minutos.`,
      },
      { status: 429, headers: { 'Retry-After': String(limite.reintentarEn) } }
    );
  }

  const usuario = await prisma.user.findUnique({ where: { id: sesion.userId } });
  if (!usuario) {
    return NextResponse.json({ success: false, message: 'Usuario no encontrado.' }, { status: 404 });
  }

  // Una cuenta de Google no tiene contraseña actual que aportar, así que este
  // flujo no le aplica: se lo decimos en vez de rechazarlo sin explicación.
  if (!usuario.passwordHash) {
    return NextResponse.json(
      {
        success: false,
        message: 'Tu cuenta inicia sesión con Google, así que no tiene contraseña que cambiar.',
      },
      { status: 400 }
    );
  }

  const valida = await comparePassword(parsed.data.actual, usuario.passwordHash);
  if (!valida) {
    return NextResponse.json(
      { success: false, message: 'La contraseña actual no es correcta.' },
      { status: 403 }
    );
  }

  if (parsed.data.actual === parsed.data.nueva) {
    return NextResponse.json(
      { success: false, message: 'La nueva contraseña debe ser distinta de la actual.' },
      { status: 400 }
    );
  }

  limpiarIntentos(claveLimite);

  await prisma.user.update({
    where: { id: usuario.id },
    data: { passwordHash: await hashPassword(parsed.data.nueva) },
  });

  return NextResponse.json({ success: true, message: 'Contraseña actualizada.' });
}
