import { getSupabaseServer } from '@/lib/supabase/server'

/**
 * Verifica se o usuário autenticado é admin do workspace.
 * Usado em Server Actions e Server Components para guardar ações sensíveis.
 */
export async function isAdmin(workspaceId: string): Promise<boolean> {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  return data?.role === 'admin'
}

/**
 * Retorna o role do usuário no workspace, ou null se não for membro.
 */
export async function getMemberRole(
  workspaceId: string,
): Promise<'admin' | 'member' | null> {
  const supabase = await getSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  return (data?.role as 'admin' | 'member') ?? null
}
