import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, testId } = await req.json();

    if (!userId || !testId) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    let candidate = await prisma.candidate.findUnique({ where: { userId } });
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          userId,
          experienceYears: 0
        }
      });
    }
    const candidateId = candidate.id;

    // Load the test details
    const test = await prisma.psychometricTest.findUnique({
      where: { id: testId }
    });

    if (!test) {
      return NextResponse.json({ error: 'Prueba no encontrada' }, { status: 404 });
    }

    // 1. Crear sesión en Prisma
    const session = await prisma.catSession.create({
      data: {
        candidateId,
        testId,
        currentTheta: 0.0,
        standardError: 1.0,
        itemsAnswered: 0,
        responses: "[]",
        status: "in_progress"
      }
    });

    // 2. Obtener banco de ítems calibrados para esta prueba
    let items = await prisma.catItem.findMany({
      where: { testId, active: true },
      select: {
        id: true,
        parameterA: true,
        parameterB: true,
        parameterC: true,
        questionText: true,
        options: true
      }
    });

    if (items.length === 0) {
      const type = (test.type || '').toUpperCase();
      let fallbackQuestions = [
        {
          questionText: "¿Cómo reaccionas ante una situación de alta presión laboral?",
          options: JSON.stringify([
            { id: "a", text: "Me enfoco en el problema y busco soluciones rápidas." },
            { id: "b", text: "Organizo mis tareas y pido ayuda si es necesario." },
            { id: "c", text: "Mantengo la calma y sigo el proceso establecido." },
            { id: "d", text: "Me estreso un poco pero logro sacar el trabajo adelante." }
          ]),
          correctOptionId: "a",
          parameterA: 1.5, parameterB: 0.0, parameterC: 0.25
        }
      ];

      if (type.includes('MOSS')) {
        fallbackQuestions = [
          {
            questionText: "Un subordinado directo ha bajado su rendimiento notablemente. ¿Qué haces?",
            options: JSON.stringify([
              { id: "a", text: "Le llamas la atención de inmediato frente al equipo." },
              { id: "b", text: "Hablas con él en privado para entender la raíz del problema." },
              { id: "c", text: "Esperas a la evaluación de desempeño formal." },
              { id: "d", text: "Le asignas menos tareas para no sobrecargarlo." }
            ]),
            correctOptionId: "b",
            parameterA: 1.5, parameterB: -0.2, parameterC: 0.2
          },
          {
            questionText: "Dos miembros del equipo tienen un conflicto abierto sobre un proyecto. ¿Cómo actúas?",
            options: JSON.stringify([
              { id: "a", text: "Tomas una decisión final tú mismo sin consultarlos." },
              { id: "b", text: "Fomentas una reunión mediada para que expongan sus puntos." },
              { id: "c", text: "Ignoras el conflicto esperando que se resuelva solo." },
              { id: "d", text: "Separas a ambos miembros definitivamente del proyecto." }
            ]),
            correctOptionId: "b",
            parameterA: 1.6, parameterB: 0.1, parameterC: 0.25
          }
        ];
      } else if (type.includes('ZAVIC')) {
        fallbackQuestions = [
          {
            questionText: "Descubres que un compañero altera las métricas de venta para cobrar bono. ¿Qué haces?",
            options: JSON.stringify([
              { id: "a", text: "No dices nada para no perjudicar su empleo." },
              { id: "b", text: "Lo reportas formalmente con Recursos Humanos." },
              { id: "c", text: "Le pides un porcentaje del bono para guardar silencio." },
              { id: "d", text: "Hablas con él y le sugieres que deje de hacerlo." }
            ]),
            correctOptionId: "b",
            parameterA: 1.8, parameterB: 0.3, parameterC: 0.15
          },
          {
            questionText: "Un proveedor te ofrece un viaje pagado a cambio de renovar su contrato. ¿Tú qué decides?",
            options: JSON.stringify([
              { id: "a", text: "Aceptas el viaje, el contrato se iba a renovar igual." },
              { id: "b", text: "Rechazas la oferta e informas al comité de ética." },
              { id: "c", text: "Pides que mejor te den el equivalente en efectivo." },
              { id: "d", text: "Aceptas y pones el viaje a nombre de un familiar." }
            ]),
            correctOptionId: "b",
            parameterA: 2.0, parameterB: 0.5, parameterC: 0.1
          }
        ];
      } else if (type.includes('LÜSCHER') || type.includes('LUSCHER') || type.includes('COLORES')) {
        fallbackQuestions = [
          {
            questionText: "¿Cuál de los siguientes colores conecta mejor con tu estado de ánimo actual?",
            options: JSON.stringify([
              { id: "a", text: "Azul Profundo (Necesidad de calma y paz)." },
              { id: "b", text: "Rojo Intenso (Deseo de acción y conquista)." },
              { id: "c", text: "Verde Claro (Búsqueda de autoafirmación)." },
              { id: "d", text: "Amarillo Brillante (Optimismo y dinamismo)." }
            ]),
            correctOptionId: "a",
            parameterA: 1.3, parameterB: -0.5, parameterC: 0.2
          },
          {
            questionText: "¿Qué color rechazas o te genera mayor malestar visual hoy?",
            options: JSON.stringify([
              { id: "a", text: "Gris (Sensación de estancamiento)." },
              { id: "b", text: "Negro (Miedo al vacío o pérdida de control)." },
              { id: "c", text: "Marrón (Preocupación por la salud corporal)." },
              { id: "d", text: "Violeta (Deseo de evasión mágica)." }
            ]),
            correctOptionId: "b",
            parameterA: 1.4, parameterB: 0.0, parameterC: 0.2
          }
        ];
      } else if (type.includes('RAVEN') || type.includes('TERMAN')) {
        fallbackQuestions = [
          {
            questionText: "Encuentra la secuencia lógica: Círculo, Cuadrado, Pentágono...",
            options: JSON.stringify([
              { id: "a", text: "Hexágono (Se suma un lado)." },
              { id: "b", text: "Triángulo (Se resta un lado)." },
              { id: "c", text: "Óvalo (Figura curva)." },
              { id: "d", text: "Rombo (Figura de 4 lados)." }
            ]),
            correctOptionId: "a",
            parameterA: 1.7, parameterB: 0.4, parameterC: 0.1
          },
          {
            questionText: "Si A es más alto que B, y B es más alto que C. Entonces:",
            options: JSON.stringify([
              { id: "a", text: "C es el más bajo de todos." },
              { id: "b", text: "A es el más bajo." },
              { id: "c", text: "C es el más alto." },
              { id: "d", text: "Todos miden igual." }
            ]),
            correctOptionId: "a",
            parameterA: 1.5, parameterB: 0.2, parameterC: 0.2
          }
        ];
      } else if (type.includes('KOSTICK') || type.includes('CLEAVER')) {
        fallbackQuestions = [
          {
            questionText: "En un ambiente de trabajo, ¿qué prefieres prioritariamente?",
            options: JSON.stringify([
              { id: "a", text: "Tener autoridad y liderar las directrices." },
              { id: "b", text: "Seguir reglas claras y ser muy perfeccionista." },
              { id: "c", text: "Trabajar de forma sociable y comunicativa." },
              { id: "d", text: "Garantizar estabilidad y rutinas predecibles." }
            ]),
            correctOptionId: "a",
            parameterA: 1.3, parameterB: -0.2, parameterC: 0.2
          },
          {
            questionText: "¿Qué afirmación te describe mejor bajo presión extrema?",
            options: JSON.stringify([
              { id: "a", text: "Me vuelvo exigente y un poco impositivo." },
              { id: "b", text: "Me aíslo para analizar el problema solo." },
              { id: "c", text: "Busco apoyo emocional en mis compañeros." },
              { id: "d", text: "Me resisto fuertemente a los cambios bruscos." }
            ]),
            correctOptionId: "a",
            parameterA: 1.4, parameterB: 0.1, parameterC: 0.25
          }
        ];
      }

      for (const q of fallbackQuestions) {
        await prisma.catItem.create({
          data: {
            testId,
            questionText: q.questionText,
            options: q.options,
            correctOptionId: q.correctOptionId,
            parameterA: q.parameterA,
            parameterB: q.parameterB,
            parameterC: q.parameterC,
            active: true
          }
        });
      }

      items = await prisma.catItem.findMany({
        where: { testId, active: true },
        select: {
          id: true,
          parameterA: true,
          parameterB: true,
          parameterC: true,
          questionText: true,
          options: true
        }
      });
    }

    // Mapear al formato que espera Python
    const availableItems = items.map(item => ({
      id: item.id,
      parameterA: item.parameterA,
      parameterB: item.parameterB,
      parameterC: item.parameterC,
      questionText: item.questionText,
      options: item.options
    }));

    let nextItem = null;

    try {
      const pythonApiUrl = process.env.AI_ENGINE_URL || 'http://localhost:8000';
      const pyResponse = await fetch(`${pythonApiUrl}/api/cat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          available_items: availableItems,
          current_theta: 0.0
        })
      });

      if (pyResponse.ok) {
        const pyData = await pyResponse.json();
        nextItem = pyData.next_item;
      }
    } catch (e) {
      console.warn('[CAT Start] Fallback to direct selection (Python API unavailable)');
    }

    if (!nextItem) {
      nextItem = availableItems[0];
    }

    return NextResponse.json({
      sessionId: session.id,
      nextItem,
      isPremium: test.isPremium,
      price: test.price
    });

  } catch (error) {
    console.error('[CAT Start Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
