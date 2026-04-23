import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const users = await getUsers();

    const user = users.find(u => u.username === username && u.passwordHash === password);

    if (user) {
      // In a real app, generate a secure JWT and set a cookie
      return NextResponse.json({ 
        success: true, 
        user: { name: user.name, role: user.role, username: user.username } 
      });
    }

    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
