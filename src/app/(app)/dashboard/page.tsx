import type { Metadata } from 'next'
import { LayoutDashboard } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do seu pipeline de vendas"
      />
      <EmptyState
        icon={LayoutDashboard}
        title="Métricas em breve"
        description="Cards de métricas e gráfico de funil chegam na aula M5."
      />
    </div>
  )
}
