import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Aquí conectaríamos con la BD para verificar los créditos del tenant
    // const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    // const hasCredits = tenant.credits > 0;
    
    // Mock validación
    const hasCredits = tenantId !== "demo_no_credits";

    return NextResponse.json({ 
      tenantId, 
      hasCredits,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("[Antigravity Gatekeeper Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
