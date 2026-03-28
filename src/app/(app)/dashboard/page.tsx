import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Users, Briefcase, DollarSign, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { MetricCard } from '@/components/dashboard/metric-card'
import { FunnelChart, type FunnelDataItem } from '@/components/dashboard/funnel-chart'
import { UpcomingDeals, type UpcomingDealItem } from '@/components/dashboard/upcoming-deals'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'

export const metadata: Metadata = { title: 'Dashboard' }

// Configuração visual das etapas do funil
const STAGE_CONFIG: Record<string, { label: string; color: string }> = {
  novo_lead:         { label: 'Novo Lead',          color: '#60a5fa' },
  contato_realizado: { label: 'Contato Realizado',  color: '#22d3ee' },
  proposta_enviada:  { label: 'Proposta Enviada',   color: '#CAFF33' },
  negociacao:        { label: 'Negociação',          color: '#fb923c' },
  fechado_ganho:     { label: 'Fechado Ganho',       color: '#4ade80' },
  fechado_perdido:   { label: 'Fechado Perdido',     color: '#f87171' },
}

const STAGE_ORDER = [
  'novo_lead',
  'contato_realizado',
  'proposta_enviada',
  'negociacao',
  'fechado_ganho',
  'fechado_perdido',
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  const wid = workspace.id

  // ── Queries paralelas ─────────────────────────────────────────────────────

  const [
    { count: totalLeads },
    { data: dealsData },
  ] = await Promise.all([
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', wid),
    supabase
      .from('deals')
      .select(`
        id, stage, estimated_value, due_date, title,
        lead:leads(name, company)
      `)
      .eq('workspace_id', wid),
  ])

  const deals = dealsData ?? []

  // ── Métricas ─────────────────────────────────────────────────────────────

  const openStages = ['novo_lead', 'contato_realizado', 'proposta_enviada', 'negociacao']
  const openDeals = deals.filter((d) => openStages.includes(d.stage)).length

  const pipelineValue = deals
    .filter((d) => openStages.includes(d.stage))
    .reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)

  const closedDeals = deals.filter((d) => d.stage === 'fechado_ganho' || d.stage === 'fechado_perdido').length
  const wonDeals = deals.filter((d) => d.stage === 'fechado_ganho').length
  const conversionRate = closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 0

  // ── Funil ─────────────────────────────────────────────────────────────────

  const funnelData: FunnelDataItem[] = STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage)
    return {
      stage,
      label: STAGE_CONFIG[stage]?.label ?? stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0),
      color: STAGE_CONFIG[stage]?.color ?? '#71717a',
    }
  })

  // ── Upcoming deals ────────────────────────────────────────────────────────

  const now = new Date()
  const upcomingDeals: UpcomingDealItem[] = deals
    .filter((d) => d.due_date && !['fechado_ganho', 'fechado_perdido'].includes(d.stage))
    .map((d) => {
      const leadJoin = d.lead as { name: string; company: string | null } | null
      return {
        id: d.id,
        title: d.title,
        stage: d.stage,
        due_date: d.due_date!,
        estimated_value: d.estimated_value ?? undefined,
        isOverdue: new Date(d.due_date!) < now,
        lead: leadJoin ? { name: leadJoin.name, company: leadJoin.company ?? undefined } : undefined,
      }
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 10)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do seu pipeline de vendas"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total de Leads"
          value={String(totalLeads ?? 0)}
          icon={Users}
          iconColor="text-blue-400"
        />
        <MetricCard
          label="Negócios Abertos"
          value={String(openDeals)}
          icon={Briefcase}
          iconColor="text-cyan-400"
        />
        <MetricCard
          label="Valor do Pipeline"
          value={formatCurrency(pipelineValue)}
          icon={DollarSign}
          iconColor="text-[#CAFF33]"
        />
        <MetricCard
          label="Taxa de Conversão"
          value={`${conversionRate}%`}
          icon={Target}
          iconColor="text-orange-400"
        />
      </div>

      {/* Funil de Vendas */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-300">
            Negócios por Etapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart data={funnelData} />
        </CardContent>
      </Card>

      {/* Deals com prazo próximo */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-300">
            Negócios com Prazo Próximo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingDeals deals={upcomingDeals} />
        </CardContent>
      </Card>
    </div>
  )
}
