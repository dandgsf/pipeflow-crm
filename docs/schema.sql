-- ============================================================
-- PipeFlow CRM — Schema SQL para Supabase
-- ============================================================
-- Autor: Danilo Fernandes
-- Data: Março 2026
-- Stack: Supabase (PostgreSQL) + Next.js 14
--
-- Ordem de execução: rodar este arquivo inteiro no SQL Editor
-- do Supabase. As tabelas são criadas na ordem correta
-- respeitando dependências de foreign keys.
-- ============================================================


-- ============================================================
-- 1. EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- 2. TABELAS
-- ============================================================

-- ---------- WORKSPACES ----------
-- Cada workspace = 1 empresa/time. Isolamento multi-tenant.
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------- MEMBERS ----------
-- Conecta usuários a workspaces com papel (admin/member).
-- Um usuário pode participar de múltiplos workspaces.
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- null para convites pendentes
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    email TEXT, -- usado para convites pendentes
    joined_at TIMESTAMPTZ DEFAULT now()
);

-- Unique parcial: apenas quando user_id não é null
CREATE UNIQUE INDEX members_workspace_user_unique
    ON members (workspace_id, user_id)
    WHERE user_id IS NOT NULL;

-- Impedir convites duplicados para o mesmo email no mesmo workspace
CREATE UNIQUE INDEX members_workspace_email_unique
    ON members (workspace_id, email)
    WHERE email IS NOT NULL;

-- ---------- SUBSCRIPTIONS ----------
-- Controla o plano de cada workspace (free ou pro).
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE UNIQUE,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------- LEADS ----------
-- Contatos/clientes potenciais do workspace.
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    position TEXT, -- cargo
    source TEXT, -- origem: site, indicação, linkedin, etc.
    status TEXT NOT NULL CHECK (status IN ('new', 'qualified', 'disqualified')) DEFAULT 'new',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------- DEALS (NEGÓCIOS) ----------
-- Negócios/oportunidades vinculados a leads, organizados no pipeline.
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value DECIMAL(12,2) DEFAULT 0, -- valor estimado em R$
    stage TEXT NOT NULL CHECK (stage IN (
        'new_lead',
        'contacted',
        'proposal_sent',
        'negotiation',
        'closed_won',
        'closed_lost'
    )) DEFAULT 'new_lead',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    expected_close_date DATE,
    closed_at TIMESTAMPTZ, -- preenchido quando fecha (ganho ou perdido)
    position INTEGER DEFAULT 0, -- ordem dentro da coluna (para drag-and-drop)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------- ACTIVITIES (ATIVIDADES/INTERAÇÕES) ----------
-- Registro de cada ponto de contato com o lead.
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL, -- opcional: vincular a um negócio
    type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note')),
    description TEXT NOT NULL,
    performed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    performed_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 3. ÍNDICES (para performance)
-- ============================================================
CREATE INDEX idx_leads_workspace ON leads(workspace_id);
CREATE INDEX idx_leads_status ON leads(workspace_id, status);
CREATE INDEX idx_leads_assigned ON leads(workspace_id, assigned_to);
CREATE INDEX idx_deals_workspace ON deals(workspace_id);
CREATE INDEX idx_deals_stage ON deals(workspace_id, stage);
CREATE INDEX idx_deals_lead ON deals(lead_id);
CREATE INDEX idx_activities_lead ON activities(lead_id);
CREATE INDEX idx_activities_workspace ON activities(workspace_id);
CREATE INDEX idx_members_workspace ON members(workspace_id);
CREATE INDEX idx_members_user ON members(user_id);


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Habilitar RLS em todas as tabelas
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- ---------- FUNÇÕES AUXILIARES ----------
-- Retorna os workspace_ids que o usuário logado tem acesso
CREATE OR REPLACE FUNCTION get_user_workspace_ids()
RETURNS SETOF UUID AS $$
    SELECT workspace_id FROM members WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Verifica se o usuário é admin de um workspace (SECURITY DEFINER para evitar recursão RLS)
CREATE OR REPLACE FUNCTION is_workspace_admin(ws_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM members
        WHERE workspace_id = ws_id
          AND user_id = auth.uid()
          AND role = 'admin'
    )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---------- POLICIES: WORKSPACES ----------
CREATE POLICY "Users can view their workspaces"
    ON workspaces FOR SELECT
    USING (id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Authenticated users can create workspaces"
    ON workspaces FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update their workspaces"
    ON workspaces FOR UPDATE
    USING (id IN (
        SELECT workspace_id FROM members
        WHERE user_id = auth.uid() AND role = 'admin'
    ));

-- ---------- POLICIES: MEMBERS ----------
CREATE POLICY "Users can view members of their workspaces"
    ON members FOR SELECT
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Admins can insert members"
    ON members FOR INSERT
    WITH CHECK (
        is_workspace_admin(workspace_id)
        OR user_id = auth.uid()  -- permitir self-insert no onboarding
    );

CREATE POLICY "Admins can delete members"
    ON members FOR DELETE
    USING (is_workspace_admin(workspace_id));

CREATE POLICY "Users can accept invites"
    ON members FOR UPDATE
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND user_id IS NULL
    )
    WITH CHECK (user_id = auth.uid());

-- ---------- POLICIES: SUBSCRIPTIONS ----------
CREATE POLICY "Users can view subscription of their workspaces"
    ON subscriptions FOR SELECT
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "System can manage subscriptions"
    ON subscriptions FOR ALL
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- ---------- POLICIES: LEADS ----------
CREATE POLICY "Users can view leads of their workspaces"
    ON leads FOR SELECT
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can create leads in their workspaces"
    ON leads FOR INSERT
    WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can update leads in their workspaces"
    ON leads FOR UPDATE
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can delete leads in their workspaces"
    ON leads FOR DELETE
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- ---------- POLICIES: DEALS ----------
CREATE POLICY "Users can view deals of their workspaces"
    ON deals FOR SELECT
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can create deals in their workspaces"
    ON deals FOR INSERT
    WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can update deals in their workspaces"
    ON deals FOR UPDATE
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can delete deals in their workspaces"
    ON deals FOR DELETE
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- ---------- POLICIES: ACTIVITIES ----------
CREATE POLICY "Users can view activities of their workspaces"
    ON activities FOR SELECT
    USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can create activities in their workspaces"
    ON activities FOR INSERT
    WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "Users can delete their own activities"
    ON activities FOR DELETE
    USING (performed_by = auth.uid());


-- ============================================================
-- 5. TRIGGERS (updated_at automático)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 6. DADOS INICIAIS (seed para desenvolvimento)
-- ============================================================
-- NOTA: Estes dados são para teste local.
-- Em produção, os dados serão criados pelos usuários.
-- Para usar, substitua 'SEU_USER_ID_AQUI' pelo UUID
-- do seu usuário no Supabase Auth após criar a conta.
--
-- Exemplo de uso (descomentar após criar conta):
--
-- INSERT INTO workspaces (id, name, slug, created_by) VALUES
--     ('11111111-1111-1111-1111-111111111111', 'Minha Empresa', 'minha-empresa', 'SEU_USER_ID_AQUI');
--
-- INSERT INTO members (workspace_id, user_id, role) VALUES
--     ('11111111-1111-1111-1111-111111111111', 'SEU_USER_ID_AQUI', 'admin');
--
-- INSERT INTO subscriptions (workspace_id, plan) VALUES
--     ('11111111-1111-1111-1111-111111111111', 'free');
