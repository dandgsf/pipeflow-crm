import type { Metadata } from 'next'
import { Users, Briefcase, DollarSign, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { MetricCard } from '@/components/dashboard/metric-card'
import { FunnelChart } from '@/components/dashboard/funnel-chart'
import { UpcomingDeals } from '@/components/dashboard/upcoming-deals'
import { MOCK_METRICS } from '@/lib/mock/metrics'

export const metadata: Metadata = { title: 'Dashboard' }

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export default function DashboardPage() {
  const { totalLeads, totalLeadsGrowth, openDeals, openDealsGrowth, pipelineValue, pipelineValueGrowth, conversionRate, conversionRateGrowth } = MOCK_METRICS

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
          value={String(totalLeads)}
          growth={totalLeadsGrowth}
          icon={Users}
          iconColor="text-blue-400"
        />
        <MetricCard
          label="Negócios Abertos"
          value={String(openDeals)}
          growth={openDealsGrowth}
          icon={Briefcase}
          iconColor="text-cyan-400"
        />
        <MetricCard
          label="Valor do Pipeline"
          value={formatCurrency(pipelineValue)}
          growth={pipelineValueGrowth}
          icon={DollarSign}
          iconColor="text-[#CAFF33]"
        />
        <MetricCard
          label="Taxa de Conversão"
          value={`${conversionRate}%`}
          growth={conversionRateGrowth}
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
          <FunnelChart />
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
          <UpcomingDeals />
        </CardContent>
      </Card>
    </div>
  )
}
