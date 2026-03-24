'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadProfileCard } from '@/components/leads/lead-profile-card'
import { ActivityTimeline } from '@/components/leads/activity-timeline'
import { LeadFormDialog, type LeadSavePayload } from '@/components/leads/lead-form-dialog'
import { cn } from '@/lib/utils'
import type { Lead, Activity } from '@/types'

// ── Componente ─────────────────────────────────────────────────────────────────

interface LeadDetailViewProps {
  lead: Lead
  activities: Activity[]
}

export function LeadDetailView({
  lead: initialLead,
  activities,
}: LeadDetailViewProps) {
  const [lead, setLead] = useState(initialLead)
  const [editOpen, setEditOpen] = useState(false)

  function handleSave(values: LeadSavePayload) {
    setLead((prev) => ({
      ...prev,
      ...values,
      updated_at: new Date().toISOString(),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{lead.name}</h2>
            {lead.company && (
              <p className="text-sm text-muted-foreground">{lead.company}</p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditOpen(true)}
          className="gap-1.5"
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">
                Atividades
                {activities.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({activities.length})
                  </span>
                )}
              </CardTitle>
              {/* Botão ativo no M8 — backend real com Supabase */}
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled
                title="Disponível no M8 — integração com Supabase"
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

      {/* Dialog de edição */}
      <LeadFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        lead={lead}
        onSave={handleSave}
      />
    </div>
  )
}
