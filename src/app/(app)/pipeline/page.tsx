import type { Metadata } from 'next'
import { KanbanSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/layout/empty-state'

export const metadata: Metadata = { title: 'Pipeline' }

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil"
        action={<Button size="sm">+ Novo Negócio</Button>}
      />
      <EmptyState
        icon={KanbanSquare}
        title="Board Kanban em breve"
        description="O Kanban com drag-and-drop chega na aula M4."
      />
    </div>
  )
}
