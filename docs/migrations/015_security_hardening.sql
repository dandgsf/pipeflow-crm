-- ╔════════════════════════════════════════════════════════════════════╗
-- ║  015 — Security Hardening Migration                              ║
-- ║  Fixes: overly permissive RLS on workspace_invites,             ║
-- ║         subscriptions INSERT policy, create_workspace RPC        ║
-- ╚════════════════════════════════════════════════════════════════════╝

-- ─── 1. Harden workspace_invites SELECT policy ──────────────────────
-- Old: USING (true) — any authenticated user could read all invites
-- New: only workspace admins or the invited user can read invites

DROP POLICY IF EXISTS "workspace_invites_select_by_token" ON workspace_invites;

CREATE POLICY "workspace_invites_select_scoped"
  ON workspace_invites
  FOR SELECT
  TO authenticated
  USING (
    is_workspace_admin(workspace_id)
    OR email = lower((SELECT auth.jwt() ->> 'email'))
  );

-- ─── 2. Harden workspace_invites UPDATE policy ─────────────────────
-- Old: USING (true) WITH CHECK (true) — any user could modify any invite field
-- New: only the invited user can accept (set accepted_at) their own invite

DROP POLICY IF EXISTS "workspace_invites_update_accept" ON workspace_invites;

CREATE POLICY "workspace_invites_update_accept"
  ON workspace_invites
  FOR UPDATE
  TO authenticated
  USING (
    email = lower((SELECT auth.jwt() ->> 'email'))
    AND accepted_at IS NULL
  )
  WITH CHECK (
    accepted_at IS NOT NULL
  );

-- ─── 3. Harden subscriptions INSERT policy ──────────────────────────
-- Old: any workspace member could insert subscriptions
-- New: only workspace admins can insert

DROP POLICY IF EXISTS "subscriptions_insert_member" ON subscriptions;

CREATE POLICY "subscriptions_insert_admin"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_admin(workspace_id));

-- ─── 4. Fix create_workspace RPC to use auth.uid() ─────────────────
-- Old: accepted p_user_id parameter (IDOR risk via direct RPC call)
-- New: uses auth.uid() internally, no user-supplied user ID

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
  -- Use auth.uid() instead of parameter to prevent IDOR
  v_user_id := (SELECT auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Create workspace
  INSERT INTO public.workspaces (name, slug, plan)
  VALUES (p_name, p_slug, 'free')
  RETURNING id INTO v_workspace_id;

  -- Add creator as admin
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_workspace_id, v_user_id, 'admin');

  -- Create free subscription record
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

-- Ensure the function is callable by authenticated users
GRANT EXECUTE ON FUNCTION create_workspace(TEXT, TEXT) TO authenticated;

-- Revoke the old 3-parameter version if it exists
DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION create_workspace(TEXT, TEXT, UUID) FROM authenticated;
EXCEPTION
  WHEN undefined_function THEN NULL;
END;
$$;
