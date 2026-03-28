-- ============================================================
-- 009_create_workspace_rpc.sql
-- Função RPC para criação atômica de workspace + membro admin
--
-- Por que SECURITY DEFINER?
--   A criação do workspace envolve dois INSERTs sequenciais:
--   1) INSERT INTO workspaces
--   2) INSERT INTO workspace_members (onde user_id = auth.uid())
--
--   O problema: a policy "workspace_members_insert_admin" permite
--   user_id = auth.uid() para a própria inserção, mas se o INSERT
--   de workspace_members falhar APÓS o workspace ser criado, o
--   rollback manual (DELETE FROM workspaces) pode ser bloqueado
--   pela RLS — o usuário ainda não é membro/admin do workspace
--   recém-criado.
--
--   Solução: função SECURITY DEFINER que roda como superuser
--   e envolve tudo em uma transação implícita. Se qualquer
--   passo falhar, o Postgres faz ROLLBACK automaticamente.
--
-- set search_path = '': previne search-path hijack (regra 3.1)
-- ============================================================

CREATE OR REPLACE FUNCTION create_workspace(
  p_name TEXT,
  p_slug TEXT,
  p_user_id UUID
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
BEGIN
  -- 1. Cria o workspace
  INSERT INTO public.workspaces (name, slug, plan)
  VALUES (p_name, p_slug, 'free')
  RETURNING id INTO v_workspace_id;

  -- 2. Adiciona o criador como admin (mesma transação)
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, p_user_id, 'admin');

  -- 3. Retorna os dados do workspace criado
  RETURN QUERY
    SELECT w.id, w.name, w.slug, w.plan
    FROM public.workspaces w
    WHERE w.id = v_workspace_id;
END;
$$;

-- Garante que apenas authenticated pode chamar esta função
REVOKE ALL ON FUNCTION create_workspace(TEXT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_workspace(TEXT, TEXT, UUID) TO authenticated;
