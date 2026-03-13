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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Negócios com prazo próximo</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {deals.length === 0 ? (
          <p className="px-6 py-4 text-sm text-muted-foreground">
            Nenhum negócio com prazo próximo.
          </p>
        ) : (
          <div className="divide-y">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between px-6 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{deal.title}</p>
                  <p className="text-xs text-muted-foreground">{deal.lead.name}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-600 font-medium">
                    {formatCurrency(deal.value)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {DEAL_STAGE_LABELS[deal.stage]}
                  </Badge>
                  {deal.expected_close_date && (
                    <span className="text-xs text-muted-foreground">
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
