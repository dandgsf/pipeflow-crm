import { ClipboardList } from 'lucide-react'
import { ActivityItem } from '@/components/leads/activity-item'
import type { Activity } from '@/types'

// ── Componente ─────────────────────────────────────────────────────────────────

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Nenhuma atividade ainda</p>
          <p className="text-xs text-muted-foreground">
            Registre ligações, e-mails, reuniões e notas sobre este lead.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}
    </div>
  )
}
