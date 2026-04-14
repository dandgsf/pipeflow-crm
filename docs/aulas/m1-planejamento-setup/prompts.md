# M1 — Planejamento & Setup · Prompts

> Módulo 1 · Aulas 1.1, 1.3, 1.4
> Referência visual: [aula-1.4-setup-ambiente.html](../../../aulas-html/m1-planejamento-setup/aula-1.4-setup-ambiente.html)

---

## Aula 1.4 — Configurando o Ambiente

Os prompts do M1 são instrucionais (sem código a gerar ainda). Use os arquivos abaixo na ordem:

### Passo 1 — Criar o repositório no GitHub

Crie um repositório público no GitHub chamado `pipeflow-crm`.

### Passo 2 — Scaffold do projeto

```
npx create-next-app@latest . --yes --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

### Passo 3 — Inicializar o shadcn/ui

```
npx shadcn@latest init
```

### Passo 4 — Instalar dependências

```
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts @supabase/supabase-js @supabase/ssr stripe @stripe/stripe-js resend react-hook-form @hookform/resolvers zod date-fns lucide-react
```

### Passo 5 — Instalar componentes shadcn/ui

```
npx shadcn@latest add button input textarea card tabs table dialog alert-dialog sheet dropdown-menu badge separator skeleton avatar select form
```

### Passo 6 — Copiar o .env.local.example

```
cp .env.local.example .env.local
```

Preencha todas as variáveis antes de continuar.

### Passo 7 — Copiar o CLAUDE.md e PLAN.md para o projeto

Estes dois arquivos são o "cérebro" do Claude Code no seu projeto.
O `CLAUDE.md` define as convenções; o `PLAN.md` define o que construir em cada aula.

> **Nota:** Instale as skills do PipeFlow via AI Templates antes de começar:
> ```
> npx claude-code-templates@latest
> ```
> Selecione: `frontend-developer`, `code-reviewer`, `payment-integration`
