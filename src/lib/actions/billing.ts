'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { getActiveWorkspace } from '@/lib/workspace'

// ─── Criar Checkout Session (redireciona pro Stripe) ─────────────────────────

export async function createCheckoutSessionAction() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  if (workspace.plan === 'pro') {
    return { error: 'Este workspace já está no plano Pro.' }
  }

  const stripe = getStripe()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Buscar stripe_customer_id existente
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('workspace_id', workspace.id)
    .maybeSingle()

  let customerId = sub?.stripe_customer_id

  // Validar que o customer ainda existe no Stripe
  if (customerId) {
    try {
      const existing = await stripe.customers.retrieve(customerId)
      if (existing.deleted) customerId = null
    } catch {
      customerId = null
    }
  }

  // Criar customer se não existe
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { workspaceId: workspace.id, userId: user.id },
    })
    customerId = customer.id

    // Salvar stripe_customer_id pra futuras operações
    await supabase
      .from('subscriptions')
      .upsert(
        {
          workspace_id: workspace.id,
          plan: 'free' as const,
          stripe_customer_id: customerId,
        },
        { onConflict: 'workspace_id' }
      )
  }

  // Criar Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${appUrl}/settings/billing?success=true`,
    cancel_url: `${appUrl}/settings/billing`,
    metadata: { workspaceId: workspace.id, userId: user.id },
  })

  if (!session.url) return { error: 'Erro ao criar sessão de checkout.' }

  redirect(session.url)
}

// ─── Criar Portal Session (redireciona pro Customer Portal) ──────────────────

export async function createPortalSessionAction() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  // Buscar stripe_customer_id
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('workspace_id', workspace.id)
    .maybeSingle()

  if (!sub?.stripe_customer_id) {
    return { error: 'Nenhuma assinatura encontrada para este workspace.' }
  }

  const stripe = getStripe()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${appUrl}/settings/billing`,
  })

  redirect(session.url)
}
