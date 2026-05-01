import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { tenantId, candidateId, status, payload } = data;

    if (!tenantId || !candidateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`[Webhook IA] Recibida actualización para candidato ${candidateId} del tenant ${tenantId}. Status: ${status}`);
    
    // Aquí se actualizaría la base de datos (Prisma) con los resultados de la IA (CV Parseado o Vectorización completada)
    // await prisma.candidate.update(...)

    return NextResponse.json({ success: true, message: "Webhook procesado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook IA Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
