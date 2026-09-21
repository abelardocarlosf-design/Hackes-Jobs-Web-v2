import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { z } from 'zod';

const TIPO_VALUES = ['DISC', '16PF', 'Moss', 'Zavic', 'Luscher'] as const;

const resultadoSchema = z.object({
  procesoId: z.string().min(1, 'procesoId es requerido'),
  tipo: z.enum(TIPO_VALUES),
  resultadoJson: z.string().min(1, 'resultadoJson es requerido'),
  scoreGlobal: z.number().optional(),
  pdfUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  const authError = requireApiKey(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = resultadoSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos', 400);
  }

  const { procesoId, tipo, resultadoJson, scoreGlobal, pdfUrl } = parsed.data;

  const existing = await prisma.proceso.findUnique({ where: { id: procesoId } });
  if (!existing) return errorResponse('Proceso no encontrado', 404);

  // No se crea TestResult porque exige un Candidate/User de plataforma que los
  // candidatos de pipeline no necesariamente tienen. Se persiste en el Proceso.
  const proceso = await prisma.proceso.update({
    where: { id: procesoId },
    data: {
      psicometriaTipo: tipo,
      psicometriaResultadoJson: resultadoJson,
      psicometriaScoreGlobal: scoreGlobal,
      psicometriaPdfUrl: pdfUrl,
    },
  });

  return successResponse(proceso);
}
