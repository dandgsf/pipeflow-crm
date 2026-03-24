import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types'

// ── Config de status ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  novo: {
    label: 'Novo',
    className: 'bg-slate-700/60 text-slate-200 border-slate-600',
  },
  contato: {
    label: 'Contato',
    className: 'bg-blue-900/60 text-blue-300 border-blue-700',
  },
  proposta: {
    label: 'Proposta',
    className: 'bg-violet-900/60 text-violet-300 border-violet-700',
  },
  negociacao: {
    label: 'Negociação',
    className: 'bg-amber-900/60 text-amber-300 border-amber-700',
  },
  ganho: {
    label: 'Ganho',
    className: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  },
  perdido: {
    label: 'Perdido',
    className: 'bg-red-900/60 text-red-300 border-red-700',
  },
}

// ── Componente ─────────────────────────────────────────────────────────────────

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
