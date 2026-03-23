'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ── Dados mockados (substituídos por Supabase no M7) ──────────────────────────

interface MockWorkspace {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro'
  initials: string
}

const MOCK_WORKSPACES: MockWorkspace[] = [
  { id: '1', name: 'Acme Corp', slug: 'acme-corp', plan: 'pro', initials: 'AC' },
  { id: '2', name: 'Startup XYZ', slug: 'startup-xyz', plan: 'free', initials: 'SX' },
  { id: '3', name: 'Meu Negócio', slug: 'meu-negocio', plan: 'free', initials: 'MN' },
]

// ─────────────────────────────────────────────────────────────────────────────

export function WorkspaceSwitcher() {
  const [activeWorkspace, setActiveWorkspace] = useState<MockWorkspace>(
    MOCK_WORKSPACES[0],
  )

  return (
    <DropdownMenu>
      {/* @base-ui não tem asChild — DropdownMenuTrigger já renderiza um <button> */}
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {/* Avatar do workspace */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          {activeWorkspace.initials}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium leading-none">
            {activeWorkspace.name}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground capitalize">
            Plano {activeWorkspace.plan}
          </span>
        </div>

        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        align="start"
        side="top"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>

        {MOCK_WORKSPACES.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onSelect={() => setActiveWorkspace(workspace)}
            className="gap-2.5 py-2"
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/20 text-xs font-semibold text-primary">
              {workspace.initials}
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{workspace.name}</span>
              <span className="text-xs text-muted-foreground capitalize">
                Plano {workspace.plan}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {workspace.plan === 'pro' && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 py-0 text-[10px] font-semibold text-primary"
                >
                  PRO
                </Badge>
              )}
              <Check
                className={cn(
                  'h-3.5 w-3.5 text-primary',
                  activeWorkspace.id === workspace.id ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2.5 py-2 text-muted-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm">Criar workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
