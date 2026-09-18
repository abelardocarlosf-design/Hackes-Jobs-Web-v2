import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const TIPOS = ['llamada', 'whatsapp', 'correo', 'psicometria', 'documentos', 'entrevista', 'otro'] as const;

const seguimientoSchema = z.object({
  candidatoId: z.string().min(1, 'candidatoId es requerido'),
  procesoId: z.string().optional(),
  tipo: z.enum(TIPOS).default('llamada'),
  nota: z.string().optional(),
  fechaLimite: z.coerce.date(),
});

export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const candidatoId = searchParams.get('candidatoId') || undefined;
  const estado = searchParams.get('estado'); // pendientes | vencidos | completados

  const where = {
    ...(candidatoId ? { candidatoId } : {}),
    ...(estado === 'completados' ? { completado: true } : {}),
    ...(estado === 'pendientes' ? { completado: false } : {}),
    ...(estado === 'vencidos' ? { completado: false, fechaLimite: { lte: new Date() } } : {}),
  };

  const items = await prisma.seguimiento.findMany({
    where,
    orderBy: [{ completado: 'asc' }, { fechaLimite: 'asc' }],
    take: 200,
    include: { candidato: { select: { id: true, nombre: true, telefono: true, email: true } } },
  });

  return successResponse({ items, total: items.length });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = seguimientoSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const candidato = await prisma.candidato.findUnique({ where: { id: parsed.data.candidatoId } });
  if (!candidato) return errorResponse('El candidatoId no corresponde a un Candidato existente', 400);

  const seguimiento = await prisma.seguimiento.create({ data: parsed.data });
  return successResponse(seguimiento, 201);
}
