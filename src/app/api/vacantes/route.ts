import { NextResponse } from 'next/server';

// TODO: Preparar integración con MongoDB aquí
// import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  // await connectToDatabase();
  
  // Dummy data por ahora
  const vacantes = [
    { id: 1, title: 'Senior Frontend Developer', location: 'Remoto' },
    { id: 2, title: 'Product Manager', location: 'Híbrido' },
  ];

  return NextResponse.json({ success: true, data: vacantes });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // await connectToDatabase();
    // await VacanteModel.create(body);
    
    return NextResponse.json({ success: true, message: 'Vacante creada exitosamente' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error al crear la vacante' }, { status: 500 });
  }
}
