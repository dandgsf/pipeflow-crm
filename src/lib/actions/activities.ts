'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import type { ActivityType } from '@/types'

const activitySchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'note']),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().default(''),
  occurred_at: z.string().min(1).max(30),
})

const idSchema = z.string().uuid()

export interface ActivityFormPayload {
  type: ActivityType
  title: string
  description?: string
  occurred_at: string
}

export async function createActivityAction(leadId: string, payload: ActivityFormPayload) {
  const parsedId = idSchema.safeParse(leadId)
  const parsed = activitySchema.safeParse(payload)
  if (!parsedId.success || !parsed.success) return { error: 'Dados inválidos.' }

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) return { error: 'Nenhum workspace ativo.' }

  const { error } = await supabase.from('activities').insert({
    workspace_id: workspace.id,
    lead_id: leadId,
    type: payload.type,
    title: payload.title,
    description: payload.description || null,
    occurred_at: payload.occurred_at,
    created_by: user.id,
  })

  if (error) return { error: 'Erro ao registrar atividade. Tente novamente.' }

  revalidatePath(`/leads/${leadId}`)
  return { success: true }
}
