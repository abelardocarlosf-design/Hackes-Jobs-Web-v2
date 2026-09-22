import { prisma } from './prisma';
import { BlogPost } from './blog.types';

export * from './blog.types';

// Los artículos vivían como un archivo JSON por slug en `data/blog/`. En Vercel
// el disco es de solo lectura, así que el CMS no guardaba nada en producción:
// la petición devolvía 200 y el artículo desaparecía. Ahora van a Postgres.
//
// La firma de las cuatro funciones no cambió a propósito, para que las páginas
// y las rutas de API que ya las consumen sigan igual. `date` sale como string
// ISO porque así lo declara `BlogPost` y así lo usan el formulario del admin
// (`post.date.split('T')[0]`) y los metadatos de OpenGraph.

type FilaBlogPost = {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: Date;
  tags: string[];
  published: boolean;
};

function aBlogPost(fila: FilaBlogPost): BlogPost {
  return {
    slug: fila.slug,
    title: fila.title,
    content: fila.content,
    excerpt: fila.excerpt,
    coverImage: fila.coverImage,
    author: fila.author,
    date: fila.date.toISOString(),
    tags: fila.tags,
    published: fila.published,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const filas = await prisma.blogPost.findMany({ orderBy: { date: 'desc' } });
  return filas.map(aBlogPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fila = await prisma.blogPost.findUnique({ where: { slug } });
  return fila ? aBlogPost(fila) : null;
}

export async function savePost(post: BlogPost): Promise<void> {
  // Se copian los campos uno a uno: el cuerpo llega de `request.json()` y
  // pasárselo entero a Prisma haría fallar la escritura con cualquier clave
  // de más que mande el formulario.
  const datos = {
    title: post.title,
    content: post.content ?? '',
    excerpt: post.excerpt ?? '',
    coverImage: post.coverImage ?? '',
    author: post.author ?? '',
    date: post.date ? new Date(post.date) : new Date(),
    tags: post.tags ?? [],
    published: post.published ?? false,
  };

  await prisma.blogPost.upsert({
    where: { slug: post.slug },
    create: { slug: post.slug, ...datos },
    update: datos,
  });
}

export async function deletePost(slug: string): Promise<void> {
  // `deleteMany` y no `delete`: borrar un slug inexistente era un no-op con
  // archivos, y con `delete` sería una excepción P2025.
  await prisma.blogPost.deleteMany({ where: { slug } });
}
