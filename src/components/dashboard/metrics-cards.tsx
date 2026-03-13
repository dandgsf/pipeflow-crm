"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardMetrics } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { Users, Briefcase, TrendingUp, Percent } from "lucide-react";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      label: "Total de Leads",
      value: metrics.total_leads.toString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Negócios Abertos",
      value: metrics.open_deals.toString(),
      icon: Briefcase,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Valor do Pipeline",
      value: formatCurrency(metrics.pipeline_value),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Taxa de Conversão",
      value: `${metrics.conversion_rate.toFixed(1)}%`,
      icon: Percent,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-lg p-2.5 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
