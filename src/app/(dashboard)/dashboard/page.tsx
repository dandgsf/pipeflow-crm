"use client";

import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { WeeklyLeadsChart } from "@/components/dashboard/weekly-leads-chart";
import { UpcomingDeals } from "@/components/dashboard/upcoming-deals";
import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return <p className="p-6 text-sm text-destructive">{error ?? "Erro ao carregar dashboard"}</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <MetricsCards metrics={data.metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FunnelChart data={data.funnel_data} />
        <WeeklyLeadsChart data={data.weekly_leads} />
      </div>

      <UpcomingDeals deals={data.upcoming_deals} />
    </div>
  );
}
