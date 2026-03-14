"use client";

import { useState, useEffect, useCallback } from "react";
import { DealWithLead } from "@/types/database";

export function useDeals() {
  const [deals, setDeals] = useState<DealWithLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deals");
      if (!res.ok) throw new Error("Erro ao carregar negócios");
      const data = await res.json();
      setDeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  async function moveStage(dealId: string, stage: string) {
    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: stage as DealWithLead["stage"] } : d))
    );
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) await fetchDeals(); // rollback on failure
    } catch {
      await fetchDeals();
    }
  }

  async function createDeal(body: Record<string, unknown>) {
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Erro ao criar negócio");
    }
    const newDeal = await res.json();
    setDeals((prev) => [newDeal, ...prev]);
    return newDeal;
  }

  return { deals, setDeals, loading, error, refetch: fetchDeals, moveStage, createDeal };
}
