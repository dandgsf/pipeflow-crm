-- Apply as the migration owner, before deploying the matching application.
BEGIN;

-- PostgREST clients may only write business fields. In particular TRUNCATE
-- has no row-level security, even when RLS is enabled.
REVOKE ALL ON public.workspaces, public.workspace_members, public.workspace_invites,
  public.subscriptions, public.leads, public.deals, public.activities FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.workspaces, public.workspace_members, public.workspace_invites,
  public.subscriptions, public.leads, public.deals, public.activities TO authenticated;
GRANT UPDATE (name), DELETE ON public.workspaces TO authenticated;
GRANT UPDATE (role), DELETE ON public.workspace_members TO authenticated;
GRANT INSERT (workspace_id, email, role, invited_by), DELETE ON public.workspace_invites TO authenticated;
GRANT INSERT, DELETE, UPDATE (name, email, phone, company, position, status, owner_id, notes, estimated_value, updated_at)
  ON public.leads TO authenticated;
GRANT INSERT, DELETE, UPDATE (lead_id, title, stage, position, estimated_value, owner_id, due_date, notes, updated_at)
  ON public.deals TO authenticated;
GRANT INSERT, DELETE, UPDATE (type, title, description, occurred_at) ON public.activities TO authenticated;

DROP POLICY IF EXISTS workspaces_insert_authenticated ON public.workspaces;
DROP POLICY IF EXISTS workspace_members_insert_admin ON public.workspace_members;
DROP POLICY IF EXISTS workspace_invites_update_accept ON public.workspace_invites;
DROP POLICY IF EXISTS subscriptions_insert_member ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_insert_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_update_admin ON public.subscriptions;
DROP POLICY IF EXISTS subscriptions_select ON public.subscriptions;
CREATE POLICY subscriptions_select ON public.subscriptions FOR SELECT TO authenticated
  USING (public.is_workspace_admin(workspace_id));

DROP POLICY IF EXISTS workspace_invites_insert ON public.workspace_invites;
CREATE POLICY workspace_invites_insert ON public.workspace_invites FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_admin(workspace_id) AND invited_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS activities_insert ON public.activities;
CREATE POLICY activities_insert ON public.activities FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id) AND created_by = (SELECT auth.uid()));
DROP POLICY IF EXISTS activities_update ON public.activities;
CREATE POLICY activities_update ON public.activities FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id) AND
         (created_by = (SELECT auth.uid()) OR public.is_workspace_admin(workspace_id)));
DROP POLICY IF EXISTS activities_delete ON public.activities;
CREATE POLICY activities_delete ON public.activities FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id) AND
         (created_by = (SELECT auth.uid()) OR public.is_workspace_admin(workspace_id)));

-- Replace each old FK, keeping PostgREST's relationship name unambiguous.
CREATE UNIQUE INDEX IF NOT EXISTS leads_workspace_id_id_key ON public.leads(workspace_id, id);
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_lead_id_fkey,
  ADD CONSTRAINT deals_lead_id_fkey FOREIGN KEY (workspace_id, lead_id)
    REFERENCES public.leads(workspace_id, id) ON DELETE CASCADE;
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_lead_id_fkey,
  ADD CONSTRAINT activities_lead_id_fkey FOREIGN KEY (workspace_id, lead_id)
    REFERENCES public.leads(workspace_id, id) ON DELETE CASCADE;

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_owner_member_fkey,
  ADD CONSTRAINT leads_owner_member_fkey FOREIGN KEY (workspace_id, owner_id)
    REFERENCES public.workspace_members(workspace_id, user_id) ON DELETE SET NULL (owner_id);
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_owner_member_fkey,
  ADD CONSTRAINT deals_owner_member_fkey FOREIGN KEY (workspace_id, owner_id)
    REFERENCES public.workspace_members(workspace_id, user_id) ON DELETE SET NULL (owner_id);

DROP FUNCTION IF EXISTS public.create_workspace(text, text, uuid);
CREATE OR REPLACE FUNCTION public.create_workspace(p_name text, p_slug text)
RETURNS TABLE (workspace_id uuid, workspace_name text, workspace_slug text, workspace_plan text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  actor uuid := auth.uid();
  new_id uuid;
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(actor::text, 17));
  IF (SELECT NOT bool_or(w.plan = 'pro') FROM public.workspace_members m
      JOIN public.workspaces w ON w.id = m.workspace_id WHERE m.user_id = actor AND m.role = 'admin') THEN
    RAISE EXCEPTION 'Workspace limit reached';
  END IF;
  INSERT INTO public.workspaces(name, slug) VALUES (p_name, p_slug) RETURNING id INTO new_id;
  INSERT INTO public.workspace_members(workspace_id, user_id, role) VALUES (new_id, actor, 'admin');
  INSERT INTO public.subscriptions(workspace_id) VALUES (new_id);
  RETURN QUERY SELECT new_id, p_name, p_slug, 'free'::text;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_workspace_invite(p_token text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  invitation public.workspace_invites%ROWTYPE;
  actor uuid := auth.uid();
BEGIN
  SELECT * INTO invitation FROM public.workspace_invites WHERE token = p_token FOR UPDATE;
  IF NOT FOUND OR invitation.accepted_at IS NOT NULL OR invitation.expires_at <= clock_timestamp() THEN
    RAISE EXCEPTION 'invalid_invite';
  END IF;
  IF NOT EXISTS (SELECT FROM auth.users WHERE id = actor AND email_confirmed_at IS NOT NULL
                 AND lower(email) = lower(invitation.email)) THEN
    RAISE EXCEPTION 'wrong_recipient';
  END IF;
  PERFORM 1 FROM public.workspaces WHERE id = invitation.workspace_id FOR NO KEY UPDATE;
  IF NOT public.is_workspace_member(invitation.workspace_id) THEN
    IF EXISTS (SELECT FROM public.workspaces w WHERE w.id = invitation.workspace_id AND w.plan <> 'pro')
        AND (SELECT count(*) FROM public.workspace_members WHERE workspace_id = invitation.workspace_id) >= 2 THEN
      RAISE EXCEPTION 'member_limit';
    END IF;
    INSERT INTO public.workspace_members(workspace_id, user_id, role)
      VALUES (invitation.workspace_id, actor, invitation.role);
  END IF;
  UPDATE public.workspace_invites SET accepted_at = clock_timestamp() WHERE id = invitation.id;
  RETURN invitation.workspace_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_workspace(text, text), public.accept_workspace_invite(text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_workspace(text, text), public.accept_workspace_invite(text)
  TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_lead_limit() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  current_plan text;
BEGIN
  SELECT plan INTO current_plan FROM public.workspaces WHERE id = NEW.workspace_id FOR NO KEY UPDATE;
  IF current_plan <> 'pro' AND (SELECT count(*) FROM public.leads WHERE workspace_id = NEW.workspace_id) > 50 THEN
    RAISE EXCEPTION 'Lead limit reached';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_lead_limit() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS enforce_lead_limit ON public.leads;
CREATE TRIGGER enforce_lead_limit AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.enforce_lead_limit();

-- Treat subscriptions as the billing source of truth. A webhook updates both
-- representations of the plan in one statement and transaction.
CREATE OR REPLACE FUNCTION public.sync_workspace_plan() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.workspaces SET plan = NEW.plan WHERE id = NEW.workspace_id AND plan <> NEW.plan;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_workspace_plan() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS sync_workspace_plan ON public.subscriptions;
CREATE TRIGGER sync_workspace_plan AFTER INSERT OR UPDATE OF plan ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_workspace_plan();

COMMIT;
