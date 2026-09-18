import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { SEGUIMIENTO_AUTOMATICO, type EtapaId } from '@/lib/crm';
import { triggerWebhookAsync } from '@/lib/webhook';
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

const procesoUpdateSchema = z.object({
  etapa: z.enum(ETAPA_VALUES).optional(),
  scoreMatch: z.number().optional(),
  notas: z.string().optional(),
  testResultId: z.string().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const parsed = procesoUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const existing = await prisma.proceso.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Proceso no encontrado', 404);

  const proceso = await prisma.proceso.update({
    where: { id: params.id },
    data: parsed.data,
  });

  // Al cambiar de etapa se agenda solo el siguiente paso, para que ningún
  // candidato se quede sin acción pendiente. Solo si no hay ya uno abierto
  // del mismo tipo: mover ida y vuelta entre etapas no debe llenar de tareas.
  const cambioEtapa = parsed.data.etapa && parsed.data.etapa !== existing.etapa;
  if (cambioEtapa) {
    const regla = SEGUIMIENTO_AUTOMATICO[parsed.data.etapa as EtapaId];
    if (regla) {
      const yaAbierto = await prisma.seguimiento.findFirst({
        where: { candidatoId: proceso.candidatoId, tipo: regla.tipo, completado: false },
      });
      if (!yaAbierto) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + regla.dias);
        await prisma.seguimiento.create({
          data: {
            candidatoId: proceso.candidatoId,
            procesoId: proceso.id,
            tipo: regla.tipo,
            nota: regla.nota,
            fechaLimite,
            automatico: true,
          },
        });
      }
    }

    // n8n escucha este evento para disparar los mensajes al candidato.
    triggerWebhookAsync('proceso-etapa-cambiada', {
      procesoId: proceso.id,
      candidatoId: proceso.candidatoId,
      requisicionId: proceso.requisicionId,
      etapaAnterior: existing.etapa,
      etapaNueva: proceso.etapa,
    });
  }

  return successResponse(proceso);
}
