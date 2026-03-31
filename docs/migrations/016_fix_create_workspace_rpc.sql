-- ╔════════════════════════════════════════════════════════════════════╗
-- ║  016 — Fix create_workspace RPC                                  ║
-- ║                                                                  ║
-- ║  Problema: a versão antiga da função (3 params) ainda existe     ║
-- ║  no banco, causando conflito de overload no PostgREST quando     ║
-- ║  o código chama com 2 params. Também garante que a função roda   ║
-- ║  como superuser (bypassa RLS) para o INSERT na subscriptions.    ║
-- ║                                                                  ║
-- ║  INSTRUÇÕES: Cole no SQL Editor do Supabase e execute.           ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- 1. Dropar a versão antiga (3 params) que causa conflito de overload
DROP FUNCTION IF EXISTS create_workspace(TEXT, TEXT, UUID);

-- 2. Recriar a versão correta (2 params) — SECURITY DEFINER garante
--    que os INSERTs rodam como postgres (superuser), bypassando RLS.
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
  -- Pega o user autenticado (sem aceitar parâmetro externo = sem IDOR)
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Cria o workspace
  INSERT INTO public.workspaces (name, slug, plan)
  VALUES (p_name, p_slug, 'free')
  RETURNING id INTO v_workspace_id;

  -- 2. Adiciona o criador como admin
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, v_user_id, 'admin');

  -- 3. Cria registro de subscription free
  INSERT INTO public.subscriptions (workspace_id, plan)
  VALUES (v_workspace_id, 'free');

  -- 4. Retorna os dados
  RETURN QUERY
    SELECT
      v_workspace_id,
      p_name,
      p_slug,
      'free'::TEXT;
END;
$$;

-- 3. Permissões
GRANT EXECUTE ON FUNCTION create_workspace(TEXT, TEXT) TO authenticated;

-- 4. Verificação: listar funções create_workspace existentes
-- (deve retornar apenas 1 resultado com 2 params)
SELECT
  p.proname AS function_name,
  pg_get_function_arguments(p.oid) AS arguments,
  r.rolname AS owner
FROM pg_proc p
JOIN pg_roles r ON p.proowner = r.oid
WHERE p.proname = 'create_workspace';
