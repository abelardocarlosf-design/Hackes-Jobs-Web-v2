import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID de resultado requerido' }, { status: 400 });
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
