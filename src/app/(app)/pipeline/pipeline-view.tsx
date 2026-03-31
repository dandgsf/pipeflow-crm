'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import { DealFormDialog, type DealSavePayload, type DealLeadOption } from '@/components/pipeline/deal-form-dialog'
import { createDealAction, updateDealAction, deleteDealAction, moveDealAction } from '@/lib/actions/deals'
import { type Deal, type PipelineStage, type WorkspaceMember } from '@/types'

// ── Props ──────────────────────────────────────────────────────────────────────

interface PipelineViewProps {
  initialDeals: Deal[]
  leads: DealLeadOption[]
  members: WorkspaceMember[]
  currentUserId: string
}

// ── Componente ────────────────────────────────────────────────────────────────

export function PipelineView({ initialDeals, leads, members, currentUserId }: PipelineViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [defaultDialogStage, setDefaultDialogStage] = useState<PipelineStage>('novo_lead')

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleAddDeal(stage: PipelineStage) {
    setEditingDeal(null)
    setDefaultDialogStage(stage)
    setDialogOpen(true)
  }

  function handleEditDeal(deal: Deal) {
    setEditingDeal(deal)
    setDialogOpen(true)
  }

  function handleDeleteDeal(deal: Deal) {
    const originalIndex = deals.findIndex((d) => d.id === deal.id)
    setDeals((prev) => prev.filter((d) => d.id !== deal.id))

    startTransition(async () => {
      const result = await deleteDealAction(deal.id)
      if (result?.error) {
        setDeals((prev) => {
          const next = [...prev]
          next.splice(originalIndex, 0, deal)
          return next
        })
      } else {
        router.refresh()
      }
    })
  }

  function handleMoveDeal(deal: Deal, stage: PipelineStage) {
    // O deal já vem com stage e position atualizados pelo KanbanBoard
    // Apenas sincroniza o estado do pai e persiste no banco
    setDeals((prev) =>
      prev.map((d) =>
        d.id === deal.id
          ? { ...d, stage: deal.stage, position: deal.position, updated_at: new Date().toISOString() }
          : d,
      ),
    )

    startTransition(async () => {
      await moveDealAction(deal.id, deal.stage, deal.position)
    })
  }

  function handleDealsChange(updated: Deal[]) {
    setDeals(updated)
  }

  function handleSaveDeal(payload: DealSavePayload, deal?: Deal | null) {
    if (deal) {
      // Atualização otimista
      const leadData = leads.find((l) => l.id === payload.lead_id)
      setDeals((prev) =>
        prev.map((d) =>
          d.id === deal.id
            ? {
                ...d,
                title: payload.title,
                lead_id: payload.lead_id,
                stage: payload.stage,
                estimated_value: payload.estimated_value,
                owner_id: payload.owner_id,
                due_date: payload.due_date,
                notes: payload.notes,
                updated_at: new Date().toISOString(),
                lead: leadData
                  ? { id: leadData.id, name: leadData.name, company: leadData.company, email: '' }
                  : d.lead,
              }
            : d,
        ),
      )

      startTransition(async () => {
        const result = await updateDealAction(deal.id, payload)
        if (!result?.error) router.refresh()
      })
    } else {
      // Criação — aguarda refresh para obter ID real
      startTransition(async () => {
        const result = await createDealAction(payload)
        if (!result?.error) router.refresh()
      })
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil de vendas"
        action={
          <Button size="sm" onClick={() => handleAddDeal('novo_lead')} disabled={isPending}>
            + Novo Negócio
          </Button>
        }
      />

      <div className="flex-1 overflow-x-auto pb-4 snap-x snap-mandatory sm:snap-none">
        <KanbanBoard
          deals={deals}
          onDealsChange={handleDealsChange}
          onEditDeal={handleEditDeal}
          onDeleteDeal={handleDeleteDeal}
          onAddDeal={handleAddDeal}
          onMoveDeal={handleMoveDeal}
        />
      </div>

      <DealFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={editingDeal}
        defaultStage={defaultDialogStage}
        onSave={handleSaveDeal}
        onDelete={handleDeleteDeal}
        leads={leads}
        members={members}
        currentUserId={currentUserId}
      />
    </div>
  )
}
