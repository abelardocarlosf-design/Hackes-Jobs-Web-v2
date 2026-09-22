import { MetadataRoute } from 'next';
import { vacantesActivas } from '@/data/vacantes';
import { getAllPosts } from '@/lib/blog';

const BASE_URL = 'https://hackesjobs.com.mx';

// Los artículos salen de la base desde que el blog dejó de ser archivos JSON,
// así que el sitemap se regenera cada hora en vez de quedarse fijo en el build.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/empresas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/empresas/requisicion`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/candidatos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/psicometrias`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/vacantes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/precios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terminos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic Vacantes Routes
  const vacantes = vacantesActivas();
  const vacantesRoutes: MetadataRoute.Sitemap = vacantes.map((v) => ({
    url: `${BASE_URL}/vacantes/${v.id}`,
    lastModified: v.fechaPublicacion ? new Date(v.fechaPublicacion) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Blog Posts Routes
  // Si la base no responde durante el build, el sitemap sale sin artículos en
  // lugar de tumbar el despliegue; se completa en la siguiente revalidación.
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error('[sitemap] no se pudieron leer los artículos:', error);
  }
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter(p => p.published)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...vacantesRoutes, ...blogRoutes];
}
