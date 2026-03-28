import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { LeadDetailView } from './lead-detail-view'
import type { Lead, Activity } from '@/types'

// ── Metadata dinâmica ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('leads')
    .select('name')
    .eq('id', id)
    .single()
  return { title: data?.name ?? 'Lead não encontrado' }
}

// ── Página ─────────────────────────────────────────────────────────────────────

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace()
  if (!workspace) redirect('/onboarding')

  const { data: leadData } = await supabase
    .from('leads')
    .select(`
      id, workspace_id, name, email, phone, company, position,
      status, owner_id, estimated_value, notes, created_at, updated_at
    `)
    .eq('id', id)
    .eq('workspace_id', workspace.id)
    .single()

  if (!leadData) notFound()

  const { data: activitiesData } = await supabase
    .from('activities')
    .select('id, workspace_id, lead_id, type, title, description, occurred_at, created_by, created_at')
    .eq('lead_id', id)
    .eq('workspace_id', workspace.id)
    .order('occurred_at', { ascending: false })

  const lead = leadData as Lead
  const activities = (activitiesData ?? []) as Activity[]

  return (
    <LeadDetailView
      lead={lead}
      activities={activities}
      currentUserId={user.id}
    />
  )
}
