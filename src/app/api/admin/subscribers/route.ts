import { NextResponse } from 'next/server';
import { getAllSubscribers } from '@/lib/newsletter';

export async function GET() {
  try {
    const subscribers = await getAllSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener suscriptores' }, { status: 500 });
  }
}
