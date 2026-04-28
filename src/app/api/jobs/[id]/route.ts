import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getAuthUser, errorResponse } from '@/lib/api-helpers';
import { triggerWebhookAsync } from '@/lib/webhook';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateJobSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  modality: z.enum(['Presencial', 'Híbrido', 'Remoto']).optional(),
  requirements: z.string().optional(),
  schedule: z.string().optional(),
  benefits: z.string().optional(),
  positions: z.number().min(1).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'closed']).optional(),
});

/**
 * GET /api/jobs/[id] — Detalle de una vacante
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: { id: true, name: true, industry: true, size: true, verified: true },
        },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return errorResponse('Vacante no encontrada', 404);
    }

    // Si la vacante no está aprobada, solo usuarios privilegiados pueden verla
    if (job.status !== 'approved') {
      const user = await getAuthUser(request);
      const canView = user && (
        ['admin', 'recruiter'].includes(user.role) ||
        (user.role === 'company' && job.company.id === user.userId)
      );
      if (!canView) {
        return errorResponse('Vacante no encontrada', 404);
      }
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error('[Job GET Error]:', error);
    return errorResponse('Error al obtener vacante', 500);
  }
}

/**
 * PATCH /api/jobs/[id] — Actualizar vacante (incluye cambio de status)
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
    const parsed = updateJobSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos');
    }

    // Verificar que la vacante existe
    const existing = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true },
    });

    if (!existing) {
      return errorResponse('Vacante no encontrada', 404);
    }

    // Si es empresa, solo puede editar sus propias vacantes (no cambiar status)
    if (user.role === 'company') {
      const company = await prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company || company.id !== existing.companyId) {
        return errorResponse('No tienes permiso para editar esta vacante', 403);
      }
      // Empresa no puede cambiar status directamente
      if (parsed.data.status) {
        delete (parsed.data as any).status;
      }
    }

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: parsed.data,
      include: {
        company: { select: { name: true } },
      },
    });

    // Si se cambió el status, disparar webhook
    if (parsed.data.status && parsed.data.status !== existing.status) {
      triggerWebhookAsync('job-created', {
        jobId: updated.id,
        title: updated.title,
        company: updated.company.name,
        status: updated.status,
        previousStatus: existing.status,
        updatedBy: user.email,
        action: 'status-change',
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Job PATCH Error]:', error);
    return errorResponse('Error al actualizar vacante', 500);
  }
}

/**
 * DELETE /api/jobs/[id] — Eliminar vacante
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request, ['admin']);
    if (authResult instanceof NextResponse) return authResult;

    await prisma.job.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Vacante eliminada' });
  } catch (error) {
    console.error('[Job DELETE Error]:', error);
    return errorResponse('Error al eliminar vacante', 500);
  }
}
