import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { requireAuth, errorResponse, successResponse } from '@/lib/api-helpers';

const ROLES = ['admin', 'recruiter', 'company', 'candidate'] as const;

const editarUsuarioSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(ROLES).optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
});

const CAMPOS_PUBLICOS = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  authProvider: true,
  createdAt: true,
} as const;

/**
 * Impide dejar la instalación sin ningún administrador.
 *
 * Sin esto, un admin puede degradarse o borrarse con un clic y nadie vuelve a
 * entrar al panel: no hay forma de recuperarlo desde la aplicación, solo
 * escribiendo a mano en la base de datos.
 */
async function bloqueaPorSerUltimoAdmin(idObjetivo: string, rolNuevo?: string) {
  const objetivo = await prisma.user.findUnique({
    where: { id: idObjetivo },
    select: { role: true },
  });
  if (!objetivo) return errorResponse('Usuario no encontrado', 404);
  if (objetivo.role !== 'admin') return null;
  if (rolNuevo === 'admin') return null; // sigue siendo admin, no hay riesgo

  const admins = await prisma.user.count({ where: { role: 'admin' } });
  if (admins <= 1) {
    return errorResponse(
      'No puedes eliminar ni degradar al último administrador. Crea otro admin primero.',
    );
  }
  return null;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    const parsed = editarUsuarioSchema.safeParse(await request.json());
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos');
    }
    const { name, role, password } = parsed.data;

    // Un admin no puede quitarse a sí mismo el rol: se quedaría fuera del panel
    // en el mismo request que lo hizo, sin manera de deshacerlo.
    if (auth.userId === params.id && role && role !== 'admin') {
      return errorResponse('No puedes cambiar tu propio rol.');
    }

    const bloqueo = await bloqueaPorSerUltimoAdmin(params.id, role);
    if (bloqueo) return bloqueo;

    const usuario = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(password && { passwordHash: await hashPassword(password), authProvider: 'local' }),
      },
      select: CAMPOS_PUBLICOS,
    });

    return successResponse(usuario);
  } catch (error) {
    console.error('[admin/users PATCH]:', error);
    return errorResponse('Error al actualizar usuario', 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    if (auth.userId === params.id) {
      return errorResponse('No puedes eliminar tu propia cuenta.');
    }

    const bloqueo = await bloqueaPorSerUltimoAdmin(params.id);
    if (bloqueo) return bloqueo;

    // Los onDelete: Cascade del schema limpian Company y Candidate.
    await prisma.user.delete({ where: { id: params.id } });
    return successResponse({ id: params.id });
  } catch (error) {
    console.error('[admin/users DELETE]:', error);
    return errorResponse('Error al eliminar usuario', 500);
  }
}
