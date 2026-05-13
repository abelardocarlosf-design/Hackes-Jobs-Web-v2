import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/[event] — Recibir callbacks de n8n
 *
 * Eventos soportados:
 * - test-completed: n8n envía resultado procesado de test psicométrico
 * - company-lead: n8n confirma procesamiento del lead
 *
 * Nota: los eventos `job-created` y `new-application` fueron retirados al
 * migrar las vacantes a un catálogo file-based (src/data/vacantes.ts). Las
 * postulaciones ahora se manejan vía webhook directo desde
 * `src/components/vacantes/PostularButton.tsx`.
 */
export async function POST(
  request: Request,
  { params }: { params: { event: string } }
) {
  try {
    const body = await request.json();
    const event = params.event;

    console.log(`[Webhook Received] ${event}:`, JSON.stringify(body).slice(0, 200));

    // Validar secret (opcional)
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.WEBHOOK_SECRET;
    if (expectedSecret && webhookSecret !== expectedSecret) {
      console.warn(`[Webhook] Secret inválido para evento ${event}`);
      // No rechazar por ahora, solo log (para facilitar desarrollo)
    }

    switch (event) {
      case 'test-completed': {
        // n8n procesa resultado de test psicométrico
        const { testResultId, score: testScore, summary } = body;
        if (testResultId) {
          await prisma.testResult.update({
            where: { id: testResultId },
            data: {
              score: testScore ? parseInt(testScore) : null,
              summary: summary || null,
            },
          });
          console.log(`[Webhook] TestResult ${testResultId} → score: ${testScore}`);
        }
        break;
      }

      case 'company-lead': {
        // n8n confirma que procesó el lead de empresa
        console.log(`[Webhook] Company lead procesado:`, body);
        break;
      }

      default:
        console.warn(`[Webhook] Evento desconocido: ${event}`);
        return NextResponse.json(
          { success: false, message: `Evento desconocido: ${event}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, message: `Evento ${event} procesado` });
  } catch (error) {
    console.error(`[Webhook Error] ${params.event}:`, error);
    return NextResponse.json(
      { success: false, message: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}
