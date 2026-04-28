import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getAuthUser, errorResponse } from '@/lib/api-helpers';
import { calculateScore, type ScoreBreakdown } from '@/lib/scoring';
import { triggerWebhookAsync } from '@/lib/webhook';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const applySchema = z.object({
  jobId: z.string().min(1, 'ID de vacante requerido'),
  coverLetter: z.string().optional(),
});

/**
 * GET /api/applications — Lista de aplicaciones
 * Admin/Recruiter: todas
 * Company: de sus vacantes
 * Candidate: solo las propias
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Filtros por rol
    if (user.role === 'candidate') {
      const candidate = await prisma.candidate.findUnique({ where: { userId: user.userId } });
      if (!candidate) return errorResponse('Perfil de candidato no encontrado', 404);
      where.candidateId = candidate.id;
    } else if (user.role === 'company') {
      const company = await prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company) return errorResponse('Empresa no encontrada', 404);
      where.job = { companyId: company.id };
    }
    // Admin y recruiter ven todo

    if (jobId) where.jobId = jobId;
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: where as any,
        include: {
          candidate: {
            include: {
              user: { select: { name: true, email: true, avatar: true } },
            },
          },
          job: {
            select: { id: true, title: true, company: { select: { name: true } } },
          },
        },
        orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.application.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[Applications GET Error]:', error);
    return errorResponse('Error al obtener aplicaciones', 500);
  }
}

/**
 * POST /api/applications — Candidato aplica a una vacante
 * Calcula score automáticamente y dispara webhook a n8n
 */
export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request, ['candidate']);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const body = await request.json();
    const parsed = applySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos');
    }

    const { jobId, coverLetter } = parsed.data;

    // Verificar que la vacante existe y está aprobada
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: { select: { name: true } } },
    });
    if (!job || job.status !== 'approved') {
      return errorResponse('Vacante no disponible', 404);
    }

    // Obtener candidato
    const candidate = await prisma.candidate.findUnique({
      where: { userId: user.userId },
      include: {
        testResults: { select: { test: { select: { type: true } }, score: true } },
      },
    });
    if (!candidate) return errorResponse('Perfil de candidato no encontrado', 404);

    // Verificar duplicado
    const existing = await prisma.application.findUnique({
      where: { jobId_candidateId: { jobId, candidateId: candidate.id } },
    });
    if (existing) {
      return errorResponse('Ya aplicaste a esta vacante', 409);
    }

    // Calcular score
    let score = 0;
    let scoreBreakdown: ScoreBreakdown | null = null;
    try {
      const requirements = job.requirements ? JSON.parse(job.requirements) : {};
      const candidateSkills = candidate.skills ? JSON.parse(candidate.skills) : [];
      const testScores = candidate.testResults
        .filter(tr => tr.score !== null)
        .map(tr => ({ testType: tr.test.type, score: tr.score! }));

      scoreBreakdown = calculateScore(
        {
          experienceYears: candidate.experienceYears,
          skills: candidateSkills,
          education: candidate.education || '',
          testScores,
        },
        requirements
      );
      score = scoreBreakdown.total;
    } catch (err) {
      console.warn('[Scoring] Error calculating score:', err);
    }

    // Crear aplicación
    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: candidate.id,
        status: 'pending',
        score,
        notes: coverLetter || null,
      },
      include: {
        job: { select: { title: true, company: { select: { name: true } } } },
        candidate: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    // Disparar webhook a n8n
    triggerWebhookAsync('new-application', {
      applicationId: application.id,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company.name,
      candidateName: user.name,
      candidateEmail: user.email,
      score,
      scoreBreakdown: scoreBreakdown ? {
        experience: scoreBreakdown.experience,
        skills: scoreBreakdown.skills,
        education: scoreBreakdown.education,
        psychometric: scoreBreakdown.psychometric,
        tier: scoreBreakdown.tier,
        matchedSkills: scoreBreakdown.details.matchedSkills,
        missingSkills: scoreBreakdown.details.missingSkills,
      } : null,
      coverLetter: coverLetter || '',
    });

    return NextResponse.json({
      success: true,
      data: {
        application,
        score: scoreBreakdown,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[Applications POST Error]:', error);
    return errorResponse('Error al procesar tu aplicación', 500);
  }
}
