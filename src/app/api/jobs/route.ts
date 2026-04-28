import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAuth, successResponse, errorResponse } from '@/lib/api-helpers';
import { triggerWebhookAsync } from '@/lib/webhook';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createJobSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  salaryRange: z.string().optional(),
  location: z.string().optional(),
  modality: z.enum(['Presencial', 'Híbrido', 'Remoto']).optional(),
  requirements: z.string().optional(),
  schedule: z.string().optional(),
  benefits: z.string().optional(),
  positions: z.number().min(1).optional(),
});

/**
 * GET /api/jobs — Lista de vacantes
 * Público: muestra solo vacantes aprobadas
 * Autenticado (admin/recruiter): muestra todas
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const modality = searchParams.get('modality');
    const companyId = searchParams.get('companyId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Verificar si es usuario autenticado con privilegios
    const user = await getAuthUser(request);
    const isPrivileged = user && ['admin', 'recruiter'].includes(user.role);

    // Construir filtro
    const where: Record<string, unknown> = {};

    // Usuarios públicos solo ven vacantes aprobadas
    if (!isPrivileged) {
      where.status = 'approved';
    } else if (status) {
      where.status = status;
    }

    // Si es empresa, solo ve sus propias vacantes
    if (user?.role === 'company') {
      const company = await prisma.company.findUnique({ where: { userId: user.userId } });
      if (company) {
        where.companyId = company.id;
      }
    }

    if (companyId) where.companyId = companyId;
    if (location) where.location = { contains: location };
    if (modality) where.modality = modality;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: where as any,
        include: {
          company: {
            select: { id: true, name: true, industry: true, size: true, verified: true },
          },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where: where as any }),
    ]);

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Jobs GET Error]:', error);
    return errorResponse('Error al obtener vacantes', 500);
  }
}

/**
 * POST /api/jobs — Crear vacante
 * Requiere: company o recruiter o admin
 */
export async function POST(request: Request) {
  try {
    const authResult = await requireAuth(request, ['company', 'recruiter', 'admin']);
    if (authResult instanceof NextResponse) return authResult;
    const user = authResult;

    const body = await request.json();
    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message || 'Datos inválidos');
    }

    // Obtener companyId
    let companyId: string;

    if (user.role === 'company') {
      const company = await prisma.company.findUnique({ where: { userId: user.userId } });
      if (!company) return errorResponse('No se encontró tu empresa', 404);
      companyId = company.id;
    } else if (body.companyId) {
      companyId = body.companyId;
    } else {
      // Admin/recruiter deben especificar companyId o se asigna la primera
      const firstCompany = await prisma.company.findFirst();
      if (!firstCompany) return errorResponse('No hay empresas registradas', 400);
      companyId = firstCompany.id;
    }

    const job = await prisma.job.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        salaryRange: parsed.data.salaryRange || null,
        location: parsed.data.location || null,
        modality: parsed.data.modality || null,
        requirements: parsed.data.requirements || null,
        schedule: parsed.data.schedule || null,
        benefits: parsed.data.benefits || null,
        positions: parsed.data.positions || 1,
        status: user.role === 'admin' ? 'approved' : 'pending',
        companyId,
      },
      include: {
        company: { select: { name: true } },
      },
    });

    // Disparar webhook a n8n
    triggerWebhookAsync('job-created', {
      jobId: job.id,
      title: job.title,
      company: job.company.name,
      status: job.status,
      createdBy: user.email,
      location: job.location,
      modality: job.modality,
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error('[Jobs POST Error]:', error);
    return errorResponse('Error al crear vacante', 500);
  }
}
