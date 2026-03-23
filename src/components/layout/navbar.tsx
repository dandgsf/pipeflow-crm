'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button, buttonVariants } from '@/components/ui/button'
import { MobileSidebar } from '@/components/layout/sidebar'

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

// ── Mock do usuário (substituído por Supabase no M7) ─────────────────────────

const MOCK_USER = {
  name: 'João Silva',
  email: 'joao@acmecorp.com',
  avatarUrl: '',
  initials: 'JS',
}

// ─────────────────────────────────────────────────────────────────────────────

export function Navbar() {
  const pageTitle = usePageTitle()

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
      {/* Hamburguer — apenas mobile */}
      <MobileSidebar />

      {/* Título da página */}
      <h1 className="flex-1 text-sm font-semibold md:text-base">{pageTitle}</h1>

      {/* Ações à direita */}
      <div className="flex items-center gap-1">
        {/* Notificações (placeholder) */}
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Menu do usuário — @base-ui usa render prop em vez de asChild */}
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
              <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
              <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary">
                {MOCK_USER.initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:block">
              {MOCK_USER.name.split(' ')[0]}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{MOCK_USER.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {MOCK_USER.email}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
