# PipeFlow CRM — Estrutura de Pastas

Essa é a estrutura alvo do projeto. Você vai construindo progressivamente com Claude Code — não precisa criar tudo de uma vez.

```
pipeflow-crm/
├── .env.local                    # Variáveis de ambiente (NÃO commitar)
├── .env.example                  # Template de variáveis (commitar)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── app/                      # App Router (Next.js 14)
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Redirect → /login ou /dashboard
│   │   │
│   │   ├── (auth)/               # Grupo: páginas públicas
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   └── page.tsx          # Criar primeiro workspace
│   │   │
│   │   ├── (dashboard)/          # Grupo: páginas autenticadas (com layout)
│   │   │   ├── layout.tsx        # Layout com sidebar + header
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Dashboard com métricas
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx      # Lista de leads
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Detalhe do lead
│   │   │   ├── pipeline/
│   │   │   │   └── page.tsx      # Pipeline Kanban
│   │   │   ├── members/
│   │   │   │   └── page.tsx      # Gerenciar membros
│   │   │   └── plans/
│   │   │       └── page.tsx      # Planos Free vs Pro
│   │   │
│   │   └── api/                  # API Routes
│   │       ├── leads/
│   │       │   ├── route.ts      # GET (list) + POST (create)
│   │       │   └── [id]/
│   │       │       └── route.ts  # GET + PUT + DELETE
│   │       ├── deals/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── activities/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── workspaces/
│   │       │   └── route.ts
│   │       ├── members/
│   │       │   ├── route.ts
│   │       │   └── invite/
│   │       │       └── route.ts
│   │       ├── dashboard/
│   │       │   └── route.ts      # Métricas agregadas
│   │       ├── billing/
│   │       │   └── checkout/
│   │       │       └── route.ts  # Criar sessão Stripe
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts  # Receber eventos Stripe
│   │
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                   # shadcn/ui components (auto-gerados)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── select.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx       # Sidebar com menu + workspace switcher
│   │   │   ├── header.tsx        # Header da área de conteúdo
│   │   │   └── mobile-nav.tsx    # Navegação mobile
│   │   │
│   │   ├── leads/
│   │   │   ├── lead-table.tsx    # Tabela de leads
│   │   │   ├── lead-form.tsx     # Formulário criar/editar lead
│   │   │   ├── lead-detail.tsx   # Card de perfil do lead
│   │   │   └── lead-filters.tsx  # Barra de filtros
│   │   │
│   │   ├── pipeline/
│   │   │   ├── kanban-board.tsx  # Board completo
│   │   │   ├── kanban-column.tsx # Coluna individual
│   │   │   ├── deal-card.tsx     # Card de negócio
│   │   │   └── deal-form.tsx     # Formulário criar/editar deal
│   │   │
│   │   ├── activities/
│   │   │   ├── activity-timeline.tsx  # Timeline vertical
│   │   │   └── activity-form.tsx      # Formulário registrar atividade
│   │   │
│   │   ├── dashboard/
│   │   │   ├── metrics-cards.tsx       # Cards de métricas
│   │   │   ├── funnel-chart.tsx        # Gráfico de funil
│   │   │   ├── leads-weekly-chart.tsx  # Gráfico de leads por semana
│   │   │   └── upcoming-deals.tsx      # Lista de deals com prazo
│   │   │
│   │   └── shared/
│   │       ├── loading.tsx        # Skeleton / spinner
│   │       ├── empty-state.tsx    # Estado vazio com CTA
│   │       └── upgrade-modal.tsx  # Modal de upgrade para Pro
│   │
│   ├── lib/                      # Utilitários e configurações
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase client (browser)
│   │   │   ├── server.ts         # Supabase client (server components)
│   │   │   └── admin.ts          # Supabase admin (service role, webhooks only)
│   │   ├── stripe.ts             # Config do Stripe
│   │   ├── utils.ts              # Helpers gerais (formatCurrency, cn, etc.)
│   │   └── constants.ts          # Constantes (re-export dos types)
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── use-workspace.ts      # Hook para workspace atual
│   │   ├── use-subscription.ts   # Hook para plano do workspace
│   │   └── use-user.ts           # Hook para usuário logado
│   │
│   ├── types/
│   │   └── database.ts           # Todos os types (copiar de types.ts)
│   │
│   └── middleware.ts             # Middleware Next.js (proteção de rotas)
│
└── docs/                         # Documentação do projeto
    ├── PRD_PipeFlow_CRM.md
    ├── schema.sql
    ├── wireframes.md
    ├── framework-checklist.md
    └── .env.example
```

## Dependências Principais

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x",
    "recharts": "^2.x",
    "stripe": "^14.x",
    "lucide-react": "^0.x",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x"
  }
}
```
