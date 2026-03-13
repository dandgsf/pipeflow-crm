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
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{lead.name}</CardTitle>
              <div className="mt-2">
                <LeadStatusBadge status={lead.status} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lead.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                {lead.email}
              </a>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                {lead.phone}
              </a>
            </div>
          )}
          {lead.company && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{lead.company}</span>
            </div>
          )}
          {lead.position && (
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{lead.position}</span>
            </div>
          )}
          {lead.source && (
            <div className="flex items-center gap-3 text-sm">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span>{lead.source}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Criado em {formatDate(lead.created_at)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{getMemberName(lead.assigned_to)}</span>
          </div>
        </CardContent>
      </Card>

      {lead.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{lead.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Negócios ({deals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum negócio vinculado.</p>
          ) : (
            <div className="space-y-3">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{deal.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {DEAL_STAGE_LABELS[deal.stage]}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
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
