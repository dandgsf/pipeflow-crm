-- ============================================================
-- 005_create_activities.sql
-- Histórico de interações por lead (call, email, meeting, note)
-- ============================================================

CREATE TABLE activities (
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

-- Índices
CREATE INDEX idx_activities_workspace_id ON activities(workspace_id);
CREATE INDEX idx_activities_lead_id      ON activities(lead_id);
CREATE INDEX idx_activities_occurred_at  ON activities(lead_id, occurred_at DESC);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
