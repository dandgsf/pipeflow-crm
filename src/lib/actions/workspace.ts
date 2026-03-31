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

  // Tenta o RPC atômico primeiro (SECURITY DEFINER bypassa RLS).
  // Se falhar (ex: função não existe ou problema de permissão),
  // faz os INSERTs diretos como fallback.
  type WorkspaceRow = { workspace_id: string }
  const rpcResult = await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: WorkspaceRow[] | null; error: unknown }>
  }).rpc('create_workspace', {
    p_name: name,
    p_slug: slug,
  })

  let workspaceId: string

  if (!rpcResult.error && rpcResult.data && rpcResult.data.length > 0) {
    // RPC funcionou
    workspaceId = rpcResult.data[0].workspace_id
  } else {
    // Fallback: INSERTs diretos (sem transação atômica, mas funcional)
    console.warn('[create-workspace] RPC falhou, usando fallback direto:', JSON.stringify(rpcResult.error))

    // 1. Criar workspace
    const { data: ws, error: wsErr } = await supabase
      .from('workspaces')
      .insert({ name, slug })
      .select('id')
      .single()

    if (wsErr || !ws) {
      console.error('[create-workspace] INSERT workspaces falhou:', wsErr)
      return { error: 'Não foi possível criar o workspace. Tente novamente.' }
    }

    workspaceId = ws.id

    // 2. Adicionar criador como admin
    const { error: memberErr } = await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspaceId, user_id: user.id, role: 'admin' as const })

    if (memberErr) {
      console.error('[create-workspace] INSERT workspace_members falhou:', memberErr)
      // Limpar workspace órfão
      await supabase.from('workspaces').delete().eq('id', workspaceId)
      return { error: 'Não foi possível criar o workspace. Tente novamente.' }
    }

    // 3. Criar subscription free (pode falhar se policy bloqueia —
    //    nesse caso o workspace funciona, subscription será criada depois)
    const { error: subErr } = await supabase
      .from('subscriptions')
      .insert({ workspace_id: workspaceId, plan: 'free' as const })

    if (subErr) {
      // Não fatal: workspace já existe e funciona.
      // A subscription será criada no primeiro checkout ou pode ser inserida manualmente.
      console.warn('[create-workspace] INSERT subscriptions falhou (não fatal):', subErr)
    }
  }

  // Define como workspace ativo no cookie
  await setActiveWorkspace(workspaceId)

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
