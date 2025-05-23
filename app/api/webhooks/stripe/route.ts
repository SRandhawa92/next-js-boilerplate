import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceRoleClient } from '@/utils/supabase/service-role';
import type { Stripe } from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function updateSubscriptionInDatabase(
  userId: string,
  priceId: string,
  status: 'active' | 'canceled' | 'incomplete'
) {
  try {
    // Create a Supabase client with the service role key
    const supabase = createServiceRoleClient();
    const subscriptionStatus = status === 'active' ? 'pro' : 'free';
    
    console.log('Updating subscription:', { userId, priceId, status: subscriptionStatus });
    
    // First, check if a subscription exists
    const { data: existingSub, error: selectError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw selectError;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        id: existingSub?.id, // Will create new if null, update if exists
        user_id: userId,
        price_id: priceId,
        status: subscriptionStatus,
        created_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    console.log('Successfully updated subscription for user:', userId);

  } catch (error) {
    console.error('Error updating subscription in database:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    }

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    console.log('Received webhook');

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.Event;

    console.log('Webhook event type:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        if (session?.metadata?.userId) {
          if (session.subscription) {
            // For subscriptions, get the subscription details
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );
            await updateSubscriptionInDatabase(
              session.metadata.userId,
              subscription.items.data[0].price.id,
              subscription.status as 'active' | 'canceled' | 'incomplete'
            );
          } else if (session.mode === 'payment') {
            // For one-time payments
            await updateSubscriptionInDatabase(
              session.metadata.userId,
              session.line_items?.data[0]?.price?.id || 'one-time',
              'active'
            );
          }
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        
        if (subscription.metadata?.userId) {
          await updateSubscriptionInDatabase(
            subscription.metadata.userId,
            subscription.items.data[0].price.id,
            subscription.status as 'active' | 'canceled' | 'incomplete'
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 