import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'

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
