import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'

export const metadata: Metadata = { title: 'Leads' }

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Gerencie seus contatos e oportunidades"
        action={<Button size="sm">+ Novo Lead</Button>}
      />
      <EmptyState
        icon={Users}
        title="Nenhum lead ainda"
        description="A listagem com filtros e formulário chegam na aula M3."
        action={<Button size="sm" variant="secondary">+ Novo Lead</Button>}
      />
    </div>
  )
}
