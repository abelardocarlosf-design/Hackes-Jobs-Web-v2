import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const ETAPA_VALUES = [
  'atraccion',
  'filtro_cv',
  'psicometria',
  'entrevista',
  'terna',
  'contratado',
  'descartado',
] as const;

const avanzarSchema = z.object({
  procesoId: z.string().min(1, 'procesoId es requerido'),
  etapa: z.enum(ETAPA_VALUES),
  scoreMatch: z.number().optional(),
  notas: z.string().optional(),
});

export async function POST(request: Request) {
  const authError = requireApiKey(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = avanzarSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const { procesoId, ...data } = parsed.data;

  const existing = await prisma.proceso.findUnique({ where: { id: procesoId } });
  if (!existing) return errorResponse('Proceso no encontrado', 404);

  // Solo persiste; n8n orquesta el resto (notificaciones, siguientes pasos, etc.)
  const proceso = await prisma.proceso.update({ where: { id: procesoId }, data });
  return successResponse(proceso);
}
