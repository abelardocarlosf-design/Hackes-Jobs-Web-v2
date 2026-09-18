import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllPosts, savePost } from '@/lib/blog';
import { requireAuth } from '@/lib/api-helpers';

// GET es público: lo consume el blog del sitio. Escribir exige rol admin.
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    const post = await request.json();
    
    // Basic validation
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await savePost(post);
    // Sin esto el artículo queda guardado pero el sitio sigue sirviendo la
    // versión cacheada, y desde fuera parece que no se guardó nada.
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

