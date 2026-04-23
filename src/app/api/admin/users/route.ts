import { NextResponse } from 'next/server';
import { getUsers, addUser, deleteUser } from '@/lib/auth';

export async function GET() {
  try {
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
