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
  M10 Monetização (Stripe)         → branch: feat/billing
  M11 Deploy & Produção            → branch: feat/deploy
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
- [ ] `src/lib/mock/leads.ts` — array com 10-15 leads mockados com todos os campos

#### Listagem de Leads (`/leads`)
- [ ] Tabela com colunas: Nome, Empresa, Cargo, Status, Responsável, Data de Criação
- [ ] Badge de status com cores (Novo, Contato, Proposta, Negociação, Ganho, Perdido)
- [ ] Barra de busca por nome/empresa (filtro client-side sobre mock)
- [ ] Filtro por status (Select)
- [ ] Filtro por responsável (Select)
- [ ] Botão "Novo Lead" → abre dialog
- [ ] Paginação (UI, sem lógica real ainda)
- [ ] EmptyState quando sem resultados

**Componentes**
- [ ] `src/components/leads/leads-table.tsx`
- [ ] `src/components/leads/leads-filters.tsx`
- [ ] `src/components/leads/lead-status-badge.tsx`

#### Formulário de Lead (Dialog)
- [ ] `src/components/leads/lead-form-dialog.tsx` — Dialog com formulário completo
- [ ] Campos: nome*, email*, telefone, empresa, cargo, status, responsável, notas
- [ ] Validação Zod em todos os campos obrigatórios
- [ ] Estados: criando vs editando (título dinâmico)
- [ ] Botão de exclusão com AlertDialog de confirmação

#### Página de Detalhe (`/leads/[id]`)
- [ ] `src/app/(app)/leads/[id]/page.tsx`
- [ ] Perfil do lead (nome, empresa, contato, status) — card lateral
- [ ] Seção de informações (cargo, responsável, data criação, valor estimado)
- [ ] Timeline de atividades (UI estática com dados mockados)
- [ ] Botão "Editar Lead" → abre lead-form-dialog
- [ ] Botão "Registrar Atividade" → modal (UI apenas)

**Componentes**
- [ ] `src/components/leads/lead-profile-card.tsx`
- [ ] `src/components/leads/activity-timeline.tsx` (UI estática)
- [ ] `src/components/leads/activity-item.tsx`

#### Commit Final
```
feat(leads): leads list with search/filters, lead detail page, create/edit/delete dialog — mock data
```

---

### M4 — Pipeline Kanban (UI)

**Branch:** `feat/pipeline-ui`
**Objetivo:** Kanban visual com drag-and-drop funcional, usando dados mockados.

#### Mock Data
- [ ] `src/lib/mock/deals.ts` — deals distribuídos pelas 6 colunas do pipeline

#### Board Kanban (`/pipeline`)
- [ ] `src/app/(app)/pipeline/page.tsx` — layout horizontal com scroll
- [ ] 6 colunas fixas com header (nome da etapa + contador + valor total)
- [ ] Scroll horizontal no board, scroll vertical por coluna
- [ ] Botão "Novo Negócio" no header da página

**Componentes**
- [ ] `src/components/pipeline/kanban-board.tsx` — container DndContext
- [ ] `src/components/pipeline/kanban-column.tsx` — SortableContext por coluna
- [ ] `src/components/pipeline/deal-card.tsx` — card arrastável

**Deal Card**
- [ ] Título do negócio
- [ ] Avatar + nome do lead vinculado
- [ ] Valor estimado (R$) em destaque
- [ ] Nome do responsável
- [ ] Prazo com cor de alerta se vencido
- [ ] Menu de ações (⋮): editar, mover para, excluir

**Drag & Drop (@dnd-kit)**
- [ ] Arrastar card entre colunas — estado local atualiza visualmente
- [ ] Overlay animado durante o drag
- [ ] Indicador visual na coluna de destino
- [ ] Touch support (mobile)

**Formulário de Negócio**
- [ ] `src/components/pipeline/deal-form-dialog.tsx`
- [ ] Campos: título*, lead vinculado (select)*, valor estimado, responsável, prazo, observações
- [ ] Pré-seleciona a coluna quando "Novo Negócio" é clicado em uma coluna específica

**Verificação**
- [ ] Drag entre todas as 6 colunas funciona
- [ ] Estado persiste enquanto página está aberta
- [ ] Funciona em mobile

#### Commit Final
```
feat(pipeline): kanban board with 6 stages, drag-and-drop between columns, deal cards — mock data
```

---

### M5 — Dashboard de Métricas (UI)

**Branch:** `feat/dashboard-ui`
**Objetivo:** Dashboard completo com métricas, gráfico e lista de deals próximos — dados mockados.

#### Mock Data
- [ ] `src/lib/mock/metrics.ts` — valores mockados para todos os cards e gráfico

#### Página Dashboard (`/dashboard`)
- [ ] `src/app/(app)/dashboard/page.tsx`

**Cards de Métricas**
- [ ] `src/components/dashboard/metric-card.tsx` — ícone, label, valor, variação (%)
- [ ] Card: Total de Leads
- [ ] Card: Negócios Abertos
- [ ] Card: Valor Total do Pipeline (R$)
- [ ] Card: Taxa de Conversão (%)

**Gráfico de Funil (Recharts)**
- [ ] `src/components/dashboard/funnel-chart.tsx` — FunnelChart com as 6 etapas
- [ ] Tooltip com quantidade e valor por etapa
- [ ] Legenda das etapas
- [ ] Responsivo (ResponsiveContainer)

**Lista de Deals com Prazo Próximo**
- [ ] `src/components/dashboard/upcoming-deals.tsx`
- [ ] Tabela compacta: título, lead, etapa, prazo, responsável
- [ ] Cor de alerta para prazos vencidos
- [ ] Link para o deal no pipeline

**Layout**
- [ ] Grid responsivo: 2 colunas em tablet, 4 em desktop para metric cards
- [ ] Gráfico ocupa largura total
- [ ] Deals próximos abaixo do gráfico

#### Commit Final
```
feat(dashboard): metric cards, sales funnel chart (Recharts), upcoming deals list — mock data
```

---

### M6 — Landing Page

**Branch:** `feat/landing`
**Objetivo:** Landing page pública de apresentação do PipeFlow CRM, light mode, pronta para deploy.

#### Estrutura (`src/app/(marketing)/`)
- [ ] `layout.tsx` — navbar pública + footer, light mode
- [ ] `page.tsx` — composição das seções

**Seções**
- [ ] `src/components/marketing/hero.tsx`
  - Headline impactante + subtítulo
  - CTA primário "Começar Grátis" → `/register`
  - CTA secundário "Ver Demo" → screenshot/vídeo placeholder
  - Badge "Sem cartão de crédito"
- [ ] `src/components/marketing/features.tsx`
  - Grid 3 colunas: Pipeline Kanban, Gestão de Leads, Dashboard de Métricas
  - Ícones + título + descrição por feature
- [ ] `src/components/marketing/pricing.tsx`
  - 2 cards: Free vs Pro
  - Lista de features por plano com checkmarks
  - Botão "Começar Grátis" (Free) e "Assinar Pro" (Pro)
  - Destaque visual no plano Pro
- [ ] `src/components/marketing/cta-banner.tsx`
  - Banner final com CTA de conversão
- [ ] `src/components/marketing/navbar-public.tsx`
  - Logo + links (Features, Preços) + botões Login/Cadastro
  - Sticky, backdrop-blur em scroll
- [ ] `src/components/marketing/footer.tsx`

**UX**
- [ ] Responsivo (mobile-first)
- [ ] Smooth scroll para seções internas
- [ ] Meta tags SEO (`generateMetadata`)

#### Commit Final
```
feat(landing): public marketing page with hero, features, pricing, CTA — light mode
```

---

## FASE 2 — BACKEND & INTEGRAÇÃO

---

### M7 — Banco de Dados & Auth Real

**Branch:** `feat/supabase-core`
**Objetivo:** Supabase configurado localmente e em produção, auth real funcionando, dados persistentes.

#### Setup Supabase
- [ ] Criar projeto no Supabase Dashboard
- [ ] Instalar Supabase CLI e inicializar: `npx supabase init`
- [ ] Configurar variáveis de ambiente reais no `.env.local`
- [ ] Criar `src/lib/supabase/client.ts` — browser client (lazy singleton)
- [ ] Criar `src/lib/supabase/server.ts` — server client com cookies (lazy, async)

#### Migrations (`supabase/migrations/`)
- [ ] `001_create_workspaces.sql`
  ```sql
  CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro'
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```
- [ ] `002_create_workspace_members.sql`
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
- [ ] `003_create_leads.sql`
- [ ] `004_create_deals.sql` (com coluna `stage` e `position` para ordenação)
- [ ] `005_create_activities.sql`
- [ ] `006_create_subscriptions.sql`
- [ ] `007_rls_policies.sql` — RLS em todas as tabelas (workspace_id scoping)
- [ ] Rodar `npx supabase db reset` para validar todas as migrations

#### Tipos TypeScript
- [ ] `npx supabase gen types typescript --local > src/types/supabase.ts`
- [ ] Atualizar `src/types/index.ts` para usar os tipos gerados

#### Auth Real
- [ ] Configurar Supabase Auth: Email/Password habilitado
- [ ] `src/proxy.ts` — proteger rotas `(app)/*`, redirecionar para `/login` se sem sessão
- [ ] `src/app/(auth)/login/page.tsx` — conectar form ao Supabase Auth (`signInWithPassword`)
- [ ] `src/app/(auth)/register/page.tsx` — conectar ao Supabase Auth (`signUp`)
- [ ] `src/app/(app)/onboarding/page.tsx` — Server Action cria workspace + workspace_member
- [ ] Callback de auth: `src/app/auth/callback/route.ts`
- [ ] Logout: Server Action em `src/components/layout/navbar.tsx`
- [ ] Redirecionar para onboarding se usuário não tem workspace

#### Context de Workspace
- [ ] `src/hooks/use-workspace.ts` — lê workspace ativo do cookie
- [ ] `src/lib/workspace.ts` — helpers `getActiveWorkspace()`, `setActiveWorkspace()`
- [ ] Workspace switcher funcional (atualiza cookie, revalida página)

**Verificação**
- [ ] Registro → email de confirmação → login → onboarding → dashboard
- [ ] Logout redireciona para `/login`
- [ ] Rotas protegidas redirecionam quem não está logado

#### Commit Final
```
feat(supabase): database migrations, RLS policies, real auth flow, workspace context
```

---

### M8 — Leads & Pipeline — Dados Reais

**Branch:** `feat/leads-data`
**Objetivo:** Substituir todos os dados mockados por dados reais do Supabase.

#### Server Actions (`src/lib/actions/`)
- [ ] `leads.ts`
  - `createLead(formData)` — insere no Supabase, revalida `/leads`
  - `updateLead(id, formData)` — atualiza, revalida
  - `deleteLead(id)` — soft delete (status = 'perdido') ou hard delete
  - `getLeads(workspaceId, filters)` — query com filtros
  - `getLeadById(id)` — busca lead + atividades relacionadas
- [ ] `deals.ts`
  - `createDeal(formData)`
  - `updateDeal(id, formData)`
  - `moveDeal(id, newStage, newPosition)` — chamado pelo drag-and-drop
  - `deleteDeal(id)`
  - `getDeals(workspaceId)` — agrupados por stage

#### Integração nas Páginas
- [ ] `/leads` — substituir mock por query real (Server Component)
- [ ] `/leads/[id]` — Server Component busca lead real com `await params`
- [ ] Formulário de lead — Server Action real com `revalidatePath`
- [ ] `/pipeline` — buscar deals do Supabase, agrupados por stage
- [ ] Drag-and-drop → chamar `moveDeal()` no `onDragEnd`
- [ ] `/dashboard` — calcular métricas reais com queries Supabase

#### Filtros e Busca
- [ ] Filtro de leads implementado como query param (não client-side)
- [ ] Busca por nome/empresa via `ilike` no Supabase

**Verificação**
- [ ] CRUD completo de leads funciona e persiste após reload
- [ ] Drag no pipeline persiste após reload
- [ ] Dados do dashboard refletem o banco real
- [ ] RLS: usuário só vê dados do seu workspace

#### Commit Final
```
feat(data): leads and pipeline wired to Supabase — real CRUD, drag persists, dashboard metrics live
```

---

### M9 — Workspace & Colaboração

**Branch:** `feat/collaboration`
**Objetivo:** Convites por e-mail, gestão de membros e isolamento multi-workspace funcional.

#### Server Actions
- [ ] `workspaces.ts`
  - `inviteMember(email, role, workspaceId)` — cria convite + envia e-mail via Resend
  - `acceptInvite(token)` — valida token, cria workspace_member
  - `removeMember(memberId, workspaceId)` — remove (apenas admin)
  - `updateMemberRole(memberId, role)` — muda de admin para membro

#### Resend — E-mail de Convite
- [ ] `src/lib/resend.ts` — lazy singleton
- [ ] `src/emails/workspace-invite.tsx` — template React Email
- [ ] Rota de aceite de convite: `src/app/invite/[token]/page.tsx`
- [ ] Tabela `workspace_invites` (token, email, workspace_id, expires_at, accepted_at)
- [ ] Migration: `008_create_workspace_invites.sql`

#### Página de Configurações
- [ ] `/settings/workspace` — nome do workspace, slug (apenas admin)
- [ ] `/settings/members` — lista de membros, badges de role, convite novo, remover
- [ ] Validação de limites do plano Free (máx 2 membros) antes de convidar

#### Role Enforcement
- [ ] Helper `src/lib/permissions.ts` — `isAdmin(userId, workspaceId)`
- [ ] Server Actions verificam role antes de mutações sensíveis
- [ ] UI esconde botões de admin para membros

**Verificação**
- [ ] Convidar por email → e-mail chega → link de aceite funciona
- [ ] Membro convidado acessa o workspace sem acesso a outros workspaces
- [ ] Admin remove membro → membro perde acesso imediatamente

#### Commit Final
```
feat(collaboration): workspace member invites via Resend, role enforcement, settings pages
```

---

### M10 — Monetização (Stripe)

**Branch:** `feat/billing`
**Objetivo:** Planos Free e Pro com checkout, webhook e enforcement de limites.

#### Setup Stripe
- [ ] `src/lib/stripe.ts` — lazy singleton com `process.env.STRIPE_SECRET_KEY`
- [ ] Criar produto "PipeFlow Pro" e preço R$49/mês no Stripe Dashboard
- [ ] Configurar variáveis: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`

#### Checkout
- [ ] Server Action `createCheckoutSession(workspaceId)` — cria Stripe Checkout Session
  - `success_url` → `/settings/billing?success=true`
  - `cancel_url` → `/settings/billing`
  - `metadata: { workspaceId }`
- [ ] Botão "Assinar Pro" na página `/settings/billing` chama a Server Action

#### Webhook
- [ ] `src/app/api/webhooks/stripe/route.ts` — Route Handler (não Server Action)
- [ ] Verificar assinatura com `stripe.webhooks.constructEvent`
- [ ] Eventos tratados:
  - `checkout.session.completed` → atualiza `subscriptions.plan = 'pro'`
  - `customer.subscription.deleted` → atualiza `subscriptions.plan = 'free'`
  - `invoice.payment_failed` → logar (opcional: notificar por email)
- [ ] `npx stripe listen --forward-to localhost:3000/api/webhooks/stripe` para dev

#### Enforcement de Limites
- [ ] `src/lib/limits.ts` — helpers `canAddLead()`, `canAddMember()`
- [ ] `createLead` — verifica `count(leads) < 50` se plano free
- [ ] `inviteMember` — verifica `count(members) < 2` se plano free
- [ ] UI: banner "Limite atingido — Faça upgrade para Pro" quando limite alcançado

#### Página de Billing (`/settings/billing`)
- [ ] Card plano atual (Free ou Pro + data de renovação)
- [ ] Card comparação de planos
- [ ] Botão "Assinar Pro" ou "Gerenciar Assinatura" (Customer Portal)
- [ ] Server Action `createPortalSession()` → redirect para Stripe Customer Portal

**Verificação**
- [ ] Checkout completo → plano atualiza no Supabase
- [ ] Cancelamento via Portal → plano volta para Free
- [ ] Criar >50 leads no Free retorna erro
- [ ] Webhook idempotente (re-processar mesmo evento não duplica dados)

#### Commit Final
```
feat(billing): Stripe checkout, webhooks, plan limits enforcement, customer portal
```

---

### M11 — Deploy & Produção

**Branch:** `feat/deploy`
**Objetivo:** Aplicação em produção no Vercel + Supabase, estável e monitorável.

#### Supabase em Produção
- [ ] Rodar todas as migrations no projeto Supabase de produção
  ```bash
  npx supabase db push
  ```
- [ ] Verificar que RLS está habilitado em todas as tabelas
- [ ] Configurar Supabase Auth: URL de redirecionamento de produção
- [ ] Gerar tipos atualizados do projeto de produção

#### Vercel
- [ ] Conectar repositório GitHub ao Vercel
- [ ] Configurar todas as variáveis de ambiente no dashboard Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_APP_URL` (URL de produção do Vercel)
- [ ] Deploy inicial: `vercel --prod` ou via push na branch `main`
- [ ] Verificar build sem erros no Vercel dashboard

#### Stripe em Produção
- [ ] Criar webhook no Stripe Dashboard apontando para `https://seu-app.vercel.app/api/webhooks/stripe`
- [ ] Atualizar `STRIPE_WEBHOOK_SECRET` com o secret do webhook de produção
- [ ] Testar checkout completo em produção (modo live ou test)

#### Resend em Produção
- [ ] Verificar domínio de e-mail no Resend
- [ ] Testar envio de convite em produção

#### Polish Final
- [ ] Revisar todos os estados de loading (Skeleton, spinner)
- [ ] Revisar todos os estados de erro (error.tsx, mensagens inline)
- [ ] Revisar EmptyState em todas as listagens
- [ ] Testar fluxo completo: registro → onboarding → leads → pipeline → invite → upgrade → manage
- [ ] Testar em mobile (responsividade)
- [ ] Verificar meta tags SEO na landing page
- [ ] `npm run build` local sem warnings

#### Commit Final
```
feat(deploy): production deployment on Vercel, Supabase migrations applied, Stripe + Resend live
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
| `feat/billing` | M10 | Stripe checkout + webhook |
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
feat/billing       → main
feat/deploy        → main  ← produção
```

Cada merge deve passar em `npm run build` e `npm run lint` sem erros.
