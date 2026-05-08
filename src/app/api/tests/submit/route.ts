import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { triggerWebhookAsync, WebhookEvent } from '@/lib/webhook';

export async function POST(request: Request) {
  try {
    const token = cookies().get('hj_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });

    const decoded = await verifyAuth(token);
    if (!decoded || decoded.role !== 'candidate') {
      return NextResponse.json({ success: false, message: 'Solo candidatos pueden enviar tests' }, { status: 403 });
    }

    const body = await request.json();
    const { slug, respuestas, timestamp, metadata } = body;

    if (!slug || !respuestas) {
      return NextResponse.json({ success: false, message: 'Faltan datos requeridos (slug, respuestas)' }, { status: 400 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { userId: decoded.userId as string },
    });

    if (!candidate) {
      return NextResponse.json({ success: false, message: 'Candidato no encontrado' }, { status: 404 });
    }

    // Buscar test por type (ignorando case si es posible, o haciendo matching manual)
    // Asumimos que los types en la BD coinciden con el slug (ej. "DISC" o "disc")
    const allTests = await prisma.psychometricTest.findMany({ where: { active: true } });
    const test = allTests.find(t => t.type.toLowerCase() === slug.toLowerCase() || t.name.toLowerCase().includes(slug.toLowerCase()));

    if (!test) {
      return NextResponse.json({ success: false, message: 'Test no encontrado en la base de datos' }, { status: 404 });
    }

    if (test.isPremium || test.price > 0) {
      const purchase = await prisma.testPurchase.findFirst({
        where: { candidateId: candidate.id, testId: test.id, status: 'completed' }
      });
      if (!purchase) {
        return NextResponse.json({ success: false, message: 'Debes adquirir este test primero' }, { status: 403 });
      }
    }

    // Guardar el resultado inicial en estado "procesando"
    const result = await prisma.testResult.create({
      data: {
        candidateId: candidate.id,
        testId: test.id,
        results: JSON.stringify({ respuestas, metadata, timestamp }),
        status: 'procesando',
        summary: 'Procesando resultados...',
      }
    });

    // Determinar el webhook según el slug
    const eventNameMap: Record<string, string> = {
      'luscher': 'wf-001-luscher',
      'disc': 'wf-002-disc',
      'allport': 'wf-003-allport',
      'moss': 'wf-004-moss',
      'zavic': 'wf-005-zavic',
      'kostick': 'wf-006-kostick',
      'raven': 'wf-007-raven',
      'terman': 'wf-008-terman',
      '16pf': 'wf-009-16pf',
      'mmpi': 'wf-010-mmpi',
    };

    const n8nEvent = eventNameMap[slug.toLowerCase()] || 'test-completed';

    // Disparar webhook específico de la psicometría
    // Como el webhook original triggerWebhookAsync enviaba al event param de n8n, 
    // y los webhooks en n8n suelen configurarse en /webhook/wf-001-luscher, 
    // pasamos el slug mapeado como evento.
    // También enviamos el resultId para que n8n pueda actualizar el status al terminar.
    triggerWebhookAsync(n8nEvent as WebhookEvent, {
      candidatoId: candidate.id,
      candidateEmail: decoded.email,
      candidateName: decoded.name,
      testId: test.id,
      testName: test.name,
      slug: slug,
      resultId: result.id,
      respuestas,
      timestamp,
      metadata
    });

    return NextResponse.json({ success: true, resultId: result.id });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno al procesar el test' },
      { status: 500 }
    );
  }
}
