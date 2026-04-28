import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { triggerWebhookAsync } from '@/lib/webhook';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !endpointSecret) {
    console.error('Missing Stripe webhook signature or secret');
    return NextResponse.json({ error: 'Missing webhook configuration' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    if (session.metadata?.candidateId && session.metadata?.testId) {
      try {
        await prisma.testPurchase.update({
          where: {
            candidateId_testId: {
              candidateId: session.metadata.candidateId,
              testId: session.metadata.testId,
            },
          },
          data: { status: 'completed' },
        });
        console.log(`Purchase completed for Candidate ${session.metadata.candidateId} Test ${session.metadata.testId}`);
        
        triggerWebhookAsync('payment-completed', {
          candidateId: session.metadata.candidateId,
          testId: session.metadata.testId,
          customerEmail: session.customer_details?.email || session.customer_email,
          amountTotal: session.amount_total,
          currency: session.currency,
        });

      } catch (error) {
        console.error('Error updating purchase status:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
