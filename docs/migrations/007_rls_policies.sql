-- ============================================================
-- 007_rls_policies.sql
-- Row Level Security para todas as tabelas
--
-- Princípio: cada usuário só acessa dados do workspace
-- onde ele é membro (via workspace_members).
-- Admins têm permissões extras em subscriptions.
-- ============================================================

-- ─── Helper function ─────────────────────────────────────────
-- Retorna TRUE se o usuário autenticado é membro do workspace.
-- Usada em todas as políticas abaixo para evitar repetição.
CREATE OR REPLACE FUNCTION is_workspace_member(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = auth.uid()
  );
$$;

-- Retorna TRUE se o usuário autenticado é ADMIN do workspace.
CREATE OR REPLACE FUNCTION is_workspace_admin(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM workspace_members
    WHERE workspace_id = p_workspace_id
      AND user_id = auth.uid()
      AND role = 'admin'
  );
$$;


-- ============================================================
-- WORKSPACES
-- Membros leem; apenas admins atualizam; inserção via trigger/SA
-- ============================================================

-- SELECT: qualquer membro do workspace pode ver
CREATE POLICY "workspaces_select_members"
  ON workspaces FOR SELECT
  USING (is_workspace_member(id));

-- INSERT: qualquer usuário autenticado pode criar um workspace
-- (o onboarding cria o workspace + insere o criador como admin em uma transação)
CREATE POLICY "workspaces_insert_authenticated"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: apenas admins podem renomear / alterar o workspace
CREATE POLICY "workspaces_update_admin"
  ON workspaces FOR UPDATE
  USING (is_workspace_admin(id))
  WITH CHECK (is_workspace_admin(id));

-- DELETE: apenas admins podem excluir o workspace
CREATE POLICY "workspaces_delete_admin"
  ON workspaces FOR DELETE
  USING (is_workspace_admin(id));


-- ============================================================
-- WORKSPACE_MEMBERS
-- Membros veem os outros membros do mesmo workspace.
-- Apenas admins podem adicionar/remover/alterar membros.
-- ============================================================

-- SELECT: membros veem todos os membros do mesmo workspace
CREATE POLICY "workspace_members_select"
  ON workspace_members FOR SELECT
  USING (is_workspace_member(workspace_id));

-- INSERT: usuário autenticado pode ser inserido como membro
-- (onboarding insere o próprio usuário; convites são tratados via SA com service role)
CREATE POLICY "workspace_members_insert_admin"
  ON workspace_members FOR INSERT
  WITH CHECK (
    -- admin adicionando outro usuário
    is_workspace_admin(workspace_id)
    OR
    -- o próprio usuário inserindo a si mesmo (criação de workspace)
    user_id = auth.uid()
  );

-- UPDATE: apenas admins podem alterar roles
CREATE POLICY "workspace_members_update_admin"
  ON workspace_members FOR UPDATE
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

-- DELETE: admins removem membros; usuário pode sair do workspace
CREATE POLICY "workspace_members_delete"
  ON workspace_members FOR DELETE
  USING (
    is_workspace_admin(workspace_id)
    OR user_id = auth.uid()
  );


-- ============================================================
-- LEADS
-- Todos os membros do workspace têm acesso completo (CRUD).
-- ============================================================

CREATE POLICY "leads_select"
  ON leads FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "leads_insert"
  ON leads FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "leads_update"
  ON leads FOR UPDATE
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "leads_delete"
  ON leads FOR DELETE
  USING (is_workspace_member(workspace_id));


-- ============================================================
-- DEALS
-- Mesma regra: todos os membros têm CRUD.
-- ============================================================

CREATE POLICY "deals_select"
  ON deals FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "deals_insert"
  ON deals FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "deals_update"
  ON deals FOR UPDATE
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY "deals_delete"
  ON deals FOR DELETE
  USING (is_workspace_member(workspace_id));


-- ============================================================
-- ACTIVITIES
-- Todos os membros leem; qualquer membro insere; apenas o
-- criador ou admins podem editar/deletar.
-- ============================================================

CREATE POLICY "activities_select"
  ON activities FOR SELECT
  USING (is_workspace_member(workspace_id));

CREATE POLICY "activities_insert"
  ON activities FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

-- UPDATE: quem criou ou admin
CREATE POLICY "activities_update"
  ON activities FOR UPDATE
  USING (
    created_by = auth.uid()
    OR is_workspace_admin(workspace_id)
  )
  WITH CHECK (
    created_by = auth.uid()
    OR is_workspace_admin(workspace_id)
  );

-- DELETE: quem criou ou admin
CREATE POLICY "activities_delete"
  ON activities FOR DELETE
  USING (
    created_by = auth.uid()
    OR is_workspace_admin(workspace_id)
  );


-- ============================================================
-- SUBSCRIPTIONS
-- Membros leem o plano do workspace; apenas o webhook Stripe
-- (service role) e admins podem atualizar.
-- ============================================================

CREATE POLICY "subscriptions_select"
  ON subscriptions FOR SELECT
  USING (is_workspace_member(workspace_id));

-- INSERT: qualquer autenticado pode criar a subscription do workspace,
-- desde que seja membro do workspace (o onboarding cria workspace → member → subscription
-- nessa ordem; na criação do workspace o usuário ainda não é admin, mas já é membro
-- porque a inserção em workspace_members acontece antes da subscription).
-- O service role do webhook Stripe também bypassa esta política.
CREATE POLICY "subscriptions_insert_member"
  ON subscriptions FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));

-- UPDATE: apenas admins (o webhook Stripe usa service role e bypassa RLS)
CREATE POLICY "subscriptions_update_admin"
  ON subscriptions FOR UPDATE
  USING (is_workspace_admin(workspace_id))
  WITH CHECK (is_workspace_admin(workspace_id));

-- DELETE: nunca deletar assinaturas (sem política de delete)
