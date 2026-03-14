"use client";

import { useState, useEffect, useCallback } from "react";
import { LeadWithCounts } from "@/types/database";

interface UseLeadsOptions {
  search?: string;
  status?: string;
  assigned_to?: string;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<LeadWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.search) params.set("search", options.search);
      if (options.status && options.status !== "all") params.set("status", options.status);
      if (options.assigned_to && options.assigned_to !== "all") params.set("assigned_to", options.assigned_to);

      const res = await fetch(`/api/leads?${params}`);
      if (!res.ok) throw new Error("Erro ao carregar leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [options.search, options.status, options.assigned_to]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function createLead(body: Record<string, string>) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Erro ao criar lead");
    }
    await fetchLeads();
    return res.json();
  }

  return { leads, loading, error, refetch: fetchLeads, createLead };
}
