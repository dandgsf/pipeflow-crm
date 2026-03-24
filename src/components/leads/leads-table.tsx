'use client'

import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState } from '@/components/layout/empty-state'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import type { Lead } from '@/types'
import { Users } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ── Componente ─────────────────────────────────────────────────────────────────

interface LeadsTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum lead encontrado"
        description="Tente ajustar os filtros ou crie um novo lead."
      />
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Empresa</TableHead>
            <TableHead className="hidden lg:table-cell">Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Responsável</TableHead>
            <TableHead className="hidden xl:table-cell">Criado em</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="group">
              {/* Nome */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-indigo-600/20 text-xs text-indigo-400">
                      {initials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="truncate font-medium hover:text-indigo-400 hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Empresa */}
              <TableCell className="hidden md:table-cell">
                <span className="text-sm text-muted-foreground">
                  {lead.company ?? '—'}
                </span>
              </TableCell>

              {/* Cargo */}
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm text-muted-foreground">
                  {lead.position ?? '—'}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>

              {/* Responsável */}
              <TableCell className="hidden sm:table-cell">
                {lead.owner ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-zinc-700 text-[10px]">
                        {initials(lead.owner.full_name ?? lead.owner.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {lead.owner.full_name ?? lead.owner.email}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Data */}
              <TableCell className="hidden xl:table-cell">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(lead.created_at), "d 'de' MMM, yyyy", {
                    locale: ptBR,
                  })}
                </span>
              </TableCell>

              {/* Ações */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      render={
                        <Link href={`/leads/${lead.id}`} className="gap-2" />
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver detalhe
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(lead)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(lead)}
                      className="gap-2 text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
