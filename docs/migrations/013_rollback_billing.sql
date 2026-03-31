-- ============================================================
-- 013_rollback_billing.sql
-- Limpa dados de assinatura Pro para reconstruir na aula.
-- A tabela subscriptions é mantida — só os dados são resetados.
--
-- COMO EXECUTAR:
--   Supabase Dashboard → SQL Editor → cole e execute.
-- ============================================================

BEGIN;

-- 1. Reverter todos os workspaces para plano 'free'
UPDATE workspaces SET plan = 'free' WHERE plan != 'free';

-- 2. Resetar subscriptions: voltar tudo pra free e limpar dados Stripe
UPDATE subscriptions
SET plan = 'free',
    stripe_customer_id = NULL,
    stripe_subscription_id = NULL,
    current_period_end = NULL;

-- 3. Reverter constraint do plan (remover 'payment_failed' se existir)
ALTER TABLE workspaces DROP CONSTRAINT IF EXISTS workspaces_plan_check;
ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_plan_check
  CHECK (plan IN ('free', 'pro'));

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('free', 'pro'));

COMMIT;
