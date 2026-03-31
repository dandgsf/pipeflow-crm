# PipeFlow CRM — Checklist de Teste em Produção

> Execute cada teste na ordem. Marque [x] conforme avançar.

---

## 1. Stripe Test Event (webhook health check)

**Pré-requisito:** webhook configurado em `https://pipeflow.vercel.app/api/webhooks/stripe`

```
Stripe Dashboard → Developers → Webhooks → selecione o endpoint
→ "Send test webhook" → escolha: checkout.session.completed → Send
```

- [ ] **Vercel Dashboard** → Functions tab → `/api/webhooks/stripe`
  - Verifique que apareceu uma invocação recente
  - Status esperado: `400` (é normal — o test event não tem metadata válido)
  - Nos logs, deve aparecer: `[stripe-webhook] checkout.session.completed sem workspaceId no metadata`
- [ ] Se retornou 400 com essa mensagem, o webhook está saudável (HMAC validou, código executou)

---

## 2. Fluxo de Navegação Manual

Abra `https://pipeflow.vercel.app` no browser.

### 2.1 Landing Page
- [ ] Landing carrega com dark mode, fontes corretas (Syne nos títulos, DM Sans no corpo)
- [ ] Hero, features, pricing e CTA visíveis
- [ ] Botão "Começar Grátis" leva para `/register`

### 2.2 Registro
- [ ] Crie uma conta de teste: nome + email + senha
- [ ] Email de confirmação chega (verifique spam)
- [ ] Clique no link → redireciona para `/auth/callback` → `/onboarding`

### 2.3 Onboarding
- [ ] Formulário "Criar workspace" aparece
- [ ] Preencha nome (ex: "Empresa Teste") e envie
- [ ] Redireciona para `/dashboard`

### 2.4 Dashboard
- [ ] Cards de métricas aparecem (todos zerados, é esperado)
- [ ] Gráfico de funil renderiza
- [ ] Seção "Deals próximos" aparece (vazia)

### 2.5 Leads
- [ ] Navegar para `/leads` via sidebar
- [ ] Clicar "Novo Lead" → preencher formulário → salvar
- [ ] Lead aparece na tabela
- [ ] Clicar no lead → página de detalhe carrega
- [ ] "Registrar Atividade" → preencher → salvar → aparece na timeline
- [ ] Voltar → editar lead → salvar → dados atualizados
- [ ] Deletar lead → confirmação → lead removido

### 2.6 Pipeline
- [ ] Navegar para `/pipeline`
- [ ] Criar um lead primeiro (se não tiver) para vincular ao deal
- [ ] "Novo Negócio" → preencher → salvar → card aparece na coluna
- [ ] Arrastar card entre colunas → soltar → posição persiste após reload
- [ ] Editar deal → salvar → dados atualizados

### 2.7 Settings
- [ ] `/settings/workspace` — nome e slug exibidos, edição funciona (admin)
- [ ] `/settings/members` — lista de membros (só você, como admin)
- [ ] `/settings/billing` — plano Free exibido, botão "Assinar Pro" visível

---

## 3. Checkout Teste (Stripe test mode)

**Pré-requisito:** Stripe está em test mode (chaves `sk_test_` / `pk_test_`)

- [ ] Em `/settings/billing`, clique "Assinar Pro"
- [ ] Redireciona para Stripe Checkout
- [ ] Use o cartão de teste: `4242 4242 4242 4242`, qualquer data futura, qualquer CVC
- [ ] Checkout completa → redireciona para `/settings/billing?success=true`
- [ ] Banner de sucesso aparece
- [ ] Plano exibido: **Pro**
- [ ] Botão mudou para "Gerenciar Assinatura"

### Verificar no Vercel (logs do webhook)
- [ ] Functions tab → `/api/webhooks/stripe` → invocação recente com status `200`
- [ ] Log: `[stripe-webhook] Workspace xxx atualizado para Pro`

### Verificar no Supabase Studio
- [ ] Tabela `subscriptions` → registro com `plan = 'pro'`, `stripe_customer_id` e `stripe_subscription_id` preenchidos
- [ ] Tabela `workspaces` → `plan = 'pro'` para o workspace de teste

---

## 4. Verificação de Dados no Supabase Studio

Abra o Supabase Dashboard → Table Editor.

### RLS habilitado
- [ ] `workspaces` — RLS enabled (cadeado verde)
- [ ] `workspace_members` — RLS enabled
- [ ] `leads` — RLS enabled
- [ ] `deals` — RLS enabled
- [ ] `activities` — RLS enabled
- [ ] `subscriptions` — RLS enabled
- [ ] `workspace_invites` — RLS enabled

### Dados consistentes
- [ ] `workspace_members` tem registro com `role = 'admin'` para seu user
- [ ] `subscriptions` tem registro vinculado ao workspace
- [ ] Leads e deals criados nos testes aparecem com `workspace_id` correto

---

## 5. Testes Extras (se quiser ir além)

### Mobile
- [ ] Abrir `https://pipeflow.vercel.app` no celular
- [ ] Sidebar colapsa (hamburger menu)
- [ ] Pipeline tem scroll horizontal funcional
- [ ] Formulários são usáveis em tela pequena

### Convite de membro
- [ ] `/settings/members` → "Convidar" → email de teste
- [ ] Verificar que email chega via Resend (ou conferir no Resend Dashboard)
- [ ] Clicar no link de convite → aceitar → membro adicionado

### Limites do plano Free
- [ ] Voltar para Free (via Stripe Portal → cancelar)
- [ ] Webhook registra: `[stripe-webhook] Workspace xxx voltou para Free`
- [ ] Tentar criar >50 leads → mensagem de erro de limite
- [ ] Tentar convidar >2 membros → mensagem de erro de limite

### Customer Portal
- [ ] Em `/settings/billing` (plano Pro) → "Gerenciar Assinatura"
- [ ] Redireciona para Stripe Customer Portal
- [ ] Cancelar assinatura no portal → voltar → plano exibido como Free

---

## Resultado

| Teste | Status |
|-------|--------|
| Webhook health check | |
| Landing → Register → Onboarding | |
| Dashboard | |
| Leads CRUD | |
| Pipeline drag-and-drop | |
| Settings | |
| Checkout → Pro | |
| Dados no Supabase | |
| RLS habilitado | |
| Mobile | |
