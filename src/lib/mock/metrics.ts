import { MOCK_DEALS } from '@/lib/mock/deals'
import { MOCK_LEADS } from '@/lib/mock/leads'

// ── Estágios do pipeline (ordem) ───────────────────────────────────────────────

export const PIPELINE_STAGES = [
  { key: 'novo_lead', label: 'Novo Lead', color: '#60A5FA' },
  { key: 'contato_realizado', label: 'Contato Realizado', color: '#22D3EE' },
  { key: 'proposta_enviada', label: 'Proposta Enviada', color: '#CAFF33' },
  { key: 'negociacao', label: 'Negociação', color: '#FB923C' },
  { key: 'fechado_ganho', label: 'Fechado Ganho', color: '#4ADE80' },
  { key: 'fechado_perdido', label: 'Fechado Perdido', color: '#F87171' },
] as const

// ── Métricas calculadas a partir do mock ───────────────────────────────────────

const activeDeals = MOCK_DEALS.filter(
  (d) => d.stage !== 'fechado_ganho' && d.stage !== 'fechado_perdido'
)
const wonDeals = MOCK_DEALS.filter((d) => d.stage === 'fechado_ganho')
const closedDeals = MOCK_DEALS.filter(
  (d) => d.stage === 'fechado_ganho' || d.stage === 'fechado_perdido'
)

const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)
const conversionRate = closedDeals.length > 0
  ? Math.round((wonDeals.length / closedDeals.length) * 100)
  : 0

export const MOCK_METRICS = {
  totalLeads: MOCK_LEADS.length,
  totalLeadsGrowth: +18, // % vs mês anterior (mock)

  openDeals: activeDeals.length,
  openDealsGrowth: +5,

  pipelineValue,
  pipelineValueGrowth: +23,

  conversionRate,
  conversionRateGrowth: +4,
}

// ── Dados do funil por etapa ───────────────────────────────────────────────────

export const MOCK_FUNNEL_DATA = PIPELINE_STAGES.map(({ key, label, color }) => {
  const stageDeals = MOCK_DEALS.filter((d) => d.stage === key)
  const totalValue = stageDeals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)
  return {
    stage: key,
    label,
    color,
    count: stageDeals.length,
    value: totalValue,
  }
})

// ── Deals com prazo próximo (ordenados por due_date asc) ──────────────────────

const TODAY = new Date('2026-03-25T00:00:00Z')

export const MOCK_UPCOMING_DEALS = MOCK_DEALS
  .filter((d) => d.due_date && d.stage !== 'fechado_ganho' && d.stage !== 'fechado_perdido')
  .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
  .slice(0, 7)
  .map((d) => ({
    ...d,
    isOverdue: new Date(d.due_date!) < TODAY,
  }))
