# M3 — Backend & Integração · Prompts

> Módulo 3 · Aulas 3.1 a 3.5 — Substituir mocks por dados reais com Supabase
> Referências visuais: pasta `aulas-html/m3-backend-integracao/`

---

## Aula 3.1 — Setup Supabase & Chaves

> Referência: [aula-3.1-setup-supabase.html](../../../aulas-html/m3-backend-integracao/aula-3.1-setup-supabase.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 3.1 — Setup Supabase & Chaves. Crie a branch feat/supabase-core e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Crie o .env.local com as chaves do Supabase e os clients conforme o PLAN.md: client.ts (browser, lazy singleton) e server.ts (servidor, cookies, async). Confirme que o .env.local está no .gitignore.
```

### Prompt 3 — Revisão

```
Revise o que você criou. Confirme que o .env.local tem as 3 chaves, que está protegido no .gitignore, que os dois clients existem e que o build passa sem erros.
```

### Prompt 4 — Commit e finalização

```
Faça o commit, abra o PR pra main, faça o merge e delete a branch.
```

---

## Aula 3.2 — Migrations & RLS

> Referência: [aula-3.2-migrations-rls.html](../../../aulas-html/m3-backend-integracao/aula-3.2-migrations-rls.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 3.2 — Migrations & Segurança RLS. Continuamos na branch feat/supabase-core. Me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Crie as migrations conforme o PLAN.md (workspaces, workspace_members, leads, deals, activities, subscriptions). Configure RLS em todas as tabelas — cada workspace só acessa seus próprios dados. Gere os arquivos SQL completos prontos para aplicar no SQL Editor do Supabase Studio e os tipos TypeScript em src/types/supabase.ts.
```

### Prompt 3 — Revisão

```
Revise as migrations e as políticas RLS. Confira no Supabase Studio se todas as tabelas aparecem e se o RLS está ativo. Rode o build e confirme que os tipos foram gerados corretamente.
```

### Prompt 4 — Commit e finalização

```
Faça o commit, abra o PR pra main, faça o merge e delete a branch.
```

---

## Aula 3.3 — Auth Real & Proteção de Rotas

> Referência: [aula-3.3-auth-real.html](../../../aulas-html/m3-backend-integracao/aula-3.3-auth-real.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 3.3 — Auth Real & Proteção de Rotas. Continuamos na branch feat/supabase-core. Me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Conecte login e registro ao Supabase Auth conforme o PLAN.md. Crie o proxy.ts pra proteger rotas, o callback de auth e o logout. Conecte o onboarding ao banco (workspace + membro admin) e o workspace switcher com dados reais.
```

### Prompt 3 — Revisão

```
Revise o que você criou. Teste o fluxo: registro → confirmação → login → onboarding → dashboard. Confira no Supabase Studio se o usuário, workspace e membro foram criados. Teste o logout e a proteção de rotas.
```

### Prompt 4 — Commit e finalização

```
Faça o commit, abra o PR pra main, faça o merge e delete a branch.
```

---

## Aula 3.4 — Leads & Pipeline com Dados Reais

> Referência: [aula-3.4-leads-dados-reais.html](../../../aulas-html/m3-backend-integracao/aula-3.4-leads-dados-reais.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 3.4 — Leads & Pipeline com dados reais. Crie a branch feat/leads-data e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Substitua todos os dados fake por dados reais conforme o PLAN.md. Leads e deals com Server Actions salvando no Supabase. Dashboard com métricas do banco. Filtros e busca funcionando no banco. Drag-and-drop persiste a posição.
```

### Prompt 3 — Revisão

```
Revise o que você criou. Teste: criar lead e verificar que persiste após reload. Arrastar deal e confirmar no Supabase Studio. Conferir que o dashboard reflete dados reais e que filtros funcionam no banco.
```

### Prompt 4 — Commit e finalização

```
Faça o commit, abra o PR pra main, faça o merge e delete a branch.
```

---

## Aula 3.5 — Workspace & Colaboração

> Referência: [aula-3.5-workspace-colaboracao.html](../../../aulas-html/m3-backend-integracao/aula-3.5-workspace-colaboracao.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 3.5 — Workspace & Colaboração. Crie a branch feat/collaboration e me descreva o que vai implementar.
```

### Prompt 2 — Construção

```
Implemente a colaboração conforme o PLAN.md. Convites por email com Resend, link de aceite, página de membros com papéis admin/membro. Limites do plano Free: máximo 2 membros. Nova tabela workspace_invites no banco.
```

### Prompt 3 — Revisão

```
Revise o que você criou. Teste: convidar por email e verificar no Resend Dashboard. Aceitar convite e conferir que o membro aparece no workspace. Admin remover membro. Verificar no Supabase Studio: workspace_members e workspace_invites.
```

### Prompt 4 — Commit e finalização

```
Faça o commit, abra o PR pra main, faça o merge e delete a branch.
```
