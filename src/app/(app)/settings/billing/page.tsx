import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CheckCircle, AlertTriangle, Crown, Users, Database, BarChart3, Mail, Zap } from 'lucide-react'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { CheckoutButton } from '@/components/billing/checkout-button'
import { PortalButton } from '@/components/billing/portal-button'

export const metadata: Metadata = { title: 'Assinatura' }

const PLAN_FEATURES = [
  { label: 'Membros da equipe', free: 'Até 2', pro: 'Ilimitados', icon: Users },
  { label: 'Leads', free: 'Até 50', pro: 'Ilimitados', icon: Database },
  { label: 'Pipeline Kanban', free: '✓', pro: '✓', icon: BarChart3 },
  { label: 'Dashboard de métricas', free: '✓', pro: '✓', icon: BarChart3 },
  { label: 'Convites por e-mail', free: '✓', pro: '✓', icon: Mail },
  { label: 'Suporte prioritário', free: '—', pro: '✓', icon: Zap },
] as const

interface BillingPageProps {
  searchParams: Promise<{ success?: string }>
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const params = await searchParams

  const supabase = await getSupabaseServer()
  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  // Buscar subscription com dados do Stripe
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, stripe_customer_id, current_period_end')
    .eq('workspace_id', workspace.id)
    .maybeSingle()

  const plan = subscription?.plan ?? workspace.plan ?? 'free'
  const isPro = plan === 'pro'
  const isPaymentFailed = plan === 'payment_failed'
  const showSuccess = params.success === 'true'

  // Formatar data de renovação
  let renewalDate: string | null = null
  if (subscription?.current_period_end) {
    renewalDate = new Date(subscription.current_period_end).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Banner de sucesso */}
      {showSuccess && (
        <div
          className="flex items-center gap-3 rounded-lg border p-4"
          style={{
            backgroundColor: 'rgba(34,197,94,0.08)',
            borderColor: 'rgba(34,197,94,0.2)',
          }}
        >
          <CheckCircle className="h-5 w-5 shrink-0 text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-400">Assinatura ativada com sucesso!</p>
            <p className="mt-0.5 text-xs text-[#888]">
              Seu workspace agora está no plano Pro com recursos ilimitados.
            </p>
          </div>
        </div>
      )}

      {/* Banner de falha de pagamento */}
      {isPaymentFailed && (
        <div
          className="flex items-center gap-3 rounded-lg border p-4"
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            borderColor: 'rgba(239,68,68,0.2)',
          }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-400">Falha no pagamento</p>
            <p className="mt-0.5 text-xs text-[#888]">
              O último pagamento falhou. Atualize seu método de pagamento para manter o plano Pro.
            </p>
            <div className="mt-2">
              <PortalButton />
            </div>
          </div>
        </div>
      )}

      {/* Card do plano atual */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111111] p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold text-[#F0F0F0]">Plano atual</h2>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: isPro ? 'rgba(202,255,51,0.15)' : 'rgba(255,255,255,0.08)',
                  color: isPro ? '#CAFF33' : '#888',
                }}
              >
                {isPro ? 'Pro' : 'Free'}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#888]">
              {isPro
                ? 'Membros e leads ilimitados para toda a equipe.'
                : 'Até 2 membros e 50 leads. Ideal para começar.'}
            </p>
            {renewalDate && isPro && (
              <p className="mt-2 font-mono text-xs text-[#666]">
                Renova em {renewalDate}
              </p>
            )}
          </div>
          <div className="ml-4">
            {isPro ? <PortalButton /> : <CheckoutButton />}
          </div>
        </div>
      </div>

      {/* Comparação de planos */}
      <div>
        <h2 className="mb-4 font-display text-base font-semibold text-[#F0F0F0]">
          Compare os planos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Card Free */}
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111111] p-5">
            <h3 className="font-display text-sm font-bold text-[#F0F0F0]">Free</h3>
            <p className="mt-1 font-mono text-2xl font-bold text-[#F0F0F0]">
              R$0<span className="text-sm font-normal text-[#888]">/mês</span>
            </p>
            <p className="mt-2 text-xs text-[#888]">Para freelancers começando</p>
            <ul className="mt-4 space-y-2">
              {PLAN_FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-[#888]">
                  <f.icon className="h-3.5 w-3.5 shrink-0 text-[#666]" />
                  <span>{f.label}:</span>
                  <span className="ml-auto font-mono text-xs">{f.free}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card Pro */}
          <div
            className="relative rounded-lg border bg-[#111111] p-5"
            style={{ borderColor: 'rgba(202,255,51,0.3)' }}
          >
            <div
              className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{ backgroundColor: '#CAFF33', color: '#0A0A0A' }}
            >
              <Crown className="h-3 w-3" />
              Recomendado
            </div>
            <h3 className="font-display text-sm font-bold text-[#CAFF33]">Pro</h3>
            <p className="mt-1 font-mono text-2xl font-bold text-[#F0F0F0]">
              R$49<span className="text-sm font-normal text-[#888]">/mês</span>
            </p>
            <p className="mt-2 text-xs text-[#888]">Para equipes em crescimento</p>
            <ul className="mt-4 space-y-2">
              {PLAN_FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-[#F0F0F0]">
                  <f.icon className="h-3.5 w-3.5 shrink-0 text-[#CAFF33]" />
                  <span>{f.label}:</span>
                  <span className="ml-auto font-mono text-xs text-[#CAFF33]">{f.pro}</span>
                </li>
              ))}
            </ul>
            {!isPro && (
              <div className="mt-5">
                <CheckoutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
