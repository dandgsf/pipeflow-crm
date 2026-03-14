"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Subscription,
  SubscriptionPlan,
  PLAN_LIMITS,
} from "@/types/database";

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  plan: SubscriptionPlan;
  loading: boolean;
  error: string | null;
  isFreePlan: boolean;
  limits: { max_members: number; max_leads: number };
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription");
      if (!res.ok) throw new Error("Erro ao carregar assinatura");
      const data = await res.json();
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const plan: SubscriptionPlan = subscription?.plan ?? "free";
  const isFreePlan = plan === "free";
  const limits = PLAN_LIMITS[plan];

  return {
    subscription,
    plan,
    loading,
    error,
    isFreePlan,
    limits,
    refetch: fetchSubscription,
  };
}
