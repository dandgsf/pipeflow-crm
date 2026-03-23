import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { DarkModeEnforcer } from '@/components/layout/dark-mode-enforcer'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | PipeFlow CRM',
  },
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark flex h-screen overflow-hidden bg-background text-foreground">
      {/* Garante dark mode em portais (@base-ui renderiza fora do wrapper) */}
      <DarkModeEnforcer />

      {/* Sidebar fixa — visível em md+, vira Sheet no mobile */}
      <Sidebar />

      {/* Área de conteúdo principal */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
