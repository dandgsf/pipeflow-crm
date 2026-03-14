"use client";

import { useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { Check, Loader2, Sparkles, Zap } from "lucide-react";

const FREE_FEATURES = [
  "Até 50 leads",
  "Até 2 membros",
  "Pipeline Kanban",
  "Dashboard básico",
  "Atividades e notas",
];

const PRO_FEATURES = [
  "Leads ilimitados",
  "Membros ilimitados",
  "Pipeline Kanban avançado",
  "Dashboard completo",
  "Atividades e notas",
  "Relatórios avançados",
  "Suporte prioritário",
  "Integrações premium",
];

export default function PlansPage() {
  const { subscription, plan, loading, isFreePlan } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleUpgrade() {
    if (!subscription?.workspace_id) return;

    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: subscription.workspace_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao criar sessão de checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-pf-text-muted" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-pf-text tracking-tight">
          Planos e Assinatura
        </h1>
        <p className="mt-1 text-sm text-pf-text-secondary">
          Escolha o plano ideal para sua equipe
        </p>
      </div>

      {/* Success / Cancel Messages */}
      {typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("success") && (
          <div className="mb-6 rounded-lg border border-pf-positive/30 bg-pf-positive/10 px-4 py-3">
            <p className="text-sm font-medium text-pf-positive">
              Upgrade realizado com sucesso! Seu plano Pro já está ativo.
            </p>
          </div>
        )}

      {typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("canceled") && (
          <div className="mb-6 rounded-lg border border-pf-text-muted/30 bg-pf-surface-2 px-4 py-3">
            <p className="text-sm text-pf-text-secondary">
              Checkout cancelado. Você pode tentar novamente quando quiser.
            </p>
          </div>
        )}

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan Card */}
        <div
          className={`relative rounded-xl border p-6 transition-colors ${
            !isFreePlan
              ? "border-pf-border-subtle bg-pf-surface"
              : "border-pf-border bg-pf-surface"
          }`}
        >
          {!isFreePlan && (
            <div className="absolute -top-px left-0 right-0 h-px bg-pf-border-subtle" />
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-pf-text">
                Free
              </h2>
              <p className="text-sm text-pf-text-secondary mt-0.5">
                Para começar a explorar
              </p>
            </div>
            {!isFreePlan ? null : (
              <span className="inline-flex items-center rounded-full bg-pf-accent/10 px-2.5 py-0.5 text-xs font-semibold text-pf-accent">
                Plano atual
              </span>
            )}
          </div>

          <div className="mb-6">
            <span className="font-display text-3xl font-bold text-pf-text">
              R$0
            </span>
            <span className="text-sm text-pf-text-muted">/mês</span>
          </div>

          <ul className="space-y-3 mb-6">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <Check className="h-4 w-4 shrink-0 text-pf-text-muted" />
                <span className="text-pf-text-secondary">{feature}</span>
              </li>
            ))}
          </ul>

          {!isFreePlan ? (
            <div className="rounded-lg border border-pf-border-subtle bg-pf-surface-2 px-4 py-2.5 text-center text-sm text-pf-text-muted">
              Plano anterior
            </div>
          ) : (
            <div className="rounded-lg border border-pf-border bg-pf-surface-2 px-4 py-2.5 text-center text-sm text-pf-text-secondary">
              Plano atual
            </div>
          )}
        </div>

        {/* Pro Plan Card */}
        <div
          className={`relative rounded-xl border p-6 transition-colors ${
            isFreePlan
              ? "border-pf-accent/30 bg-pf-surface"
              : "border-pf-accent/50 bg-pf-surface ring-1 ring-pf-accent/20"
          }`}
        >
          {/* Accent top border */}
          <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-pf-accent/60 to-transparent" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-pf-text">
                Pro
              </h2>
              <Sparkles className="h-4 w-4 text-pf-accent" />
            </div>
            {!isFreePlan && (
              <span className="inline-flex items-center rounded-full bg-pf-accent/10 px-2.5 py-0.5 text-xs font-semibold text-pf-accent">
                Plano atual
              </span>
            )}
          </div>

          <div className="mb-6">
            <span className="font-display text-3xl font-bold text-pf-text">
              R$49
            </span>
            <span className="text-sm text-pf-text-muted">/mês</span>
          </div>

          <ul className="space-y-3 mb-6">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <Check className="h-4 w-4 shrink-0 text-pf-accent" />
                <span className="text-pf-text-secondary">{feature}</span>
              </li>
            ))}
          </ul>

          {isFreePlan ? (
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-pf-accent px-4 py-2.5 text-sm font-semibold text-pf-bg transition-colors hover:bg-pf-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {checkoutLoading ? "Redirecionando..." : "Fazer upgrade"}
            </button>
          ) : (
            <button
              onClick={() => {
                // Placeholder: in production, this would link to Stripe Customer Portal
                window.open("https://billing.stripe.com/p/login/test", "_blank");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-pf-border bg-pf-surface-2 px-4 py-2.5 text-sm font-medium text-pf-text transition-colors hover:bg-pf-surface hover:border-pf-border"
            >
              Gerenciar assinatura
            </button>
          )}
        </div>
      </div>

      {/* Subscription Info */}
      {subscription && !isFreePlan && subscription.current_period_end && (
        <div className="mt-6 rounded-lg border border-pf-border-subtle bg-pf-surface p-4">
          <p className="text-sm text-pf-text-secondary">
            Sua assinatura renova em{" "}
            <span className="font-medium text-pf-text">
              {new Date(subscription.current_period_end).toLocaleDateString(
                "pt-BR"
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
