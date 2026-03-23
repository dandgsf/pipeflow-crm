'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Settings,
  Workflow,
  Menu,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher'
import { cn } from '@/lib/utils'

// ── Itens de navegação ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/settings', label: 'Configurações', icon: Settings },
] as const

// ── Link de navegação com estado ativo ────────────────────────────────────────

interface NavLinkProps {
  href: string
  label: string
  icon: React.ElementType
  onClick?: () => void
}

function NavLink({ href, label, icon: Icon, onClick }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : '')} />
      {label}
    </Link>
  )
}

// ── Conteúdo da navegação (compartilhado entre desktop e Sheet mobile) ────────

function NavContent({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Workflow className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold tracking-tight">PipeFlow</span>
      </div>

      {/* Links principais */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Workspace switcher */}
      <div className="border-t border-border p-3">
        <WorkspaceSwitcher />
      </div>
    </div>
  )
}

// ── Sidebar desktop ───────────────────────────────────────────────────────────

function DesktopSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <NavContent />
    </aside>
  )
}

// ── Sidebar mobile (Sheet com estado controlado) ──────────────────────────────

function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'md:hidden',
        )}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-60 gap-0 p-0 bg-sidebar border-r border-border"
        showCloseButton={false}
      >
        {/* onLinkClick fecha o Sheet após navegação */}
        <NavContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function Sidebar() {
  return <DesktopSidebar />
}

export { MobileSidebar }
