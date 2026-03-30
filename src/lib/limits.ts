'use server'

import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'

const FREE_LEAD_LIMIT = 50
const FREE_MEMBER_LIMIT = 2

/**
 * Verifica se o workspace pode adicionar mais leads.
 * Pro = ilimitado, Free = máximo 50.
 */
export async function canAddLead(workspaceId?: string): Promise<{
  allowed: boolean
  current: number
  limit: number | null
}> {
  const supabase = await getSupabaseServer()
  const workspace = workspaceId
    ? { id: workspaceId, plan: '' as string }
    : await getActiveWorkspace()

  if (!workspace) return { allowed: false, current: 0, limit: FREE_LEAD_LIMIT }

  // Se passamos só o id, buscar o plano
  let plan = (workspace as { plan?: string }).plan
  if (!plan || workspaceId) {
    const { data } = await supabase
      .from('workspaces')
      .select('plan')
      .eq('id', workspace.id)
      .single()
    plan = data?.plan ?? 'free'
  }

  if (plan === 'pro') {
    return { allowed: true, current: 0, limit: null }
  }

  const { count } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)

  const current = count ?? 0
  return {
    allowed: current < FREE_LEAD_LIMIT,
    current,
    limit: FREE_LEAD_LIMIT,
  }
}

/**
 * Verifica se o workspace pode adicionar mais membros.
 * Pro = ilimitado, Free = máximo 2.
 */
export async function canAddMember(workspaceId?: string): Promise<{
  allowed: boolean
  current: number
  limit: number | null
}> {
  const supabase = await getSupabaseServer()
  const workspace = workspaceId
    ? { id: workspaceId, plan: '' as string }
    : await getActiveWorkspace()

  if (!workspace) return { allowed: false, current: 0, limit: FREE_MEMBER_LIMIT }

  let plan = (workspace as { plan?: string }).plan
  if (!plan || workspaceId) {
    const { data } = await supabase
      .from('workspaces')
      .select('plan')
      .eq('id', workspace.id)
      .single()
    plan = data?.plan ?? 'free'
  }

  if (plan === 'pro') {
    return { allowed: true, current: 0, limit: null }
  }

  const { count } = await supabase
    .from('workspace_members')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)

  const current = count ?? 0
  return {
    allowed: current < FREE_MEMBER_LIMIT,
    current,
    limit: FREE_MEMBER_LIMIT,
  }
}
