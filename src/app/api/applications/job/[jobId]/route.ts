import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, errorResponse } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/applications/job/[jobId] — Aplicaciones de una vacante específica
 * Solo accesible por admin, recruiter o la empresa dueña
 */
export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const authResult = await requireAuth(request, ['admin', 'recruiter', 'company']);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    // Verificar que la vacante existe
    const job = await prisma.job.findUnique({
      where: { id: params.jobId },
      include: { company: true },
    });
    if (!job) return errorResponse('Vacante no encontrada', 404);

    // Si es empresa, verificar que es la dueña
    if (user.role === 'company') {
      const company = await prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company || company.id !== job.companyId) {
        return errorResponse('No tienes acceso a esta vacante', 403);
      }
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sort') || 'score';

    const where: Record<string, unknown> = { jobId: params.jobId };
    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where: where as any,
      include: {
        candidate: {
          include: {
            user: { select: { name: true, email: true, avatar: true } },
            testResults: {
              select: {
                score: true,
                test: { select: { name: true, type: true } },
              },
            },
          },
        },
      },
      orderBy: sortBy === 'score' ? { score: 'desc' } : { createdAt: 'desc' },
    });

    // Estadísticas del pipeline
    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      reviewing: applications.filter(a => a.status === 'reviewing').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      hired: applications.filter(a => a.status === 'hired').length,
      avgScore: applications.length > 0
        ? Math.round(applications.reduce((s, a) => s + (a.score || 0), 0) / applications.length)
        : 0,
    };

    return NextResponse.json({ success: true, data: applications, stats });
  } catch (error) {
    console.error('[Job Applications GET Error]:', error);
    return errorResponse('Error al obtener aplicaciones', 500);
  }
}
