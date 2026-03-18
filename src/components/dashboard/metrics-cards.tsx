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
      color: "text-pf-cool",
      bg: "bg-pf-cool/10",
    },
    {
      label: "Negócios Abertos",
      value: metrics.open_deals.toString(),
      icon: Briefcase,
      color: "text-pf-warm",
      bg: "bg-pf-warm/10",
    },
    {
      label: "Valor do Pipeline",
      value: formatCurrency(metrics.pipeline_value),
      icon: TrendingUp,
      color: "text-pf-positive",
      bg: "bg-pf-positive/10",
    },
    {
      label: "Taxa de Conversão",
      value: `${metrics.conversion_rate.toFixed(1)}%`,
      icon: Percent,
      color: "text-pf-accent",
      bg: "bg-pf-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pf-stagger">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="pf-glass rounded-xl flex items-center gap-4 p-5">
          <div className={`rounded-lg p-2.5 ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-pf-text-muted">{label}</p>
            <p className="font-display text-xl font-bold text-pf-text">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
