import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { LeadsView } from './leads-view'
import type { Lead, WorkspaceMember } from '@/types'

export const metadata: Metadata = { title: 'Leads' }

export default async function LeadsPage() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  // Busca leads do workspace
  const { data: leadsData } = await supabase
    .from('leads')
    .select(`
      id, workspace_id, name, email, phone, company, position,
      status, owner_id, estimated_value, notes, created_at, updated_at
    `)
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  // Busca membros do workspace
  const { data: membersData } = await supabase
    .from('workspace_members')
    .select('id, workspace_id, user_id, role, created_at')
    .eq('workspace_id', workspace.id)

  // Monta membros — apenas o usuário atual tem email/nome disponíveis via auth.getUser()
  // Os demais membros são identificados pelo user_id até que uma view de perfis seja criada
  const members: WorkspaceMember[] = (membersData ?? []).map((m) => ({
    id: m.id,
    workspace_id: m.workspace_id,
    user_id: m.user_id,
    role: m.role as 'admin' | 'member',
    created_at: m.created_at,
    user: {
      id: m.user_id,
      email: m.user_id === user.id ? (user.email ?? '') : '',
      full_name: m.user_id === user.id
        ? (user.user_metadata?.full_name as string | undefined)
        : undefined,
    },
  }))

  const leads = (leadsData ?? []) as Lead[]

  return (
    <LeadsView
      initialLeads={leads}
      members={members}
      currentUserId={user.id}
    />
  )
}
