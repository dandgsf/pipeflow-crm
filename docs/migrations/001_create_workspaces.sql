-- ============================================================
-- 001_create_workspaces.sql
-- Tabela principal de workspaces (tenants do sistema)
-- ============================================================

CREATE TABLE workspaces (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  slug       TEXT        UNIQUE NOT NULL,
  plan       TEXT        NOT NULL DEFAULT 'free'
               CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilita RLS (as políticas ficam em 007_rls_policies.sql)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
