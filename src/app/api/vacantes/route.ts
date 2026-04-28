import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/vacantes — Alias de /api/jobs (retrocompatibilidad)
 * Retorna vacantes aprobadas con datos de empresa.
 */
export async function GET() {
  try {
    const vacantes = await prisma.job.findMany({
      where: { status: 'approved' },
      include: {
        company: {
          select: { name: true, industry: true, verified: true },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: vacantes });
  } catch (error) {
    console.error('[Vacantes GET Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener vacantes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vacantes — Redirige a /api/jobs
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Redirigir al endpoint principal
    const response = await fetch(new URL('/api/jobs', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Vacantes POST Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear vacante' },
      { status: 500 }
    );
  }
}
