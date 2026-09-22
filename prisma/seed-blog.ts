import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';
import type { BlogPost } from '../src/lib/blog.types';
import type { Subscriber } from '../src/lib/newsletter.types';

// Importa a Postgres el contenido que vivía en archivos: los 13 artículos de
// `data/blog/*.json` y los suscriptores de `data/subscribers.json`. Los dos
// archivos siguen en git, así que esto funciona también desde un clon limpio.
//
// Salta lo que ya existe en lugar de sobrescribirlo: si mañana editas o borras
// un artículo desde /admin/blog y alguien vuelve a correr el seed, no queremos
// resucitar el borrado ni pisar la edición con la versión del archivo.

const RUTA_BLOG = path.join(process.cwd(), 'data/blog');
const RUTA_SUSCRIPTORES = path.join(process.cwd(), 'data/subscribers.json');

async function importarArticulos() {
  if (!fs.existsSync(RUTA_BLOG)) {
    console.log('⏭️  No hay data/blog/, no hay artículos que importar.');
    return;
  }

  const archivos = fs.readdirSync(RUTA_BLOG).filter((f) => f.endsWith('.json'));
  let creados = 0;
  let existentes = 0;

  for (const archivo of archivos) {
    const post = JSON.parse(
      fs.readFileSync(path.join(RUTA_BLOG, archivo), 'utf8')
    ) as BlogPost;

    const yaEsta = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
      select: { slug: true },
    });
    if (yaEsta) {
      existentes++;
      continue;
    }

    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt ?? '',
        coverImage: post.coverImage ?? '',
        author: post.author ?? '',
        date: new Date(post.date),
        tags: post.tags ?? [],
        published: post.published ?? false,
      },
    });
    creados++;
  }

  console.log(`✅ Artículos: ${creados} importados, ${existentes} ya estaban.`);
}

async function importarSuscriptores() {
  if (!fs.existsSync(RUTA_SUSCRIPTORES)) {
    console.log('⏭️  No hay data/subscribers.json, no hay suscriptores que importar.');
    return;
  }

  let suscriptores: Subscriber[];
  try {
    suscriptores = JSON.parse(fs.readFileSync(RUTA_SUSCRIPTORES, 'utf8'));
  } catch {
    console.log('⚠️  data/subscribers.json no es JSON válido; se omite.');
    return;
  }

  let creados = 0;
  for (const s of suscriptores) {
    const email = s.email.trim().toLowerCase();
    // createMany + skipDuplicates haría lo mismo en una sola sentencia, pero
    // así se puede informar cuántos entraron de verdad.
    const yaEsta = await prisma.subscriber.findUnique({
      where: { email },
      select: { email: true },
    });
    if (yaEsta) continue;

    await prisma.subscriber.create({
      data: { email, date: s.date ? new Date(s.date) : new Date() },
    });
    creados++;
  }

  console.log(`✅ Suscriptores: ${creados} importados de ${suscriptores.length}.`);
}

async function main() {
  console.log('🌱 Importando blog y newsletter desde data/…');
  await importarArticulos();
  await importarSuscriptores();
  console.log('🎉 Listo.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
