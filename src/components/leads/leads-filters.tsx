'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { LeadStatus, WorkspaceMember } from '@/types'

// ── Tipos ──────────────────────────────────────────────────────────────────────

export interface LeadsFiltersState {
  search: string
  status: LeadStatus | 'all'
  ownerId: string | 'all'
}

interface LeadsFiltersProps {
  filters: LeadsFiltersState
  onChange: (filters: LeadsFiltersState) => void
  members?: WorkspaceMember[]
}

// ── Componente ─────────────────────────────────────────────────────────────────

export function LeadsFilters({ filters, onChange, members = [] }: LeadsFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.ownerId !== 'all'

  function handleReset() {
    onChange({ search: '', status: 'all', ownerId: 'all' })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Busca */}
      <div className="relative w-full sm:min-w-[220px] sm:flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou empresa…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      {/* Filtro status */}
      <Select
        value={filters.status}
        onValueChange={(value) =>
          onChange({ ...filters, status: (value ?? 'all') as LeadStatus | 'all' })
        }
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="novo">Novo</SelectItem>
          <SelectItem value="contato">Contato</SelectItem>
          <SelectItem value="proposta">Proposta</SelectItem>
          <SelectItem value="negociacao">Negociação</SelectItem>
          <SelectItem value="ganho">Ganho</SelectItem>
          <SelectItem value="perdido">Perdido</SelectItem>
        </SelectContent>
      </Select>

      {/* Filtro responsável */}
      <Select
        value={filters.ownerId}
        onValueChange={(value) => onChange({ ...filters, ownerId: value ?? 'all' })}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os responsáveis</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.user_id} value={m.user_id}>
              {m.user?.full_name ?? m.user?.email ?? m.user_id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Limpar filtros */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Limpar
        </Button>
      )}
    </div>
  )
}
