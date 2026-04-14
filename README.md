# PipeFlow CRM

> Plataforma SaaS multi-tenant de gestão de clientes e pipeline de vendas.  
> Projeto educacional — construído do zero com Next.js 14, Supabase e Stripe.

---

## O que é

PipeFlow é um CRM visual para pequenas empresas, freelancers e times de vendas. Cada empresa tem um workspace isolado com:

- **Pipeline Kanban** com drag-and-drop entre etapas de venda
- **Gestão de Leads** com perfil completo e histórico de atividades
- **Dashboard** com métricas do funil (leads, negócios, conversão, receita)
- **Multi-workspace** — um usuário pode pertencer a várias empresas
- **Colaboração** — convite de membros por e-mail com controle de roles
- **Monetização** — plano Free (2 membros, 50 leads) e Pro (R$49/mês via Stripe)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript 5 |
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Banco + Auth | Supabase (PostgreSQL + RLS + Auth) |
| Pagamentos | Stripe (Checkout + Webhooks + Portal) |
| E-mail | Resend |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Deploy | Vercel |

---

## Setup local

### 1. Clone e instale dependências

```bash
git clone https://github.com/dandgsf/pipeflow-crm.git
cd pipeflow-crm
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e preencha:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard → Products |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` (local) |

### 3. Configure o banco de dados

Execute as migrations na ordem em `docs/migrations/` via Supabase SQL Editor ou CLI.  
Para ambiente limpo, use `docs/migrations/PRODUCTION_FULL_MIGRATION.sql`.

### 4. Rode o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Estrutura de pastas

```
src/
  app/
    (marketing)/     # Landing page (pública)
    (auth)/          # Login, registro, onboarding
    (app)/           # App autenticado (dashboard, leads, pipeline, settings)
    api/webhooks/    # Stripe webhook handler
  components/
    ui/              # shadcn/ui primitives
    leads/           # Componentes de leads
    pipeline/        # Kanban board
    dashboard/       # Métricas e gráficos
    layout/          # Sidebar, navbar, workspace switcher
  lib/
    actions/         # Server Actions (mutações de dados)
    supabase/        # Clientes Supabase (browser + server)
    stripe.ts        # SDK Stripe
    resend.ts        # SDK Resend
  types/             # Tipos TypeScript compartilhados
  hooks/             # React hooks (use-workspace, etc.)
docs/
  PRD.md             # Requisitos do produto
  PLAN.md            # Plano de execução por milestones
  migrations/        # SQL migrations numeradas
```

---

## Milestones

| # | Milestone | Branch |
|---|---|---|
| M0 | Setup & Configuração | `main` |
| M1 | Design System & App Shell | `feat/app-shell` |
| M2 | Auth & Onboarding (UI) | `feat/auth-ui` |
| M3 | Leads — Telas & Componentes | `feat/leads-ui` |
| M4 | Pipeline Kanban (UI) | `feat/pipeline-ui` |
| M5 | Dashboard de Métricas (UI) | `feat/dashboard-ui` |
| M6 | Landing Page | `feat/landing` |
| M7 | Banco de Dados & Auth Real | `feat/supabase-core` |
| M8 | Leads & Pipeline — Dados Reais | `feat/leads-data` |
| M9 | Workspace & Colaboração | `feat/collaboration` |
| M10 | Monetização (Stripe) | `feat/billing-nextjs` |
| M11 | Deploy & Produção | `feat/deploy` |

Detalhes de cada milestone: [docs/PLAN.md](docs/PLAN.md)

---

## Comandos úteis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run lint     # ESLint
```

---

## Segurança

- Variáveis de ambiente **nunca** vão para o git (`.env.local` está no `.gitignore`)
- `SUPABASE_SERVICE_ROLE_KEY` é usado **apenas** server-side (webhooks/edge functions)
- Todas as tabelas têm **Row Level Security (RLS)** habilitado
- Dados isolados por `workspace_id` em todas as queries
