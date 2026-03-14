"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DealWithLead, DEAL_STAGE_LABELS } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";

interface UpcomingDealsProps {
  deals: DealWithLead[];
}

export function UpcomingDeals({ deals }: UpcomingDealsProps) {
  return (
    <Card className="bg-pf-surface border-pf-border">
      <CardHeader>
        <CardTitle className="text-base text-pf-text">Negócios com prazo próximo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {deals.length === 0 ? (
          <p className="px-6 py-4 text-sm text-pf-text-muted">
            Nenhum negócio com prazo próximo.
          </p>
        ) : (
          <div className="divide-y divide-pf-border">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-pf-surface-2 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-pf-text">{deal.title}</p>
                  <p className="text-xs text-pf-text-muted">{deal.lead.name}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-pf-positive font-medium">
                    {formatCurrency(deal.value)}
                  </span>
                  <Badge variant="outline" className="text-xs border-pf-border text-pf-text-secondary">
                    {DEAL_STAGE_LABELS[deal.stage]}
                  </Badge>
                  {deal.expected_close_date && (
                    <span className="text-xs text-pf-text-muted">
                      {formatDate(deal.expected_close_date)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
