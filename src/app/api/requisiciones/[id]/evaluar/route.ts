import { prisma } from '@/lib/prisma';
import { requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { calcularMatch } from '@/lib/crm';

/**
 * Recalcula el match de todos los candidatos de una requisición.
 * Equivale al "Evaluar aplicantes" de la referencia, pero con el cálculo por
 * reglas de `calcularMatch` en vez de un modelo: es determinista y explicable.
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request, ['admin', 'recruiter']);
  if (auth instanceof Response) return auth;

  const requisicion = await prisma.requisicion.findUnique({
    where: { id: params.id },
    include: { procesos: { include: { candidato: true } } },
  });

  if (!requisicion) return errorResponse('Requisición no encontrada', 404);

  let actualizados = 0;
  for (const proceso of requisicion.procesos) {
    const score = calcularMatch(
      {
        puestoInteres: proceso.candidato.puestoInteres,
        zona: proceso.candidato.zona,
        tieneCV: !!proceso.candidato.cvKey,
        experienciaAnios: proceso.candidato.experienciaAnios,
      },
      { puesto: requisicion.puesto, zona: requisicion.zona }
    );

    if (proceso.scoreMatch !== score) {
      await prisma.proceso.update({ where: { id: proceso.id }, data: { scoreMatch: score } });
      actualizados += 1;
    }
  }

  return successResponse({ evaluados: requisicion.procesos.length, actualizados });
}
