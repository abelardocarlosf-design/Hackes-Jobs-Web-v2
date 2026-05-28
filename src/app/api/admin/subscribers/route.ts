import { NextResponse } from 'next/server';
import { getAllSubscribers } from '@/lib/newsletter';
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

    const subscribers = await getAllSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener suscriptores' }, { status: 500 });
  }
}

