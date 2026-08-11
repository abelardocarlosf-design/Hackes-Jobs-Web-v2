import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const upsertSchema = z.object({
  nombre: z.string().min(2, 'nombre es requerido'),
  email: z.string().email('email inválido').optional(),
  telefono: z.string().optional(),
  zona: z.string().optional(),
  puestoInteres: z.string().optional(),
  fuente: z.string().optional(),
  consentimientoLFPDPPP: z.boolean(),
});

export async function POST(request: Request) {
  const authError = requireApiKey(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  // Dedup por email normalizado a lowercase; si no hay email, por teléfono.
  // Nunca crear duplicados silenciosos por mismatch de mayúsculas.
  const email = parsed.data.email?.toLowerCase();
  const { telefono } = parsed.data;

  let existing = null;
  if (email) {
    existing = await prisma.candidato.findFirst({ where: { email } });
  }
  if (!existing && telefono) {
    existing = await prisma.candidato.findFirst({ where: { telefono } });
  }

  if (existing) {
    const candidato = await prisma.candidato.update({
      where: { id: existing.id },
      data: { ...parsed.data, email },
    });
    return successResponse({ ...candidato, _dedup: true });
  }

  if (!parsed.data.consentimientoLFPDPPP) {
    return errorResponse('No se puede crear un Candidato sin consentimiento LFPDPPP', 422);
  }

  const candidato = await prisma.candidato.create({
    data: { ...parsed.data, email },
  });
  return successResponse(candidato, 201);
}
