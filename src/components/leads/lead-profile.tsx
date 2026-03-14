"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadStatusBadge } from "./lead-status-badge";
import { LeadWithCounts, DealWithLead, DEAL_STAGE_LABELS } from "@/types/database";
import { getMemberName } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Link2,
  Calendar,
  User,
} from "lucide-react";

interface LeadProfileProps {
  lead: LeadWithCounts;
  deals: DealWithLead[];
}

export function LeadProfile({ lead, deals }: LeadProfileProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-pf-surface border-pf-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-pf-text">{lead.name}</CardTitle>
              <div className="mt-2">
                <LeadStatusBadge status={lead.status} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lead.email && (
            <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
              <Mail className="h-4 w-4 text-pf-text-muted" />
              <a href={`mailto:${lead.email}`} className="text-pf-accent hover:underline">
                {lead.email}
              </a>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
              <Phone className="h-4 w-4 text-pf-text-muted" />
              <a href={`tel:${lead.phone}`} className="text-pf-accent hover:underline">
                {lead.phone}
              </a>
            </div>
          )}
          {lead.company && (
            <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
              <Building2 className="h-4 w-4 text-pf-text-muted" />
              <span>{lead.company}</span>
            </div>
          )}
          {lead.position && (
            <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
              <Briefcase className="h-4 w-4 text-pf-text-muted" />
              <span>{lead.position}</span>
            </div>
          )}
          {lead.source && (
            <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
              <Link2 className="h-4 w-4 text-pf-text-muted" />
              <span>{lead.source}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
            <Calendar className="h-4 w-4 text-pf-text-muted" />
            <span>Criado em {formatDate(lead.created_at)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-pf-text-secondary">
            <User className="h-4 w-4 text-pf-text-muted" />
            <span>{getMemberName(lead.assigned_to)}</span>
          </div>
        </CardContent>
      </Card>

      {lead.notes && (
        <Card className="bg-pf-surface border-pf-border">
          <CardHeader>
            <CardTitle className="text-base text-pf-text">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-pf-text-secondary whitespace-pre-wrap">{lead.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-pf-surface border-pf-border">
        <CardHeader>
          <CardTitle className="text-base text-pf-text">
            Negócios ({deals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <p className="text-sm text-pf-text-muted">Nenhum negócio vinculado.</p>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between rounded-lg border border-pf-border-subtle bg-pf-surface-2 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-pf-text">{deal.title}</p>
                    <p className="text-xs text-pf-text-muted">
                      {DEAL_STAGE_LABELS[deal.stage]}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-pf-positive/20 text-pf-positive">
                    {formatCurrency(deal.value)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
