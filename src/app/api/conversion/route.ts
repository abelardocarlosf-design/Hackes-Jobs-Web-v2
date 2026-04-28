import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[CONVERSION TRACKED]', body);
    
    // Aquí se podría integrar en el futuro con la base de datos o un CRM
    // await prisma.conversion.create({ data: { type: body.type, source: body.source } })

    return NextResponse.json({ success: true, message: 'Conversión registrada' });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
