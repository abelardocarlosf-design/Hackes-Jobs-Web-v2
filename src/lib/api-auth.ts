import { NextResponse } from 'next/server';

/**
 * Auth de máquina para n8n (endpoints /api/n8n/*).
 * Independiente del JWT humano (getAuthUser/requireAuth en api-helpers.ts).
 */
export function requireApiKey(request: Request): NextResponse | null {
  const apiKey = request.headers.get('x-api-key');
  const expected = process.env.N8N_API_KEY;

  if (!expected) {
    return NextResponse.json(
      { success: false, message: 'N8N_API_KEY no está configurada en el servidor.' },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== expected) {
    return NextResponse.json(
      { success: false, message: 'x-api-key inválida o ausente.' },
      { status: 401 }
    );
  }

  return null;
}
