# PipeFlow CRM

> Plataforma SaaS multi-tenant de gestão de clientes e pipeline de vendas.  
> Projeto educacional — construído do zero com Next.js 14, Supabase e Stripe.

---

## Para o Aluno — Por onde começar

### 1. Crie seu PRD

Antes de qualquer código, defina o produto que você vai construir:

**[prd-claude-code.lovable.app](https://prd-claude-code.lovable.app/)**

O framework vai te guiar na criação do seu `PRD.md`. Salve o resultado em `docs/PRD.md`.

> Você pode usar o [docs/PRD.md](docs/PRD.md) deste repositório como referência — ele descreve o PipeFlow.

### 2. Acompanhe as aulas

Cada módulo tem um arquivo HTML com o conteúdo da aula e um `prompts.md` com os prompts prontos para o Claude Code.

**[docs/aulas/](docs/aulas/)** ← comece aqui

| Módulo | Conteúdo | Prompts |
|---|---|---|
| M1 — Planejamento & Setup | Setup do ambiente, Claude Code, AI Templates | [prompts.md](docs/aulas/m1-planejamento-setup/prompts.md) |
| M2 — Desenvolvimento UI | App shell, auth, leads, kanban, dashboard, landing | [prompts.md](docs/aulas/m2-desenvolvimento/prompts.md) |
| M3 — Backend & Integração | Supabase, migrations, RLS, auth real, colaboração | [prompts.md](docs/aulas/m3-backend-integracao/prompts.md) |
| M4 — Pagamentos | Stripe checkout, webhook, billing, limites de plano | [prompts.md](docs/aulas/m4-pagamentos/prompts.md) |
| M5 — Go-Live | Segurança, responsividade, deploy em produção | [prompts.md](docs/aulas/m5-golive-seguranca/prompts.md) |

### 3. Use o ciclo de cada aula

```
Planejar → Construir → Revisar → Commit
```

Cole os prompts **em ordem** no Claude Code. Sempre comece com o Prompt 1 (planejamento + branch).

---

## O que é o PipeFlow

CRM visual para pequenas empresas, freelancers e times de vendas. Cada empresa tem um workspace isolado com:

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

Execute as migrations via Supabase SQL Editor. Para ambiente limpo, use:

```
docs/migrations/PRODUCTION_FULL_MIGRATION.sql
```

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
  aulas/             # Material das aulas (HTML + prompts por módulo)
  referencias/       # Arquivos de referência visual e de design
```

---

## Documentação

| Arquivo | Descrição |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Requisitos do produto |
| [docs/PLAN.md](docs/PLAN.md) | Plano de execução por milestones |
| [docs/aulas/](docs/aulas/) | Material das aulas com prompts por módulo |
| [docs/migrations/](docs/migrations/) | SQL migrations numeradas |
| [docs/referencias/design-scope.html](docs/referencias/design-scope.html) | Referência completa do design system (paleta, tipografia, componentes, animações) |
| [.env.local.example](.env.local.example) | Variáveis de ambiente necessárias |

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

---

## Autoria e Propriedade

Projeto desenvolvido e mantido por **Danilo Fernandes** ([@dandgsf](https://github.com/dandgsf)) como material oficial do curso **Claude Code: do Zero ao SaaS**.

Todo o código, material de aulas, slides e prompts deste repositório são de propriedade exclusiva do autor. Reprodução ou distribuição não autorizada é proibida.
