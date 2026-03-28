import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PIPELINE_STAGES } from '@/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function StageBadge({ stage }: { stage: string }) {
  // Cores por stage (consistente com o Kanban)
  const stageColors: Record<string, string> = {
    novo_lead: '#60a5fa',
    contato_realizado: '#22d3ee',
    proposta_enviada: '#CAFF33',
    negociacao: '#fb923c',
    fechado_ganho: '#4ade80',
    fechado_perdido: '#f87171',
  }
  const found = PIPELINE_STAGES.find((s) => s.id === stage)
  if (!found) return null
  const color = stageColors[stage] ?? '#71717a'
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {found.label}
    </span>
  )
}

function DueDateCell({ dueDate, isOverdue }: { dueDate: string; isOverdue: boolean }) {
  const date = new Date(dueDate)
  const days = differenceInDays(date, new Date())

  return (
    <div className="flex items-center gap-1.5">
      <Clock className={`h-3 w-3 ${isOverdue ? 'text-red-400' : 'text-zinc-500'}`} />
      <span className={`text-xs font-mono ${isOverdue ? 'text-red-400 font-semibold' : 'text-zinc-400'}`}>
        {format(date, 'd MMM', { locale: ptBR })}
      </span>
      {isOverdue ? (
        <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">Vencido</Badge>
      ) : days <= 7 ? (
        <span className="text-[10px] text-amber-400">{days}d</span>
      ) : null}
    </div>
  )
}

export interface UpcomingDealItem {
  id: string
  title: string
  stage: string
  due_date: string
  estimated_value?: number
  isOverdue: boolean
  lead?: { name: string; company?: string }
}

interface UpcomingDealsProps {
  deals: UpcomingDealItem[]
}

export function UpcomingDeals({ deals }: UpcomingDealsProps) {
  if (deals.length === 0) {
    return (
      <p className="text-sm text-zinc-500 text-center py-8">
        Nenhum negócio com prazo definido.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Negócio</th>
            <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4 hidden sm:table-cell">Lead</th>
            <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4 hidden md:table-cell">Etapa</th>
            <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Prazo</th>
            <th className="text-right text-xs font-medium text-zinc-500 pb-3">Valor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {deals.map((deal) => (
            <tr key={deal.id} className="group">
              <td className="py-3 pr-4">
                <Link
                  href="/pipeline"
                  className="font-medium text-zinc-200 group-hover:text-[#CAFF33] transition-colors flex items-center gap-1"
                >
                  {deal.title}
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </td>
              <td className="py-3 pr-4 hidden sm:table-cell">
                <p className="text-zinc-300 text-xs">{deal.lead?.name}</p>
                <p className="text-zinc-600 text-[11px]">{deal.lead?.company}</p>
              </td>
              <td className="py-3 pr-4 hidden md:table-cell">
                <StageBadge stage={deal.stage} />
              </td>
              <td className="py-3 pr-4">
                <DueDateCell dueDate={deal.due_date} isOverdue={deal.isOverdue} />
              </td>
              <td className="py-3 text-right">
                <span className="font-mono text-xs text-zinc-300">
                  {formatCurrency(deal.estimated_value ?? 0)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
