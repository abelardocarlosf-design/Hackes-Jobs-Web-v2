import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID de resultado requerido' }, { status: 400 });
    }

    // ─── Autenticación & Prevención de IDOR ─────────────────
    // Intentar validar sesión de Administrador primero
    let isAuthorized = false;
    const adminToken = cookies().get('hj_admin_token')?.value;
    if (adminToken) {
      try {
        const decodedAdmin = await verifyAuth(adminToken);
        if (decodedAdmin && decodedAdmin.role === 'admin') {
          isAuthorized = true;
        }
      } catch {}
    }

    // Si no es admin, validar sesión del Candidato
    let authenticatedCandidateId: string | null = null;
    if (!isAuthorized) {
      const candidateToken = cookies().get('hj_token')?.value;
      if (!candidateToken) {
        return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
      }

      try {
        const decodedCandidate = await verifyAuth(candidateToken);
        if (decodedCandidate && decodedCandidate.role === 'candidate') {
          const candidate = await prisma.candidate.findUnique({
            where: { userId: decodedCandidate.userId },
          });
          if (candidate) {
            authenticatedCandidateId = candidate.id;
          }
        }
      } catch {
        return NextResponse.json({ success: false, message: 'Sesión inválida o expirada' }, { status: 401 });
      }
    }

    const result = await prisma.testResult.findUnique({
      where: { id },
      include: {
        test: true
      }
    });

    if (!result) {
      return NextResponse.json({ success: false, message: 'Resultado no encontrado' }, { status: 404 });
    }

    // Si no es administrador, verificar que el candidato es dueño del resultado (IDOR Guard)
    if (!isAuthorized && result.candidateId !== authenticatedCandidateId) {
      return NextResponse.json({ success: false, message: 'Acceso denegado' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      status: result.status, // 'procesando' | 'completado' | 'fallido'
      score: result.score,
      summary: result.summary,
      testName: result.test.name,
      // Intentar parsear resultados si están guardados como JSON string
      data: result.results ? JSON.parse(result.results) : null
    });
  } catch (error) {
    console.error('Error in status check:', error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

