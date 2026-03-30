-- ============================================================
-- 012_add_payment_failed_plan.sql
-- Adiciona 'payment_failed' como valor válido no campo plan
-- das tabelas workspaces e subscriptions.
-- ============================================================

-- workspaces: dropar constraint antiga e recriar
ALTER TABLE workspaces
  DROP CONSTRAINT IF EXISTS workspaces_plan_check;

ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_plan_check
  CHECK (plan IN ('free', 'pro', 'payment_failed'));

-- subscriptions: dropar constraint antiga e recriar
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('free', 'pro', 'payment_failed'));
