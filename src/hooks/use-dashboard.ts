"use client";

import { useState, useEffect } from "react";
import { DashboardMetrics, FunnelData, WeeklyLeadsData, DealWithLead } from "@/types/database";

interface DashboardData {
  metrics: DashboardMetrics;
  funnel_data: FunnelData[];
  weekly_leads: WeeklyLeadsData[];
  upcoming_deals: DealWithLead[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Erro ao carregar dashboard");
        setData(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  return { data, loading, error };
}
