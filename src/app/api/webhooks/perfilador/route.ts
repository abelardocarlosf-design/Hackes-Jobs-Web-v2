import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch('https://api.hackesjobs.com.mx/webhook/perfilador', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Error del servidor destino: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error proxying perfilador webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del proxy al conectar con webhook' },
      { status: 500 }
    );
  }
}
