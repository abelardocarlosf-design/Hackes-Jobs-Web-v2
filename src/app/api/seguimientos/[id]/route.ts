import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const patchSchema = z.object({
  completado: z.boolean().optional(),
  nota: z.string().optional(),
  fechaLimite: z.coerce.date().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const existente = await prisma.seguimiento.findUnique({ where: { id: params.id } });
  if (!existente) return errorResponse('Seguimiento no encontrado', 404);

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const { completado, ...resto } = parsed.data;

  const seguimiento = await prisma.seguimiento.update({
    where: { id: params.id },
    data: {
      ...resto,
      ...(completado === undefined
        ? {}
        : { completado, completadoEn: completado ? new Date() : null }),
    },
  });

  return successResponse(seguimiento);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const existente = await prisma.seguimiento.findUnique({ where: { id: params.id } });
  if (!existente) return errorResponse('Seguimiento no encontrado', 404);

  await prisma.seguimiento.delete({ where: { id: params.id } });
  return successResponse({ id: params.id });
}
