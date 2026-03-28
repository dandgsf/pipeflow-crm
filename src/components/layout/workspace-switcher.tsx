'use client'

import { useTransition } from 'react'
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { switchWorkspaceAction } from '@/lib/actions/workspace'
import type { Workspace } from '@/types'

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
  activeWorkspace: Workspace
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function WorkspaceSwitcher({ workspaces, activeWorkspace }: WorkspaceSwitcherProps) {
  const [isPending, startTransition] = useTransition()

  function handleSwitch(workspaceId: string) {
    if (workspaceId === activeWorkspace.id) return
    startTransition(() => {
      switchWorkspaceAction(workspaceId)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {/* Avatar do workspace */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            getInitials(activeWorkspace.name)
          )}
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
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Workspaces
          </DropdownMenuLabel>

          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => handleSwitch(workspace.id)}
              className="gap-2.5 py-2"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/20 text-xs font-semibold text-primary">
                {getInitials(workspace.name)}
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
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2.5 py-2 text-muted-foreground" disabled>
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-border">
            <Plus className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm">Criar workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
