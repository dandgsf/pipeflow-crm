import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { DarkModeEnforcer } from '@/components/layout/dark-mode-enforcer'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getWorkspaceContext } from '@/lib/workspace'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | PipeFlow CRM',
  },
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Uma única query busca workspaces + ativo (regra 6.2 — evitar N+1)
  const { workspaces, activeWorkspace } = await getWorkspaceContext()

  if (!activeWorkspace) redirect('/onboarding')

  const userName = user.user_metadata?.full_name as string | undefined
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined

  const sidebarData = { workspaces, activeWorkspace }

  return (
    <div className="dark flex h-screen overflow-hidden bg-background text-foreground">
      <DarkModeEnforcer />
      <Sidebar sidebarData={sidebarData} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          user={{
            name: userName ?? '',
            email: user.email ?? '',
            avatarUrl,
          }}
          sidebarData={sidebarData}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
