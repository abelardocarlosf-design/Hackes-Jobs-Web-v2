import { NextResponse } from 'next/server';
import { getAllPosts, savePost } from '@/lib/blog';
import { verifyAuth } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function checkAdminAuth() {
  const token = cookies().get('hj_admin_token')?.value;
  if (!token) return false;
  try {
    const decoded = await verifyAuth(token);
    return decoded && decoded.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const post = await request.json();
    
    // Basic validation
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await savePost(post);
    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

