'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import type { LeadStatus } from '@/types'

export interface LeadFormPayload {
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: LeadStatus
  owner_id: string
  estimated_value?: number
  notes?: string
}

export async function createLeadAction(payload: LeadFormPayload) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase.from('leads').insert({
    workspace_id: workspace.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    company: payload.company || null,
    position: payload.position || null,
    status: payload.status,
    owner_id: payload.owner_id || null,
    estimated_value: payload.estimated_value ?? null,
    notes: payload.notes || null,
  })

  if (error) return { error: 'Erro ao criar lead. Tente novamente.' }

  revalidatePath('/leads')
  return { success: true }
}

export async function updateLeadAction(id: string, payload: LeadFormPayload) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase
    .from('leads')
    .update({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      company: payload.company || null,
      position: payload.position || null,
      status: payload.status,
      owner_id: payload.owner_id || null,
      estimated_value: payload.estimated_value ?? null,
      notes: payload.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Erro ao atualizar lead. Tente novamente.' }

  revalidatePath('/leads')
  revalidatePath(`/leads/${id}`)
  return { success: true }
}

export async function deleteLeadAction(id: string) {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspace.id)

  if (error) return { error: 'Erro ao excluir lead. Tente novamente.' }

  revalidatePath('/leads')
  return { success: true }
}
