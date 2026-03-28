-- ============================================================
-- 008_search_indexes.sql
-- Índices adicionais para busca e performance
--
-- Aplicar após 003_create_leads.sql
--
-- Por que pg_trgm + GIN?
--   ILIKE '%texto%' sem índice = full table scan.
--   Com gin_trgm_ops, o Postgres usa trigrams para lookup
--   eficiente em ILIKE/LIKE com % em qualquer posição.
--   (Regra 1.2 — escolher o tipo certo de índice)
-- ============================================================

-- Habilita a extensão de trigrams (idempotente)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índice GIN para busca por nome do lead (ILIKE '%...%')
CREATE INDEX idx_leads_name_trgm
  ON leads USING gin (name gin_trgm_ops);

-- Índice GIN para busca por empresa do lead
CREATE INDEX idx_leads_company_trgm
  ON leads USING gin (company gin_trgm_ops);

-- Índice para lookup de leads por email (busca exata)
-- Hash é mais rápido que B-tree para igualdade pura
CREATE INDEX idx_leads_email
  ON leads (workspace_id, email);

-- Índice para busca de deals por título
CREATE INDEX idx_deals_title_trgm
  ON deals USING gin (title gin_trgm_ops);

-- Índice para lookup do workspace por slug (já tem UNIQUE, mas documentado)
-- O UNIQUE constraint em workspaces(slug) já cria um B-tree index implicitamente.
-- Nenhum índice adicional necessário para slug.
