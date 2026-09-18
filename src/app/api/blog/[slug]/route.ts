import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostBySlug, savePost, deletePost } from '@/lib/blog';
import { requireAuth } from '@/lib/api-helpers';

// Refresca el listado, el artículo y el sitemap tras escribir. Sin esto la
// edición queda en la base pero el sitio sigue mostrando la versión cacheada.
function revalidarBlog(slug: string) {
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/sitemap.xml');
}

// GET es público: lo consume el detalle del blog. Editar y borrar exigen admin.
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    const post = await request.json();
    await savePost(post);
    revalidarBlog(post.slug ?? params.slug);
    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    await deletePost(params.slug);
    revalidarBlog(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

