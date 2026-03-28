'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Settings,
  Menu,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { WorkspaceSwitcher } from '@/components/layout/workspace-switcher'
import { cn } from '@/lib/utils'
import type { Workspace } from '@/types'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/settings', label: 'Configurações', icon: Settings },
] as const

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
      style={isActive ? { color: '#CAFF33', backgroundColor: 'rgba(202,255,51,0.08)' } : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'font-medium'
          : 'text-[#8A8A8F] hover:bg-white/[0.03] hover:text-[#E8E8E8]',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )
}

interface SidebarData {
  workspaces: Workspace[]
  activeWorkspace: Workspace
}

function NavContent({
  onLinkClick,
  sidebarData,
}: {
  onLinkClick?: () => void
  sidebarData: SidebarData
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[#1E1E22] px-4">
        {/* Mark: chartreuse square with "P" */}
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] font-display text-base font-extrabold"
          style={{ backgroundColor: '#CAFF33', color: '#0C0C0E' }}
        >
          P
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-semibold text-[#E8E8E8]">PipeFlow</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#555559]">CRM</span>
        </div>
      </div>

      {/* Links principais */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Workspace switcher */}
      <div className="border-t border-[#1E1E22] p-3">
        <WorkspaceSwitcher
          workspaces={sidebarData.workspaces}
          activeWorkspace={sidebarData.activeWorkspace}
        />
      </div>
    </div>
  )
}

function DesktopSidebar({ sidebarData }: { sidebarData: SidebarData }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[#1E1E22] bg-[#141416] md:flex">
      <NavContent sidebarData={sidebarData} />
    </aside>
  )
}

function MobileSidebar({ sidebarData }: { sidebarData?: SidebarData }) {
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
        className="w-60 gap-0 p-0 border-r border-[#1E1E22] bg-[#141416]"
        showCloseButton={false}
      >
        {sidebarData && (
          <NavContent
            onLinkClick={() => setOpen(false)}
            sidebarData={sidebarData}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar({ sidebarData }: { sidebarData: SidebarData }) {
  return <DesktopSidebar sidebarData={sidebarData} />
}

export { MobileSidebar }
