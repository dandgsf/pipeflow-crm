import type { Metadata } from 'next'
import { SettingsTab } from '@/components/settings/settings-tab'

export const metadata: Metadata = { title: 'Configurações' }

const TABS = [
  { href: '/settings/workspace', label: 'Workspace' },
  { href: '/settings/members', label: 'Membros' },
  { href: '/settings/billing', label: 'Assinatura' },
] as const

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Configurações</h1>
        <p className="mt-1 text-sm text-[#888]">Gerencie o workspace e os membros da equipe</p>
      </div>

      {/* Tab navigation */}
      <nav className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 border-b border-[#1E1E22]">
          {TABS.map((tab) => (
            <SettingsTab key={tab.href} href={tab.href} label={tab.label} />
          ))}
        </div>
      </nav>

      {children}
    </div>
  )
}
