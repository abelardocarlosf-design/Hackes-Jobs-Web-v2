import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, itemId, selectedOptionId } = await req.json();

    if (!sessionId || !itemId || !selectedOptionId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // 1. Obtener la sesión y el historial actual
    const session = await prisma.catSession.findUnique({
      where: { id: sessionId },
      include: { test: { include: { catItems: { where: { active: true } } } } }
    });

    if (!session || session.status === 'completed') {
      return NextResponse.json({ error: 'Sesión no válida o ya finalizada' }, { status: 400 });
    }

    // Obtener el ítem respondido para sacar sus parámetros y validar respuesta
    const answeredItem = await prisma.catItem.findUnique({ where: { id: itemId } });
    if (!answeredItem) {
      return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 });
    }

    const isCorrect = answeredItem.correctOptionId === selectedOptionId;

    // 2. Actualizar el historial
    const history = JSON.parse(session.responses);
    history.push({
      itemId,
      a: answeredItem.parameterA,
      b: answeredItem.parameterB,
      c: answeredItem.parameterC,
      is_correct: isCorrect,
      thetaBefore: session.currentTheta
    });

    // 3. Obtener ítems aún no respondidos
    const answeredItemIds = history.map((h: any) => h.itemId);
    const availableItems = session.test.catItems
      .filter(item => !answeredItemIds.includes(item.id))
      .map(item => ({
        id: item.id,
        parameterA: item.parameterA,
        parameterB: item.parameterB,
        parameterC: item.parameterC,
        questionText: item.questionText,
        options: item.options
      }));

    let pyData = null;

    try {
      const pythonApiUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
      const pyResponse = await fetch(`${pythonApiUrl}/api/cat/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history,
          current_theta: session.currentTheta,
          available_items: availableItems
        })
      });

      if (pyResponse.ok) {
        pyData = await pyResponse.json();
      }
    } catch (e) {
      console.warn('[CAT Answer] Fallback to direct calculation (Python API unavailable)');
    }

    if (!pyData) {
      const maxItems = 10;
      const isCompleted = history.length >= maxItems || availableItems.length === 0;
      const calculatedTheta = session.currentTheta + (isCorrect ? 0.5 : -0.5);
      
      pyData = {
        status: isCompleted ? 'completed' : 'in_progress',
        new_theta: calculatedTheta,
        final_theta: calculatedTheta,
        standard_error: Math.max(1.0 - (history.length * 0.1), 0.1),
        next_item: availableItems[0] || null
      };
    }

    // 5. Actualizar la base de datos de Prisma
    await prisma.catSession.update({
      where: { id: sessionId },
      data: {
        responses: JSON.stringify(history),
        currentTheta: pyData.final_theta || pyData.new_theta || session.currentTheta,
        standardError: pyData.standard_error,
        itemsAnswered: session.itemsAnswered + 1,
        status: pyData.status === 'completed' ? 'completed' : 'in_progress'
      }
    });

    if (pyData.status === 'completed') {
      // Opcional: Generar el TestResult oficial
      await prisma.testResult.create({
        data: {
          candidateId: session.candidateId,
          testId: session.testId,
          score: Math.round(((pyData.final_theta + 4) / 8) * 100), // Normalización simple [-4, 4] a [0, 100]
          results: JSON.stringify({
            finalTheta: pyData.final_theta,
            standardError: pyData.standard_error,
            itemsCount: session.itemsAnswered + 1
          }),
          summary: "Evaluación Adaptativa completada satisfactoriamente."
        }
      });
    }

    return NextResponse.json({
      status: pyData.status,
      newTheta: pyData.new_theta,
      standardError: pyData.standard_error,
      nextItem: pyData.next_item,
      isCompleted: pyData.status === 'completed'
    });

  } catch (error) {
    console.error('[CAT Answer Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
