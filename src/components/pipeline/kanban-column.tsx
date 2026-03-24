'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DealCard } from '@/components/pipeline/deal-card'
import { formatCurrency } from '@/components/pipeline/deal-card'
import { cn } from '@/lib/utils'
import { type Deal, type PipelineStage } from '@/types'

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
      {/* Header da coluna — editorial, sem glassmorphism */}
      <div
        className="rounded-t-lg px-3 pb-3 pt-3 shrink-0"
        style={{
          backgroundColor: '#141416',
          borderTop: `2px solid ${stageColor}`,
          borderLeft: '1px solid #2A2A2E',
          borderRight: '1px solid #2A2A2E',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Dot + stage label em mono uppercase */}
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: stageColor }}
            />
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] truncate"
              style={{ color: stageColor }}
            >
              {stage.label}
            </span>
            <span
              className="shrink-0 font-mono text-[10px] tabular-nums"
              style={{ color: '#555559' }}
            >
              {deals.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 rounded-md text-[#555559] hover:text-[#E8E8E8] hover:bg-white/[0.06]"
            onClick={() => onAddDeal(stage.id)}
            title={`Novo negócio em ${stage.label}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Valor total — Syne bold */}
        <p className="mt-2 font-display text-base font-bold tabular-nums" style={{ color: '#E8E8E8' }}>
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Corpo — zona de drop + cards */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-2 overflow-y-auto rounded-b-lg px-2 pb-2 pt-1.5',
          'min-h-[120px] transition-all duration-200',
        )}
        style={{
          backgroundColor: isOver ? 'rgba(202,255,51,0.03)' : '#0C0C0E',
          borderLeft: `1px solid ${isOver ? '#CAFF3340' : '#2A2A2E'}`,
          borderRight: `1px solid ${isOver ? '#CAFF3340' : '#2A2A2E'}`,
          borderBottom: `1px solid ${isOver ? '#CAFF3340' : '#2A2A2E'}`,
        }}
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

        {/* Empty state */}
        {deals.length === 0 && !isOver && (
          <button
            onClick={() => onAddDeal(stage.id)}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed py-4 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors"
            style={{ borderColor: '#2A2A2E', color: '#555559' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#CAFF3366'
              e.currentTarget.style.color = '#CAFF33'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2A2A2E'
              e.currentTarget.style.color = '#555559'
            }}
          >
            <Plus className="h-3 w-3" />
            Adicionar negócio
          </button>
        )}
      </div>
    </div>
  )
}
