import { NextResponse } from 'next/server';
import { getAllSubscribers } from '@/lib/newsletter';
import { requireAuth, errorResponse, successResponse } from '@/lib/api-helpers';

// Recibe `request` porque requireAuth necesita leer la cookie hj_token de él.
// Antes la firma era GET() sin argumentos y la sesión salía de next/headers.
export async function GET(request: Request) {
  const auth = await requireAuth(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    return successResponse(await getAllSubscribers());
  } catch (error) {
    console.error('[admin/subscribers GET]:', error);
    return errorResponse('Error al obtener suscriptores', 500);
  }
}
