import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const intakeSchema = z.object({
  cliente: z.object({
    razonSocial: z.string().min(2, 'cliente.razonSocial es requerida'),
    rfc: z.string().optional(),
    contactoNombre: z.string().optional(),
    contactoEmail: z.string().email().optional(),
    contactoTel: z.string().optional(),
    zona: z.string().optional(),
    tier: z.union([z.literal(1), z.literal(2)]).optional(),
  }),
  requisicion: z.object({
    puesto: z.string().min(2, 'requisicion.puesto es requerido'),
    zona: z.string().optional(),
    turno: z.string().optional(),
    bandaSalarialMin: z.number().optional(),
    bandaSalarialMax: z.number().optional(),
    fechaLimite: z.coerce.date().optional(),
  }),
});

export async function POST(request: Request) {
  const authError = requireApiKey(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const { cliente: clienteInput, requisicion: requisicionInput } = parsed.data;

  // Dedup de Cliente por rfc, si no por contactoEmail; si no hay ninguno, se crea nuevo.
  let cliente = null;
  if (clienteInput.rfc) {
    cliente = await prisma.cliente.findFirst({ where: { rfc: clienteInput.rfc } });
  }
  if (!cliente && clienteInput.contactoEmail) {
    cliente = await prisma.cliente.findFirst({ where: { contactoEmail: clienteInput.contactoEmail } });
  }
  if (!cliente) {
    cliente = await prisma.cliente.create({ data: clienteInput });
  }

  const requisicion = await prisma.requisicion.create({
    data: { ...requisicionInput, clienteId: cliente.id },
  });

  return successResponse({ cliente, requisicion }, 201);
}
