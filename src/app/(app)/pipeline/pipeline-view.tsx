'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import { DealFormDialog, type DealSavePayload } from '@/components/pipeline/deal-form-dialog'
import { MOCK_DEALS } from '@/lib/mock/deals'
import { MOCK_LEADS, MOCK_OWNERS } from '@/lib/mock/leads'
import { type Deal, type PipelineStage } from '@/types'

// ── Helper — reconstrói o objeto lead a partir do id ──────────────────────────

function buildLead(leadId: string) {
  const lead = MOCK_LEADS.find((l) => l.id === leadId)
  if (!lead) return undefined
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    avatar_url: lead.avatar_url,
  }
}

// ── Componente ────────────────────────────────────────────────────────────────

export function PipelineView() {
  // Estado principal dos deals (mutável na sessão)
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)

  // Estado do dialog
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
    setDeals((prev) => prev.filter((d) => d.id !== deal.id))
  }

  function handleMoveDeal(deal: Deal, stage: PipelineStage) {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === deal.id
          ? {
              ...d,
              stage,
              position: prev.filter((x) => x.stage === stage).length,
              updated_at: new Date().toISOString(),
            }
          : d,
      ),
    )
  }

  function handleDealsChange(updated: Deal[]) {
    setDeals(updated)
  }

  function handleSaveDeal(payload: DealSavePayload, deal?: Deal | null) {
    if (deal) {
      // Edição
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
                lead: buildLead(payload.lead_id),
                owner: MOCK_OWNERS.find((o) => o.id === payload.owner_id),
              }
            : d,
        ),
      )
    } else {
      // Criação
      const stageDeals = deals.filter((d) => d.stage === payload.stage)
      const newDeal: Deal = {
        id: `d${Date.now()}`,
        workspace_id: 'ws1',
        lead_id: payload.lead_id,
        title: payload.title,
        stage: payload.stage,
        position: stageDeals.length,
        estimated_value: payload.estimated_value,
        owner_id: payload.owner_id,
        due_date: payload.due_date,
        notes: payload.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lead: buildLead(payload.lead_id),
        owner: MOCK_OWNERS.find((o) => o.id === payload.owner_id),
      }
      setDeals((prev) => [...prev, newDeal])
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
      <PageHeader
        title="Pipeline"
        description="Acompanhe seus negócios em cada etapa do funil de vendas"
        action={
          <Button size="sm" onClick={() => handleAddDeal('novo_lead')}>
            + Novo Negócio
          </Button>
        }
      />

      {/* Board com scroll horizontal */}
      <div className="flex-1 overflow-x-auto pb-4">
        <KanbanBoard
          deals={deals}
          onDealsChange={handleDealsChange}
          onEditDeal={handleEditDeal}
          onDeleteDeal={handleDeleteDeal}
          onAddDeal={handleAddDeal}
          onMoveDeal={handleMoveDeal}
        />
      </div>

      {/* Dialog de criação/edição */}
      <DealFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={editingDeal}
        defaultStage={defaultDialogStage}
        onSave={handleSaveDeal}
        onDelete={handleDeleteDeal}
      />
    </div>
  )
}
