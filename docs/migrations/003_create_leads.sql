-- ============================================================
-- 003_create_leads.sql
-- Contatos/empresas gerenciados dentro de um workspace
-- ============================================================

CREATE TABLE leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT,
  company         TEXT,
  position        TEXT,
  status          TEXT        NOT NULL DEFAULT 'novo'
                    CHECK (status IN ('novo', 'contato', 'proposta', 'negociacao', 'ganho', 'perdido')),
  owner_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  notes           TEXT,
  estimated_value NUMERIC(12, 2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índices
CREATE INDEX idx_leads_workspace_id ON leads(workspace_id);
CREATE INDEX idx_leads_status        ON leads(workspace_id, status);
CREATE INDEX idx_leads_owner_id      ON leads(owner_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
