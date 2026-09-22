import { prisma } from '@/lib/prisma';
import { requireApiKey } from '@/lib/api-auth';
import { successResponse } from '@/lib/api-helpers';

export async function GET(request: Request) {
  const authError = requireApiKey(request);
  if (authError) return authError;

  const requisiciones = await prisma.requisicion.findMany({
    where: { estatus: 'abierta' },
    include: { cliente: true },
    orderBy: { fechaSolicitud: 'asc' },
  });

  return successResponse(requisiciones);
}
