# PipeFlow CRM — Plano de Execução

> Estratégia: **Interface primeiro, backend depois.**
> Cada milestone entrega algo visível e testável no browser.
> Dados mockados na Fase 1. Integração real na Fase 2.

---

## Visão Geral

```
FASE 1 — INTERFACE (UI-first, dados mockados)
  M0  Setup & Configuração         → branch: main
  M1  Design System & App Shell    → branch: feat/app-shell
  M2  Auth & Onboarding (UI)       → branch: feat/auth-ui
  M3  Leads — Telas & Componentes  → branch: feat/leads-ui
  M4  Pipeline Kanban (UI)         → branch: feat/pipeline-ui
  M5  Dashboard de Métricas (UI)   → branch: feat/dashboard-ui
  M6  Landing Page                 → branch: feat/landing

FASE 2 — BACKEND & INTEGRAÇÃO
  M7  Banco de Dados & Auth Real   → branch: feat/supabase-core
  M8  Leads & Pipeline — Dados     → branch: feat/leads-data
  M9  Workspace & Colaboração      → branch: feat/collaboration
  M10  Monetização (Stripe)          → branch: feat/billing-nextjs
  M10½ Multi-Workspace              → branch: feat/multi-workspace
  M11  Deploy & Produção            → branch: feat/deploy
```

---

## FASE 1 — INTERFACE

---

### M0 — Setup & Configuração

**Branch:** `main`
**Objetivo:** Repositório pronto para desenvolvimento com todas as ferramentas configuradas.

#### Entregas

- [x] Criar repositório no GitHub (`pipeflow-crm`)
- [x] Scaffold Next.js com TypeScript, Tailwind e App Router
  ```bash
  npx create-next-app@latest . --yes --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
  ```
- [x] Configurar shadcn/ui
  ```bash
  npx shadcn@latest init
  ```
- [x] Corrigir Geist font (mover variáveis para `<html>`, literais no `@theme inline`)
- [x] Instalar dependências do projeto
  ```bash
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts
  npm install @supabase/supabase-js @supabase/ssr
  npm install stripe @stripe/stripe-js
  npm install resend
  npm install react-hook-form @hookform/resolvers zod
  npm install date-fns lucide-react
  ```
- [x] Instalar componentes shadcn/ui necessários
  ```bash
  npx shadcn@latest add button input textarea card tabs table dialog alert-dialog sheet dropdown-menu badge separator skeleton avatar select form
  ```
- [x] Criar estrutura de pastas (`src/components/`, `src/lib/`, `src/types/`, `src/hooks/`)
- [x] Configurar `src/types/index.ts` com tipos base (Workspace, Lead, Deal, Activity, etc.)
- [x] Criar `.env.local.example` com todas as variáveis de ambiente
- [x] Configurar `.gitignore` (incluir `.env*.local`)
- [x] Verificar `npm run build` sem erros

#### Commit Final
```
feat: project setup — Next.js 14, shadcn/ui, Tailwind, TypeScript, all dependencies installed
```

---

### M1 — Design System & App Shell

**Branch:** `feat/app-shell`
**Objetivo:** Shell da aplicação completo com navegação, layout dark mode e dados estáticos.

#### Entregas

**Layout & Navegação**
- [x] `src/app/(app)/layout.tsx` — layout autenticado com sidebar
- [x] `src/components/layout/sidebar.tsx` — sidebar com links: Dashboard, Leads, Pipeline, Configurações
- [x] `src/components/layout/navbar.tsx` — topbar com avatar do usuário e menu
- [x] `src/components/layout/workspace-switcher.tsx` — dropdown estático com workspaces mockados
- [x] Rota `/dashboard` com página placeholder
- [x] Rota `/leads` com página placeholder
- [x] Rota `/pipeline` com página placeholder
- [x] Rota `/settings` com página placeholder

**Design Tokens & Dark Mode**
- [x] Dark mode como padrão no app shell (`class="dark"` no `<html>` via DarkModeEnforcer)
- [x] Paleta zinc/slate com accent indigo no `globals.css`
- [x] Geist Sans e Geist Mono configurados e funcionando

**Estados Globais**
- [x] Componente `<PageHeader>` reutilizável (título + breadcrumb + ação primária)
- [x] Componente `<EmptyState>` (ícone + mensagem + CTA)
- [x] Skeleton genérico `<LoadingSkeleton>` para loading states
- [x] Página `not-found.tsx` global

**Verificação**
- [x] Sidebar colapsa em mobile (Sheet)
- [x] Navegação entre rotas funciona
- [x] Sem erros no console

#### Commit Final
```
feat(shell): app layout with sidebar, navbar, workspace switcher, dark mode design tokens
```

---

### M2 — Auth & Onboarding (UI)

**Branch:** `feat/auth-ui`
**Objetivo:** Fluxo completo de autenticação e onboarding com UI finalizada. Sem backend real ainda — navegação hardcoded.

#### Entregas

**Telas de Auth** (`src/app/(auth)/`)
- [x] `login/page.tsx` — formulário email + senha, link para registro, light mode
- [x] `register/page.tsx` — formulário nome + email + senha + confirmar senha
- [x] Layout `(auth)/layout.tsx` — centralizado, logo PipeFlow, light mode

**Onboarding** (`src/app/(onboarding)/onboarding/`)
- [x] `page.tsx` — passo único: criar primeiro workspace (nome)
- [x] Redirecionamento para `/dashboard` após submit (mock)

**Componentes**
- [x] `src/components/auth/login-form.tsx` — formulário com validação Zod (react-hook-form)
- [x] `src/components/auth/register-form.tsx` — formulário com validação
- [x] `src/components/auth/workspace-form.tsx` — formulário de criação de workspace

**UX**
- [x] Estados de loading nos botões (spinner durante submit)
- [x] Mensagens de erro inline nos campos
- [x] Link "Esqueceu a senha?" (tela placeholder)
- [x] Validação client-side com zod schemas

#### Commit Final
```
feat(auth): login, register and onboarding UI with form validation — no backend yet
```

---

### M3 — Leads — Telas & Componentes

**Branch:** `feat/leads-ui`
**Objetivo:** Gestão completa de leads com dados mockados. UI 100% funcional visualmente.

#### Mock Data
- [x] `src/lib/mock/leads.ts` — array com 10-15 leads mockados com todos os campos

#### Listagem de Leads (`/leads`)
- [x] Tabela com colunas: Nome, Empresa, Cargo, Status, Responsável, Data de Criação
- [x] Badge de status com cores (Novo, Contato, Proposta, Negociação, Ganho, Perdido)
- [x] Barra de busca por nome/empresa (filtro client-side sobre mock)
- [x] Filtro por status (Select)
- [x] Filtro por responsável (Select)
- [x] Botão "Novo Lead" → abre dialog
- [x] Paginação (UI, sem lógica real ainda)
- [x] EmptyState quando sem resultados

**Componentes**
- [x] `src/components/leads/leads-table.tsx`
- [x] `src/components/leads/leads-filters.tsx`
- [x] `src/components/leads/lead-status-badge.tsx`

#### Formulário de Lead (Dialog)
- [x] `src/components/leads/lead-form-dialog.tsx` — Dialog com formulário completo
- [x] Campos: nome*, email*, telefone, empresa, cargo, status, responsável, notas
- [x] Validação Zod em todos os campos obrigatórios
- [x] Estados: criando vs editando (título dinâmico)
- [x] Botão de exclusão com AlertDialog de confirmação

#### Página de Detalhe (`/leads/[id]`)
- [x] `src/app/(app)/leads/[id]/page.tsx`
- [x] Perfil do lead (nome, empresa, contato, status) — card lateral
- [x] Seção de informações (cargo, responsável, data criação, valor estimado)
- [x] Timeline de atividades (UI estática com dados mockados)
- [x] Botão "Editar Lead" → abre lead-form-dialog
- [x] Botão "Registrar Atividade" → desabilitado (M8)

**Componentes**
- [x] `src/components/leads/lead-profile-card.tsx`
- [x] `src/components/leads/activity-timeline.tsx` (UI estática)
- [x] `src/components/leads/activity-item.tsx`

#### Commit Final
```
feat(leads): leads list with search/filters, lead detail page, create/edit/delete dialog — mock data
```

---

### M4 — Pipeline Kanban (UI) ✅

**Branch:** `feat/pipeline-ui` → mergeado em `main` (PR #4)
**Objetivo:** Kanban visual com drag-and-drop funcional, usando dados mockados.

#### Mock Data
- [x] `src/lib/mock/deals.ts` — 16 deals distribuídos pelas 6 colunas do pipeline

#### Board Kanban (`/pipeline`)
- [x] `src/app/(app)/pipeline/page.tsx` — layout horizontal com scroll
- [x] 6 colunas fixas com header (nome da etapa + contador + valor total)
- [x] Scroll horizontal no board, scroll vertical por coluna
- [x] Botão "Novo Negócio" no header da página

**Componentes**
- [x] `src/components/pipeline/kanban-board.tsx` — container DndContext
- [x] `src/components/pipeline/kanban-column.tsx` — SortableContext por coluna
- [x] `src/components/pipeline/deal-card.tsx` — card arrastável

**Deal Card**
- [x] Título do negócio
- [x] Avatar + nome do lead vinculado (avatar colorido com cor da etapa)
- [x] Valor estimado (R$) em IBM Plex Mono, cor da etapa
- [x] Nome do responsável
- [x] Prazo com cor de alerta se vencido (vermelho #FF4757 + badge "Vencido")
- [x] Menu de ações (⋮): editar, mover para, excluir

**Drag & Drop (@dnd-kit)**
- [x] Arrastar card entre colunas — estado local atualiza visualmente
- [x] Overlay animado durante o drag (rotate 1.5deg + scale 1.04, accent top-line)
- [x] Indicador visual na coluna de destino (borda chartreuse #CAFF33)
- [x] Touch support (mobile) via TouchSensor

**Formulário de Negócio**
- [x] `src/components/pipeline/deal-form-dialog.tsx`
- [x] Campos: título*, lead vinculado (select)*, valor estimado, responsável, prazo, observações
- [x] Pré-seleciona a coluna quando "Novo Negócio" é clicado em uma coluna específica

**Brand Identity v2 aplicada**
- [x] Fontes: Syne (display) + DM Sans (body) + IBM Plex Mono (dados)
- [x] Accent chartreuse #CAFF33 como primary em dark mode
- [x] Sidebar: logo mark quadrado chartreuse com "P", item ativo em chartreuse
- [x] Cards: accent line no topo via inset box-shadow (sem glassmorphism)
- [x] Stage colors atualizados: cool blue, cyan, chartreuse, orange, green, red
- [x] Noise texture SVG no body (opacity 0.03)

**Verificação**
- [x] Drag entre todas as 6 colunas funciona
- [x] Estado persiste enquanto página está aberta
- [x] Touch support mobile
- [x] `npx tsc --noEmit` zero erros

#### Commit Final
```
feat(pipeline): kanban board with 6 stages, drag-and-drop, deal cards + brand identity v2
```

---

### M5 — Dashboard de Métricas (UI)

**Branch:** `feat/dashboard-ui`
**Objetivo:** Dashboard completo com métricas, gráfico e lista de deals próximos — dados mockados.

#### Mock Data
- [x] `src/lib/mock/metrics.ts` — valores mockados para todos os cards e gráfico

#### Página Dashboard (`/dashboard`)
- [x] `src/app/(app)/dashboard/page.tsx`

**Cards de Métricas**
- [x] `src/components/dashboard/metric-card.tsx` — ícone, label, valor, variação (%)
- [x] Card: Total de Leads
- [x] Card: Negócios Abertos
- [x] Card: Valor Total do Pipeline (R$)
- [x] Card: Taxa de Conversão (%)

**Gráfico de Funil (Recharts)**
- [x] `src/components/dashboard/funnel-chart.tsx` — FunnelChart com as 6 etapas
- [x] Tooltip com quantidade e valor por etapa
- [x] Legenda das etapas
- [x] Responsivo (ResponsiveContainer)

**Lista de Deals com Prazo Próximo**
- [x] `src/components/dashboard/upcoming-deals.tsx`
- [x] Tabela compacta: título, lead, etapa, prazo, responsável
- [x] Cor de alerta para prazos vencidos
- [x] Link para o deal no pipeline

**Layout**
- [x] Grid responsivo: 2 colunas em tablet, 4 em desktop para metric cards
- [x] Gráfico ocupa largura total
- [x] Deals próximos abaixo do gráfico

#### Commit Final
```
feat(dashboard): metric cards, sales funnel chart (Recharts), upcoming deals list — mock data
```

---

### M6 — Landing Page ✅

**Branch:** `feat/landing` → mergeado em `main`
**Objetivo:** Landing page pública de apresentação do PipeFlow CRM, dark mode, pronta para deploy.

#### Estrutura (`src/app/(marketing)/`)
- [x] `layout.tsx` — layout público sem auth
- [x] `page.tsx` — composição de todas as seções (496 linhas)

**Seções**
- [x] Hero com orbs animados, headline, CTA "Começar Grátis" → `/register`
- [x] Pipeline visualization terminal (animação de etapas)
- [x] Stats section (4 métricas de impacto)
- [x] Features grid (6 cards com ícones e descrições)
- [x] `src/components/landing/success-cases.tsx` — 3 cards com CountUp animado
- [x] Pricing section (Free vs Pro com destaque visual)
- [x] CTA final com wave separators
- [x] `src/components/landing/navbar-mobile.tsx` — menu mobile
- [x] `src/components/shared/logo.tsx` — Logo PipeFlow com accent e linha pulsante
- [x] `src/components/shared/wave-separator.tsx` — divisor SVG animado
- [x] `src/components/shared/animate-on-scroll.tsx` — Intersection Observer fade-in

**UX & Brand Identity**
- [x] Dark mode (bg `#0A0A0A`, accent chartreuse `#CAFF33`)
- [x] Fontes: Syne (display) + DM Sans (body) + IBM Plex Mono (dados)
- [x] Animações CSS: orbs flutuantes, wave scroll, flow pulse, page enter, stagger
- [x] Glassmorphism e glow em botões accent
- [x] Responsivo (mobile-first)
- [x] Meta tags SEO no `layout.tsx` root

**Auth & Onboarding (identidade visual corrigida)**
- [x] `(auth)/layout.tsx` — dark mode com orbs e logo PipeFlow
- [x] `(onboarding)/onboarding/page.tsx` — dark mode idêntico ao auth
- [x] `workspace-form.tsx` — tokens PipeFlow (bg-pf-surface, accent, inputs dark)

#### Commit Final
```
feat(landing): public marketing page — dark mode, hero, features, pricing, CTA, brand identity v2
```

---

## FASE 2 — BACKEND & INTEGRAÇÃO

---

### M7 — Banco de Dados & Auth Real ✅

**Branch:** `feat/supabase-core` → mergeado em `main` (PR #8)
**Objetivo:** Supabase configurado localmente e em produção, auth real funcionando, dados persistentes.

#### Setup Supabase
- [x] Criar projeto no Supabase Dashboard
- [x] Configurar variáveis de ambiente reais no `.env.local`
- [x] Criar `src/lib/supabase/client.ts` — browser client (lazy singleton)
- [x] Criar `src/lib/supabase/server.ts` — server client com cookies (lazy, async)

#### Migrations (SQL direto no Supabase Dashboard)

> Não utilizamos Supabase CLI. As migrations são aplicadas diretamente no **SQL Editor** do Supabase Dashboard. Os arquivos ficam em `docs/migrations/` apenas como referência e controle de versão.

- [x] `docs/migrations/001_create_workspaces.sql`
  ```sql
  CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro'
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```
- [x] `docs/migrations/002_create_workspace_members.sql`
  ```sql
  CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- 'admin' | 'member'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(workspace_id, user_id)
  );
  ```
- [x] `docs/migrations/003_create_leads.sql`
- [x] `docs/migrations/004_create_deals.sql` (com coluna `stage` e `position` para ordenação)
- [x] `docs/migrations/005_create_activities.sql`
- [x] `docs/migrations/006_create_subscriptions.sql`
- [x] `docs/migrations/007_rls_policies.sql` — RLS em todas as tabelas; `(SELECT auth.uid())` para performance, `SET search_path=''` nas funções SECURITY DEFINER, policies `TO authenticated`
- [x] `docs/migrations/007_drop_before_recreate.sql` — helper para recriar funções/policies com CASCADE
- [x] `docs/migrations/008_search_indexes.sql` — `pg_trgm` + GIN indexes em `leads.name/company` e `deals.title`; índice composto `(workspace_id, email)`
- [x] `docs/migrations/009_create_workspace_rpc.sql` — função `create_workspace` PL/pgSQL atômica (SECURITY DEFINER, REVOKE PUBLIC, GRANT authenticated)
- [x] Executar cada arquivo no SQL Editor do Supabase Dashboard e validar

#### Tipos TypeScript
- [x] Gerar `src/types/supabase.ts` via **Supabase Dashboard → Settings → API → Generate types** (download) ou copiar do editor
- [x] Atualizar `src/types/index.ts` para usar os tipos gerados

#### Auth Real
- [x] Configurar Supabase Auth: Email/Password habilitado
- [x] `src/proxy.ts` — proteger rotas `(app)/*`, redirecionar para `/login` se sem sessão (`proxyConfig` — Next.js 16)
- [x] `src/app/(auth)/login/page.tsx` — conectar form ao Supabase Auth (`signInWithPassword`); `<Suspense>` para `useSearchParams`
- [x] `src/app/(auth)/register/page.tsx` — conectar ao Supabase Auth (`signUp`) com `emailRedirectTo`
- [x] `src/app/(onboarding)/onboarding/page.tsx` — Server Action `createWorkspaceAction` cria workspace + workspace_member via RPC atômico
- [x] Callback de auth: `src/app/auth/callback/route.ts` — `exchangeCodeForSession`
- [x] Logout: `signOutAction` em `src/lib/actions/workspace.ts`, chamada pelo navbar
- [x] Redirecionar para onboarding se usuário não tem workspace

#### Context de Workspace
- [x] `src/hooks/use-workspace.ts` — lê workspace ativo do cookie
- [x] `src/lib/workspace.ts` — `getWorkspaceContext()` (única query, sem N+1), `getActiveWorkspace()`, `setActiveWorkspace()`
- [x] `src/lib/actions/workspace.ts` — `switchWorkspaceAction` (verifica membership, seta cookie, redirect)
- [x] Workspace switcher funcional (atualiza cookie, revalida página)

**Verificação**
- [x] Registro → email de confirmação → login → onboarding → dashboard
- [x] Logout redireciona para `/login`
- [x] Rotas protegidas redirecionam quem não está logado

#### Commit Final
```
feat(supabase): database migrations, RLS policies, real auth flow, workspace context
```

---

### M8 — Leads & Pipeline — Dados Reais ✅

**Branch:** `feat/leads-data` → mergeado em `main` (PR #9)
**Objetivo:** Substituir todos os dados mockados por dados reais do Supabase.

#### Server Actions (`src/lib/actions/`)
- [x] `leads.ts` — `createLeadAction`, `updateLeadAction`, `deleteLeadAction`
- [x] `deals.ts` — `createDealAction`, `updateDealAction`, `moveDealAction`, `deleteDealAction`
- [x] `activities.ts` — `createActivityAction`

#### Integração nas Páginas
- [x] `/leads` — Server Component com query real + filtros passados via props
- [x] `/leads/[id]` — Server Component busca lead + atividades reais; "Registrar Atividade" habilitado
- [x] Formulário de lead — Server Action real com `revalidatePath`, otimismo com revert em erro
- [x] `/pipeline` — buscar deals com join `lead:leads(id, name, company, email)`
- [x] Drag-and-drop → `moveDealAction(id, stage, position)` chamado no `onDragEnd`
- [x] `/dashboard` — métricas reais: total leads, negócios abertos, valor do pipeline, conversão

#### Filtros e Busca
- [x] Filtros de leads funcionam contra dados reais (passados como props para client component)
- [x] Membros reais no select de responsável (sem mock)

#### Bug Fixes
- [x] Hydration mismatch: `id="pipeline-kanban"` no `DndContext` + `isOverdue` computado inline
- [x] Cursor offset no drag: removido `rotate/scale` do `DragOverlay`
- [x] Campo de valor invadido: `grid-cols-1 sm:grid-cols-2` nos forms
- [x] Revert otimista preserva índice original com `splice`

**Verificação**
- [x] CRUD completo de leads funciona e persiste após reload
- [x] Drag no pipeline persiste após reload
- [x] Dados do dashboard refletem o banco real
- [x] RLS: usuário só vê dados do seu workspace

#### Commit Final
```
feat(leads-pipeline): replace mock data with real Supabase queries and Server Actions
```

---

### M9 — Workspace & Colaboração ✅

**Branch:** `feat/collaboration` → mergeado em `main` (PR #10)
**Objetivo:** Convites por e-mail, gestão de membros e isolamento multi-workspace funcional.

#### Server Actions
- [x] `src/lib/actions/workspaces.ts`
  - `inviteMemberAction(email, role)` — cria convite + envia e-mail via Resend, retorna `warning` se email falhou
  - `acceptInviteAction(token)` — valida token + email, cria workspace_member, retorna `expectedEmail` se email errado
  - `removeMemberAction(memberId)` — remove (apenas admin, protege último admin)
  - `updateMemberRoleAction(memberId, role)` — muda role (apenas admin, protege último admin)
  - `cancelInviteAction(inviteId)` — cancela convite pendente (apenas admin)
  - `updateWorkspaceAction(name)` — atualiza nome (apenas admin)

#### Resend — E-mail de Convite
- [x] `src/lib/resend.ts` — lazy singleton (já existia)
- [x] `src/emails/workspace-invite.tsx` — template HTML puro (sem react-dom/server — Turbopack-safe)
- [x] `src/app/invite/[token]/page.tsx` — rota pública com detecção de email errado + SwitchAccountButton
- [x] `src/app/invite/[token]/switch-account-button.tsx` — faz signOut e preserva token na URL
- [x] Tabela `workspace_invites` (token 256-bit, email, workspace_id, role, expires_at, accepted_at)
- [x] Migration: `docs/migrations/010_create_workspace_invites.sql`

#### Página de Configurações
- [x] `src/app/(app)/settings/layout.tsx` — layout com tabs Workspace / Membros
- [x] `/settings/workspace` — nome + slug (readonly) + plano; edição apenas admin
- [x] `/settings/members` — lista de membros + convites pendentes + banner limite Free
- [x] Validação de limites do plano Free (máx 2 membros) na Server Action e UI

#### Role Enforcement
- [x] `src/lib/permissions.ts` — `isAdmin()` e `getMemberRole()`
- [x] Server Actions verificam role antes de mutações sensíveis
- [x] UI esconde botões de admin para membros

#### Fluxo de Auth com Convite
- [x] `proxy.ts` — usuário autenticado com `?invite=` vai direto para `/invite/[token]`
- [x] `login-form.tsx` — banner de convite pendente, preserva token no link "Criar conta"
- [x] `register-form.tsx` — emailRedirectTo aponta para `/invite/[token]` se há token

#### Outros
- [x] `src/components/ui/currency-input.tsx` — input BRL formatado nos forms de lead e deal
- [x] `src/types/supabase.ts` — tipos da tabela `workspace_invites`

**Verificação**
- [x] Build limpo (`npm run build`, 14 rotas, zero erros TypeScript)
- [ ] Convidar por email → e-mail chega no Resend Dashboard → link de aceite funciona
- [ ] Membro convidado acessa o workspace sem acesso a outros workspaces
- [ ] Admin remove membro → membro perde acesso imediatamente

#### Commit Final
```
feat(collaboration): workspace member invites via Resend, role enforcement, settings pages
```

---

### M10 — Monetização (Stripe) ✅

**Branch:** `feat/billing-nextjs` → mergeado em `main` (PR #11)
**Objetivo:** Planos Free e Pro com checkout, webhook e enforcement de limites.

#### Setup Stripe
- [x] `src/lib/stripe.ts` — lazy singleton com `process.env.STRIPE_SECRET_KEY` (já existia do M0)
- [x] Criar produto "PipeFlow Pro" e preço R$49/mês no Stripe Dashboard
- [x] Configurar variáveis: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`

#### Checkout
- [x] Server Action `createCheckoutSessionAction()` em `src/lib/actions/billing.ts`
  - `success_url` → `/settings/billing?success=true`
  - `cancel_url` → `/settings/billing`
  - `metadata: { workspaceId, userId }`
  - Busca ou cria `stripe_customer_id` com validação de customer existente
- [x] Botão "Assinar Pro" na página `/settings/billing` chama a Server Action via `CheckoutButton`

#### Webhook (Route Handler — não Edge Function)
- [x] `src/app/api/webhooks/stripe/route.ts` — Route Handler (não Server Action)
- [x] Verificar assinatura HMAC com `stripe.webhooks.constructEvent`
- [x] Supabase Admin com `SUPABASE_SERVICE_ROLE_KEY` (webhook não tem sessão de usuário)
- [x] Eventos tratados:
  - `checkout.session.completed` → upsert `subscriptions.plan = 'pro'` + `workspaces.plan = 'pro'`
  - `invoice.payment_succeeded` → fallback para ativar Pro (resolve workspaceId via metadata ou customer_id)
  - `customer.subscription.deleted` → update `subscriptions.plan = 'free'` + `workspaces.plan = 'free'`
  - `invoice.payment_failed` → update `subscriptions.plan = 'payment_failed'`
- [x] `npx stripe listen --forward-to localhost:3000/api/webhooks/stripe` para dev

#### Enforcement de Limites
- [x] `src/lib/limits.ts` — `canAddLead()` (Free: 50) e `canAddMember()` (Free: 2)
- [x] `createLeadAction` em `leads.ts` — verifica `canAddLead()` antes de inserir
- [x] `inviteMemberAction` em `workspaces.ts` — usa `canAddMember()` centralizado

#### Página de Billing (`/settings/billing`)
- [x] Card plano atual (Free, Pro ou Payment Failed + data de renovação)
- [x] Card comparação de planos (Free vs Pro com features)
- [x] `CheckoutButton` — "Assinar Pro" (plano Free)
- [x] `PortalButton` — "Gerenciar Assinatura" (plano Pro)
- [x] Banner de sucesso (`?success=true`)
- [x] Banner de alerta para `payment_failed` com link pro Portal
- [x] Tab "Assinatura" no layout de settings

#### Migrations
- [x] `docs/migrations/012_add_payment_failed_plan.sql` — adiciona `payment_failed` ao CHECK constraint

**Verificação**
- [ ] Checkout completo → plano atualiza no Supabase
- [ ] Cancelamento via Portal → plano volta para Free
- [ ] Criar >50 leads no Free retorna erro
- [ ] Webhook idempotente (re-processar mesmo evento não duplica dados)

#### Commit Final
```
feat(billing): Stripe checkout, webhook handler, plan limits enforcement, billing page
```

---

### M10½ — Multi-Workspace ✅

**Branch:** `feat/multi-workspace` → mergeado em `main` (PR #12)
**Objetivo:** Habilitar criação de múltiplos workspaces com limites por plano. Complementa M9 (colaboração) e M10 (billing).

#### Regra de Negócio
- **Free:** 1 workspace como admin (criado no onboarding)
- **Pro:** Ilimitado (admin de ao menos 1 workspace Pro pode criar mais)
- Cada novo workspace nasce no plano Free com seu próprio ciclo de billing

#### Entregas

**Limit Check**
- [x] `src/lib/limits.ts` — `canCreateWorkspace()` (query admin memberships com join no plano)
- [x] `src/lib/actions/workspace.ts` — guard server-side no `createWorkspaceAction`

**UI**
- [x] `src/components/workspace/create-workspace-dialog.tsx` — Dialog com form (Pro) ou prompt de upgrade (Free)
- [x] `src/components/layout/workspace-switcher.tsx` — botão "Criar workspace" habilitado
- [x] Propagação de `canCreateWorkspace` via sidebar → navbar → layout

**Bug Fix**
- [x] `src/app/api/webhooks/stripe/route.ts` — fix tipo `invoice.subscription` (Stripe SDK breaking change)

**Verificação**
- [x] Build limpo (`npm run build`, 17 rotas, zero erros TypeScript)
- [ ] Free com 1 workspace: dialog mostra prompt de upgrade
- [ ] Pro: dialog mostra form → cria workspace → redireciona para dashboard
- [ ] Server-side rejeita criação quando limite excedido
- [ ] Mobile: workspace switcher funciona com botão habilitado

#### Commit Final
```
feat(workspace): enable multi-workspace creation with plan-based limits
```

---

### M11 — Deploy & Produção ✅

**Branch:** `feat/deploy` → mergeado em `main` (PR #13)
**Objetivo:** Aplicação em produção no Vercel + Supabase, estável e monitorável.

#### Supabase em Produção
- [x] Script consolidado: `docs/migrations/PRODUCTION_FULL_MIGRATION.sql` (idempotente)
- [x] Executar migrations no SQL Editor do projeto de produção
- [x] Fix RPC `create_workspace`: drop versão antiga (3 params), manter versão segura (2 params)
- [x] Fallback resiliente na Server Action (INSERTs diretos se RPC falhar)
- [x] RLS habilitado em todas as 7 tabelas
- [x] Supabase Auth configurado com URLs de produção

#### Vercel
- [x] Repositório GitHub conectado ao Vercel (deploy automático na `main`)
- [x] Variáveis de ambiente configuradas no Vercel Dashboard
- [x] Deploy em produção: `https://pipeflow-crm.vercel.app`
- [x] Build sem erros (16 rotas, Next.js 16.2.1 + Turbopack)

#### Segurança
- [x] Security headers: CSP (com `fonts.googleapis.com`), HSTS, X-Frame-Options, X-Content-Type-Options
- [x] `poweredByHeader: false` no next.config.ts
- [x] Open redirect prevention no login-form e auth/callback
- [x] Service role key isolada no webhook handler (único lugar correto)
- [x] `.env*.local` e `.vercel` no .gitignore
- [x] Proxy protege rotas `/dashboard`, `/leads`, `/pipeline`, `/settings`
- [x] RLS hardening: workspace_invites SELECT/UPDATE restritos, subscriptions INSERT admin-only
- [x] `create_workspace` RPC usa `auth.uid()` (sem IDOR)

#### Stripe em Produção (pendente webhook live)
- [ ] Criar webhook no Stripe Dashboard → `https://pipeflow-crm.vercel.app/api/webhooks/stripe`
  - Eventos: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Copiar Signing Secret → atualizar `STRIPE_WEBHOOK_SECRET` no Vercel

#### Commit Final
```
feat(deploy): production deployment on Vercel + Supabase, workspace creation fix, security hardening
```

---

## Referência Rápida de Branches

| Branch | Milestone | Descrição |
|---|---|---|
| `main` | M0 | Setup inicial |
| `feat/app-shell` | M1 | Layout, sidebar, dark mode |
| `feat/auth-ui` | M2 | Login, registro, onboarding (UI) |
| `feat/leads-ui` | M3 | Leads list, detalhe, forms (UI) |
| `feat/pipeline-ui` | M4 | Kanban com drag-and-drop (UI) |
| `feat/dashboard-ui` | M5 | Métricas e gráfico (UI) |
| `feat/landing` | M6 | Landing page pública |
| `feat/supabase-core` | M7 | Auth real + migrations + RLS |
| `feat/leads-data` | M8 | CRUD real leads + pipeline |
| `feat/collaboration` | M9 | Convites + membros + roles |
| `feat/billing-nextjs` | M10 | Stripe checkout + webhook + limites |
| `feat/multi-workspace` | M10½ | Criação de múltiplos workspaces |
| `feat/deploy` | M11 | Deploy produção Vercel |

---

## Sequência de Merge

```
feat/app-shell     → main
feat/auth-ui       → main
feat/leads-ui      → main
feat/pipeline-ui   → main
feat/dashboard-ui  → main
feat/landing       → main
feat/supabase-core → main  ← ponto de virada: dados reais
feat/leads-data    → main
feat/collaboration → main
feat/billing-nextjs  → main
feat/multi-workspace → main
feat/deploy          → main  ← produção
```

Cada merge deve passar em `npm run build` e `npm run lint` sem erros.
