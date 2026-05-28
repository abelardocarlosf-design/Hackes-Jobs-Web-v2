import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/auth';
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await deleteUser(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}

