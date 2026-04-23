import { NextResponse } from 'next/server';
import { getPostBySlug, savePost, deletePost } from '@/lib/blog';

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
  try {
    const post = await request.json();
    await savePost(post);
    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await deletePost(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
