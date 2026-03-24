import { Phone, Mail, Users, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Activity, ActivityType } from '@/types'

// ── Config por tipo ────────────────────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<
  ActivityType,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    iconClass: string
    bgClass: string
  }
> = {
  call: {
    icon: Phone,
    label: 'Ligação',
    iconClass: 'text-blue-400',
    bgClass: 'bg-blue-900/40 border-blue-800',
  },
  email: {
    icon: Mail,
    label: 'E-mail',
    iconClass: 'text-violet-400',
    bgClass: 'bg-violet-900/40 border-violet-800',
  },
  meeting: {
    icon: Users,
    label: 'Reunião',
    iconClass: 'text-amber-400',
    bgClass: 'bg-amber-900/40 border-amber-800',
  },
  note: {
    icon: FileText,
    label: 'Nota',
    iconClass: 'text-slate-400',
    bgClass: 'bg-slate-800/40 border-slate-700',
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ── Componente ─────────────────────────────────────────────────────────────────

interface ActivityItemProps {
  activity: Activity
  isLast?: boolean
}

export function ActivityItem({ activity, isLast = false }: ActivityItemProps) {
  const config = ACTIVITY_CONFIG[activity.type]
  const Icon = config.icon

  return (
    <div className="relative flex gap-4">
      {/* Linha da timeline */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 h-full w-px bg-border" />
      )}

      {/* Ícone do tipo */}
      <div
        className={cn(
          'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
          config.bgClass,
        )}
      >
        <Icon className={cn('h-4 w-4', config.iconClass)} />
      </div>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {config.label}
            </span>
            <h4 className="mt-0.5 text-sm font-medium">{activity.title}</h4>
          </div>
          <time className="shrink-0 text-xs text-muted-foreground">
            {format(new Date(activity.occurred_at), "d 'de' MMM, yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </time>
        </div>

        {activity.description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {activity.description}
          </p>
        )}

        {activity.creator && (
          <div className="mt-3 flex items-center gap-1.5">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="bg-zinc-700 text-[9px]">
                {initials(
                  activity.creator.full_name ?? activity.creator.email,
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {activity.creator.full_name ?? activity.creator.email}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
