'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/permissions'
import { getStripe } from '@/lib/stripe'
import { getActiveWorkspace } from '@/lib/workspace'

// ─── Criar Checkout Session (redireciona pro Stripe) ─────────────────────────

export async function createCheckoutSessionAction() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }
  if (!(await isAdmin(workspace.id))) return { error: 'Apenas administradores podem gerenciar a cobrança.' }

  if (workspace.plan !== 'free') {
    return { error: 'Gerencie a assinatura existente pelo portal de cobrança.' }
  }

  const stripe = getStripe()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Buscar stripe_customer_id existente
  const { data: sub, error: readError } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('workspace_id', workspace.id)
    .maybeSingle()

  if (readError) return { error: 'Não foi possível consultar a assinatura.' }
  let customerId = sub?.stripe_customer_id
  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) customerId = null
    else if (customer.metadata.workspaceId !== workspace.id) return { error: 'Vínculo de cobrança inválido.' }
  }

  if (!customerId) {
    // A retry or a concurrent admin must not replace a customer already linked by another request.
    const customer = await stripe.customers.create(
      { metadata: { workspaceId: workspace.id } },
      { idempotencyKey: `workspace-customer-${workspace.id}-${sub?.stripe_customer_id ?? 'new'}` },
    )
    const admin = getSupabaseAdmin()
    if (!sub) {
      const { error } = await admin.from('subscriptions')
        .upsert({ workspace_id: workspace.id }, { onConflict: 'workspace_id', ignoreDuplicates: true })
      if (error) return { error: 'Não foi possível preparar a assinatura.' }
    }
    const update = admin.from('subscriptions').update({ stripe_customer_id: customer.id })
      .eq('workspace_id', workspace.id)
    const { error } = sub?.stripe_customer_id
      ? await update.eq('stripe_customer_id', sub.stripe_customer_id)
      : await update.is('stripe_customer_id', null)
    const { data: linked } = await supabase.from('subscriptions').select('stripe_customer_id')
      .eq('workspace_id', workspace.id).maybeSingle()
    if (error || linked?.stripe_customer_id !== customer.id) return { error: 'Não foi possível vincular a cobrança.' }
    customerId = customer.id
  }

  const { data: [previous] } = await stripe.checkout.sessions.list({ customer: customerId, limit: 1 })
  if (previous?.mode === 'subscription' && previous.metadata?.workspaceId === workspace.id) {
    if (previous.status === 'open' && previous.url) redirect(previous.url)
    const subId = previous.subscription
    if (typeof subId === 'string') {
      const existing = await stripe.subscriptions.retrieve(subId)
      if (!['canceled', 'incomplete_expired'].includes(existing.status)) {
        return { error: 'Já existe uma assinatura. Gerencie-a pelo portal de cobrança.' }
      }
    }
  }
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    subscription_data: { metadata: { workspaceId: workspace.id } },
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    success_url: `${appUrl}/settings/billing?success=true`,
    cancel_url: `${appUrl}/settings/billing`,
    metadata: { workspaceId: workspace.id },
  }, { idempotencyKey: `workspace-checkout-${customerId}-${previous?.id ?? 'first'}` })

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
  if (!(await isAdmin(workspace.id))) return { error: 'Apenas administradores podem gerenciar a cobrança.' }

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

  const customer = await stripe.customers.retrieve(sub.stripe_customer_id)
  if (customer.deleted || customer.metadata.workspaceId !== workspace.id) return { error: 'Vínculo de cobrança inválido.' }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${appUrl}/settings/billing`,
  })

  redirect(session.url)
}
