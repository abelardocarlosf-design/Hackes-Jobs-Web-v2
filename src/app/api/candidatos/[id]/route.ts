import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { borrarCV } from '@/lib/cv-storage';
import { z } from 'zod';

const vacioANull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v);

const candidatoUpdateSchema = z.object({
  nombre: z.string().min(2).optional(),
  email: z.preprocess(vacioANull, z.string().email('email inválido').nullable().optional()),
  telefono: z.preprocess(vacioANull, z.string().nullable().optional()),
  zona: z.preprocess(vacioANull, z.string().nullable().optional()),
  puestoInteres: z.preprocess(vacioANull, z.string().nullable().optional()),
  fuente: z.string().optional(),
  consentimientoLFPDPPP: z.boolean().optional(),
  linkedin: z.preprocess(vacioANull, z.string().url('La URL de LinkedIn no es válida').nullable().optional()),
  experienciaAnios: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z.number().int().min(0).max(60).nullable().optional()
  ),
  notas: z.preprocess(vacioANull, z.string().nullable().optional()),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const candidato = await prisma.candidato.findUnique({
    where: { id: params.id },
    include: {
      procesos: {
        include: { requisicion: true, testResult: true },
      },
    },
  });
  if (!candidato) return errorResponse('Candidato no encontrado', 404);

  return successResponse(candidato);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = candidatoUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const existing = await prisma.candidato.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Candidato no encontrado', 404);

  const candidato = await prisma.candidato.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      email: typeof parsed.data.email === 'string' ? parsed.data.email.toLowerCase() : parsed.data.email,
    },
  });
  return successResponse(candidato);
}

/**
 * Borra al candidato y su CV del almacenamiento.
 * El archivo se borra explícitamente: la cascada de Prisma limpia procesos y
 * seguimientos, pero no el binario, y dejarlo sería conservar dato personal
 * de alguien que ya no está en la base (LFPDPPP).
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const existing = await prisma.candidato.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Candidato no encontrado', 404);

  if (existing.cvKey) await borrarCV(existing.cvKey);
  await prisma.candidato.delete({ where: { id: params.id } });

  return successResponse({ id: params.id });
}
