import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { calcularMatch } from '@/lib/crm';
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

const procesoSchema = z.object({
  requisicionId: z.string().min(1, 'requisicionId es requerido'),
  candidatoId: z.string().min(1, 'candidatoId es requerido'),
  etapa: z.enum(ETAPA_VALUES).optional(),
  scoreMatch: z.number().optional(),
  notas: z.string().optional(),
});

export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const requisicionId = searchParams.get('requisicionId') || undefined;
  const etapa = searchParams.get('etapa') || undefined;

  const where = {
    ...(requisicionId ? { requisicionId } : {}),
    ...(etapa ? { etapa } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.proceso.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.proceso.count({ where }),
  ]);

  return successResponse({ items, page, limit, total });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = procesoSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const [requisicion, candidato] = await Promise.all([
    prisma.requisicion.findUnique({ where: { id: parsed.data.requisicionId } }),
    prisma.candidato.findUnique({ where: { id: parsed.data.candidatoId } }),
  ]);

  if (!requisicion) return errorResponse('La requisicionId no corresponde a una Requisición existente', 400);
  if (!candidato) return errorResponse('La candidatoId no corresponde a un Candidato existente', 400);

  if (requisicion.estatus === 'cerrada' || requisicion.estatus === 'cancelada') {
    return errorResponse(
      `No se puede crear un Proceso: la Requisición está "${requisicion.estatus}"`,
      422
    );
  }

  // Si no viene un score explícito, se calcula por reglas al momento de asignar.
  const scoreMatch =
    parsed.data.scoreMatch ??
    calcularMatch(
      {
        puestoInteres: candidato.puestoInteres,
        zona: candidato.zona,
        tieneCV: !!candidato.cvKey,
        experienciaAnios: candidato.experienciaAnios,
      },
      { puesto: requisicion.puesto, zona: requisicion.zona }
    );

  const proceso = await prisma.proceso.create({ data: { ...parsed.data, scoreMatch } });
  return successResponse(proceso, 201);
}
