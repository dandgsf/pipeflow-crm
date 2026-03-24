'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DealCard } from '@/components/pipeline/deal-card'
import { formatCurrency } from '@/components/pipeline/deal-card'
import { cn } from '@/lib/utils'
import { type Deal, type PipelineStage } from '@/types'

// ── Props ─────────────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  stage: { id: PipelineStage; label: string }
  stageColor: string
  deals: Deal[]
  isOver: boolean
  animationDelay: number
  onAddDeal: (stage: PipelineStage) => void
  onEditDeal: (deal: Deal) => void
  onDeleteDeal: (deal: Deal) => void
  onMoveDeal: (deal: Deal, stage: PipelineStage) => void
}

// ── Componente ────────────────────────────────────────────────────────────────

export function KanbanColumn({
  stage,
  stageColor,
  deals,
  isOver,
  animationDelay,
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
  onMoveDeal,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: stage.id })

  const totalValue = deals.reduce((sum, d) => sum + (d.estimated_value ?? 0), 0)
  const itemIds = deals.map((d) => d.id)

  return (
    <div
      className="flex w-[272px] flex-none flex-col animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Header da coluna */}
      <div
        className="rounded-t-xl bg-card px-3 pb-2.5 pt-3 shrink-0"
        style={{ borderTop: `3px solid ${stageColor}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-xs font-semibold uppercase tracking-wider truncate"
              style={{ color: stageColor }}
            >
              {stage.label}
            </span>
            <span className="shrink-0 rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-muted-foreground tabular-nums">
              {deals.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => onAddDeal(stage.id)}
            title={`Novo negócio em ${stage.label}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Valor total da coluna */}
        <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Corpo — zona de drop + cards */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-2 overflow-y-auto rounded-b-xl px-2 pb-2 pt-1.5',
          'min-h-[120px] transition-colors duration-200',
          isOver && 'bg-white/[0.03]',
        )}
        style={
          isOver
            ? {
                boxShadow: `inset 0 0 0 1.5px ${stageColor}55`,
              }
            : undefined
        }
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              stageColor={stageColor}
              onEdit={onEditDeal}
              onDelete={onDeleteDeal}
              onMoveTo={onMoveDeal}
            />
          ))}
        </SortableContext>

        {/* Empty state sutil */}
        {deals.length === 0 && !isOver && (
          <button
            onClick={() => onAddDeal(stage.id)}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/50 py-4 text-xs text-muted-foreground/50 transition-colors hover:border-border hover:text-muted-foreground"
          >
            <Plus className="h-3 w-3" />
            Adicionar negócio
          </button>
        )}
      </div>
    </div>
  )
}
