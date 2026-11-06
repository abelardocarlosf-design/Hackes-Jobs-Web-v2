import { MetadataRoute } from 'next';
import { vacantesActivas } from '@/data/vacantes';
import { getAllPosts } from '@/lib/blog';
import { testsConfig } from '@/lib/psicometriasConfig';
import { SITE_URL as BASE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes — sin lastModified: un "ahora" en cada request le enseña a
  // Google a ignorar el campo. /login, /register y /exito no se indexan.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/empresas`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/empresas/requisicion`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/candidatos`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/psicometrias`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/vacantes`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/precios`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terminos`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const testRoutes: MetadataRoute.Sitemap = Object.values(testsConfig)
    .filter((t) => !t.comingSoon)
    .map((t) => ({ url: `${BASE_URL}/psicometrias/${t.slug}`, changeFrequency: 'monthly', priority: 0.7 }));

  // Dynamic Vacantes Routes
  const vacantes = vacantesActivas();
  const vacantesRoutes: MetadataRoute.Sitemap = vacantes.map((v) => ({
    url: `${BASE_URL}/vacantes/${v.id}`,
    ...(v.fechaPublicacion ? { lastModified: new Date(v.fechaPublicacion) } : {}),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Blog Posts Routes
  const posts = await getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter(p => p.published)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...testRoutes, ...vacantesRoutes, ...blogRoutes];
}
