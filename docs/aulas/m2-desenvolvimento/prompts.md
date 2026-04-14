# M2 — Desenvolvimento UI · Prompts

> Módulo 2 · Aulas 2.1 a 2.6 — Interface primeiro, dados mockados
> Referências visuais: pasta `aulas-html/m2-desenvolvimento/`

---

## Aula 2.1 — Design System & App Shell

> Referência: [m2-2.1-design-system-app-shell.html](../../../aulas-html/m2-desenvolvimento/m2-2.1-design-system-app-shell.html)

### Prompt 1 — Planejamento + Branch

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 2.1 — Design System e App Shell.
Crie uma branch pra essa feature e me descreva o que vai implementar.
```

### Prompt 2 — Execução

```
Implemente o esqueleto visual do PipeFlow conforme o PLAN.md:
sidebar com menu de navegação, barra superior, seletor de workspace com dados fake,
dark mode como padrão, e componentes base que vamos reutilizar nas próximas aulas.
Sidebar que vira menu hamburguer no celular.
```

### Prompt 3 — Revisão

```
Revise o que você criou. Confere se a sidebar funciona em mobile, se a navegação troca entre as páginas e se o dark mode ta aplicado direitinho.
```

### Prompt 4 — Commit + PR

```
Faça o commit dessa feature, abra um PR pra main, faça o merge e delete a branch.
```

---

## Aula 2.2 — Auth & Onboarding

> Referência: [m2-2.2-auth-onboarding.html](../../../aulas-html/m2-desenvolvimento/m2-2.2-auth-onboarding.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 2.2 — Auth & Onboarding UI. Crie uma branch pra essa feature e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Implemente as telas de login, cadastro e onboarding conforme o PLAN.md. Formulários com validação nos campos, loading nos botões e mensagens de erro. Por enquanto a navegação é fake — login redireciona pro dashboard sem validar de verdade. O onboarding pede o nome do primeiro workspace e redireciona pro dashboard.
```

### Prompt 3 — Revisão

```
Revise o que você criou. Verifica se os formulários têm validação, se os botões têm loading, se as mensagens de erro aparecem, e se a navegação tá redirecionando certo. Roda o projeto e testa.
```

### Prompt 4 — Commit e PR

```
Faça o commit dessa feature, abra um PR pra main, faça o merge e delete a branch.
```

---

## Aula 2.3 — Gestão de Leads

> Referência: [m2-2.3-gestao-leads.html](../../../aulas-html/m2-desenvolvimento/m2-2.3-gestao-leads.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 2.3 — Gestão de Leads UI. Crie uma branch pra essa feature e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Implemente a gestão de leads conforme o PLAN.md com dados fake:

- Crie uns 10-15 leads brasileiros mockados
- Tabela com busca por nome/empresa e filtros por status
- Formulário pra criar/editar/excluir lead
- Página de detalhe do lead com timeline de atividades (visual apenas)
- Badges coloridos por status do lead
```

### Prompt 3 — Revisão e commit

```
Revise o que você criou. Testa se a busca funciona, se os filtros filtram, se o formulário valida os campos, e se a página de detalhe carrega. Depois faz o commit, abre PR pra main, faz merge e deleta a branch.
```

---

## Aula 2.4 — Pipeline Kanban

> Referência: [m2-2.4-pipeline-kanban.html](../../../aulas-html/m2-desenvolvimento/m2-2.4-pipeline-kanban.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 2.4 — Pipeline Kanban UI. Crie uma branch pra essa feature. Use a skill frontend-design e se inspire no Pipedrive como referência visual. Me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Implemente o Pipeline Kanban conforme o PLAN.md com dados fake:

- Board com 6 colunas (as etapas do pipeline) e scroll horizontal
- Cada coluna mostra o total de negócios e valor em R$
- Cards dos negócios com título, lead, valor, responsável e prazo
- Arrastar e soltar cards entre colunas (drag-and-drop)
- Formulário pra criar novo negócio
- Visual bonito, inspirado no Pipedrive. Use a skill frontend-design.
```

### Prompt 3 — Revisão e commit

```
Revise o pipeline. Testa se o drag-and-drop funciona, se os totais das colunas atualizam, se dá pra criar novo negócio. Faz o commit, abre PR pra main, faz merge e deleta a branch.
```

---

## Aula 2.5 — Dashboard de Métricas

> Referência: [m2-2.5-dashboard-metricas.html](../../../aulas-html/m2-desenvolvimento/m2-2.5-dashboard-metricas.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 2.5 — Dashboard de Métricas UI. Crie uma branch pra essa feature e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Implemente o Dashboard conforme o PLAN.md com dados fake:

- 4 cards de métricas: Total de Leads, Negócios Abertos, Valor do Pipeline (R$), Taxa de Conversão (%)
- Gráfico de funil mostrando negócios por etapa do pipeline (Recharts)
- Tabela com os negócios mais próximos do prazo
- Dados mockados mas realistas
- Esse é o /dashboard — a primeira tela após o login
```

### Prompt 3 — Revisão e commit

```
Revise o dashboard. Verifica se os cards mostram valores, se o gráfico renderiza, se a tabela de negócios aparece. Faz o commit, abre PR pra main, faz merge e deleta a branch.
```

---

## Aula 2.6 — Landing Page

> Referência: [m2-2.6-landing-page.html](../../../aulas-html/m2-desenvolvimento/m2-2.6-landing-page.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 2.6 — Landing Page. Crie uma branch pra essa feature e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Crie a página inicial pública do PipeFlow. Quem acessar o site sem estar logado vai ver essa página. Ela precisa ter:

- Menu no topo com o logo, links de navegação e botão "Começar grátis"
- Seção principal com frase de impacto, descrição curta e dois botões de ação
- 4 números de resultado (+47% conversão, 3.2x leads qualificados, -62% ciclo de venda, 1200+ times)
- Lista das principais funcionalidades do CRM (6 no total)
- Tabela de preços: plano Grátis (2 membros, 50 leads) e plano Pro (R$49/mês, ilimitado)
- Botão final de chamada para ação e rodapé com o logo
- Use as cores, fontes e animações que estão documentadas no CLAUDE.md
```

### Prompt 3 — Revisão

```
Revise a landing page que você criou. Verifica se todas as seções aparecem na tela, se os botões estão visíveis e funcionando, e se a página fica boa no celular também.
```

### Prompt 4 — Commit e finalização

```
Faz o commit com tudo que foi criado, abre um PR pra main, faz o merge, deleta a branch e atualiza o PLAN.md marcando os itens da landing page como concluídos.
```
