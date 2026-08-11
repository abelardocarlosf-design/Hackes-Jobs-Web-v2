import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const ESTATUS_VALUES = ['abierta', 'en_proceso', 'terna_entregada', 'cerrada', 'cancelada'] as const;

const requisicionSchema = z.object({
  clienteId: z.string().min(1, 'clienteId es requerido'),
  puesto: z.string().min(2, 'puesto es requerido'),
  zona: z.string().optional(),
  turno: z.string().optional(),
  bandaSalarialMin: z.number().optional(),
  bandaSalarialMax: z.number().optional(),
  estatus: z.enum(ESTATUS_VALUES).optional(),
  fechaLimite: z.coerce.date().optional(),
});

export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const estatus = searchParams.get('estatus') || undefined;
  const clienteId = searchParams.get('clienteId') || undefined;
  const zona = searchParams.get('zona') || undefined;

  const where = {
    ...(estatus ? { estatus } : {}),
    ...(clienteId ? { clienteId } : {}),
    ...(zona ? { zona } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.requisicion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.requisicion.count({ where }),
  ]);

  return successResponse({ items, page, limit, total });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = requisicionSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const cliente = await prisma.cliente.findUnique({ where: { id: parsed.data.clienteId } });
  if (!cliente) return errorResponse('El clienteId no corresponde a un Cliente existente', 400);

  const requisicion = await prisma.requisicion.create({ data: parsed.data });
  return successResponse(requisicion, 201);
}
