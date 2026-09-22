import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const clienteUpdateSchema = z.object({
  razonSocial: z.string().min(2).optional(),
  rfc: z.string().optional(),
  contactoNombre: z.string().optional(),
  contactoEmail: z.string().email('contactoEmail inválido').optional(),
  contactoTel: z.string().optional(),
  zona: z.string().optional(),
  tier: z.union([z.literal(1), z.literal(2)]).optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const cliente = await prisma.cliente.findUnique({ where: { id: params.id } });
  if (!cliente) return errorResponse('Cliente no encontrado', 404);

  return successResponse(cliente);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = clienteUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const existing = await prisma.cliente.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Cliente no encontrado', 404);

  const cliente = await prisma.cliente.update({ where: { id: params.id }, data: parsed.data });
  return successResponse(cliente);
}
