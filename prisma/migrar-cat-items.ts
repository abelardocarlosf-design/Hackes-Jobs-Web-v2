/**
 * Traslada el banco de ítems CAT de la base SQLite antigua (`prisma/dev.db`) a
 * la base Postgres actual.
 *
 * Por qué hace falta: `seed_cat.ts` solo crea la prueba de demostración, pero
 * la base antigua tenía ítems repartidos entre las 8 psicometrías reales, con
 * 46 sesiones CAT abiertas contra ellas. Al sembrar Neon desde cero, esas 8
 * pruebas quedaban con banco vacío y el motor adaptativo sin nada que elegir.
 *
 * Qué se traslada, sin hacerse ilusiones: las 43 filas antiguas son en realidad
 * 23, porque cada una está duplicada exacta —misma huella de parámetros TRI— por
 * una ejecución doble del seed que las creó. Y esas 23 se reducen a 6 textos de
 * pregunta distintos, tres de ellos genéricos y repetidos tal cual en las 8
 * pruebas. No es un banco calibrado: es relleno. Se traslada para conservar la
 * paridad con lo que había en producción, no porque tenga valor psicométrico.
 *
 * Empareja por NOMBRE de prueba, no por id: los seeds generan cuids nuevos en
 * cada base, así que los identificadores antiguos no existen aquí.
 *
 * Es idempotente: un ítem ya presente (mismo texto de pregunta en la misma
 * prueba) se salta en vez de duplicarse.
 *
 *   npx tsx prisma/migrar-cat-items.ts            → simulacro, no escribe
 *   npx tsx prisma/migrar-cat-items.ts --aplicar  → escribe
 */

import { DatabaseSync } from 'node:sqlite';
import { prisma } from '../src/lib/prisma';

const RUTA_SQLITE = 'prisma/dev.db';
const aplicar = process.argv.includes('--aplicar');

type ItemAntiguo = {
  id: string;
  testId: string;
  questionText: string;
  options: string;
  correctOptionId: string;
  parameterA: number;
  parameterB: number;
  parameterC: number;
  active: number;
};

async function main() {
  const sqlite = new DatabaseSync(RUTA_SQLITE, { readOnly: true });

  // Nombre de cada prueba antigua, para poder emparejar por nombre.
  const nombrePorIdAntiguo = new Map<string, string>();
  for (const t of sqlite.prepare('SELECT id, name FROM psychometric_tests').all() as Array<{
    id: string;
    name: string;
  }>) {
    nombrePorIdAntiguo.set(t.id, t.name);
  }

  const items = sqlite.prepare('SELECT * FROM cat_items').all() as unknown as ItemAntiguo[];
  sqlite.close();

  // Pruebas actuales, indexadas por nombre.
  const idPorNombreActual = new Map<string, string>();
  for (const t of await prisma.psychometricTest.findMany({ select: { id: true, name: true } })) {
    idPorNombreActual.set(t.name, t.id);
  }

  let insertados = 0;
  let yaEstaban = 0;
  let duplicadosEnOrigen = 0;
  const sinPrueba: string[] = [];

  // La base antigua trae cada ítem por duplicado exacto (una ejecución doble de
  // su seed: 43 filas para 23 combinaciones reales). Sin llevar la cuenta de lo
  // ya tratado en esta misma pasada, el simulacro prometía insertar los 40 y
  // luego solo entraban 20, porque el gemelo recién insertado hacía de tope.
  const vistosEnEstaPasada = new Set<string>();

  for (const item of items) {
    const nombre = nombrePorIdAntiguo.get(item.testId);
    const testIdActual = nombre ? idPorNombreActual.get(nombre) : undefined;

    if (!testIdActual) {
      sinPrueba.push(nombre ?? item.testId);
      continue;
    }

    const clave = `${testIdActual} ${item.questionText}`;
    if (vistosEnEstaPasada.has(clave)) {
      duplicadosEnOrigen++;
      continue;
    }
    vistosEnEstaPasada.add(clave);

    const existe = await prisma.catItem.findFirst({
      where: { testId: testIdActual, questionText: item.questionText },
      select: { id: true },
    });

    if (existe) {
      yaEstaban++;
      continue;
    }

    if (aplicar) {
      await prisma.catItem.create({
        data: {
          testId: testIdActual,
          questionText: item.questionText,
          options: item.options,
          correctOptionId: item.correctOptionId,
          parameterA: item.parameterA,
          parameterB: item.parameterB,
          parameterC: item.parameterC,
          active: item.active === 1,
        },
      });
    }

    insertados++;
  }

  console.log(`\n${aplicar ? 'APLICADO' : 'SIMULACRO (no se escribió nada)'}`);
  console.log(`  ítems en la base antigua  : ${items.length}`);
  console.log(`  duplicados exactos, omitidos: ${duplicadosEnOrigen}`);
  console.log(`  ${(aplicar ? 'insertados' : 'a insertar').padEnd(26)}: ${insertados}`);
  console.log(`  ya estaban en destino     : ${yaEstaban}`);

  if (sinPrueba.length) {
    const cuenta = new Map<string, number>();
    for (const n of sinPrueba) cuenta.set(n, (cuenta.get(n) ?? 0) + 1);
    console.log('\n  Sin prueba equivalente en la base actual (se omiten):');
    // forEach y no for...of: el target de TypeScript del proyecto no itera Maps.
    cuenta.forEach((n, nombre) => console.log(`    ${nombre} → ${n} ítem(s)`));
  }

  if (!aplicar) console.log('\n  Vuelve a correrlo con --aplicar para escribir.');
}

main()
  .catch((error) => {
    console.error('\n❌ La migración falló:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
