import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MOCK_LEADS, MOCK_ACTIVITIES } from '@/lib/mock/leads'
import { LeadDetailView } from './lead-detail-view'

// ── Metadata dinâmica ──────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const lead = MOCK_LEADS.find((l) => l.id === id)
  return { title: lead?.name ?? 'Lead não encontrado' }
}

// ── Página ─────────────────────────────────────────────────────────────────────

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = MOCK_LEADS.find((l) => l.id === id)

  if (!lead) notFound()

  const activities = MOCK_ACTIVITIES[id] ?? []

  return <LeadDetailView lead={lead} activities={activities} />
}
