import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

function stripeId(value: string | { id: string } | null | undefined) {
  return typeof value === 'string' ? value : value?.id
}

function billingReference(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      if (session.mode !== 'subscription') return
      return { customer: stripeId(session.customer), subscription: stripeId(session.subscription),
        workspace: session.metadata?.workspaceId }
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      return { customer: stripeId(sub.customer), subscription: sub.id, workspace: sub.metadata.workspaceId }
    }
    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed': {
      const invoice = event.data.object
      // Older Stripe endpoints put the subscription directly on the invoice.
      const legacy = invoice as Stripe.Invoice & { subscription?: string }
      return { customer: stripeId(invoice.customer),
        subscription: stripeId(invoice.parent?.subscription_details?.subscription ?? legacy.subscription) }
    }
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const received = () => NextResponse.json({ received: true })
  const reference = billingReference(event)
  if (!reference?.customer || !reference.subscription) return received()
  try {
    const supabase = getSupabaseAdmin()
    const { data: before, error: readError } = await supabase.from('subscriptions')
      .select('workspace_id, stripe_subscription_id, plan').eq('stripe_customer_id', reference.customer).maybeSingle()
    if (readError) throw readError
    if (!before) return received()
    // Resolve ownership at Stripe, including for subscriptions created before
    // subscription metadata was added. A local customer ID alone is insufficient.
    const [customer, subscription] = await Promise.all([
      stripe.customers.retrieve(reference.customer),
      stripe.subscriptions.retrieve(reference.subscription),
    ])
    const workspaceId = customer.deleted ? subscription.metadata.workspaceId : customer.metadata.workspaceId
    if (!workspaceId || before.workspace_id !== workspaceId || stripeId(subscription.customer) !== reference.customer ||
        (reference.workspace && reference.workspace !== workspaceId) ||
        (subscription.metadata.workspaceId && subscription.metadata.workspaceId !== workspaceId)) {
      console.warn('[stripe-webhook] Unverified workspace binding', event.id)
      return received()
    }

    const item = subscription.items.data.find(i => i.price.id === process.env.STRIPE_PRO_PRICE_ID)
    if (!item) return received()
    const status = subscription.status
    // Read current provider state so a delayed invoice cannot reactivate a canceled subscription.
    const plan = status === 'active' || status === 'trialing' ? 'pro'
      : status === 'canceled' || status === 'incomplete_expired' ? 'free' : 'payment_failed'
    const previousId = before.stripe_subscription_id
    if (plan === 'free' && previousId !== subscription.id) return received()
    if (before.plan !== 'free' && previousId && previousId !== subscription.id) return received()
    // Retain the terminal ID. A stale delivery must not reopen that subscription.
    if (before.plan === 'free' && previousId === subscription.id && plan !== 'free') return received()
    const update = supabase.from('subscriptions').update({
      plan, stripe_subscription_id: subscription.id,
      current_period_end: plan === 'free' ? null : new Date(item.current_period_end * 1000).toISOString(),
    }).eq('workspace_id', workspaceId).eq('stripe_customer_id', reference.customer).eq('plan', before.plan)
    const guarded = previousId ? update.eq('stripe_subscription_id', previousId) : update.is('stripe_subscription_id', null)
    const { data: written, error } = await guarded.select('id').maybeSingle()
    if (error || !written) throw new Error('Concurrent billing update')
    return received()
  } catch {
    console.error('[stripe-webhook] Billing sync failed', event.id)
    return NextResponse.json({ error: 'Billing sync failed' }, { status: 500 })
  }
}
