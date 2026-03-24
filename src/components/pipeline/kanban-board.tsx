'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { KanbanColumn } from '@/components/pipeline/kanban-column'
import { DealCardContent } from '@/components/pipeline/deal-card'
import { PIPELINE_STAGES, type Deal, type PipelineStage } from '@/types'

// ── Cores por estágio ─────────────────────────────────────────────────────────

export const STAGE_COLORS: Record<PipelineStage, string> = {
  novo_lead:          '#5B7FFF',
  contato_realizado:  '#00B4D8',
  proposta_enviada:   '#CAFF33',
  negociacao:         '#FF6B35',
  fechado_ganho:      '#2ED573',
  fechado_perdido:    '#FF4757',
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  deals: Deal[]
  onDealsChange: (deals: Deal[]) => void
  onEditDeal: (deal: Deal) => void
  onDeleteDeal: (deal: Deal) => void
  onAddDeal: (stage: PipelineStage) => void
  onMoveDeal: (deal: Deal, stage: PipelineStage) => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStageOfItem(id: string, deals: Deal[]): PipelineStage | null {
  // Verifica se o id é de um estágio
  if (PIPELINE_STAGES.some((s) => s.id === id)) {
    return id as PipelineStage
  }
  // Caso contrário, busca pelo deal
  return deals.find((d) => d.id === id)?.stage ?? null
}

function reposition(deals: Deal[]): Deal[] {
  // Re-atribui position (0,1,2...) por coluna para manter consistência
  const grouped: Record<string, Deal[]> = {}
  for (const deal of deals) {
    if (!grouped[deal.stage]) grouped[deal.stage] = []
    grouped[deal.stage].push(deal)
  }
  const result: Deal[] = []
  for (const stage of Object.keys(grouped)) {
    grouped[stage].forEach((d, i) => {
      result.push({ ...d, position: i })
    })
  }
  return result
}

// ── Componente ────────────────────────────────────────────────────────────────

export function KanbanBoard({
  deals,
  onDealsChange,
  onEditDeal,
  onDeleteDeal,
  onAddDeal,
  onMoveDeal,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // Estado interno para feedback visual durante drag (não propaga para o pai)
  const [internalDeals, setInternalDeals] = useState<Deal[]>(deals)

  // Sincroniza internalDeals quando o pai atualiza deals (CRUD, etc.)
  // useEffect é correto aqui — useMemo não pode ter side effects
  useEffect(() => {
    setInternalDeals(deals)
  }, [deals])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  )

  // Deal ativo (para DragOverlay)
  const activeDeal = activeId
    ? internalDeals.find((d) => d.id === activeId) ?? null
    : null

  // Agrupa por estágio para renderização
  const dealsByStage = useMemo(() => {
    const map: Record<PipelineStage, Deal[]> = {
      novo_lead: [],
      contato_realizado: [],
      proposta_enviada: [],
      negociacao: [],
      fechado_ganho: [],
      fechado_perdido: [],
    }
    for (const deal of internalDeals) {
      map[deal.stage].push(deal)
    }
    // Ordena por posição dentro de cada coluna
    for (const stage of Object.keys(map) as PipelineStage[]) {
      map[stage].sort((a, b) => a.position - b.position)
    }
    return map
  }, [internalDeals])

  // Coluna sobre a qual está sendo arrastado
  const [overId, setOverId] = useState<string | null>(null)

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) {
      setOverId(null)
      return
    }

    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)
    setOverId(overIdStr)

    const activeDealItem = internalDeals.find((d) => d.id === activeIdStr)
    if (!activeDealItem) return

    const overStage = getStageOfItem(overIdStr, internalDeals)
    if (!overStage || overStage === activeDealItem.stage) return

    // Mover para nova coluna durante o drag (feedback visual)
    setInternalDeals((prev) => {
      const updated = prev.map((d) =>
        d.id === activeIdStr
          ? { ...d, stage: overStage, position: prev.filter((x) => x.stage === overStage).length }
          : d,
      )
      return reposition(updated)
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over) {
      // Revert: sem destino válido
      setInternalDeals(deals)
      return
    }

    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)

    const activeDealItem = internalDeals.find((d) => d.id === activeIdStr)
    if (!activeDealItem) return

    const destStage = getStageOfItem(overIdStr, internalDeals)
    if (!destStage) return

    let updated: Deal[]

    if (activeDealItem.stage === destStage) {
      // Reordenação dentro da mesma coluna
      const columnDeals = internalDeals
        .filter((d) => d.stage === destStage)
        .sort((a, b) => a.position - b.position)

      const activeIndex = columnDeals.findIndex((d) => d.id === activeIdStr)
      const overIndex = columnDeals.findIndex((d) => d.id === overIdStr)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const reordered = arrayMove(columnDeals, activeIndex, overIndex)
        const otherDeals = internalDeals.filter((d) => d.stage !== destStage)
        updated = reposition([...otherDeals, ...reordered])
      } else {
        updated = reposition(internalDeals)
      }
    } else {
      // Já movido via onDragOver — apenas confirmar
      updated = reposition(internalDeals)
    }

    setInternalDeals(updated)
    onDealsChange(updated)
  }

  function handleDragCancel() {
    setActiveId(null)
    setOverId(null)
    setInternalDeals(deals)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Board — scroll horizontal */}
      <div
        className="flex gap-3 items-start px-1 pb-2"
        style={{ minWidth: `${6 * 272 + 5 * 12}px` }}
      >
        {PIPELINE_STAGES.map((stage, index) => {
          const stageColor = STAGE_COLORS[stage.id]
          const stageDeals = dealsByStage[stage.id]

          // Detecta se este estágio é o destino atual do drag
          const isOver =
            overId != null &&
            (overId === stage.id ||
              stageDeals.some((d) => d.id === overId))

          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              stageColor={stageColor}
              deals={stageDeals}
              isOver={isOver}
              animationDelay={index * 60}
              onAddDeal={onAddDeal}
              onEditDeal={onEditDeal}
              onDeleteDeal={onDeleteDeal}
              onMoveDeal={onMoveDeal}
            />
          )
        })}
      </div>

      {/* Overlay animado durante drag */}
      <DragOverlay dropAnimation={null}>
        {activeDeal && (
          <div
            className="rounded-lg border p-3 cursor-grabbing w-[272px]"
            style={{
              backgroundColor: '#141416',
              borderColor: STAGE_COLORS[activeDeal.stage],
              boxShadow: `inset 0 2px 0 ${STAGE_COLORS[activeDeal.stage]}, 0 20px 40px rgba(0,0,0,0.6)`,
              transform: 'rotate(1.5deg) scale(1.04)',
            }}
          >
            <DealCardContent
              deal={activeDeal}
              stageColor={STAGE_COLORS[activeDeal.stage]}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
