-- ============================================================
-- Passo 1: Drop com CASCADE (remove funções + policies dependentes)
-- ============================================================

DROP FUNCTION IF EXISTS is_workspace_member(UUID) CASCADE;
DROP FUNCTION IF EXISTS is_workspace_admin(UUID) CASCADE;

-- Qualquer policy residual que não dependa das funções
DROP POLICY IF EXISTS "workspaces_insert_authenticated"  ON workspaces;
DROP POLICY IF EXISTS "workspace_members_insert_admin"   ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_update_admin"   ON workspace_members;
DROP POLICY IF EXISTS "workspace_members_delete"         ON workspace_members;
DROP POLICY IF EXISTS "activities_update"                ON activities;
DROP POLICY IF EXISTS "activities_delete"                ON activities;
DROP POLICY IF EXISTS "subscriptions_insert_member"      ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_admin"       ON subscriptions;
