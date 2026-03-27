# PipeFlow CRM — Project Briefing for Claude Code

## What is PipeFlow

PipeFlow CRM is a multi-tenant SaaS platform for managing clients and sales pipelines. It targets small and medium businesses, freelancers, and sales teams who need a simple, visual CRM without the complexity or cost of HubSpot/Pipedrive. Each company/team gets an isolated workspace with a Kanban sales pipeline, lead management, activity history, and team collaboration. Monetized via Free (2 members, 50 leads) and Pro (unlimited, R$49/mês via Stripe).

Full requirements: [docs/PRD.md](docs/PRD.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript 5 |
| UI | React 18 + Tailwind CSS + shadcn/ui |
| Database + Auth | Supabase (PostgreSQL + RLS + Auth) |
| Payments | Stripe (Checkout + Webhooks + Customer Portal) |
| Email | Resend |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Deploy | Vercel |

---

## Folder Structure

```
src/
  app/
    (marketing)/         # Public pages (no auth required) — M8
      page.tsx           # Landing page (recriada no M8)
    (auth)/              # Auth flow
      login/
      register/
      onboarding/
    (app)/               # Authenticated app shell (sidebar layout)
      dashboard/
      leads/
        [id]/            # Lead detail + activity timeline
      pipeline/          # Kanban board
      settings/
        workspace/       # Workspace config, member management
        billing/         # Stripe subscription management
    api/
      webhooks/
        stripe/          # Stripe webhook handler (Route Handler)
  components/
    ui/                  # shadcn/ui primitives (auto-generated)
    leads/               # Lead list, lead card, lead form
    pipeline/            # Kanban board, column, deal card
    dashboard/           # Metric cards, funnel chart
    layout/              # Sidebar, navbar, workspace switcher
  lib/
    supabase/
      client.ts          # Browser client (lazy singleton)
      server.ts          # Server client (lazy, uses cookies)
    stripe.ts            # Stripe SDK (lazy singleton)
    resend.ts            # Resend SDK (lazy singleton)
  types/
    index.ts             # Shared TypeScript types
  hooks/
    use-workspace.ts     # Active workspace context
```

---

## Coding Conventions

### Next.js App Router
- **Server Components by default.** Add `'use client'` only for interactivity or browser APIs.
- Push `'use client'` boundaries as far down the tree as possible.
- All async request APIs must be awaited: `await cookies()`, `await headers()`, `await params`, `await searchParams`.
- Use **Server Actions** (`'use server'`) for data mutations.
- Use **Route Handlers** (`route.ts`) only for webhooks and public API endpoints.
- Auth protection lives in `src/proxy.ts` (Next.js 16 naming; replaces `middleware.ts`).

### Lazy Client Initialization
Never initialize SDK clients at module scope — it crashes during `next build`. Always use lazy singletons:

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getSupabaseServer() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
```

Apply the same pattern to `getStripe()` and `getResend()`.

### TypeScript
- Strict mode enabled (`"strict": true`).
- No `any`. Use `unknown` + type guards when needed.
- Define shared entity types in `src/types/index.ts`.

### Database / Supabase
- **RLS on every table.** No exceptions.
- Never use the service role key inside app code — only in Supabase Edge Functions (webhooks).
- All queries scoped by `workspace_id` through RLS policies.
- Active workspace stored in a cookie and passed as Supabase `app.workspace_id` session variable.

---

## Data Model

| Table | Purpose |
|---|---|
| `workspaces` | Each company/team. RLS anchor. |
| `workspace_members` | User ↔ workspace mapping with `role` (admin \| member) |
| `leads` | Contacts/companies with full profile |
| `deals` | Kanban cards — linked to lead, workspace, and pipeline stage |
| `activities` | Timeline entries per lead (call, email, meeting, note) |
| `subscriptions` | Stripe plan status per workspace (free \| pro) |

### Pipeline Stages (ordered)
1. Novo Lead
2. Contato Realizado
3. Proposta Enviada
4. Negociação
5. Fechado Ganho
6. Fechado Perdido

---

## Multi-tenancy

- Each user can belong to multiple workspaces with different roles.
- The **active workspace** is selected via a dropdown in the sidebar and persisted in a cookie.
- Supabase RLS policies use `auth.uid()` + `workspace_id` to enforce data isolation — no cross-workspace data leaks.
- Admins can invite collaborators by email (Resend sends the invitation).

---

## Monetization

| Plan | Limits | Price |
|---|---|---|
| Free | 2 members, 50 leads | R$0 |
| Pro | Unlimited members + leads | R$49/mês |

- Checkout: Stripe Checkout Session (redirect flow).
- Subscription lifecycle: Stripe Webhook → Route Handler → update `subscriptions` table.
- Billing management: Stripe Customer Portal.
- Plan enforcement: check `subscriptions` table in Server Components/Actions before allowing create operations.

---

## Design System

- **Component library:** shadcn/ui (copy-to-project model, fully customizable)
- **Styling:** Tailwind CSS + custom CSS tokens prefixed `--pf-*`
- **App shell:** Dark mode enforced (`className="dark"` no `<html>`)
- **Landing page:** Dark-first também, fundo `#0A0A0A`
- **Reference UX:** Pipedrive Kanban, HubSpot dashboard metrics

### Typography

| Classe utilitária | Fonte | Uso |
|---|---|---|
| `font-display` | **Syne** (700/800) | Headlines, títulos, logo |
| `font-body` | **DM Sans** (400/500) | Texto de interface, parágrafos |
| `font-mono` | **IBM Plex Mono** | Métricas, IDs, código, tags |

Fontes carregadas via Google Fonts no `globals.css`.

### Paleta de Cores (tokens CSS)

| Token | Valor | Uso |
|---|---|---|
| `--pf-accent` | `#CAFF33` | Cor de destaque principal (verde-limão) |
| `--pf-accent-dim` | `#a8d400` | Accent hover/pressed |
| `--pf-bg` | `#0A0A0A` | Fundo da landing |
| `--pf-surface` | `#111111` | Cards, painéis |
| `--pf-surface-2` | `#1a1a1a` | Surface elevado |
| `--pf-border` | `rgba(255,255,255,0.08)` | Bordas sutis |
| `--pf-text` | `#F0F0F0` | Texto principal |
| `--pf-text-muted` | `#888` | Texto secundário |

Uso via Tailwind: `text-pf-accent`, `bg-pf-surface`, `border-pf-border`, etc.

### Animações CSS Customizadas

Definidas em `globals.css`, disponíveis como classes utilitárias:

| Classe | Efeito |
|---|---|
| `pf-orb-float` | Orbe flutuante com movimento vertical suave |
| `pf-wave-scroll` | Onda SVG em scroll horizontal infinito |
| `pf-flow-pulse` | Pulso de opacidade (linha decorativa do logo) |
| `pf-case-float` | Float vertical com delays para cards de casos |
| `pf-case-float-delay-1` | Delay 0.3s para segundo card |
| `pf-case-float-delay-2` | Delay 0.6s para terceiro card |
| `pf-page-enter` | Fade-in + translate na entrada de página |
| `pf-stagger` | Stagger de entrada para listas |
| `pf-glass` | Fundo glassmorphism (blur + border semitransparente) |
| `pf-glow-btn` | Glow no hover de botões com accent color |
| `pf-nav-active` | Indicador de item ativo na navegação |

### Componentes Compartilhados da Landing

Localização: `src/components/shared/` e `src/components/landing/`

| Componente | Arquivo | Descrição |
|---|---|---|
| `<Logo>` | `shared/logo.tsx` | Logo "PipeFlow" com accent color e linha pulsante |
| `<WaveSeparator>` | `shared/wave-separator.tsx` | Divisor SVG animado entre seções; aceita `flip` |
| `<AnimateOnScroll>` | `shared/animate-on-scroll.tsx` | Wrapper que anima filho ao entrar no viewport; aceita `as`, `delay` |
| `<SuccessCases>` | `landing/success-cases.tsx` | Grid de 3 cards com CountUp animado de métricas |

### shadcn/ui Primitives in Use
Button, Input, Textarea, Card, Tabs, Table, Dialog, AlertDialog, Sheet, DropdownMenu, Badge, Separator, Skeleton, Avatar, Select, Form (react-hook-form + zod)

---

## Key Commands

```bash
# Development
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check

```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Only for Edge Functions / server scripts

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=             # e.g. http://localhost:3000
```

---

## Development Milestones

1. **M1 — Foundation:** Next.js scaffold + Supabase auth + workspace creation + basic shell layout
2. **M2 — Leads:** Lead CRUD, list with filters, lead detail page
3. **M3 — Pipeline:** Kanban board with @dnd-kit, deal cards, stage persistence
4. **M4 — Activities:** Timeline registration on lead detail page
5. **M5 — Dashboard:** Metric cards + Recharts funnel chart
6. **M6 — Collaboration:** Workspace invites via Resend, member management, role enforcement
7. **M7 — Monetization:** Stripe Checkout + webhook + plan limits enforcement
8. **M8 — Landing Page:** Public marketing page with hero, features, pricing CTA
