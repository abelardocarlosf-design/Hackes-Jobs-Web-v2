import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const ESTATUS_VALUES = ['abierta', 'en_proceso', 'terna_entregada', 'cerrada', 'cancelada'] as const;

const requisicionUpdateSchema = z.object({
  puesto: z.string().min(2).optional(),
  zona: z.string().optional(),
  turno: z.string().optional(),
  bandaSalarialMin: z.number().optional(),
  bandaSalarialMax: z.number().optional(),
  estatus: z.enum(ESTATUS_VALUES).optional(),
  fechaLimite: z.coerce.date().optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const requisicion = await prisma.requisicion.findUnique({
    where: { id: params.id },
    include: { procesos: true },
  });
  if (!requisicion) return errorResponse('Requisición no encontrada', 404);

  return successResponse(requisicion);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = requisicionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const existing = await prisma.requisicion.findUnique({
    where: { id: params.id },
    include: { procesos: true },
  });
  if (!existing) return errorResponse('Requisición no encontrada', 404);

  if (parsed.data.estatus === 'terna_entregada') {
    const hayTerna = existing.procesos.some((p) => p.etapa === 'terna');
    if (!hayTerna) {
      return errorResponse(
        'No se puede marcar terna_entregada sin al menos un Proceso en etapa "terna"',
        422
      );
    }
  }

  const requisicion = await prisma.requisicion.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return successResponse(requisicion);
}
