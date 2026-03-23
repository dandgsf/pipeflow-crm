import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'

export const metadata: Metadata = { title: 'Configurações' }

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Workspace, membros e plano de assinatura"
      />
      <EmptyState
        icon={Settings}
        title="Configurações em breve"
        description="Gestão de workspace e billing chegam nas aulas M9 e M10."
      />
    </div>
  )
}
