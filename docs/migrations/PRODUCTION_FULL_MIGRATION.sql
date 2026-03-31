-- ╔════════════════════════════════════════════════════════════════════════════╗
-- ║  PipeFlow CRM — Script Consolidado para Supabase de Produção            ║
-- ║  VERSÃO IDEMPOTENTE — seguro para rodar múltiplas vezes                  ║
-- ║                                                                          ║
-- ║  INSTRUÇÕES:                                                             ║
-- ║  1. Abra o SQL Editor no Supabase Dashboard (projeto de PRODUÇÃO)        ║
-- ║  2. Cole este arquivo inteiro e execute                                   ║
-- ║  3. Verifique que RLS está habilitado em todas as tabelas                ║
-- ║  4. Configure Authentication → URL Configuration com URLs de produção    ║
-- ╚════════════════════════════════════════════════════════════════════════════╝


-- ════════════════════════════════════════════════════════════════════════════
-- 001 — WORKSPACES
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspaces (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  slug       TEXT        UNIQUE NOT NULL,
  plan       TEXT        NOT NULL DEFAULT 'free'
               CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════
-- 002 — WORKSPACE_MEMBERS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspace_members (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT        NOT NULL DEFAULT 'member'
                 CHECK (role IN ('admin', 'member')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id      ON workspace_members(user_id);

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════
-- 003 — LEADS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT,
  company         TEXT,
  position        TEXT,
  status          TEXT        NOT NULL DEFAULT 'novo'
                    CHECK (status IN ('novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido')),
  owner_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  notes           TEXT,
  estimated_value NUMERIC(12, 2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_status        ON leads(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_owner_id      ON leads(owner_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════
-- 004 — DEALS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS deals (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id         UUID        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  stage           TEXT        NOT NULL DEFAULT 'novo_lead'
                    CHECK (stage IN (
                      'novo_lead',
                      'contato_realizado',
                      'proposta_enviada',
                      'negociacao',
                      'fechado_ganho',
                      'fechado_perdido'
                    )),
  position        INTEGER     NOT NULL DEFAULT 0,
  estimated_value NUMERIC(12, 2),
  owner_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date        DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS deals_updated_at ON deals;
CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_deals_workspace_id       ON deals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage              ON deals(workspace_id, stage);
CREATE INDEX IF NOT EXISTS idx_deals_lead_id            ON deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage_position     ON deals(workspace_id, stage, position);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════
-- 005 — ACTIVITIES
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS activities (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id      UUID        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL
                 CHECK (type IN ('call', 'email', 'meeting', 'note')),
  title        TEXT        NOT NULL,
  description  TEXT,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_workspace_id ON activities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id      ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_occurred_at  ON activities(lead_id, occurred_at DESC);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════
-- 006 — SUBSCRIPTIONS
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subscriptions (
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

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════════════════════
-- 007 — RLS POLICIES (helper functions + all policies)
-- ════════════════════════════════════════════════════════════════════════════

-- Helper functions (CREATE OR REPLACE é idempotente)
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = (SELECT auth.uid())
  );
$$;

CREATE OR REPLACE FUNCTION is_workspace_admin(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;

-- ── WORKSPACES policies ──
DROP POLICY IF EXISTS "workspaces_select_members" ON workspaces;
CREATE POLICY "workspaces_select_members"
  ON workspaces FOR SELECT TO authenticated
  USING (is_workspace_member(id));

DROP POLICY IF EXISTS "workspaces_insert_authenticated" ON workspaces;
CREATE POLICY "workspaces_insert_authenticated"
  ON workspaces FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "workspaces_update_admin" ON workspaces;
CREATE POLICY "workspaces_update_admin"
  ON workspaces FOR UPDATE TO authenticated
  USING (is_workspace_admin(id))
  WITH CHECK (is_workspace_admin(id));

DROP POLICY IF EXISTS "workspaces_delete_admin" ON workspaces;
CREATE POLICY "workspaces_delete_admin"
  ON workspaces FOR DELETE TO authenticated
  USING (is_workspace_admin(id));

-- ── WORKSPACE_MEMBERS policies ──
DROP POLICY IF EXISTS "workspace_members_select" ON workspace_members;
CREATE POLICY "workspace_members_select"
  ON workspace_members FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "workspace_members_insert_admin" ON workspace_members;
CREATE POLICY "workspace_members_insert_admin"
  ON workspace_members FOR INSERT TO authenticated
  WITH CHECK (
    is_workspace_admin(workspace_id)
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "workspace_members_update_admin" ON workspace_members;
CREATE POLICY "workspace_members_update_admin"
  ON workspace_members FOR UPDATE TO authenticated
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS "workspace_members_delete" ON workspace_members;
CREATE POLICY "workspace_members_delete"
  ON workspace_members FOR DELETE TO authenticated
  USING (
    is_workspace_admin(workspace_id)
    OR user_id = (SELECT auth.uid())
  );

-- ── LEADS policies ──
DROP POLICY IF EXISTS "leads_select" ON leads;
CREATE POLICY "leads_select"
  ON leads FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_insert" ON leads;
CREATE POLICY "leads_insert"
  ON leads FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_update" ON leads;
CREATE POLICY "leads_update"
  ON leads FOR UPDATE TO authenticated
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "leads_delete" ON leads;
CREATE POLICY "leads_delete"
  ON leads FOR DELETE TO authenticated
  USING (is_workspace_member(workspace_id));

-- ── DEALS policies ──
DROP POLICY IF EXISTS "deals_select" ON deals;
CREATE POLICY "deals_select"
  ON deals FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "deals_insert" ON deals;
CREATE POLICY "deals_insert"
  ON deals FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "deals_update" ON deals;
CREATE POLICY "deals_update"
  ON deals FOR UPDATE TO authenticated
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "deals_delete" ON deals;
CREATE POLICY "deals_delete"
  ON deals FOR DELETE TO authenticated
  USING (is_workspace_member(workspace_id));

-- ── ACTIVITIES policies ──
DROP POLICY IF EXISTS "activities_select" ON activities;
CREATE POLICY "activities_select"
  ON activities FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "activities_insert" ON activities;
CREATE POLICY "activities_insert"
  ON activities FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "activities_update" ON activities;
CREATE POLICY "activities_update"
  ON activities FOR UPDATE TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR is_workspace_admin(workspace_id)
  )
  WITH CHECK (
    created_by = (SELECT auth.uid())
    OR is_workspace_admin(workspace_id)
  );

DROP POLICY IF EXISTS "activities_delete" ON activities;
CREATE POLICY "activities_delete"
  ON activities FOR DELETE TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR is_workspace_admin(workspace_id)
  );

-- ── SUBSCRIPTIONS policies (SELECT only — INSERT/UPDATE in 015) ──
DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
CREATE POLICY "subscriptions_select"
  ON subscriptions FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));


-- ════════════════════════════════════════════════════════════════════════════
-- 008 — SEARCH INDEXES (pg_trgm)
-- ════════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_leads_name_trgm
  ON leads USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_leads_company_trgm
  ON leads USING gin (company gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_leads_email
  ON leads (workspace_id, email);

CREATE INDEX IF NOT EXISTS idx_deals_title_trgm
  ON deals USING gin (title gin_trgm_ops);


-- ════════════════════════════════════════════════════════════════════════════
-- 010 — WORKSPACE_INVITES
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS workspace_invites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  token         TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at   TIMESTAMPTZ,
  invited_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS workspace_invites_token_idx ON workspace_invites(token);

CREATE INDEX IF NOT EXISTS workspace_invites_workspace_pending_idx
  ON workspace_invites(workspace_id)
  WHERE accepted_at IS NULL;

ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

-- ── WORKSPACE_INVITES policies ──
DROP POLICY IF EXISTS "workspace_invites_insert" ON workspace_invites;
CREATE POLICY "workspace_invites_insert"
  ON workspace_invites FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_invites.workspace_id
        AND wm.user_id = (SELECT auth.uid())
        AND wm.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "workspace_invites_delete" ON workspace_invites;
CREATE POLICY "workspace_invites_delete"
  ON workspace_invites FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_invites.workspace_id
        AND wm.user_id = (SELECT auth.uid())
        AND wm.role = 'admin'
    )
  );


-- ════════════════════════════════════════════════════════════════════════════
-- 012 — ADD payment_failed TO plan CHECK CONSTRAINTS
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE workspaces
  DROP CONSTRAINT IF EXISTS workspaces_plan_check;

ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_plan_check
  CHECK (plan IN ('free', 'pro', 'payment_failed'));

ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('free', 'pro', 'payment_failed'));


-- ════════════════════════════════════════════════════════════════════════════
-- 015 — SECURITY HARDENING
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Harden workspace_invites SELECT (admins + invited user only)
DROP POLICY IF EXISTS "workspace_invites_select_by_token" ON workspace_invites;
DROP POLICY IF EXISTS "workspace_invites_select_scoped" ON workspace_invites;
CREATE POLICY "workspace_invites_select_scoped"
  ON workspace_invites FOR SELECT TO authenticated
  USING (
    is_workspace_admin(workspace_id)
    OR email = lower((SELECT auth.jwt() ->> 'email'))
  );

-- 2. Harden workspace_invites UPDATE (only invited user can accept)
DROP POLICY IF EXISTS "workspace_invites_update_accept" ON workspace_invites;
CREATE POLICY "workspace_invites_update_accept"
  ON workspace_invites FOR UPDATE TO authenticated
  USING (
    email = lower((SELECT auth.jwt() ->> 'email'))
    AND accepted_at IS NULL
  )
  WITH CHECK (
    accepted_at IS NOT NULL
  );

-- 3. Subscriptions INSERT — only workspace admins
DROP POLICY IF EXISTS "subscriptions_insert_member" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert_admin" ON subscriptions;
CREATE POLICY "subscriptions_insert_admin"
  ON subscriptions FOR INSERT TO authenticated
  WITH CHECK (is_workspace_admin(workspace_id));

-- 4. Subscriptions UPDATE — only workspace admins
DROP POLICY IF EXISTS "subscriptions_update_admin" ON subscriptions;
CREATE POLICY "subscriptions_update_admin"
  ON subscriptions FOR UPDATE TO authenticated
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

-- 5. Drop old 3-parameter version to prevent PostgREST overload conflict
DROP FUNCTION IF EXISTS create_workspace(TEXT, TEXT, UUID);

-- 6. create_workspace RPC — uses auth.uid() (no IDOR)
CREATE OR REPLACE FUNCTION create_workspace(
  p_name TEXT,
  p_slug TEXT
)
RETURNS TABLE (
  workspace_id UUID,
  workspace_name TEXT,
  workspace_slug TEXT,
  workspace_plan TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_workspace_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.workspaces (name, slug, plan)
  VALUES (p_name, p_slug, 'free')
  RETURNING id INTO v_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, v_user_id, 'admin');

  INSERT INTO public.subscriptions (workspace_id, plan)
  VALUES (v_workspace_id, 'free');

  RETURN QUERY
    SELECT
      v_workspace_id,
      p_name,
      p_slug,
      'free'::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION create_workspace(TEXT, TEXT) TO authenticated;

-- Revoke old 3-parameter version if it exists
DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION create_workspace(TEXT, TEXT, UUID) FROM authenticated;
EXCEPTION
  WHEN undefined_function THEN NULL;
END;
$$;


-- ════════════════════════════════════════════════════════════════════════════
-- ✅ MIGRATION COMPLETA — IDEMPOTENTE
-- Pode ser executado múltiplas vezes sem erro.
-- Verifique no Table Editor que RLS está habilitado em TODAS as tabelas:
--   workspaces, workspace_members, leads, deals, activities,
--   subscriptions, workspace_invites
-- ════════════════════════════════════════════════════════════════════════════
