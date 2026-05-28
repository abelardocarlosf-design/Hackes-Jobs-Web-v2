import { NextResponse } from 'next/server';
import { getUsers, addUser } from '@/lib/auth';
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
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = await getUsers();
    // Don't send passwords to frontend
    const safeUsers = users.map(({ passwordHash, ...u }) => u);
    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userData = await request.json();
    
    if (!userData.username || !userData.passwordHash || !userData.name) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const newUser = await addUser(userData);
    const { passwordHash, ...safeUser } = newUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}

