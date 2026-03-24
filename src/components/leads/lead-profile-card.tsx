import { Mail, Phone, Building2, Briefcase, DollarSign, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import type { Lead } from '@/types'

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

// ── Sub-componente de linha de info ────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

interface LeadProfileCardProps {
  lead: Lead
}

export function LeadProfileCard({ lead }: LeadProfileCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        {/* Avatar + nome + status */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-indigo-600/20 text-lg text-indigo-400">
              {initials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-tight">{lead.name}</h3>
            {lead.position && (
              <p className="text-xs text-muted-foreground">{lead.position}</p>
            )}
            {lead.company && (
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            )}
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4">
        {/* Contato */}
        <div className="space-y-3">
          <InfoRow icon={Mail} label="E-mail" value={lead.email} />
          {lead.phone && (
            <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
          )}
          {lead.company && (
            <InfoRow icon={Building2} label="Empresa" value={lead.company} />
          )}
          {lead.position && (
            <InfoRow icon={Briefcase} label="Cargo" value={lead.position} />
          )}
        </div>

        <Separator />

        {/* Negócio */}
        <div className="space-y-3">
          {lead.estimated_value !== undefined && lead.estimated_value > 0 && (
            <InfoRow
              icon={DollarSign}
              label="Valor estimado"
              value={formatCurrency(lead.estimated_value)}
            />
          )}
          {lead.owner && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="bg-zinc-700 text-[9px]">
                    {initials(lead.owner.full_name ?? lead.owner.email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Responsável</p>
                <p className="truncate text-sm font-medium">
                  {lead.owner.full_name ?? lead.owner.email}
                </p>
              </div>
            </div>
          )}
          <InfoRow
            icon={Calendar}
            label="Criado em"
            value={format(new Date(lead.created_at), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          />
        </div>

        {/* Notas */}
        {lead.notes && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Notas</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {lead.notes}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
