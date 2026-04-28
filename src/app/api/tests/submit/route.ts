import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { triggerWebhookAsync } from '@/lib/webhook';

export async function POST(request: Request) {
  try {
    const token = cookies().get('hj_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });

    const decoded = await verifyAuth(token);
    if (!decoded || decoded.role !== 'candidate') {
      return NextResponse.json({ success: false, message: 'Solo candidatos pueden enviar tests' }, { status: 403 });
    }

    const body = await request.json();
    const { testId, testType, answers, score, summary } = body;

    if ((!testId && !testType) || !answers) {
      return NextResponse.json({ success: false, message: 'Faltan datos requeridos' }, { status: 400 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { userId: decoded.userId as string },
    });

    if (!candidate) {
      return NextResponse.json({ success: false, message: 'Candidato no encontrado' }, { status: 404 });
    }

    // Verificar si el test es premium y si lo ha comprado
    let test;
    if (testId) {
      test = await prisma.psychometricTest.findUnique({ where: { id: testId } });
    } else if (testType) {
      test = await prisma.psychometricTest.findFirst({ where: { type: testType } });
    }

    if (!test) {
      return NextResponse.json({ success: false, message: 'Test no encontrado' }, { status: 404 });
    }

    if (test.isPremium) {
      const purchase = await prisma.testPurchase.findUnique({
        where: { candidateId_testId: { candidateId: candidate.id, testId: test.id } }
      });
      if (!purchase || purchase.status !== 'completed') {
        return NextResponse.json({ success: false, message: 'Debes adquirir este test primero' }, { status: 403 });
      }
    }

    // Guardar el resultado
    const result = await prisma.testResult.create({
      data: {
        candidateId: candidate.id,
        testId: test.id,
        results: JSON.stringify(answers),
        score: score || 0,
        summary: summary || 'Test completado satisfactoriamente.',
      }
    });

    // Disparar webhook
    triggerWebhookAsync('test-completed', {
      candidateId: candidate.id,
      candidateEmail: decoded.email,
      candidateName: decoded.name,
      testId: test.id,
      testName: test.name,
      testType: test.type,
      score: result.score,
      summary: result.summary,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno al procesar el test' },
      { status: 500 }
    );
  }
}
