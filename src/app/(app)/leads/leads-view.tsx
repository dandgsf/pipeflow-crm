'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { LeadsTable } from '@/components/leads/leads-table'
import { LeadsFilters, type LeadsFiltersState } from '@/components/leads/leads-filters'
import { LeadFormDialog, type LeadSavePayload } from '@/components/leads/lead-form-dialog'
import { createLeadAction, updateLeadAction, deleteLeadAction } from '@/lib/actions/leads'
import type { Lead, WorkspaceMember } from '@/types'

// ── Config ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8

// ── Props ──────────────────────────────────────────────────────────────────────

interface LeadsViewProps {
  initialLeads: Lead[]
  members: WorkspaceMember[]
  currentUserId: string
}

// ── Componente ─────────────────────────────────────────────────────────────────

export function LeadsView({ initialLeads, members, currentUserId }: LeadsViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Estado de dados — otimista local, revalidado pelo router após Server Action
  const [leads, setLeads] = useState<Lead[]>(initialLeads)

  // Filtros
  const [filters, setFilters] = useState<LeadsFiltersState>({
    search: '',
    status: 'all',
    ownerId: 'all',
  })

  // Paginação
  const [page, setPage] = useState(1)

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  // ── Filtros client-side ──────────────────────────────────────────────────────

  const filteredLeads = useMemo(() => {
    const q = filters.search.toLowerCase().trim()

    return leads.filter((lead) => {
      if (q && !lead.name.toLowerCase().includes(q) && !lead.company?.toLowerCase().includes(q)) {
        return false
      }
      if (filters.status !== 'all' && lead.status !== filters.status) {
        return false
      }
      if (filters.ownerId !== 'all' && lead.owner_id !== filters.ownerId) {
        return false
      }
      return true
    })
  }, [leads, filters])

  const handleFiltersChange = (next: LeadsFiltersState) => {
    setFilters(next)
    setPage(1)
  }

  // ── Paginação ────────────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedLeads = filteredLeads.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  // ── Ações ────────────────────────────────────────────────────────────────────

  function handleNew() {
    setEditingLead(null)
    setDialogOpen(true)
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setDialogOpen(true)
  }

  function handleDelete(lead: Lead) {
    const originalIndex = leads.findIndex((l) => l.id === lead.id)
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))

    startTransition(async () => {
      const result = await deleteLeadAction(lead.id)
      if (result?.error) {
        setLeads((prev) => {
          const next = [...prev]
          next.splice(originalIndex, 0, lead)
          return next
        })
      } else {
        router.refresh()
      }
    })
  }

  function handleSave(values: LeadSavePayload, lead?: Lead | null) {
    if (lead) {
      // Edição — atualização otimista
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id ? { ...l, ...values, updated_at: new Date().toISOString() } : l,
        ),
      )

      startTransition(async () => {
        const result = await updateLeadAction(lead.id, values)
        if (!result?.error) router.refresh()
      })
    } else {
      // Criação — Server Action, depois refresh para obter ID real
      startTransition(async () => {
        const result = await createLeadAction(values)
        if (!result?.error) router.refresh()
      })
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={`${filteredLeads.length} lead${filteredLeads.length !== 1 ? 's' : ''} encontrado${filteredLeads.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" onClick={handleNew} className="gap-1.5" disabled={isPending}>
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        }
      />

      <LeadsFilters filters={filters} onChange={handleFiltersChange} members={members} />

      <LeadsTable
        leads={paginatedLeads}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span className="text-xs sm:text-sm">
            Página {safePage} de {totalPages} — {filteredLeads.length} leads
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialog criar/editar */}
      <LeadFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={editingLead}
        onSave={handleSave}
        onDelete={handleDelete}
        members={members}
        currentUserId={currentUserId}
      />
    </div>
  )
}
