import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catItems = [
  {
    questionText: "Si la probabilidad de que un evento ocurra es de 0.2, ¿cuál es la probabilidad de que no ocurra en 3 intentos independientes?",
    options: JSON.stringify([
      { id: "a", text: "0.512" },
      { id: "b", text: "0.008" },
      { id: "c", text: "0.800" },
      { id: "d", text: "0.488" }
    ]),
    correctOptionId: "a",
    parameterA: 1.5,
    parameterB: 1.2,
    parameterC: 0.25
  },
  {
    questionText: "¿Cuál de las siguientes estructuras de datos ofrece una complejidad temporal O(1) promedio para búsqueda, inserción y eliminación?",
    options: JSON.stringify([
      { id: "a", text: "Árbol Binario de Búsqueda" },
      { id: "b", text: "Lista Enlazada" },
      { id: "c", text: "Tabla Hash (Hash Map)" },
      { id: "d", text: "Cola de Prioridad (Min-Heap)" }
    ]),
    correctOptionId: "c",
    parameterA: 1.8,
    parameterB: -0.5,
    parameterC: 0.25
  },
  {
    questionText: "En el contexto de microservicios, ¿cuál es el propósito principal del patrón 'Circuit Breaker'?",
    options: JSON.stringify([
      { id: "a", text: "Balancear la carga entre múltiples instancias" },
      { id: "b", text: "Prevenir fallas en cascada y permitir la recuperación del sistema" },
      { id: "c", text: "Cifrar la comunicación entre servicios" },
      { id: "d", text: "Descubrir nuevos servicios dinámicamente" }
    ]),
    correctOptionId: "b",
    parameterA: 1.3,
    parameterB: 0.8,
    parameterC: 0.25
  }
];

async function main() {
  console.log('Iniciando el seeding de la prueba CAT...');

  // Asegurarse de que exista una prueba general para los items CAT
  const test = await prisma.psychometricTest.upsert({
    where: { id: 'test-cat-demo-01' },
    update: {},
    create: {
      id: 'test-cat-demo-01',
      name: 'Evaluación Técnica Adaptativa (Ingeniería)',
      type: 'custom',
      level: 'premium',
      price: 25.0,
      isPremium: true,
      structure: JSON.stringify({ type: 'cat', threshold: 0.3, maxItems: 10 }),
      duration: 30,
      active: true,
    }
  });

  console.log(`Prueba CAT creada/encontrada: ${test.name}`);

  for (const item of catItems) {
    await prisma.catItem.create({
      data: {
        testId: test.id,
        questionText: item.questionText,
        options: item.options,
        correctOptionId: item.correctOptionId,
        parameterA: item.parameterA,
        parameterB: item.parameterB,
        parameterC: item.parameterC,
        active: true
      }
    });
  }

  console.log(`¡Seeding completado! Se han insertado ${catItems.length} ítems calibrados TRI.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
