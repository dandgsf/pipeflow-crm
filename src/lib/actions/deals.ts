'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import type { PipelineStage } from '@/types'

export interface DealFormPayload {
  title: string
  lead_id: string
  stage: PipelineStage
  estimated_value?: number
  owner_id: string
  due_date?: string
  notes?: string
}

export async function createDealAction(payload: DealFormPayload) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  // Calcula a próxima posição dentro do stage
  const { count } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspace.id)
    .eq('stage', payload.stage)

  const { error } = await supabase.from('deals').insert({
    workspace_id: workspace.id,
    lead_id: payload.lead_id,
    title: payload.title,
    stage: payload.stage,
    position: count ?? 0,
    estimated_value: payload.estimated_value ?? null,
    owner_id: payload.owner_id || null,
    due_date: payload.due_date || null,
    notes: payload.notes || null,
  })

  if (error) return { error: 'Erro ao criar negócio. Tente novamente.' }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateDealAction(id: string, payload: DealFormPayload) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase
    .from('deals')
    .update({
      lead_id: payload.lead_id,
      title: payload.title,
      stage: payload.stage,
      estimated_value: payload.estimated_value ?? null,
      owner_id: payload.owner_id || null,
      due_date: payload.due_date || null,
      notes: payload.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Erro ao atualizar negócio. Tente novamente.' }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function moveDealAction(id: string, newStage: PipelineStage, newPosition: number) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase
    .from('deals')
    .update({
      stage: newStage,
      position: newPosition,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Erro ao mover negócio.' }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteDealAction(id: string) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Erro ao excluir negócio. Tente novamente.' }

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { success: true }
}
