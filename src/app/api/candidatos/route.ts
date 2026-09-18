import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const candidatoSchema = z.object({
  nombre: z.string().min(2, 'nombre es requerido'),
  email: z.string().email('email inválido').optional(),
  telefono: z.string().optional(),
  zona: z.string().optional(),
  puestoInteres: z.string().optional(),
  fuente: z.string().optional(),
  consentimientoLFPDPPP: z.boolean(),
});

export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const zona = searchParams.get('zona') || undefined;
  const puestoInteres = searchParams.get('puestoInteres') || undefined;
  const q = searchParams.get('q') || undefined;

  const where = {
    ...(zona ? { zona } : {}),
    ...(puestoInteres ? { puestoInteres } : {}),
    ...(q
      ? {
          OR: [
            { nombre: { contains: q } },
            { email: { contains: q } },
            { telefono: { contains: q } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.candidato.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.candidato.count({ where }),
  ]);

  return successResponse({ items, page, limit, total });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = candidatoSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  if (!parsed.data.consentimientoLFPDPPP) {
    return errorResponse(
      'No se puede crear un Candidato sin consentimiento LFPDPPP',
      422
    );
  }

  const candidato = await prisma.candidato.create({
    data: {
      ...parsed.data,
      email: parsed.data.email?.toLowerCase(),
    },
  });
  return successResponse(candidato, 201);
}
