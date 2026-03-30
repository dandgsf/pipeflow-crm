'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { setActiveWorkspace } from '@/lib/workspace'
import { canCreateWorkspace } from '@/lib/limits'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

export async function createWorkspaceAction(name: string) {
  const supabase = await getSupabaseServer()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) redirect('/login')

  // Verificar limite de workspaces do plano
  const { allowed, current, limit } = await canCreateWorkspace()
  if (!allowed) {
    return {
      error: `Limite de ${limit} workspace${limit === 1 ? '' : 's'} atingido (${current}/${limit}). Faça upgrade para o plano Pro para criar mais workspaces.`,
    }
  }

  // Gera slug único com sufixo aleatório
  const baseSlug = generateSlug(name)
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`

  // RPC atômica: cria workspace + insere membro admin em uma transação.
  // Se qualquer etapa falhar, o Postgres faz rollback automaticamente —
  // sem risco de workspace órfão.
  // Nota: supabase.ts gerado não inclui RPCs customizadas ainda.
  // Usar `as unknown` para contornar o tipo restrito até regenerar os tipos.
  type WorkspaceRow = { workspace_id: string }
  const rpcResult = await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: WorkspaceRow[] | null; error: unknown }>
  }).rpc('create_workspace', {
    p_name: name,
    p_slug: slug,
    p_user_id: user.id,
  })

  if (rpcResult.error || !rpcResult.data || rpcResult.data.length === 0) {
    return { error: 'Não foi possível criar o workspace. Tente novamente.' }
  }

  // Define como workspace ativo no cookie
  await setActiveWorkspace(rpcResult.data[0].workspace_id)

  redirect('/dashboard')
}

export async function switchWorkspaceAction(workspaceId: string) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verifica que o usuário é membro desse workspace
  const { data: member } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!member) return { error: 'Acesso negado.' }

  await setActiveWorkspace(workspaceId)
  redirect('/dashboard')
}

export async function signOutAction() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
  redirect('/login')
}
