import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const clienteSchema = z.object({
  razonSocial: z.string().min(2, 'razonSocial es requerida'),
  rfc: z.string().optional(),
  contactoNombre: z.string().optional(),
  contactoEmail: z.string().email('contactoEmail inválido').optional(),
  contactoTel: z.string().optional(),
  zona: z.string().optional(),
  tier: z.union([z.literal(1), z.literal(2)]).optional(),
});

export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  const [items, total] = await Promise.all([
    prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.cliente.count(),
  ]);

  return successResponse({ items, page, limit, total });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = clienteSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const cliente = await prisma.cliente.create({ data: parsed.data });
  return successResponse(cliente, 201);
}
