import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.BLOG_ADMIN_USER || 'admin';
    const adminPass = process.env.BLOG_ADMIN_PASS || 'hackesjobs2025';

    if (username === adminUser && password === adminPass) {
      // In a real app, use a proper session/cookie
      return NextResponse.json({ success: true, token: 'fake-admin-token' });
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
