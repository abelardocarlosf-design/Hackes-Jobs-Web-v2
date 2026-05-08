import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Verificar Token de Seguridad (API Key)
    const secret = request.headers.get('X-Webhook-Secret') || request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (secret !== process.env.WEBHOOK_SECRET) {
      console.warn('[UpdateStatus] Intento de acceso no autorizado');
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { resultId, status, score, summary, results } = body;

    if (!resultId) {
      return NextResponse.json({ success: false, message: 'resultId es requerido' }, { status: 400 });
    }

    // 2. Actualizar el registro en la base de datos
    const updatedResult = await prisma.testResult.update({
      where: { id: resultId },
      data: {
        status: status || 'completado',
        score: score !== undefined ? (typeof score === 'string' ? parseInt(score) : score) : undefined,
        summary: summary || undefined,
        // Si n8n envía resultados enriquecidos, los guardamos
        results: results ? JSON.stringify(results) : undefined,
      }
    });

    console.log(`[UpdateStatus] Test ${resultId} actualizado exitosamente a ${status}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Resultado actualizado correctamente',
      id: updatedResult.id 
    });
  } catch (error) {
    console.error('Error updating test status:', error);
    return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
  }
}
