'use client'

import { useState, useMemo } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { LeadsTable } from '@/components/leads/leads-table'
import { LeadsFilters, type LeadsFiltersState } from '@/components/leads/leads-filters'
import { LeadFormDialog, type LeadSavePayload } from '@/components/leads/lead-form-dialog'
import { MOCK_LEADS } from '@/lib/mock/leads'
import type { Lead } from '@/types'

// ── Config ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8

// ── Componente ─────────────────────────────────────────────────────────────────

export function LeadsView() {
  // Estado de dados (mock, mutável durante a sessão)
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)

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

  // Resetar para página 1 ao filtrar
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
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
  }

  function handleSave(values: LeadSavePayload, lead?: Lead | null) {
    if (lead) {
      // Edição
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? {
                ...l,
                ...values,
                updated_at: new Date().toISOString(),
              }
            : l,
        ),
      )
    } else {
      // Criação
      const newLead: Lead = {
        id: `l${Date.now()}`,
        workspace_id: 'ws1',
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        company: values.company || undefined,
        position: values.position || undefined,
        status: values.status,
        owner_id: values.owner_id,
        estimated_value: values.estimated_value,
        notes: values.notes || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setLeads((prev) => [newLead, ...prev])
      setPage(1)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={`${filteredLeads.length} lead${filteredLeads.length !== 1 ? 's' : ''} encontrado${filteredLeads.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" onClick={handleNew} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        }
      />

      <LeadsFilters filters={filters} onChange={handleFiltersChange} />

      <LeadsTable
        leads={paginatedLeads}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
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
      />
    </div>
  )
}
