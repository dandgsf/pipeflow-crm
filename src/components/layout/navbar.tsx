'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button, buttonVariants } from '@/components/ui/button'
import { MobileSidebar } from '@/components/layout/sidebar'
import { signOutAction } from '@/lib/actions/workspace'
import type { Workspace } from '@/types'

// ── Mapa de títulos por rota ──────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/pipeline': 'Pipeline',
  '/settings': 'Configurações',
  '/settings/workspace': 'Configurações do Workspace',
  '/settings/billing': 'Planos & Cobrança',
}

function usePageTitle() {
  const pathname = usePathname()
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  const match = Object.keys(ROUTE_TITLES)
    .filter((r) => pathname.startsWith(r))
    .sort((a, b) => b.length - a.length)[0]
  return match ? ROUTE_TITLES[match] : 'PipeFlow'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

// ─────────────────────────────────────────────────────────────────────────────

interface NavbarProps {
  user: {
    name: string
    email: string
    avatarUrl?: string
  }
  sidebarData: {
    workspaces: Workspace[]
    activeWorkspace: Workspace
    canCreateWorkspace: boolean
  }
}

export function Navbar({ user, sidebarData }: NavbarProps) {
  const pageTitle = usePageTitle()
  const initials = getInitials(user.name || user.email)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
      {/* Hamburguer — apenas mobile */}
      <MobileSidebar sidebarData={sidebarData} />

      {/* Título da página */}
      <h1 className="flex-1 text-sm font-semibold md:text-base">{pageTitle}</h1>

      {/* Ações à direita */}
      <div className="flex items-center gap-1">
        {/* Notificações (placeholder) */}
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Menu do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'flex items-center gap-2 px-2',
                })}
                aria-label="Menu do usuário"
              />
            }
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:block">
              {(user.name || user.email).split(' ')[0]}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{user.name || 'Usuário'}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                className="gap-2"
                onClick={() => signOutAction()}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
