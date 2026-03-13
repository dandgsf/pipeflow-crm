# Framework NoCode StartUp.AI — PipeFlow CRM
## Checklist de Execução Completo

Este documento é o seu mapa de construção. Siga a ordem. Marque cada item conforme for concluindo no VSCode com Claude Code.

---

## ETAPA 1: PLANEJAMENTO

### ☑️ 1 — Visão Estratégica
- [ ] Problema identificado e documentado
- [ ] Solução definida com escopo claro
- [ ] Funcionalidades principais listadas
- [ ] Personas e tipos de usuários mapeados
- [ ] Ferramentas e custos levantados
- [ ] Escopo negativo definido (o que NÃO vai ter)

> 📄 Referência: `PRD_PipeFlow_CRM.md` — Seções 1.1 a 1.6

### ☑️ 2 — Insights do Mercado
- [ ] Benchmark de 3-4 plataformas (HubSpot, Pipedrive, RD Station CRM)
- [ ] Pontos fortes e fracos de cada referência anotados
- [ ] Diferenciais do PipeFlow CRM definidos
- [ ] Referências de design coletadas (Pipedrive pipeline, HubSpot dashboard, Linear layout)

> 📄 Referência: `PRD_PipeFlow_CRM.md` — Seção 2

### ☑️ 3 — Arquitetura Técnica
- [ ] Processos mapeados (6 fluxos: cadastrar lead, gerenciar pipeline, registrar atividade, onboarding, upgrade, convidar)
- [ ] Modelagem de dados completa (6 tabelas com relacionamentos)
- [ ] Script SQL pronto para execução no Supabase
- [ ] RLS (Row Level Security) configurado
- [ ] Wireframes descritivos de todas as telas (10 telas)
- [ ] Estrutura de rotas (páginas + API) definida
- [ ] Endpoints da API documentados
- [ ] PRD completo e revisado

> 📄 Referências: `schema.sql` + `wireframes.md` + `PRD_PipeFlow_CRM.md` — Seção 3

---

## ETAPA 2: EXECUÇÃO

### ☑️ 4 — Criação Interativa

#### Ambiente e Setup
- [ ] Criar projeto Next.js com Tailwind + TypeScript + shadcn/ui (via Claude Code)
- [ ] Configurar estrutura de pastas (`app/`, `components/`, `lib/`, `types/`)
- [ ] Instalar dependências: `@supabase/supabase-js`, `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts`, `stripe`
- [ ] Configurar `.env.local` com variáveis do Supabase
- [ ] Inicializar Git + criar `.gitignore` + primeiro commit + push GitHub
- [ ] Criar client Supabase (`lib/supabase/client.ts` e `lib/supabase/server.ts`)

#### Banco de Dados [Supabase]
- [ ] Criar projeto no Supabase
- [ ] Executar `schema.sql` no SQL Editor
- [ ] Verificar tabelas criadas (workspaces, members, subscriptions, leads, deals, activities)
- [ ] Verificar RLS habilitado em todas as tabelas
- [ ] Verificar políticas de acesso criadas
- [ ] Testar RLS: criar usuário → criar workspace → verificar que só vê seus dados

#### Interface — Autenticação
- [ ] Tela de Login (`/login`)
- [ ] Tela de Cadastro (`/signup`)
- [ ] Tela de Onboarding (`/onboarding`) — criar primeiro workspace
- [ ] Middleware de proteção de rotas (redirecionar para /login se não autenticado)
- [ ] Testar fluxo: cadastro → onboarding → dashboard
- [ ] **Commit: "feat: auth pages + onboarding"**

#### Interface — Layout e Navegação
- [ ] Layout principal com sidebar + header
- [ ] Navegação entre páginas (Dashboard, Leads, Pipeline, Membros, Plano)
- [ ] Dropdown de troca de workspace na sidebar
- [ ] Avatar + nome do usuário + logout na sidebar
- [ ] Sidebar responsiva (colapsável em mobile)
- [ ] **Commit: "feat: main layout + navigation"**

#### Interface — Leads
- [ ] Página de listagem de leads (tabela com dados mockados)
- [ ] Barra de busca e filtros (status, responsável)
- [ ] Modal de cadastro de novo lead
- [ ] Página de detalhe do lead (perfil + timeline mockada)
- [ ] Formulário de registrar atividade
- [ ] **Commit: "feat: leads pages + detail"**

#### Interface — Pipeline Kanban
- [ ] Board com 6 colunas (etapas do pipeline)
- [ ] Cards de negócio (título, valor, lead, responsável, prazo)
- [ ] Header de coluna com qtd e valor total
- [ ] Drag-and-drop entre colunas (dnd-kit)
- [ ] Modal de criar novo negócio
- [ ] **Commit: "feat: pipeline kanban + drag-and-drop"**

#### Interface — Dashboard
- [ ] 4 cards de métricas (dados mockados)
- [ ] Gráfico de funil de vendas (Recharts)
- [ ] Gráfico de novos leads por semana (Recharts)
- [ ] Lista "meus negócios com prazo próximo"
- [ ] **Commit: "feat: dashboard + charts"**

#### Backend — API Routes
- [ ] CRUD de Leads (GET, POST, PUT, DELETE)
- [ ] CRUD de Deals (GET, POST, PUT, DELETE)
- [ ] CRUD de Activities (GET, POST, DELETE)
- [ ] Rota de Dashboard (dados agregados)
- [ ] Rota de Workspaces (criar, listar)
- [ ] Rota de Members (convidar, listar, remover)
- [ ] Validação de inputs em todos os endpoints
- [ ] Tratamento de erros com mensagens amigáveis
- [ ] **Commit: "feat: all API routes"**

#### Conectar Frontend ao Backend
- [ ] Substituir mocks por chamadas reais nos Leads
- [ ] Substituir mocks por chamadas reais no Pipeline
- [ ] Substituir mocks por chamadas reais no Dashboard
- [ ] Drag-and-drop persistindo no banco
- [ ] Timeline de atividades com dados reais
- [ ] Testar fluxo completo end-to-end
- [ ] **Commit: "feat: connect frontend to backend"**

#### Multi-Empresa e Colaboração
- [ ] Página de Membros (listar, convidar, remover)
- [ ] Verificação de role (admin vs membro) no frontend e backend
- [ ] Esconder botões de admin para membros
- [ ] Troca de workspace funcional (dropdown na sidebar)
- [ ] Limite de colaboradores no plano Free (bloqueio + modal upgrade)
- [ ] **Commit: "feat: multi-tenant + permissions"**

#### Monetização (Stripe/Asaas)
- [ ] Criar conta no Stripe (modo teste)
- [ ] Configurar produto "PipeFlow Pro" (R$49/mês)
- [ ] Implementar Stripe Checkout (rota /api/billing/checkout)
- [ ] Implementar webhook (/api/webhooks/stripe)
- [ ] Página de planos (Free vs Pro com comparativo)
- [ ] Lógica de limites por plano (leads, colaboradores)
- [ ] Testar com Stripe CLI: pagamento → webhook → plano ativado
- [ ] **Commit: "feat: stripe integration + plans"**

#### Segurança
- [ ] RLS funcionando (testar com 2 usuários em workspaces diferentes)
- [ ] Variáveis de ambiente: NUNCA no código, sempre em .env.local
- [ ] Validação de inputs em todos os formulários e endpoints
- [ ] Middleware verificando autenticação em todas as rotas protegidas
- [ ] Stripe webhook validando assinatura (webhook secret)
- [ ] **Commit: "fix: security review"**

#### Testes Manuais
- [ ] Criar conta → onboarding → dashboard
- [ ] Cadastrar 5 leads → verificar listagem e busca
- [ ] Criar 3 negócios → verificar no pipeline
- [ ] Arrastar negócio entre etapas → verificar persistência
- [ ] Registrar atividades → verificar timeline
- [ ] Convidar membro → verificar acesso
- [ ] Trocar workspace → verificar isolamento
- [ ] Fazer upgrade → verificar limites removidos
- [ ] Mobile: testar sidebar, pipeline scroll, tabelas

### ☑️ 5 — Lançamento e PDCA

#### Deploy
- [ ] Conectar repositório GitHub ao Vercel
- [ ] Configurar variáveis de ambiente no Vercel (Supabase URL, keys, Stripe keys)
- [ ] Fazer deploy
- [ ] Testar URL pública
- [ ] Configurar webhook Stripe para URL de produção
- [ ] Testar deploy automático (push → atualiza)
- [ ] **Commit: "chore: production deploy"**

#### Revisão Final
- [ ] Navegar por todas as páginas e verificar UI/UX
- [ ] Testar responsividade em mobile e tablet
- [ ] Corrigir bugs encontrados
- [ ] Ajustar textos e labels
- [ ] **Commit final: "fix: final review + polish"**

#### PDCA (pós-lançamento / melhorias futuras)
- [ ] Listar pontos de melhoria identificados durante construção
- [ ] Priorizar por impacto vs esforço
- [ ] Sugestões: integração WhatsApp, e-mail automático, relatórios PDF, scoring de leads com IA

---

## Resumo de Commits Esperados

| # | Commit | Módulo |
|---|--------|--------|
| 1 | `chore: initial setup + first commit` | Módulo 1 |
| 2 | `feat: auth pages + onboarding` | Módulo 3 |
| 3 | `feat: main layout + navigation` | Módulo 3 |
| 4 | `feat: leads pages + detail` | Módulo 3 |
| 5 | `feat: pipeline kanban + drag-and-drop` | Módulo 3 |
| 6 | `feat: dashboard + charts` | Módulo 3 |
| 7 | `feat: all API routes` | Módulo 4 |
| 8 | `feat: connect frontend to backend` | Módulo 4 |
| 9 | `feat: multi-tenant + permissions` | Módulo 5 |
| 10 | `feat: stripe integration + plans` | Módulo 5 |
| 11 | `fix: security review` | Módulo 6 |
| 12 | `chore: production deploy` | Módulo 6 |
| 13 | `fix: final review + polish` | Módulo 6 |
