-- ============================================================
-- 004_create_deals.sql
-- Cards do Kanban — vinculados a um lead e a uma etapa do pipeline
-- ============================================================

CREATE TABLE deals (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  lead_id         UUID        NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  stage           TEXT        NOT NULL DEFAULT 'novo_lead'
                    CHECK (stage IN (
                      'novo_lead',
                      'contato_realizado',
                      'proposta_enviada',
                      'negociacao',
                      'fechado_ganho',
                      'fechado_perdido'
                    )),
  -- position define a ordem dentro da coluna (inteiro; menor = mais alto no Kanban)
  position        INTEGER     NOT NULL DEFAULT 0,
  estimated_value NUMERIC(12, 2),
  owner_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date        DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reusa a função update_updated_at() criada em 003_create_leads.sql
-- (deve ser executado após 003)
CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índices
CREATE INDEX idx_deals_workspace_id       ON deals(workspace_id);
CREATE INDEX idx_deals_stage              ON deals(workspace_id, stage);
CREATE INDEX idx_deals_lead_id            ON deals(lead_id);
CREATE INDEX idx_deals_stage_position     ON deals(workspace_id, stage, position);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
