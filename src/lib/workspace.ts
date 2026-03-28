import { cookies } from 'next/headers'
import { getSupabaseServer } from '@/lib/supabase/server'
import type { Workspace } from '@/types'

const WORKSPACE_COOKIE = 'pipeflow_workspace_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

// ── Server helpers ─────────────────────────────────────────────────────────────

/**
 * Retorna { workspaces, activeWorkspace } em uma única query.
 * Usar no layout para evitar roundtrips duplicados.
 */
export async function getWorkspaceContext(): Promise<{
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
}> {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { workspaces: [], activeWorkspace: null }

  const cookieStore = await cookies()
  const workspaceId = cookieStore.get(WORKSPACE_COOKIE)?.value

  const { data: members } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(id, name, slug, plan, created_at)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!members || members.length === 0) {
    return { workspaces: [], activeWorkspace: null }
  }

  const workspaces = members
    .map((m) => m.workspaces as Workspace | null)
    .filter((w): w is Workspace => w !== null)

  if (workspaces.length === 0) return { workspaces: [], activeWorkspace: null }

  const activeWorkspace = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0]

  return { workspaces, activeWorkspace }
}

/**
 * Retorna o workspace ativo (conveniência — usa getWorkspaceContext internamente).
 */
export async function getActiveWorkspace(): Promise<Workspace | null> {
  const { activeWorkspace } = await getWorkspaceContext()
  return activeWorkspace
}

/**
 * Retorna todos os workspaces do usuário autenticado.
 */
export async function getUserWorkspaces(): Promise<Workspace[]> {
  const { workspaces } = await getWorkspaceContext()
  return workspaces
}

/**
 * Define o workspace ativo no cookie (chamar dentro de Server Action ou Route Handler).
 */
export async function setActiveWorkspace(workspaceId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(WORKSPACE_COOKIE, workspaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export { WORKSPACE_COOKIE }
