"use client";

import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { WeeklyLeadsChart } from "@/components/dashboard/weekly-leads-chart";
import { UpcomingDeals } from "@/components/dashboard/upcoming-deals";
import { MOCK_LEADS, MOCK_DEALS } from "@/lib/mock-data";
import {
  DashboardMetrics,
  FunnelData,
  WeeklyLeadsData,
  DEAL_STAGE_LABELS,
  DEAL_STAGE_ORDER,
} from "@/types/database";

// ---------- Compute mock metrics ----------

function computeMetrics(): DashboardMetrics {
  const openDeals = MOCK_DEALS.filter(
    (d) => d.stage !== "closed_won" && d.stage !== "closed_lost"
  );
  const closedDeals = MOCK_DEALS.filter(
    (d) => d.stage === "closed_won" || d.stage === "closed_lost"
  );
  const wonDeals = MOCK_DEALS.filter((d) => d.stage === "closed_won");

  return {
    total_leads: MOCK_LEADS.length,
    open_deals: openDeals.length,
    pipeline_value: openDeals.reduce((s, d) => s + d.value, 0),
    conversion_rate:
      closedDeals.length > 0
        ? (wonDeals.length / closedDeals.length) * 100
        : 0,
  };
}

function computeFunnel(): FunnelData[] {
  return DEAL_STAGE_ORDER.map((stage) => ({
    stage,
    stage_label: DEAL_STAGE_LABELS[stage],
    count: MOCK_DEALS.filter((d) => d.stage === stage).length,
    value: MOCK_DEALS.filter((d) => d.stage === stage).reduce(
      (s, d) => s + d.value,
      0
    ),
  })).filter((f) => f.count > 0);
}

function computeWeeklyLeads(): WeeklyLeadsData[] {
  const now = new Date();
  const weeks: WeeklyLeadsData[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7 - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const count = MOCK_LEADS.filter((l) => {
      const d = new Date(l.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;

    const label = `${String(weekStart.getDate()).padStart(2, "0")}/${String(weekStart.getMonth() + 1).padStart(2, "0")}`;
    weeks.push({ week: label, count });
  }

  return weeks;
}

function getUpcomingDeals() {
  return MOCK_DEALS.filter(
    (d) =>
      d.expected_close_date &&
      d.stage !== "closed_won" &&
      d.stage !== "closed_lost"
  )
    .sort(
      (a, b) =>
        new Date(a.expected_close_date!).getTime() -
        new Date(b.expected_close_date!).getTime()
    )
    .slice(0, 5);
}

export default function DashboardPage() {
  const metrics = computeMetrics();
  const funnelData = computeFunnel();
  const weeklyData = computeWeeklyLeads();
  const upcomingDeals = getUpcomingDeals();

  return (
    <div className="space-y-6 p-6">
      <MetricsCards metrics={metrics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FunnelChart data={funnelData} />
        <WeeklyLeadsChart data={weeklyData} />
      </div>

      <UpcomingDeals deals={upcomingDeals} />
    </div>
  );
}
