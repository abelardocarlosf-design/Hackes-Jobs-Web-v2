import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/applications/[id] — Actualizar status de una aplicación
 * Solo admin, recruiter o empresa dueña de la vacante
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request, ['admin', 'recruiter', 'company']);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const body = await request.json();
    const { status, notes } = body;

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    if (status && !validStatuses.includes(status)) {
      return errorResponse(`Status inválido. Opciones: ${validStatuses.join(', ')}`);
    }

    // Verificar que la aplicación existe
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: { job: { include: { company: true } } },
    });
    if (!application) return errorResponse('Aplicación no encontrada', 404);

    // Si es empresa, verificar propiedad
    if (user.role === 'company') {
      const company = await prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company || company.id !== application.job.companyId) {
        return errorResponse('No tienes acceso a esta aplicación', 403);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: updateData,
      include: {
        candidate: { include: { user: { select: { name: true, email: true } } } },
        job: { select: { title: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Application PATCH Error]:', error);
    return errorResponse('Error al actualizar aplicación', 500);
  }
}
