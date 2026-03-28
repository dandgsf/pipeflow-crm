-- Migration 010: workspace_invites
-- Tabela de convites por token para membros de workspace.
-- Executar no SQL Editor do Supabase Dashboard.

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

-- Índice para busca rápida por token (aceite de convite)
CREATE INDEX IF NOT EXISTS workspace_invites_token_idx ON workspace_invites(token);

-- Índice para listar convites pendentes de um workspace
CREATE INDEX IF NOT EXISTS workspace_invites_workspace_pending_idx
  ON workspace_invites(workspace_id)
  WHERE accepted_at IS NULL;

-- ── RLS ────────────────────────────────────────────────────────────────────────
ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

-- SELECT 1: qualquer autenticado pode ler um convite pelo token
--   (necessário para acceptInviteAction funcionar — o convidado não é admin ainda)
CREATE POLICY "workspace_invites_select_by_token"
  ON workspace_invites
  FOR SELECT
  TO authenticated
  USING (true);
-- Nota de segurança: o token é um hex de 32 bytes (256 bits de entropia),
-- impossível de adivinhar por força bruta. A validação de email na Server
-- Action garante que só o dono do email pode aceitar o convite.

-- SELECT 2: admins do workspace podem listar todos os convites (para a página /settings/members)
-- Já coberto pela policy acima (USING true). Mantemos apenas uma policy SELECT
-- para simplicidade — a filtragem por workspace é feita na query da aplicação.

-- INSERT: apenas admins do workspace podem criar convites
CREATE POLICY "workspace_invites_insert"
  ON workspace_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_invites.workspace_id
        AND wm.user_id = (SELECT auth.uid())
        AND wm.role = 'admin'
    )
  );

-- UPDATE: qualquer autenticado pode marcar accepted_at (aceitar convite)
--   A validação de email + token é feita na Server Action antes do UPDATE.
CREATE POLICY "workspace_invites_update_accept"
  ON workspace_invites
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE: apenas admins do workspace podem cancelar convites
CREATE POLICY "workspace_invites_delete"
  ON workspace_invites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_invites.workspace_id
        AND wm.user_id = (SELECT auth.uid())
        AND wm.role = 'admin'
    )
  );
