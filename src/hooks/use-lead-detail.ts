"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead, DealWithLead, ActivityWithAuthor } from "@/types/database";

export function useLeadDetail(id: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [deals, setDeals] = useState<DealWithLead[]>([]);
  const [activities, setActivities] = useState<ActivityWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadRes, dealsRes, activitiesRes] = await Promise.all([
        fetch(`/api/leads/${id}`),
        fetch(`/api/deals?lead_id=${id}`),
        fetch(`/api/activities?lead_id=${id}`),
      ]);

      if (!leadRes.ok) throw new Error("Lead não encontrado");

      const [leadData, dealsData, activitiesData] = await Promise.all([
        leadRes.json(),
        dealsRes.json(),
        activitiesRes.json(),
      ]);

      setLead(leadData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function createActivity(body: Record<string, string>) {
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, lead_id: id }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Erro ao registrar atividade");
    }
    await fetchAll();
  }

  return { lead, deals, activities, loading, error, refetch: fetchAll, createActivity };
}
