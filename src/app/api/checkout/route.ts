import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const token = cookies().get('hj_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });

    const decoded = await verifyAuth(token);
    if (!decoded || decoded.role !== 'candidate') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { testId } = body;

    if (!testId) {
      return NextResponse.json({ success: false, message: 'Test ID es requerido' }, { status: 400 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { userId: decoded.userId as string },
    });

    if (!candidate) {
      return NextResponse.json({ success: false, message: 'Candidato no encontrado' }, { status: 404 });
    }

    const test = await prisma.psychometricTest.findUnique({
      where: { id: testId },
    });

    if (!test || !test.isPremium) {
      return NextResponse.json({ success: false, message: 'Test inválido o no es premium' }, { status: 400 });
    }

    // Verificar si ya lo compró
    const existingPurchase = await prisma.testPurchase.findUnique({
      where: {
        candidateId_testId: {
          candidateId: candidate.id,
          testId: test.id,
        },
      },
    });

    if (existingPurchase && existingPurchase.status === 'completed') {
      return NextResponse.json({ success: false, message: 'Ya has comprado este test' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: test.name,
              description: `Acceso al test psicométrico: ${test.name}`,
            },
            unit_amount: Math.round(test.price * 100), // En centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/psicometrias/success?session_id={CHECKOUT_SESSION_ID}&testId=${test.id}`,
      cancel_url: `${baseUrl}/psicometrias?payment=cancelled`,
      metadata: {
        candidateId: candidate.id,
        testId: test.id,
      },
      customer_email: decoded.email as string,
    });

    // Guardar el registro de compra pendiente o actualizar el existente
    if (existingPurchase) {
       await prisma.testPurchase.update({
         where: { id: existingPurchase.id },
         data: { stripeSessionId: session.id },
       });
    } else {
       await prisma.testPurchase.create({
         data: {
           candidateId: candidate.id,
           testId: test.id,
           stripeSessionId: session.id,
           amount: test.price,
           status: 'pending',
         },
       });
    }

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno al crear sesión de pago' },
      { status: 500 }
    );
  }
}
