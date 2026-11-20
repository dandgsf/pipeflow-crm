-- Run with psql -X -v ON_ERROR_STOP=1 on an isolated Supabase-compatible database after migration 017.
BEGIN;
SET LOCAL plpgsql.check_asserts = on;
INSERT INTO auth.users(id, email, email_confirmed_at) VALUES
  ('00000000-0000-4000-8000-000000000001','owner@example.invalid',now()),
  ('00000000-0000-4000-8000-000000000002','member@example.invalid',now()),
  ('00000000-0000-4000-8000-000000000003','other@example.invalid',now());

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
CREATE TEMP TABLE fixture AS SELECT workspace_id AS id FROM public.create_workspace('Fixture','fixture-authz');
DO $$
BEGIN
  ASSERT public.is_workspace_admin((SELECT id FROM fixture));
  ASSERT NOT has_table_privilege(current_user,'public.workspace_members','INSERT');
  ASSERT NOT has_table_privilege(current_user,'public.workspace_invites','UPDATE');
  ASSERT NOT has_column_privilege(current_user,'public.workspaces','plan','UPDATE');
  ASSERT NOT has_column_privilege(current_user,'public.subscriptions','stripe_customer_id','UPDATE');
  ASSERT NOT has_table_privilege(current_user,'public.workspaces','INSERT');
  ASSERT NOT has_table_privilege(current_user,'public.leads','TRUNCATE');
  ASSERT NOT has_column_privilege(current_user,'public.activities','created_by','UPDATE');
  ASSERT NOT has_function_privilege('anon','public.accept_workspace_invite(text)','EXECUTE');
  ASSERT (SELECT count(*) FROM public.subscriptions WHERE workspace_id=(SELECT id FROM fixture)) = 1;
  BEGIN
    PERFORM public.create_workspace('Second','second-fixture');
    RAISE EXCEPTION 'expected workspace limit';
  EXCEPTION WHEN raise_exception THEN ASSERT SQLERRM = 'Workspace limit reached'; END;
END;
$$;
UPDATE public.workspaces SET name='Renamed' WHERE id=(SELECT id FROM fixture);
INSERT INTO public.workspace_invites(workspace_id,email,role,invited_by)
  SELECT id,'member@example.invalid','member',auth.uid() FROM fixture;
CREATE TEMP TABLE invitation AS SELECT token FROM public.workspace_invites WHERE workspace_id=(SELECT id FROM fixture);
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000003',true);
DO $$
BEGIN
  ASSERT NOT EXISTS (SELECT FROM public.workspaces WHERE id=(SELECT id FROM fixture));
  BEGIN
    PERFORM public.accept_workspace_invite((SELECT token FROM invitation));
    RAISE EXCEPTION 'expected recipient check';
  EXCEPTION WHEN raise_exception THEN ASSERT SQLERRM = 'wrong_recipient'; END;
END;
$$;
CREATE TEMP TABLE other_workspace AS SELECT workspace_id AS id FROM public.create_workspace('Other','other-fixture');
CREATE TEMP TABLE other_lead AS WITH added AS (
  INSERT INTO public.leads(workspace_id,name,email) SELECT id,'Contact','contact@example.invalid' FROM other_workspace RETURNING id
) SELECT id FROM added;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
SELECT public.accept_workspace_invite(token) FROM invitation;
DO $$
BEGIN
  ASSERT public.is_workspace_member((SELECT id FROM fixture));
  ASSERT NOT public.is_workspace_admin((SELECT id FROM fixture));
  ASSERT NOT EXISTS (SELECT FROM public.subscriptions WHERE workspace_id=(SELECT id FROM fixture));
  BEGIN
    PERFORM public.accept_workspace_invite((SELECT token FROM invitation));
    RAISE EXCEPTION 'expected used invite';
  EXCEPTION WHEN raise_exception THEN ASSERT SQLERRM = 'invalid_invite'; END;
  BEGIN
    INSERT INTO public.deals(workspace_id,lead_id,title) SELECT fixture.id,other_lead.id,'Contact' FROM fixture, other_lead;
    RAISE EXCEPTION 'expected same-workspace reference';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END;
$$;
INSERT INTO public.leads(workspace_id,name,email,owner_id)
  SELECT fixture.id,'Contact ' || n,'contact@example.invalid',auth.uid() FROM fixture, generate_series(1,50) n;
INSERT INTO public.activities(workspace_id,lead_id,created_by,title,type)
  SELECT workspace_id,id,auth.uid(),'Call','call' FROM public.leads LIMIT 1;
DO $$
BEGIN
  BEGIN
    INSERT INTO public.activities(workspace_id,lead_id,title,type) SELECT workspace_id,id,'Call','call' FROM public.leads LIMIT 1;
    RAISE EXCEPTION 'expected authorship check';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.leads(workspace_id,name,email) SELECT id,'Contact','contact@example.invalid' FROM fixture;
    RAISE EXCEPTION 'expected lead limit';
  EXCEPTION WHEN raise_exception THEN ASSERT SQLERRM = 'Lead limit reached'; END;
END;
$$;

RESET ROLE;
SET LOCAL ROLE service_role;
UPDATE public.subscriptions SET plan='pro' WHERE workspace_id IN
  (SELECT id FROM public.workspaces WHERE slug='fixture-authz');
RESET ROLE;
SET LOCAL ROLE authenticated;
DO $$ BEGIN ASSERT (SELECT plan FROM public.workspaces WHERE id=(SELECT id FROM fixture)) = 'pro'; END; $$;
INSERT INTO public.leads(workspace_id,name,email) SELECT id,'Pro contact','pro@example.invalid' FROM fixture;
ROLLBACK;
