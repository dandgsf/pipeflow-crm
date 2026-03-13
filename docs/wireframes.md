# Wireframes — PipeFlow CRM
## Descrição Detalhada de Telas

Cada tela abaixo está descrita no formato que pode ser usado como prompt para o Claude Code construir a interface. Use estas descrições diretamente no VSCode.

---

## Tela 1: Login (`/login`)

**Objetivo:** Autenticar o usuário existente.

**Layout:**
- Página centralizada, fundo branco ou gradiente suave
- Card central (max-width: 400px) com:
  - Logo PipeFlow CRM no topo (texto estilizado, sem imagem)
  - Título: "Entrar na sua conta"
  - Campo: E-mail (input com ícone de envelope)
  - Campo: Senha (input com ícone de cadeado e toggle para mostrar/ocultar)
  - Botão: "Entrar" (primário, full-width, cor principal do tema)
  - Link abaixo: "Não tem uma conta? Criar conta" → redireciona para /signup

**Interação:**
- Ao submeter → chama Supabase Auth signInWithPassword
- Se erro → mostra mensagem inline abaixo do formulário
- Se sucesso → redireciona para /dashboard (ou /onboarding se não tem workspace)

---

## Tela 2: Cadastro (`/signup`)

**Objetivo:** Criar conta nova.

**Layout:**
- Mesmo visual do login, com card centralizado
- Campos: Nome completo, E-mail, Senha, Confirmar Senha
- Botão: "Criar conta"
- Link: "Já tem conta? Entrar" → /login

**Interação:**
- Supabase Auth signUp
- Após sucesso → redireciona para /onboarding

---

## Tela 3: Onboarding (`/onboarding`)

**Objetivo:** Criar o primeiro workspace após cadastro.

**Layout:**
- Página simples, centralizada
- Título: "Crie seu espaço de trabalho"
- Subtítulo: "Cada empresa ou time tem seu próprio workspace isolado"
- Campo: Nome da empresa (ex: "Acme Corp")
- Campo: Slug (gerado automaticamente a partir do nome, editável: "acme-corp")
- Botão: "Criar workspace e começar"

**Interação:**
- POST /api/workspaces → cria workspace + member (admin) + subscription (free)
- Redireciona para /dashboard

---

## Tela 4: Layout Principal (compartilhado)

**Objetivo:** Estrutura que envolve todas as páginas autenticadas.

**Componentes:**

### Sidebar (esquerda, fixa, ~260px)
- **Topo:** Nome do workspace + dropdown para trocar (ícone de chevron)
- **Menu:**
  - 📊 Dashboard (`/dashboard`)
  - 👥 Leads (`/leads`)
  - 🎯 Pipeline (`/pipeline`)
  - 👤 Membros (`/members`)
  - 💳 Plano (`/plans`)
- **Rodapé da sidebar:** Avatar + nome do usuário + botão logout
- **Mobile:** sidebar colapsável (hamburger menu)

### Header (topo da área de conteúdo)
- Breadcrumb ou título da página atual
- Espaço para ações contextuais (ex: "Novo Lead" na página de leads)

### Área de conteúdo (direita)
- Ocupa o restante da tela
- Padding interno confortável
- Scroll vertical quando necessário

---

## Tela 5: Dashboard (`/dashboard`)

**Objetivo:** Visão geral das métricas de vendas do workspace.

**Layout (de cima para baixo):**

### Linha 1: Cards de métricas (4 cards lado a lado)
| Card | Dado | Cor do ícone |
|------|------|-------------|
| Total de Leads | COUNT de leads | Azul |
| Negócios Abertos | COUNT de deals onde stage != closed_won e != closed_lost | Amarelo |
| Valor do Pipeline | SUM do value de deals abertos | Verde |
| Taxa de Conversão | closed_won / total de deals fechados × 100 | Roxo |

### Linha 2: Gráficos (2 gráficos lado a lado)
- **Esquerda — Funil de Vendas (gráfico de barras horizontal)**
  - Cada barra = 1 etapa do pipeline
  - Largura proporcional à quantidade de negócios
  - Cores degradê (azul escuro → azul claro)
  - Biblioteca: Recharts BarChart

- **Direita — Novos Leads por Semana (gráfico de linhas)**
  - Eixo X: últimas 4 semanas
  - Eixo Y: quantidade de leads criados
  - Linha suave com pontos
  - Biblioteca: Recharts LineChart

### Linha 3: Lista "Meus negócios com prazo próximo"
- Tabela simples: Título | Lead | Valor | Prazo | Etapa
- Ordenado por expected_close_date (mais próximo primeiro)
- Máximo 5 itens
- Filtrado pelo usuário logado (assigned_to)

---

## Tela 6: Lista de Leads (`/leads`)

**Objetivo:** Ver, buscar, filtrar e cadastrar leads.

**Layout:**

### Barra de ações (topo)
- Título: "Leads" + badge com total (ex: "Leads (47)")
- Barra de busca (pesquisa por nome ou empresa)
- Filtros: Status (dropdown), Responsável (dropdown), Data de criação (date range)
- Botão: "+ Novo Lead" (abre modal)

### Tabela de leads
| Coluna | Tipo |
|--------|------|
| Nome | Texto (clicável → vai para /leads/[id]) |
| E-mail | Texto |
| Telefone | Texto |
| Empresa | Texto |
| Status | Badge colorido (Novo=azul, Qualificado=verde, Desqualificado=cinza) |
| Responsável | Avatar + nome |
| Criado em | Data relativa ("há 2 dias") |

- Paginação no rodapé (20 leads por página)
- Linha clicável → navega para detalhe

### Modal: Novo Lead
- Campos: Nome*, E-mail, Telefone, Empresa, Cargo, Origem, Notas
- (*) = obrigatório
- Botão: "Salvar Lead"
- Ao salvar → fecha modal, lead aparece na lista

---

## Tela 7: Detalhe do Lead (`/leads/[id]`)

**Objetivo:** Ver perfil completo do lead e registrar interações.

**Layout (2 colunas em desktop, empilhado em mobile):**

### Coluna esquerda (~40%): Perfil do Lead
- **Header:** Nome grande + badge de status + botão "Editar"
- **Dados:**
  - 📧 E-mail (clicável, abre mailto)
  - 📱 Telefone (clicável, abre tel)
  - 🏢 Empresa
  - 💼 Cargo
  - 🔗 Origem
  - 📅 Criado em (data completa)
  - 👤 Responsável
- **Notas:** Área de texto com as notas do lead
- **Negócios vinculados:** Lista de deals desse lead (título, valor, etapa)

### Coluna direita (~60%): Timeline de Atividades
- **Botão topo:** "+ Nova Atividade"
- **Timeline vertical:**
  - Cada item: ícone do tipo (📞 Ligação, 📧 E-mail, 🤝 Reunião, 📝 Nota)
  - Autor, data, descrição
  - Linha conectora vertical entre itens
  - Ordem: mais recente no topo
- **Modal: Nova Atividade**
  - Tipo (select: Ligação, E-mail, Reunião, Nota)
  - Descrição (textarea)
  - Data (default: agora)
  - Botão: "Registrar"

---

## Tela 8: Pipeline Kanban (`/pipeline`)

**Objetivo:** Visualizar e gerenciar o funil de vendas com drag-and-drop.

**Layout:**

### Header do pipeline
- Título: "Pipeline de Vendas"
- Botão: "+ Novo Negócio" (abre modal)

### Board Kanban (scroll horizontal se necessário)
6 colunas, cada uma representando uma etapa:

| Coluna | Cor do header |
|--------|--------------|
| Novo Lead | Azul |
| Contato Realizado | Ciano |
| Proposta Enviada | Amarelo |
| Negociação | Laranja |
| Fechado Ganho | Verde |
| Fechado Perdido | Vermelho |

### Header de cada coluna
- Nome da etapa
- Quantidade de cards (badge)
- Valor total da coluna (ex: "R$ 45.000")

### Card de negócio (dentro de cada coluna)
- **Título** do negócio (bold)
- **Valor:** R$ XX.XXX (destaque verde)
- **Lead:** Nome do lead vinculado
- **Responsável:** Avatar pequeno
- **Prazo:** Data (vermelho se vencido)
- **Prioridade:** Indicador visual (opcional: borda colorida)

### Drag-and-drop
- Arrastar card de uma coluna para outra
- Ao soltar → atualiza stage via API
- Feedback visual: card fica semi-transparente durante arraste
- Coluna de destino fica com borda highlighted

### Modal: Novo Negócio
- Título*, Valor (R$), Lead (select pesquisável), Etapa (select), Responsável (select), Prazo
- Botão: "Criar Negócio"

---

## Tela 9: Membros (`/members`)

**Objetivo:** Gerenciar colaboradores do workspace.

**Layout:**

### Header
- Título: "Membros" + badge com total
- Botão: "+ Convidar" (somente para Admin)

### Lista de membros
| Coluna | Tipo |
|--------|------|
| Avatar + Nome | Texto |
| E-mail | Texto |
| Papel | Badge (Admin=roxo, Membro=azul) |
| Entrou em | Data |
| Ações | Botão remover (somente Admin, não pode remover a si mesmo) |

### Modal: Convidar Membro
- Campo: E-mail do convidado
- Select: Papel (Admin ou Membro)
- Botão: "Enviar convite"
- **Bloqueio:** Se plano Free e já tem 2 membros → mostrar alerta: "Limite atingido. Faça upgrade para o plano Pro." + botão "Ver planos"

---

## Tela 10: Planos (`/plans`)

**Objetivo:** Comparar planos e gerenciar assinatura.

**Layout:**

### Header
- Título: "Escolha o melhor plano para seu time"
- Badge do plano atual: "Plano atual: Free" (ou "Pro")

### Cards de planos (2 cards lado a lado)

**Card Free:**
- Preço: Grátis
- Features: ✅ Até 2 colaboradores, ✅ Até 50 leads, ✅ Pipeline completo, ✅ Dashboard
- Botão: "Plano atual" (desabilitado) ou nenhum

**Card Pro:**
- Preço: R$49/mês
- Tag: "Recomendado" (destaque visual)
- Features: ✅ Colaboradores ilimitados, ✅ Leads ilimitados, ✅ Tudo do Free, ✅ Suporte prioritário
- Botão: "Fazer upgrade" (primário, chamativo) → inicia Stripe Checkout
- Ou se já é Pro: "Gerenciar assinatura" → abre Stripe Customer Portal

---

## Responsividade

### Mobile (< 768px)
- Sidebar: colapsável com hamburger menu
- Dashboard: cards empilham (2x2 ou 1 coluna)
- Pipeline: scroll horizontal no board, colunas com largura fixa (~280px)
- Tabelas: scroll horizontal ou layout em cards
- Detalhe do lead: colunas empilham (perfil em cima, timeline embaixo)

### Tablet (768px - 1024px)
- Sidebar: pode ficar colapsada por padrão (ícones only)
- Dashboard: gráficos empilham (1 por linha)
- Pipeline: 3-4 colunas visíveis, scroll para as demais
