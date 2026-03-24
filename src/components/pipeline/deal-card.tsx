'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, MoreHorizontal, Pencil, Trash2, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { PIPELINE_STAGES, type Deal, type PipelineStage } from '@/types'

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function formatCurrency(value?: number): string {
  if (value == null) return '—'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

// ── DealCardContent ────────────────────────────────────────────────────────────
// Conteúdo visual do card — compartilhado com DragOverlay

interface DealCardContentProps {
  deal: Deal
  stageColor: string
}

export function DealCardContent({ deal, stageColor }: DealCardContentProps) {
  const isOverdue =
    deal.due_date != null && new Date(deal.due_date) < new Date()

  return (
    <div className="space-y-2.5">
      {/* Título */}
      <p className="text-sm font-medium leading-tight line-clamp-2 text-foreground">
        {deal.title}
      </p>

      {/* Lead */}
      {deal.lead && (
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarFallback className="text-[9px] bg-indigo-600/20 text-indigo-400 font-semibold">
              {initials(deal.lead.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {deal.lead.name}
          </span>
          {deal.lead.company && (
            <span className="text-xs text-muted-foreground/50 truncate hidden sm:inline">
              · {deal.lead.company}
            </span>
          )}
        </div>
      )}

      {/* Valor + responsável */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums" style={{ color: stageColor }}>
          {formatCurrency(deal.estimated_value)}
        </span>
        {deal.owner?.full_name && (
          <span className="text-xs text-muted-foreground/70 truncate">
            {deal.owner.full_name.split(' ')[0]}
          </span>
        )}
      </div>

      {/* Prazo */}
      {deal.due_date && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            isOverdue ? 'text-red-400' : 'text-muted-foreground/60',
          )}
        >
          <Calendar className="h-3 w-3 shrink-0" />
          <span>
            {format(new Date(deal.due_date), "d 'de' MMM", { locale: ptBR })}
          </span>
          {isOverdue && (
            <span className="font-semibold text-red-400 ml-0.5">· Vencido</span>
          )}
        </div>
      )}
    </div>
  )
}

// ── DealCard ───────────────────────────────────────────────────────────────────

interface DealCardProps {
  deal: Deal
  stageColor: string
  isDragging?: boolean
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
  onMoveTo: (deal: Deal, stage: PipelineStage) => void
}

export function DealCard({
  deal,
  stageColor,
  isDragging = false,
  onEdit,
  onDelete,
  onMoveTo,
}: DealCardProps) {
  const [hovered, setHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id })

  const isBeingDragged = isDragging || isSortableDragging

  const cardStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderColor: hovered && !isBeingDragged
      ? stageColor
      : 'rgba(255,255,255,0.08)',
    boxShadow: hovered && !isBeingDragged
      ? `0 4px 20px ${stageColor}28`
      : undefined,
  }

  // Outros estágios disponíveis para mover
  const otherStages = PIPELINE_STAGES.filter((s) => s.id !== deal.stage)

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative rounded-xl border bg-card/80 p-3',
        'backdrop-blur-md cursor-grab active:cursor-grabbing',
        'transition-all duration-200 select-none',
        isBeingDragged ? 'opacity-30' : 'hover:-translate-y-0.5',
      )}
    >
      <DealCardContent deal={deal} stageColor={stageColor} />

      {/* Menu de ações — visível no hover */}
      <div
        className={cn(
          'absolute right-2 top-2 transition-opacity duration-150',
          hovered ? 'opacity-100' : 'opacity-0',
        )}
        // Interrompe propagação para não iniciar drag ao clicar no menu
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-6 w-6 items-center justify-center rounded-md bg-background/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Ações do negócio"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(deal)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar negócio
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowRight className="mr-2 h-3.5 w-3.5" />
                Mover para
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {otherStages.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => onMoveTo(deal, s.id)}
                  >
                    {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(deal)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Excluir negócio
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
