'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadProfileCard } from '@/components/leads/lead-profile-card'
import { ActivityTimeline } from '@/components/leads/activity-timeline'
import { LeadFormDialog, type LeadSavePayload } from '@/components/leads/lead-form-dialog'
import { ActivityFormDialog, type ActivitySavePayload } from '@/components/leads/activity-form-dialog'
import { updateLeadAction } from '@/lib/actions/leads'
import { createActivityAction } from '@/lib/actions/activities'
import { cn } from '@/lib/utils'
import type { Lead, Activity } from '@/types'

// ── Componente ─────────────────────────────────────────────────────────────────

interface LeadDetailViewProps {
  lead: Lead
  activities: Activity[]
  currentUserId: string
}

export function LeadDetailView({
  lead: initialLead,
  activities: initialActivities,
  currentUserId,
}: LeadDetailViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [lead, setLead] = useState(initialLead)
  const [activities, setActivities] = useState(initialActivities)
  const [editOpen, setEditOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)

  function handleSave(values: LeadSavePayload) {
    setLead((prev) => ({ ...prev, ...values, updated_at: new Date().toISOString() }))

    startTransition(async () => {
      const result = await updateLeadAction(lead.id, values)
      if (result?.error) {
        // Reverte para o estado original em caso de falha
        setLead(initialLead)
      } else {
        router.refresh()
      }
    })
  }

  function handleSaveActivity(payload: ActivitySavePayload) {
    startTransition(async () => {
      const result = await createActivityAction(lead.id, payload)
      if (!result?.error) router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/leads"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'shrink-0')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight truncate">{lead.name}</h2>
            {lead.company && (
              <p className="text-sm text-muted-foreground truncate">{lead.company}</p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
          className="gap-1.5 self-start sm:self-auto shrink-0"
          disabled={isPending}
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar Lead
        </Button>
      </div>

      {/* Layout em grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Coluna esquerda — perfil */}
        <div className="space-y-4">
          <LeadProfileCard lead={lead} />
        </div>

        {/* Coluna direita — atividades */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">
                Atividades
                {activities.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({activities.length})
                  </span>
                )}
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 self-start sm:self-auto"
                onClick={() => setActivityOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Registrar atividade
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de edição do lead */}
      <LeadFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        lead={lead}
        onSave={handleSave}
        currentUserId={currentUserId}
      />

      {/* Dialog de nova atividade */}
      <ActivityFormDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        onSave={handleSaveActivity}
      />
    </div>
  )
}
