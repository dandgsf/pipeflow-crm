'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { canAddLead } from '@/lib/limits'
import type { LeadStatus } from '@/types'

const leadSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional().default(''),
  company: z.string().max(200).optional().default(''),
  position: z.string().max(200).optional().default(''),
  status: z.enum(['novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido']),
  owner_id: z.string().uuid().or(z.literal('')),
  estimated_value: z.number().min(0).max(999_999_999).optional(),
  notes: z.string().max(5000).optional().default(''),
})

const idSchema = z.string().uuid()

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
  const parsed = leadSchema.safeParse(payload)
  if (!parsed.success) return { error: 'Dados inválidos.' }

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  // Verificar limite do plano
  const { allowed, current, limit } = await canAddLead()
  if (!allowed) {
    return {
      error: `Limite de ${limit} leads atingido (${current}/${limit}). Faça upgrade para o plano Pro.`,
    }
  }

  const d = parsed.data
  const { error } = await supabase.from('leads').insert({
    workspace_id: workspace.id,
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    company: d.company || null,
    position: d.position || null,
    status: d.status,
    owner_id: d.owner_id || null,
    estimated_value: d.estimated_value ?? null,
    notes: d.notes || null,
  })

  if (error) return { error: 'Erro ao criar lead. Tente novamente.' }

  revalidatePath('/leads')
  return { success: true }
}

export async function updateLeadAction(id: string, payload: LeadFormPayload) {
  const parsedId = idSchema.safeParse(id)
  const parsed = leadSchema.safeParse(payload)
  if (!parsedId.success || !parsed.success) return { error: 'Dados inválidos.' }

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
  const parsedId = idSchema.safeParse(id)
  if (!parsedId.success) return { error: 'ID inválido.' }

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
