import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tests = [
  // --- Nivel Básico ---
  {
    name: 'Test de Colores de Lüscher',
    type: 'proyectivo',
    level: 'basico',
    price: 0.0,
    isPremium: false,
    duration: 5,
    structure: JSON.stringify({ description: 'Test de colores no verbal para estado emocional.' })
  },
  {
    name: 'Test de Cleaver / Perfil DISC',
    type: 'DISC',
    level: 'basico',
    price: 0.0,
    isPremium: false,
    duration: 15,
    structure: JSON.stringify({ description: 'Estilo de trabajo y comportamiento organizacional.' })
  },
  {
    name: 'Test de Valores de Allport',
    type: 'axiológico',
    level: 'basico',
    price: 0.0,
    isPremium: false,
    duration: 20,
    structure: JSON.stringify({ description: 'Motivadores y alineación cultural.' })
  },

  // --- Nivel Intermedio ---
  {
    name: 'Test de Moss',
    type: 'habilidades_sociales',
    level: 'intermedio',
    price: 19.99,
    isPremium: true,
    duration: 30,
    structure: JSON.stringify({ description: 'Adaptabilidad y habilidades de supervisión.' })
  },
  {
    name: 'Test de Zavic',
    type: 'valores',
    level: 'intermedio',
    price: 19.99,
    isPremium: true,
    duration: 20,
    structure: JSON.stringify({ description: 'Valores e intereses. Orientado a Integridad.' })
  },
  {
    name: 'Test de Kostick',
    type: 'inventario',
    level: 'intermedio',
    price: 19.99,
    isPremium: true,
    duration: 30,
    structure: JSON.stringify({ description: 'Inventario de percepción y preferencias laborales.' })
  },

  // --- Nivel Avanzado ---
  {
    name: 'Test de Raven - Matrices Progresivas',
    type: 'inteligencia',
    level: 'avanzado',
    price: 29.99,
    isPremium: true,
    duration: 45,
    structure: JSON.stringify({ description: 'Inteligencia no verbal.' })
  },
  {
    name: 'Test de Terman-Merrill',
    type: 'inteligencia',
    level: 'avanzado',
    price: 29.99,
    isPremium: true,
    duration: 50,
    structure: JSON.stringify({ description: 'Coeficiente Intelectual (CI).' })
  },

  // --- Nivel Clínico/Premium ---
  {
    name: 'Test 16 PF de Cattell',
    type: 'personalidad',
    level: 'premium',
    price: 49.99,
    isPremium: true,
    duration: 60,
    structure: JSON.stringify({ description: '16 Factores de la Personalidad.' })
  },
  {
    name: 'MMPI-2',
    type: 'personalidad_clinico',
    level: 'premium',
    price: 49.99,
    isPremium: true,
    duration: 120,
    structure: JSON.stringify({ description: 'Inventario Multifásico de Personalidad de Minnesota.' })
  }
];

async function main() {
  console.log('🌱 Seeding Psychometric Tests...');

  for (const test of tests) {
    const created = await prisma.psychometricTest.create({
      data: test
    });
    console.log(`Created test: ${created.name} (${created.level}) - $${created.price}`);
  }

  console.log('✅ Psychometric Tests Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
