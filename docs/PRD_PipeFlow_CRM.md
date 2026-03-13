# PRD — PipeFlow CRM
## Product Requirements Document

**Projeto:** PipeFlow CRM — CRM de Vendas Multi-Empresa
**Versão:** 1.0
**Data:** Março 2026
**Autor:** Danilo Fernandes
**Stack:** Next.js 14, Tailwind CSS, shadcn/ui, Supabase, Stripe/Asaas, Git, Vercel, Recharts, Claude Code

---

## 1. Visão Estratégica

### 1.1 Problema Identificado

Pequenas empresas, freelancers e times de vendas perdem oportunidades de negócio por falta de organização no acompanhamento de leads e no processo comercial. Muitos usam planilhas, anotações soltas ou simplesmente confiam na memória — o que resulta em leads esquecidos, follow-ups perdidos e zero visibilidade sobre o funil de vendas.

### 1.2 Solução

Construir o **PipeFlow CRM** — um sistema de gestão de clientes e vendas com:

- Pipeline visual estilo Kanban para acompanhar negócios por etapa
- Cadastro completo de leads/contatos com dados de empresa e cargo
- Registro de atividades (ligações, e-mails, reuniões, notas) por lead
- Dashboard com métricas de vendas em tempo real (valor do pipeline, taxa de conversão, funil)
- Multi-empresa: cada time/empresa tem seu workspace isolado
- Monetização via planos (Free e Pro) com integração Stripe/Asaas

### 1.3 Funcionalidades Principais

#### Gestão de Leads
- Cadastro com campos: nome, e-mail, telefone, empresa, cargo, origem, notas
- Status: Novo, Qualificado, Desqualificado
- Responsável (membro do workspace)
- Busca e filtros por nome, empresa, status, responsável, data

#### Pipeline de Vendas (Kanban)
- Etapas: Novo Lead → Contato Realizado → Proposta Enviada → Negociação → Fechado Ganho → Fechado Perdido
- Cards de negócio com: título, valor (R$), lead vinculado, responsável, prazo
- Drag-and-drop entre etapas
- Valor total por etapa visível no topo de cada coluna

#### Atividades / Interações
- Tipos: Ligação, E-mail, Reunião, Nota
- Campos: tipo, descrição, data, autor
- Timeline cronológica no detalhe do lead
- Cada atividade vinculada a um lead específico

#### Dashboard
- Cards: Total de Leads, Negócios Abertos, Valor Total do Pipeline, Taxa de Conversão
- Gráfico de funil (negócios por etapa)
- Gráfico de barras (novos leads por semana)
- Lista: "Meus negócios com prazo próximo"

#### Multi-Empresa
- Workspaces isolados (cada empresa = 1 workspace)
- Convite de colaboradores por e-mail
- Papéis: Admin e Membro
- Troca de workspace via dropdown na sidebar
- Row Level Security (RLS) no Supabase

#### Monetização
- **Plano Free:** até 2 colaboradores, 50 leads
- **Plano Pro (R$49/mês):** colaboradores e leads ilimitados
- Stripe Checkout para pagamento
- Webhook para ativação/desativação automática
- Página de planos com comparativo visual

### 1.4 Personas e Tipos de Usuários

| Persona | Descrição | Ações Principais |
|---------|-----------|------------------|
| **Admin** | Dono da empresa ou gestor comercial | Criar workspace, convidar membros, gerenciar plano, criar/editar tudo |
| **Membro** | Vendedor ou SDR do time | Cadastrar leads, gerenciar negócios, registrar atividades |
| **Visitante (não logado)** | Pessoa na página de login | Criar conta, fazer login |

### 1.5 O que NÃO vai ter (Escopo Negativo)

- Automação de e-mail (fora do escopo do MVP)
- Integração com WhatsApp
- App mobile nativo
- Importação/exportação CSV
- Relatórios em PDF
- Múltiplos pipelines por workspace (apenas 1 pipeline)

### 1.6 Ferramentas e Custos

| Ferramenta | Uso | Custo |
|------------|-----|-------|
| Next.js 14 | Frontend + API Routes | Gratuito |
| Tailwind CSS + shadcn/ui | Estilização e componentes | Gratuito |
| Supabase | Banco de dados + Auth + RLS | Free tier (até 500MB) |
| Stripe | Pagamento (internacional) | 2.9% + R$0.30/transação |
| Asaas (alternativa) | Pagamento (Brasil) | Similar |
| GitHub | Versionamento | Gratuito |
| Vercel | Deploy e hosting | Free tier |
| Claude Code | Desenvolvimento assistido por IA | Incluído na assinatura |
| Recharts | Gráficos do dashboard | Gratuito |

**Custo total para o aluno:** R$0 (tudo no free tier durante desenvolvimento)

---

## 2. Insights do Mercado

### 2.1 Benchmark

| Plataforma | Pontos Fortes | Pontos Fracos | O que aproveitar |
|------------|--------------|---------------|------------------|
| **HubSpot CRM** | Gratuito, robusto, integrações | Complexo para iniciantes, pesado | Estrutura de leads + deals separados |
| **Pipedrive** | Pipeline visual excelente, UX limpa | Pago desde o início, sem free tier robusto | Visual do Kanban, cards com valor |
| **RD Station CRM** | Focado no Brasil, integração com marketing | Interface datada, menos flexível | Funil de vendas simplificado |
| **Trello** | Kanban simples e intuitivo | Não é CRM, sem métricas de vendas | Experiência de drag-and-drop |

### 2.2 Diferenciais do PipeFlow CRM

- **Multi-empresa nativo** (maioria dos CRMs não oferece no plano gratuito)
- **Pipeline Kanban bonito e funcional** (inspirado no Pipedrive)
- **Construído com Claude Code** (demonstra que IA pode criar SaaS completo)
- **Monetização real** (Stripe/Asaas integrado, não é só um exercício)

### 2.3 Inspirações de Design

- Pipeline visual: Pipedrive (colunas com valor total no topo)
- Dashboard: HubSpot (cards de métricas + gráfico de funil)
- Layout geral: Linear app (sidebar clean + área de conteúdo ampla)
- Cards: Notion databases (visual limpo com badges coloridos)

---

## 3. Arquitetura Técnica

### 3.1 Mapeamento de Processos

#### Fluxo: Cadastrar Lead
1. Usuário clica em "Novo Lead"
2. Modal abre com formulário (nome, e-mail, telefone, empresa, cargo)
3. Ao salvar → POST /api/leads → insere no Supabase
4. Lead aparece na lista com status "Novo"
5. Lead já pode ser vinculado a um negócio no pipeline

#### Fluxo: Gerenciar Pipeline
1. Usuário acessa a página Pipeline
2. Colunas carregam com negócios do workspace
3. Ao criar negócio → seleciona lead, define título, valor, prazo
4. Ao arrastar card → PATCH /api/deals/:id → atualiza etapa
5. Valor total de cada coluna recalcula automaticamente

#### Fluxo: Registrar Atividade
1. Usuário acessa detalhe do lead
2. Clica em "Nova Atividade"
3. Seleciona tipo (Ligação, E-mail, Reunião, Nota), escreve descrição
4. Ao salvar → POST /api/activities → insere vinculada ao lead
5. Timeline do lead atualiza em ordem cronológica

#### Fluxo: Onboarding
1. Usuário cria conta (Supabase Auth)
2. Redireciona para tela de criar workspace (nome da empresa + slug)
3. Workspace criado → usuário adicionado como Admin
4. Redireciona para Dashboard (vazio, com call-to-action para criar primeiro lead)

#### Fluxo: Upgrade de Plano
1. Admin acessa página de Planos
2. Clica em "Fazer Upgrade"
3. Redireciona para Stripe Checkout
4. Pagamento confirmado → Stripe envia webhook
5. Endpoint /api/webhooks/stripe atualiza tabela subscriptions
6. Limites removidos (leads e colaboradores ilimitados)

#### Fluxo: Convidar Colaborador
1. Admin acessa página de Membros
2. Insere e-mail do colaborador
3. Se plano Free e já tem 2 membros → modal de upgrade
4. Se permitido → convite salvo no banco
5. Colaborador faz cadastro/login → é adicionado ao workspace automaticamente

### 3.2 Estrutura de Páginas (Rotas Next.js)

```
/                          → Redirect para /login ou /dashboard
/login                     → Tela de login
/signup                    → Tela de cadastro
/onboarding                → Criar primeiro workspace
/dashboard                 → Dashboard com métricas
/leads                     → Lista de leads (tabela + filtros)
/leads/[id]                → Detalhe do lead (perfil + timeline)
/pipeline                  → Pipeline Kanban de vendas
/members                   → Gerenciar membros do workspace
/plans                     → Página de planos (Free vs Pro)
/api/leads                 → CRUD de leads
/api/deals                 → CRUD de negócios
/api/activities            → CRUD de atividades
/api/members               → Gerenciar membros
/api/workspaces            → Gerenciar workspaces
/api/dashboard             → Dados agregados do dashboard
/api/webhooks/stripe       → Webhook do Stripe
```

### 3.3 API Routes — Endpoints

#### Leads
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/leads | Listar leads do workspace (com filtros) |
| POST | /api/leads | Criar novo lead |
| GET | /api/leads/[id] | Detalhe do lead |
| PUT | /api/leads/[id] | Editar lead |
| DELETE | /api/leads/[id] | Excluir lead |

#### Deals (Negócios)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/deals | Listar negócios do workspace (com filtros) |
| POST | /api/deals | Criar novo negócio |
| PUT | /api/deals/[id] | Editar negócio (inclui mover etapa) |
| DELETE | /api/deals/[id] | Excluir negócio |

#### Activities (Atividades)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/activities?lead_id=X | Listar atividades de um lead |
| POST | /api/activities | Registrar nova atividade |
| DELETE | /api/activities/[id] | Excluir atividade |

#### Workspace & Members
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/workspaces | Criar workspace |
| GET | /api/workspaces | Listar workspaces do usuário |
| POST | /api/members/invite | Convidar membro |
| DELETE | /api/members/[id] | Remover membro |

#### Dashboard & Billing
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/dashboard | Métricas agregadas |
| POST | /api/billing/checkout | Criar sessão Stripe Checkout |
| POST | /api/webhooks/stripe | Receber eventos do Stripe |

---

## 4. Observações Importantes

### Limitações conhecidas
- Supabase free tier: 500MB de armazenamento, 50K rows
- Vercel free tier: 100GB de bandwidth/mês
- Stripe modo teste: usar para desenvolvimento, sem cobranças reais

### Prazos
- Semana 1: Documentação + Setup
- Semana 2: Gravar Módulos 1, 2 e 3
- Semana 3: Gravar Módulos 4, 5 e 6
- Buffer: Revisão e entrega

### Decisões técnicas
- **Next.js App Router** (não Pages Router) — padrão atual
- **Server Components** onde possível, Client Components para interatividade
- **Supabase Client** no frontend, **Supabase Admin** apenas no backend (webhooks)
- **dnd-kit** para drag-and-drop (mais leve que react-beautiful-dnd)
- **Recharts** para gráficos (mais simples que D3, integra bem com React)
