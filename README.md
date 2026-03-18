# PipeFlow CRM

CRM de vendas multi-tenant para pequenas empresas e equipes comerciais. Gerencie leads, pipeline de vendas e atividades em uma interface moderna com Kanban drag-and-drop.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Frontend | React 18 + Tailwind CSS + shadcn/ui |
| Banco de dados | Supabase (PostgreSQL + RLS) |
| Autenticação | Supabase Auth |
| Pagamentos | Stripe (checkout + webhooks via Edge Function) |
| Email | Resend (convites de membros) |
| Drag-and-drop | @dnd-kit |
| Gráficos | Recharts |
| Linguagem | TypeScript 5 |

## Funcionalidades

- **Gestão de leads** — Cadastro, filtros por status/responsável, busca, perfil detalhado com timeline de atividades
- **Pipeline Kanban** — 6 estágios de venda com drag-and-drop (Novo Lead → Contatado → Proposta → Negociação → Ganho → Perdido)
- **Atividades** — Registro de ligações, e-mails, reuniões e anotações vinculados a leads e deals
- **Dashboard** — Métricas de conversão, funil de vendas, tendência semanal de leads, deals próximos do fechamento
- **Multi-tenant** — Workspaces isolados com Row Level Security (RLS), convite de membros por email, roles admin/membro
- **Planos e billing** — Plano Free (2 membros, 50 leads) e Pro (R$49/mês, ilimitado) via Stripe Checkout
- **Convite por email** — Membros convidados recebem email via Resend com link de signup pré-preenchido
- **Aceite automático de convite** — Email-matching no onboarding vincula o novo usuário ao workspace sem tokens

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (projeto criado)
- Conta no [Stripe](https://stripe.com) (chaves de API)
- Conta no [Resend](https://resend.com) (API key para envio de emails)
- Supabase CLI (`npm install -g supabase`) para deploy da Edge Function

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/dandgsf/pipeflow-crm.git
cd pipeflow-crm

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais (veja seção abaixo)

# 4. Configure o banco de dados
# Execute o conteúdo de docs/schema.sql no SQL Editor do Supabase

# 5. Deploy da Edge Function (webhook Stripe)
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase secrets set STRIPE_SECRET_KEY=sk_... STRIPE_WEBHOOK_SECRET=whsec_...
npx supabase functions deploy stripe-webhook

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...

# Resend (email)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **IMPORTANTE:** Nunca faça commit de `.env.local` no repositório. O `.gitignore` já está configurado para ignorá-lo.

### Variáveis da Edge Function (Supabase Secrets)

Estas variáveis são configuradas via CLI e **não** vão no `.env.local`:

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_... STRIPE_WEBHOOK_SECRET=whsec_...
```

As variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetadas automaticamente pelo Supabase.

## Configuração do Banco de Dados

1. Crie um projeto no [Supabase](https://supabase.com)
2. Acesse o **SQL Editor** no painel do Supabase
3. Execute o script completo de [`docs/schema.sql`](docs/schema.sql) — ele cria todas as tabelas, índices e políticas RLS
4. (Opcional) Execute `node scripts/seed.mjs` para popular dados de demonstração

## Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Copie as chaves de API (Dashboard → Developers → API Keys)
3. Crie um produto "Pro" com preço recorrente de R$49/mês
4. Copie o `price_id` para `STRIPE_PRICE_ID`
5. Configure o webhook no Stripe Dashboard:
   - **URL:** `https://SEU_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
   - **Eventos:**
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
6. Copie o Signing Secret e configure: `npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

## Configuração do Resend (Email)

1. Crie uma conta no [Resend](https://resend.com)
2. Copie a API key e adicione em `.env.local` como `RESEND_API_KEY`
3. Para desenvolvimento, o sender `onboarding@resend.dev` funciona sem verificação de domínio
4. Para produção, verifique seu domínio no painel do Resend e atualize o `from` em `src/app/api/members/invite/route.ts`

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/           # Rotas públicas (login, signup)
│   ├── (dashboard)/      # Rotas protegidas (dashboard, leads, pipeline, members, plans)
│   ├── onboarding/       # Criação do primeiro workspace / aceite de convite
│   └── api/              # Rotas de API (leads, deals, activities, workspaces, billing)
├── components/
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── layout/           # Header e Sidebar
│   ├── leads/            # Tabela, filtros, perfil, dialogs de leads
│   ├── pipeline/         # Kanban, deal cards, dialogs
│   ├── activities/       # Timeline e dialogs de atividades
│   ├── dashboard/        # Cards de métricas e gráficos
│   ├── emails/           # Templates de email (invite-member)
│   ├── landing/          # Componentes da landing page
│   └── shared/           # Logo, animações, modais compartilhados
├── hooks/                # Custom hooks (useLeads, useDeals, useDashboard, etc.)
├── lib/
│   ├── supabase/         # Clients Supabase (server, browser)
│   ├── resend.ts         # Client Resend (lazy-initialized)
│   └── utils.ts          # Utilitários
└── types/
    └── database.ts       # Tipos TypeScript e constantes

supabase/
├── config.toml                       # Configuração do projeto Supabase
└── functions/
    └── stripe-webhook/
        └── index.ts                  # Edge Function: webhook do Stripe
```

## Fluxo de Convite de Membros

1. Admin vai em **Membros** e convida por email
2. Sistema cria registro `member` com `user_id = null` e envia email via Resend
3. Convidado recebe email com link para `/signup?invite=ID&email=EMAIL`
4. Ao criar conta, o email já vem preenchido (readonly)
5. No onboarding, o sistema detecta o convite pendente via email-matching
6. O `user_id` do member é atualizado automaticamente e o usuário entra no workspace

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (porta 3000) |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter |

## Deploy

### Next.js (Vercel ou similar)

1. Configure todas as variáveis de `.env.example` no provedor
2. `npm run build && npm run start`

### Edge Function (Supabase)

```bash
npx supabase functions deploy stripe-webhook
```

## Segurança

- **Row Level Security (RLS)** — Todas as tabelas possuem políticas que isolam dados por workspace
- **Verificação de workspace** — Todas as rotas de API validam que o recurso pertence ao workspace do usuário
- **Webhook assinado** — A Edge Function verifica a assinatura do Stripe antes de processar
- **Admin-only billing** — Apenas admins podem criar sessões de checkout
- **Sanitização de busca** — Input de busca sanitizado contra manipulação de filtros PostgREST
- **Variáveis públicas controladas** — Apenas chaves com prefixo `NEXT_PUBLIC_` são expostas ao navegador

Consulte [`SECURITY.md`](SECURITY.md) para política completa de segurança e como reportar vulnerabilidades.

## Documentação Adicional

| Arquivo | Descrição |
|---------|-----------|
| [`docs/schema.sql`](docs/schema.sql) | Schema completo do banco com RLS |
| [`.env.example`](.env.example) | Template de variáveis de ambiente |
| [`SECURITY.md`](SECURITY.md) | Política de segurança |

## Licença

Este projeto é privado. Todos os direitos reservados.
