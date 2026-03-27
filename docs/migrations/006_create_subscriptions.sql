-- ============================================================
-- 006_create_subscriptions.sql
-- Plano de assinatura por workspace (integração Stripe)
-- ============================================================

CREATE TABLE subscriptions (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id           UUID        NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  plan                   TEXT        NOT NULL DEFAULT 'free'
                           CHECK (plan IN ('free', 'pro')),
  stripe_customer_id     TEXT        UNIQUE,
  stripe_subscription_id TEXT        UNIQUE,
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reusa a função update_updated_at() criada em 003_create_leads.sql
-- (deve ser executado após 003)
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índice para lookup rápido pelo ID Stripe
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
