import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { PipelineView } from './pipeline-view'
import type { Deal, WorkspaceMember } from '@/types'
import type { DealLeadOption } from '@/components/pipeline/deal-form-dialog'

export const metadata: Metadata = { title: 'Pipeline' }

export default async function PipelinePage() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  // Busca deals com join do lead (campos necessários para os cards)
  const { data: dealsData } = await supabase
    .from('deals')
    .select(`
      id, workspace_id, lead_id, title, stage, position,
      estimated_value, owner_id, due_date, notes, created_at, updated_at,
      lead:leads(id, name, company, email)
    `)
    .eq('workspace_id', workspace.id)
    .order('position', { ascending: true })

  // Busca leads para o select do formulário
  const { data: leadsData } = await supabase
    .from('leads')
    .select('id, name, company')
    .eq('workspace_id', workspace.id)
    .order('name', { ascending: true })

  // Busca membros do workspace
  const { data: membersData } = await supabase
    .from('workspace_members')
    .select('id, workspace_id, user_id, role, created_at')
    .eq('workspace_id', workspace.id)

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

  // Normaliza o join do lead (Supabase retorna objeto ou null)
  const deals = (dealsData ?? []).map((d) => {
    const leadJoin = d.lead as { id: string; name: string; company: string | null; email: string } | null
    return {
      ...d,
      lead: leadJoin
        ? { id: leadJoin.id, name: leadJoin.name, company: leadJoin.company ?? undefined, email: leadJoin.email }
        : undefined,
    }
  }) as Deal[]

  const leads: DealLeadOption[] = (leadsData ?? []).map((l) => ({
    id: l.id,
    name: l.name,
    company: l.company ?? undefined,
  }))

  return (
    <PipelineView
      initialDeals={deals}
      leads={leads}
      members={members}
      currentUserId={user.id}
    />
  )
}
