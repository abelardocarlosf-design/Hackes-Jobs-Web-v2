import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-04-10' as any,
});

export async function POST(req: Request) {
  try {
    const { planId, tenantId, isCredits } = await req.json();

    // La URL de retorno no puede caer a localhost: Stripe redirige ahí al
    // cliente después de pagar y el cobro termina en una página inalcanzable.
    // Si falta la variable se usa el origen de la propia petición, que en
    // Vercel es el dominio real del despliegue.
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get('origin') ||
      new URL(req.url).origin;

    // Mock IDs. En prod: reemplazar con tus process.env.STRIPE_PRICE_ID
    let priceId = '';
    
    if (isCredits) {
      priceId = process.env.STRIPE_PRICE_CREDITS || 'price_mock_credits';
    } else {
      switch (planId) {
        case 'pro': priceId = process.env.STRIPE_PRICE_PRO || 'price_mock_pro'; break;
        case 'enterprise': priceId = process.env.STRIPE_PRICE_ENTERPRISE || 'price_mock_ent'; break;
        default: priceId = process.env.STRIPE_PRICE_BASIC || 'price_mock_basic';
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: isCredits ? 'payment' : 'subscription',
      // Antes apuntaban a /dashboard/billing/success y /dashboard/billing, dos
      // rutas que nunca existieron: todo checkout terminaba en un 404.
      success_url: `${baseUrl}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/precios`,
      client_reference_id: tenantId || 'guest',
      metadata: {
        tenantId: tenantId || 'guest',
        type: isCredits ? 'credits_refill' : 'subscription_upgrade',
        planId: planId || 'none'
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Error al crear Stripe Checkout Session:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago', details: error.message },
      { status: 500 }
    );
  }
}
