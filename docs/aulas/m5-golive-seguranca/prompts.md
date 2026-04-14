# M5 — Go-Live & Segurança · Prompts

> Módulo 5 · Aulas 5.1 a 5.4 — Auditoria, polish visual e deploy em produção
> Referências visuais: pasta `aulas-html/m5-golive-seguranca/`

---

## Aula 5.1 — Auditoria de Segurança

> Referência: [aula-5.1-seguranca.html](../../../aulas-html/m5-golive-seguranca/aula-5.1-seguranca.html)

### Prompt 1 — Planejamento + Auditoria

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 5.1 — Auditoria de Segurança. Crie a branch feat/deploy. Antes de publicar, faça uma revisão completa de segurança do projeto e me diga o que encontrou e corrigiu.
```

### Prompt 2 — Verificação Manual RLS

```
Verifique no Supabase Studio: Authentication → Policies. Confirme que TODAS as tabelas têm RLS ativo. Teste: dois workspaces diferentes não devem ver dados um do outro.
```

### Prompt 3 — Commit

```
Faça um commit com as correções de segurança encontradas na auditoria.
```

---

## Aula 5.2 — Responsividade & Polish Visual

> Referência: [aula-5.2-responsividade-polish.html](../../../aulas-html/m5-golive-seguranca/aula-5.2-responsividade-polish.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 5.2 — Responsividade e Polish Visual. Continue na branch feat/deploy.
```

### Prompt 2 — Responsividade

```
Revise a responsividade e o visual do app inteiro. Teste em 3 tamanhos: celular (375px), tablet (768px) e desktop. Garanta que sidebar, pipeline, tabelas e dashboard funcionam em todos. Adicione loading e estados vazios onde faltar.
```

### Prompt 3 — Commit

```
Faça um commit com os ajustes de responsividade e polish visual.
```

---

## Aula 5.3 — Deploy em Produção

> Referência: [aula-5.3-deploy-producao.html](../../../aulas-html/m5-golive-seguranca/aula-5.3-deploy-producao.html)

> **Pré-requisito:** Configure as variáveis de ambiente no painel do Vercel antes de rodar os prompts.
> Use `NEXT_PUBLIC_APP_URL` com sua URL do Vercel (ex: `https://pipeflow-crm.vercel.app`).

### Prompt 1 — Preparar Build

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 5.3 — Deploy em Produção. Prepare o projeto pra deploy: aplique as migrations no Supabase de produção, verifique a segurança e rode o build local.
```

### Prompt 2 — Webhook Produção

```
Configure o webhook do Stripe pra produção:
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: https://[sua-url].vercel.app/api/webhooks/stripe
3. Eventos: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
4. Copie o Signing Secret (whsec_live_...) e adicione como STRIPE_WEBHOOK_SECRET no Vercel
5. Redeploy no Vercel pra carregar a nova variável
```

### Prompt 3 — Teste End-to-End

```
Teste o fluxo completo em produção:
1. Envie um test event pelo Stripe Dashboard → verifique nos logs do Vercel (Functions tab)
2. Fluxo manual: Landing → Login → Dashboard → Pipeline → Leads → Settings → Billing
3. Checkout teste → webhook → plano Pro ativado
4. Supabase Studio: confirme que os dados estão corretos
```

### Prompt 4 — Commit Final

```
Faça o commit final, abra o PR pra main, faça o merge e delete a branch.
```

---

## Aula 5.4 — Recapitulação

> Referência: [aula-5.4-recapitulacao.html](../../../aulas-html/m5-golive-seguranca/aula-5.4-recapitulacao.html)

Parabéns — você construiu um SaaS completo do zero. 🎉

O que você entregou:
- **M1** — Setup profissional com Next.js 14, TypeScript e shadcn/ui
- **M2** — Interface completa: app shell, auth, leads, pipeline Kanban, dashboard, landing page
- **M3** — Backend real com Supabase: Auth, RLS, Server Actions, colaboração por email
- **M4** — Monetização com Stripe: checkout, webhook, limites de plano, customer portal
- **M5** — Segurança auditada, responsividade revisada, deploy em produção no Vercel
