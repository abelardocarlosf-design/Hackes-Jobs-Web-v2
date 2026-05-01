import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const blogEntries = posts.map((post) => ({
    url: `https://hackesjobs.com.mx/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    {
      url: 'https://hackesjobs.com.mx/',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://hackesjobs.com.mx/empresas',
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: 'https://hackesjobs.com.mx/candidatos',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://hackesjobs.com.mx/psicometrias',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://hackesjobs.com.mx/blog',
      lastModified: new Date(),
      priority: 0.7,
    },
    ...blogEntries,
  ];
}
