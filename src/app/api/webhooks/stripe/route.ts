import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

// ── Supabase Admin (service role) ─────────────────────────────
// O webhook não tem sessão de usuário — precisa do service role
// para escrever direto no banco sem RLS.
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── POST /api/webhooks/stripe ─────────────────────────────────
export async function POST(request: Request) {
  // 1. Ler body como texto (raw) — Stripe exige isso pra verificar HMAC
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  // 2. Verificar assinatura com constructEvent
  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  // 3. Tratar eventos
  try {
    switch (event.type) {
      // ── Checkout concluído → ativar Pro ──────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const workspaceId = session.metadata?.workspaceId
        const userId = session.metadata?.userId

        if (!workspaceId) {
          console.error('[stripe-webhook] checkout.session.completed sem workspaceId no metadata')
          return NextResponse.json({ error: 'Missing workspaceId in metadata' }, { status: 400 })
        }

        console.log(`[stripe-webhook] checkout.session.completed — workspace: ${workspaceId}, user: ${userId}`)

        // Buscar dados da subscription no Stripe pra pegar current_period_end
        // Na API v20+ do Stripe, current_period_end fica nos items, não na subscription
        let currentPeriodEnd: string | null = null
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
            { expand: ['items.data'] }
          )
          const firstItem = subscription.items.data[0]
          if (firstItem) {
            currentPeriodEnd = new Date(firstItem.current_period_end * 1000).toISOString()
          }
        }

        // Upsert na tabela subscriptions
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert(
            {
              workspace_id: workspaceId,
              plan: 'pro' as const,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              current_period_end: currentPeriodEnd,
            },
            { onConflict: 'workspace_id' }
          )

        if (subError) {
          console.error('[stripe-webhook] Erro ao upsert subscription:', subError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // Atualizar plano no workspace (campo denormalizado)
        const { error: wsError } = await supabase
          .from('workspaces')
          .update({ plan: 'pro' as const })
          .eq('id', workspaceId)

        if (wsError) {
          console.error('[stripe-webhook] Erro ao atualizar workspace plan:', wsError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        console.log(`[stripe-webhook] Workspace ${workspaceId} atualizado para Pro`)
        break
      }

      // ── Assinatura cancelada → voltar para Free ─────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log(`[stripe-webhook] customer.subscription.deleted — customer: ${customerId}`)

        // Encontrar workspace pelo stripe_customer_id
        const { data: sub, error: findError } = await supabase
          .from('subscriptions')
          .select('workspace_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (findError || !sub) {
          console.error('[stripe-webhook] Subscription não encontrada para customer:', customerId)
          return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
        }

        // Resetar pra Free
        const { error: resetError } = await supabase
          .from('subscriptions')
          .update({
            plan: 'free' as const,
            stripe_subscription_id: null,
            current_period_end: null,
          })
          .eq('stripe_customer_id', customerId)

        if (resetError) {
          console.error('[stripe-webhook] Erro ao resetar subscription:', resetError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        const { error: wsResetError } = await supabase
          .from('workspaces')
          .update({ plan: 'free' as const })
          .eq('id', sub.workspace_id)

        if (wsResetError) {
          console.error('[stripe-webhook] Erro ao resetar workspace plan:', wsResetError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        console.log(`[stripe-webhook] Workspace ${sub.workspace_id} voltou para Free`)
        break
      }

      // ── Pagamento confirmado (fallback p/ checkout.session.completed) ──
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const subscriptionId = (invoice as unknown as Record<string, unknown>).subscription as string | null

        if (!subscriptionId) {
          console.log('[stripe-webhook] invoice.payment_succeeded sem subscription — ignorando (one-off invoice)')
          break
        }

        console.log(`[stripe-webhook] invoice.payment_succeeded — customer: ${customerId}, subscription: ${subscriptionId}`)

        // Buscar subscription no Stripe para pegar metadata e period_end
        const paidSub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data'],
        })

        // Tentar obter workspaceId do metadata da subscription ou do checkout original
        let workspaceId: string | null = paidSub.metadata?.workspaceId ?? null

        // Se não tem no metadata da subscription, buscar pelo customer_id no banco
        if (!workspaceId) {
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('workspace_id')
            .eq('stripe_customer_id', customerId)
            .maybeSingle()

          workspaceId = existingSub?.workspace_id ?? null
        }

        if (!workspaceId) {
          console.error('[stripe-webhook] invoice.payment_succeeded — não conseguiu resolver workspaceId para customer:', customerId)
          break
        }

        // Pegar current_period_end
        let paidPeriodEnd: string | null = null
        const paidItem = paidSub.items.data[0]
        if (paidItem) {
          paidPeriodEnd = new Date(paidItem.current_period_end * 1000).toISOString()
        }

        // Upsert subscription como Pro
        const { error: paidSubError } = await supabase
          .from('subscriptions')
          .upsert(
            {
              workspace_id: workspaceId,
              plan: 'pro' as const,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              current_period_end: paidPeriodEnd,
            },
            { onConflict: 'workspace_id' }
          )

        if (paidSubError) {
          console.error('[stripe-webhook] Erro ao upsert subscription (invoice.payment_succeeded):', paidSubError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        const { error: paidWsError } = await supabase
          .from('workspaces')
          .update({ plan: 'pro' as const })
          .eq('id', workspaceId)

        if (paidWsError) {
          console.error('[stripe-webhook] Erro ao atualizar workspace (invoice.payment_succeeded):', paidWsError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        console.log(`[stripe-webhook] Workspace ${workspaceId} atualizado para Pro via invoice.payment_succeeded`)
        break
      }

      // ── Pagamento falhou ────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.warn(`[stripe-webhook] invoice.payment_failed — customer: ${customerId}, invoice: ${invoice.id}`)

        // Marcar como payment_failed na subscription
        const { error: failError } = await supabase
          .from('subscriptions')
          .update({ plan: 'payment_failed' })
          .eq('stripe_customer_id', customerId)

        if (failError) {
          console.error('[stripe-webhook] Erro ao marcar payment_failed:', failError)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // Atualizar workspace também
        const { data: failSub } = await supabase
          .from('subscriptions')
          .select('workspace_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (failSub) {
          await supabase
            .from('workspaces')
            .update({ plan: 'payment_failed' })
            .eq('id', failSub.workspace_id)
        }

        console.warn(`[stripe-webhook] Customer ${customerId} marcado como payment_failed`)
        break
      }

      default:
        console.log(`[stripe-webhook] Evento não tratado: ${event.type}`)
    }
  } catch (err) {
    console.error('[stripe-webhook] Erro ao processar evento:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  // 4. Retornar confirmação pro Stripe
  return NextResponse.json({ received: true })
}
