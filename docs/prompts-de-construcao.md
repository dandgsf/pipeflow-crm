# Prompts de Construção — PipeFlow CRM
## Guia Completo de Prompts para Claude Code

Este arquivo contém todos os prompts que você (e os alunos) vão usar no Claude Code dentro do VSCode para construir o PipeFlow CRM do zero.

**Como usar:** Copie o prompt, cole no Claude Code, e execute. Cada prompt corresponde a uma etapa do projeto.

---

## FASE 1: GERAR A DOCUMENTAÇÃO DO PROJETO

### Prompt 1.1 — Gerar o PRD completo

> Use este prompt para criar toda a documentação de planejamento do projeto. O aluno adapta os campos entre [colchetes] para o projeto dele.

```
Você é um Engenheiro de Produtos IA experiente. Preciso que você crie um PRD (Product Requirements Document) completo para o seguinte projeto:

PROJETO: [PipeFlow CRM — CRM de Vendas Multi-Empresa]

PROBLEMA: [Pequenas empresas e freelancers perdem vendas por falta de organização no acompanhamento de leads e no processo comercial. Usam planilhas ou confiam na memória.]

SOLUÇÃO: [Um CRM com pipeline visual Kanban, cadastro de leads, registro de interações, dashboard de vendas, multi-empresa com workspaces isolados e monetização via planos pagos.]

STACK TÉCNICA:
- Frontend: Next.js 14 + Tailwind CSS + shadcn/ui
- Backend: Next.js API Routes (App Router)
- Banco de Dados: Supabase (PostgreSQL + Row Level Security)
- Autenticação: Supabase Auth
- Pagamento: Stripe (ou Asaas)
- Versionamento: Git + GitHub
- Deploy: Vercel
- Gráficos: Recharts

REFERÊNCIAS DE MERCADO: [HubSpot CRM, Pipedrive, RD Station CRM]

O PRD deve conter obrigatoriamente:

1. VISÃO ESTRATÉGICA
   - Problema identificado (detalhado)
   - Solução proposta (com lista de features)
   - Funcionalidades principais agrupadas por categoria
   - Personas e tipos de usuários (tabela com ações de cada um)
   - Escopo negativo (o que NÃO vai ter no MVP)
   - Ferramentas e custos estimados

2. INSIGHTS DO MERCADO
   - Benchmark de 3-4 plataformas concorrentes (pontos fortes, fracos, o que aproveitar)
   - Diferenciais do nosso projeto
   - Inspirações de design e UX

3. ARQUITETURA TÉCNICA
   - Mapeamento de processos (todos os fluxos do usuário, passo a passo numerado)
   - Estrutura de páginas (rotas do Next.js)
   - Endpoints da API (tabela com método, rota e descrição)

4. OBSERVAÇÕES
   - Limitações conhecidas
   - Decisões técnicas importantes

Formate em Markdown limpo e organizado. Seja detalhado em cada seção.
```

### Prompt 1.2 — Gerar o Schema SQL do Supabase

```
Com base no PRD que acabamos de criar, gere o schema SQL completo para o Supabase (PostgreSQL).

Requisitos obrigatórios:
1. Use UUID como primary key em todas as tabelas (uuid_generate_v4)
2. Inclua campos created_at e updated_at com TIMESTAMPTZ
3. Use foreign keys com ON DELETE CASCADE onde apropriado
4. Inclua CHECK constraints para campos com valores limitados (enums via CHECK)
5. Crie índices para os campos mais consultados (workspace_id, status, stage, lead_id)
6. Habilite Row Level Security (RLS) em TODAS as tabelas
7. Crie uma função auxiliar get_user_workspace_ids() que retorna os workspace_ids do usuário logado
8. Crie policies de SELECT, INSERT, UPDATE e DELETE para cada tabela
9. Crie triggers de updated_at automático
10. Inclua seção de seed data comentada como exemplo

As tabelas devem refletir exatamente as entidades do PRD. Comente cada tabela explicando seu propósito.

Entregue como um arquivo .sql único e executável no SQL Editor do Supabase.
```

### Prompt 1.3 — Gerar Wireframes Descritivos

```
Com base no PRD, gere wireframes descritivos (em texto) para TODAS as telas do projeto.

Para cada tela, descreva:
1. URL/rota da página
2. Objetivo da tela
3. Layout detalhado (de cima para baixo, esquerda para direita)
4. Cada componente visual: tipo, dados exibidos, posição
5. Interações do usuário (o que acontece ao clicar, submeter, arrastar)
6. Responsividade (como se adapta em mobile e tablet)

Telas necessárias:
- Login
- Cadastro
- Onboarding (criar workspace)
- Layout principal (sidebar + header)
- Dashboard
- Lista de leads
- Detalhe do lead
- Pipeline Kanban
- Membros
- Planos/Pricing

Formate como um documento Markdown. Cada tela deve ser descritiva o suficiente para que eu possa usar como prompt direto no Claude Code para construir a interface.
```

### Prompt 1.4 — Gerar Types TypeScript

```
Com base no schema SQL que criamos, gere um arquivo TypeScript com:

1. Todos os tipos das tabelas (interfaces refletindo exatamente as colunas)
2. Enums como union types (ex: type DealStage = 'new_lead' | 'contacted' | ...)
3. Tipos auxiliares para joins comuns (ex: DealWithLead, LeadWithCounts, ActivityWithAuthor)
4. Tipos para o dashboard (métricas, dados de gráficos)
5. Objetos de constantes com labels em português, cores e ícones para cada enum
6. Constantes de limites por plano (free/pro)
7. Array com a ordem das etapas do pipeline

O arquivo deve ser copiável direto para src/types/database.ts
```

### Prompt 1.5 — Gerar Estrutura de Pastas e Checklist

```
Com base no PRD, schema e wireframes, gere dois documentos:

DOCUMENTO 1 — Estrutura de Pastas:
- Árvore completa de diretórios e arquivos do projeto Next.js 14 (App Router)
- Separar: app/ (pages + api), components/ (por feature), lib/, hooks/, types/
- Listar as dependências (package.json) com versões recomendadas

DOCUMENTO 2 — Checklist de Execução:
Seguindo as 5 etapas do Framework NoCode StartUp:
1. Visão Estratégica (checkboxes do que já foi feito na documentação)
2. Insights do Mercado (checkboxes)
3. Arquitetura Técnica (checkboxes)
4. Criação Interativa (checkboxes detalhados para cada feature: banco, interface, backend, segurança, testes)
5. Lançamento e PDCA (deploy, revisão, melhorias futuras)

Inclua os commits esperados ao final (tabela com # | mensagem do commit | módulo da ementa).
```

---

## FASE 2: CONSTRUIR O PROJETO (etapa por etapa)

> Estes são os prompts que você usará dentro do Claude Code no VSCode, na ordem.

### Prompt 2.1 — Criar o projeto Next.js

```
Crie um projeto Next.js 14 com App Router, TypeScript, Tailwind CSS e shadcn/ui.

Requisitos:
- Use create-next-app com --typescript --tailwind --app --src-dir
- Instale as dependências: @supabase/supabase-js @supabase/ssr @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts stripe lucide-react date-fns
- Configure o shadcn/ui com tema "neutral" e estilo "new-york"
- Crie o arquivo .env.local com as variáveis do .env.example
- Crie o .gitignore protegendo .env.local e node_modules
- Crie a estrutura base de pastas: components/, lib/, hooks/, types/
- Copie o arquivo de types para src/types/database.ts

Inicialize o Git, faça o primeiro commit e prepare para push no GitHub.
```

### Prompt 2.2 — Configurar Supabase Client

```
Leia o arquivo docs/PRD_PipeFlow_CRM.md para contexto do projeto.

Crie os clients do Supabase para o projeto:

1. src/lib/supabase/client.ts — Client para uso no browser (Client Components)
   - Usar createBrowserClient do @supabase/ssr
   
2. src/lib/supabase/server.ts — Client para uso em Server Components e API Routes
   - Usar createServerClient do @supabase/ssr com cookies
   
3. src/lib/supabase/admin.ts — Client admin (service role) para webhooks
   - Usar createClient com SUPABASE_SERVICE_ROLE_KEY
   - APENAS para uso em /api/webhooks/

4. src/middleware.ts — Middleware Next.js para refresh de sessão e proteção de rotas
   - Redirecionar para /login se não autenticado (exceto /login, /signup, /api/webhooks)
   - Redirecionar para /onboarding se autenticado mas sem workspace
   - Redirecionar para /dashboard se autenticado e com workspace
```

### Prompt 2.3 — Construir Autenticação

```
Leia docs/wireframes.md nas seções "Login", "Cadastro" e "Onboarding".

Construa as 3 telas de autenticação:

1. /login — Tela de login com e-mail e senha (Supabase Auth)
2. /signup — Tela de cadastro com nome, e-mail e senha
3. /onboarding — Após cadastro, criar o primeiro workspace

Requisitos:
- Use shadcn/ui para todos os componentes (Input, Button, Card, Label)
- Validação visual nos formulários (campos obrigatórios)
- Mensagens de erro inline
- Loading state nos botões durante submissão
- O onboarding deve: criar workspace, criar member (admin), criar subscription (free)
- Após onboarding, redirecionar para /dashboard
- Design limpo, centralizado, responsivo

Faça commit: "feat: auth pages + onboarding"
```

### Prompt 2.4 — Construir Layout Principal

```
Leia docs/wireframes.md na seção "Layout Principal".

Construa o layout que envolve todas as páginas autenticadas (/dashboard, /leads, /pipeline, /members, /plans):

1. Sidebar fixa (esquerda, ~260px):
   - Topo: nome do workspace + dropdown para trocar
   - Menu: Dashboard, Leads, Pipeline, Membros, Plano (usar ícones lucide-react)
   - Rodapé: avatar + nome do usuário + botão logout
   - Mobile: hamburger menu com sidebar colapsável

2. Área de conteúdo (direita):
   - Header com título da página
   - Espaço para children

Use shadcn/ui, Tailwind, e os tipos de src/types/database.ts.
Crie os componentes em src/components/layout/

Faça commit: "feat: main layout + navigation"
```

### Prompt 2.5 — Construir Página de Leads

```
Leia docs/wireframes.md nas seções "Lista de Leads" e "Detalhe do Lead".
Leia docs/types.ts para os tipos Lead, LeadStatus, etc.

Construa:

1. /leads — Lista de leads com:
   - Tabela com colunas: Nome, E-mail, Telefone, Empresa, Status (badge), Responsável, Data
   - Barra de busca por nome/empresa
   - Filtros: status (dropdown), responsável (dropdown)
   - Botão "+ Novo Lead" que abre modal com formulário
   - Cada linha clicável → navega para /leads/[id]
   - Use dados mockados por enquanto (array estático)

2. /leads/[id] — Detalhe do lead com:
   - Coluna esquerda: perfil (dados de contato, empresa, cargo, notas)
   - Coluna direita: timeline de atividades (mockadas)
   - Botão "+ Nova Atividade" com modal (tipo, descrição, data)
   - Lista de negócios vinculados ao lead

Componentes em src/components/leads/ e src/components/activities/

Faça commit: "feat: leads pages + detail"
```

### Prompt 2.6 — Construir Pipeline Kanban

```
Leia docs/wireframes.md na seção "Pipeline Kanban".
Leia docs/types.ts para DealStage, DEAL_STAGE_LABELS, DEAL_STAGE_COLORS, DEAL_STAGE_ORDER.

Construa /pipeline com:

1. Board Kanban com 6 colunas (uma por etapa do pipeline)
2. Header de cada coluna: nome da etapa, quantidade de cards, valor total (R$)
3. Cards de negócio: título, valor, nome do lead, responsável, prazo
4. Drag-and-drop entre colunas usando @dnd-kit/core e @dnd-kit/sortable
5. Ao soltar em outra coluna → atualizar estado local (depois será API)
6. Feedback visual durante arraste (opacidade, borda destacada na coluna destino)
7. Botão "+ Novo Negócio" com modal (título, valor, lead, etapa, responsável, prazo)
8. Use dados mockados por enquanto
9. Scroll horizontal no mobile

Componentes em src/components/pipeline/

Faça commit: "feat: pipeline kanban + drag-and-drop"
```

### Prompt 2.7 — Construir Dashboard

```
Leia docs/wireframes.md na seção "Dashboard".
Leia docs/types.ts para DashboardMetrics, FunnelData, WeeklyLeadsData.

Construa /dashboard com:

1. 4 cards de métricas: Total de Leads, Negócios Abertos, Valor do Pipeline, Taxa de Conversão
   - Cada card com ícone (lucide-react), valor grande, label
   
2. Gráfico de funil (barras horizontais) — negócios por etapa
   - Usar Recharts BarChart
   - Cores de DEAL_STAGE_COLORS
   
3. Gráfico de linha — novos leads por semana (últimas 4 semanas)
   - Usar Recharts LineChart
   
4. Lista "Meus negócios com prazo próximo" (tabela simples, 5 itens)

Use dados mockados. Componentes em src/components/dashboard/

Faça commit: "feat: dashboard + charts"
```

### Prompt 2.8 — Criar todas as API Routes

```
Leia docs/PRD_PipeFlow_CRM.md na seção "3.3 API Routes — Endpoints".
Leia docs/schema.sql para entender a estrutura das tabelas.
Use src/lib/supabase/server.ts para o client do Supabase.
Use os tipos de src/types/database.ts.

Crie TODAS as API Routes:

1. /api/leads — GET (listar com filtros) + POST (criar)
2. /api/leads/[id] — GET + PUT + DELETE
3. /api/deals — GET (listar com filtros) + POST (criar)
4. /api/deals/[id] — GET + PUT (inclui mover etapa) + DELETE
5. /api/activities — GET (filtrar por lead_id) + POST (criar)
6. /api/activities/[id] — DELETE
7. /api/workspaces — GET (listar do usuário) + POST (criar)
8. /api/members — GET (listar do workspace)
9. /api/members/invite — POST (convidar)
10. /api/dashboard — GET (métricas agregadas com COUNT, SUM, etc)

Cada rota deve:
- Validar inputs obrigatórios
- Retornar erros amigáveis com status code correto
- Filtrar pelo workspace_id do usuário logado
- Usar try/catch

Faça commit: "feat: all API routes"
```

### Prompt 2.9 — Conectar Frontend ao Backend

```
Agora substitua TODOS os dados mockados por chamadas reais à API:

1. Lista de leads → fetch /api/leads
2. Detalhe do lead → fetch /api/leads/[id]
3. Timeline de atividades → fetch /api/activities?lead_id=X
4. Pipeline Kanban → fetch /api/deals
5. Drag-and-drop → PATCH /api/deals/[id] ao soltar
6. Dashboard → fetch /api/dashboard
7. Criar lead → POST /api/leads → revalidar lista
8. Criar negócio → POST /api/deals → revalidar pipeline
9. Registrar atividade → POST /api/activities → revalidar timeline

Teste o fluxo completo: criar lead → criar negócio → arrastar no pipeline → registrar atividade → verificar dashboard.

Faça commit: "feat: connect frontend to backend"
```

### Prompt 2.10 — Multi-empresa e Permissões

```
Leia docs/wireframes.md na seção "Membros".

Construa:

1. /members — Página de membros do workspace
   - Listar membros (avatar, nome, email, papel, data de entrada)
   - Botão "+ Convidar" (somente para admin)
   - Modal de convite (email + papel)
   - Botão remover membro (somente admin, não pode remover a si mesmo)
   - Bloqueio se plano Free já tem 2 membros → mostrar modal de upgrade

2. Troca de workspace:
   - Dropdown na sidebar que lista workspaces do usuário
   - Ao trocar → recarregar todos os dados do workspace selecionado
   - Usar hook useWorkspace para gerenciar workspace ativo

3. Permissões:
   - Verificar role (admin/member) via hook
   - Esconder botões de admin para membros no frontend
   - Verificar role nos endpoints de /api/members

Faça commit: "feat: multi-tenant + permissions"
```

### Prompt 2.11 — Integração Stripe

```
Construa a integração completa com Stripe:

1. /api/billing/checkout — Criar sessão Stripe Checkout
   - Receber workspace_id
   - Criar ou reutilizar Stripe Customer
   - Criar checkout session com STRIPE_PRICE_ID
   - Retornar URL do checkout

2. /api/webhooks/stripe — Receber eventos do Stripe
   - Validar assinatura do webhook (STRIPE_WEBHOOK_SECRET)
   - Usar Supabase admin client (service role)
   - Tratar eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
   - Atualizar tabela subscriptions com plano e status

3. /plans — Página de planos
   - Card Free vs Card Pro com comparativo visual
   - Badge do plano atual
   - Botão "Fazer upgrade" → chama /api/billing/checkout → redireciona
   - Se já é Pro: "Gerenciar assinatura" → Stripe Customer Portal

4. Lógica de limites:
   - Hook useSubscription que retorna o plano atual e os limites
   - Antes de criar lead → verificar se atingiu limite (50 no free)
   - Antes de convidar membro → verificar limite (2 no free)
   - Se atingiu → mostrar UpgradeModal

Faça commit: "feat: stripe integration + plans"
```

### Prompt 2.12 — Deploy e Segurança

```
Prepare o projeto para produção:

1. Revisar segurança:
   - Confirmar que RLS está habilitado em todas as tabelas
   - Confirmar que .env.local está no .gitignore
   - Confirmar que SUPABASE_SERVICE_ROLE_KEY só é usado em /api/webhooks
   - Adicionar validação de inputs em formulários que ainda não têm
   - Verificar que o webhook do Stripe valida a assinatura

2. Responsividade:
   - Sidebar colapsável em mobile (hamburger menu)
   - Pipeline com scroll horizontal
   - Tabelas com scroll horizontal ou layout em cards no mobile
   - Detalhe do lead: colunas empilham no mobile
   - Dashboard: cards em grid 2x2 ou 1 coluna no mobile

3. Preparar para Vercel:
   - Verificar que next.config.ts está correto
   - Listar variáveis de ambiente necessárias no Vercel
   - Garantir que todos os commits estão feitos e pushed

Faça commit: "fix: security review + responsiveness"
```

---

## DICA PARA OS ALUNOS

A ordem importa. Cada prompt assume que os anteriores já foram executados.
Se o Claude Code errar em algum ponto, não se preocupe — mostre o erro
para ele e peça para corrigir. Iterar faz parte do processo.

Fluxo resumido:
1. Gerar documentação (Fase 1) → 5 prompts
2. Construir o projeto (Fase 2) → 12 prompts
3. Cada prompt = ~1 aula do curso = ~1 commit
