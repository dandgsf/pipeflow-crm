-- ============================================================
-- 007_rls_policies.sql
-- Row Level Security para todas as tabelas
--
-- Princípio: cada usuário só acessa dados do workspace
-- onde ele é membro (via workspace_members).
-- Admins têm permissões extras em subscriptions.
--
-- Performance (regra 3.3 — Supabase Postgres Best Practices):
--   • Funções usam (select auth.uid()) para ser avaliado UMA vez
--     por query (não por linha).
--   • SECURITY DEFINER + set search_path = '' previne search-path hijack.
--   • Todas as policies têm TO authenticated para não avaliar anon.
--   • Índices nas colunas usadas pelas políticas estão em 002/003/004.
-- ============================================================

-- ─── Helper functions ─────────────────────────────────────────
-- (select auth.uid()) é avaliado uma única vez por query pelo
-- planner do Postgres — sem isso, auth.uid() roda POR LINHA.

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


-- ============================================================
-- WORKSPACES
-- ============================================================

CREATE POLICY "workspaces_select_members"
  ON workspaces FOR SELECT
  TO authenticated
  USING (is_workspace_member(id));

-- Qualquer autenticado pode criar workspace (onboarding)
CREATE POLICY "workspaces_insert_authenticated"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "workspaces_update_admin"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (is_workspace_admin(id))
  WITH CHECK (is_workspace_admin(id));

CREATE POLICY "workspaces_delete_admin"
  ON workspaces FOR DELETE
  TO authenticated
  USING (is_workspace_admin(id));


-- ============================================================
-- WORKSPACE_MEMBERS
-- ============================================================

CREATE POLICY "workspace_members_select"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY "workspace_members_insert_admin"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    is_workspace_admin(workspace_id)
    OR user_id = (SELECT auth.uid())
  );

CREATE POLICY "workspace_members_update_admin"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

CREATE POLICY "workspace_members_delete"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    is_workspace_admin(workspace_id)
    OR user_id = (SELECT auth.uid())
  );


-- ============================================================
-- LEADS
-- ============================================================

CREATE POLICY "leads_select"
  ON leads FOR SELECT
  TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY "leads_insert"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "leads_update"
  ON leads FOR UPDATE
  TO authenticated
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "leads_delete"
  ON leads FOR DELETE
  TO authenticated
  USING (is_workspace_member(workspace_id));


-- ============================================================
-- DEALS
-- ============================================================

CREATE POLICY "deals_select"
  ON deals FOR SELECT
  TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY "deals_insert"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "deals_update"
  ON deals FOR UPDATE
  TO authenticated
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "deals_delete"
  ON deals FOR DELETE
  TO authenticated
  USING (is_workspace_member(workspace_id));


-- ============================================================
-- ACTIVITIES
-- Membros leem/inserem; criador ou admin edita/deleta.
-- ============================================================

CREATE POLICY "activities_select"
  ON activities FOR SELECT
  TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY "activities_insert"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "activities_update"
  ON activities FOR UPDATE
  TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR is_workspace_admin(workspace_id)
  )
  WITH CHECK (
    created_by = (SELECT auth.uid())
    OR is_workspace_admin(workspace_id)
  );

CREATE POLICY "activities_delete"
  ON activities FOR DELETE
  TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR is_workspace_admin(workspace_id)
  );


-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

CREATE POLICY "subscriptions_select"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY "subscriptions_insert_member"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "subscriptions_update_admin"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

-- Sem política de DELETE: assinaturas nunca são deletadas diretamente
