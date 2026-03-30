'use server'

import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'

const FREE_LEAD_LIMIT = 50
const FREE_MEMBER_LIMIT = 2
const FREE_WORKSPACE_LIMIT = 1

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
 * Verifica se o usuário pode criar mais workspaces.
 * Admin de ao menos 1 workspace Pro = ilimitado.
 * Senão = máximo 1 workspace como admin.
 */
export async function canCreateWorkspace(): Promise<{
  allowed: boolean
  current: number
  limit: number | null
}> {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { allowed: false, current: 0, limit: FREE_WORKSPACE_LIMIT }

  // Buscar workspaces onde o usuário é ADMIN (com plano)
  const { data: adminMemberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(plan)')
    .eq('user_id', user.id)
    .eq('role', 'admin')

  if (!adminMemberships || adminMemberships.length === 0) {
    return { allowed: true, current: 0, limit: FREE_WORKSPACE_LIMIT }
  }

  const current = adminMemberships.length
  const hasProWorkspace = adminMemberships.some(
    (m) => (m.workspaces as unknown as { plan: string } | null)?.plan === 'pro'
  )

  if (hasProWorkspace) {
    return { allowed: true, current, limit: null }
  }

  return {
    allowed: current < FREE_WORKSPACE_LIMIT,
    current,
    limit: FREE_WORKSPACE_LIMIT,
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
