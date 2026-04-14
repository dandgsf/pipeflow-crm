# M4 — Pagamentos · Prompts

> Módulo 4 · Aulas 4.1 e 4.2 — Stripe Checkout, Webhook, Limites de Plano
> Referências visuais: pasta `aulas-html/m4-pagamentos/`

---

## Aula 4.1 — Checkout & Webhook com Stripe

> Referência: [m4-4.1-checkout-webhook.html](../../../aulas-html/m4-pagamentos/m4-4.1-checkout-webhook.html)

### Prompt 1 — Planejamento

```
Leia o CLAUDE.md e o PLAN.md. Estamos na aula 4.1 — Checkout & Webhook com Stripe. Crie a branch feat/billing e me descreva o que vai implementar.
```

### Prompt 2 — Chaves .env

Antes de rodar o próximo prompt, cole as chaves do Stripe no seu `.env.local`:

```
Adicione no .env.local as chaves do Stripe:
STRIPE_SECRET_KEY=[cole aqui]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[cole aqui]
STRIPE_PRO_PRICE_ID=[cole aqui]
```

> Onde encontrar: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) e [dashboard.stripe.com/products](https://dashboard.stripe.com/products)

### Prompt 3 — Checkout + Webhook

```
Implemente a monetização com Stripe conforme o PLAN.md:
- Botão "Assinar Pro" que redireciona pro checkout do Stripe
- Webhook que recebe a confirmação do Stripe e ativa o plano Pro no banco
- Quando cancelar, webhook volta o plano pra Free
- O webhook é a única exceção que usa Route Handler — todo o resto usa Server Actions
```

### Prompt 4 — Webhook Secret

Após configurar o endpoint no Stripe Dashboard, adicione o secret:

```
Adicione no .env.local a chave do webhook:
STRIPE_WEBHOOK_SECRET=[cole aqui]
```

> Onde encontrar: Stripe Dashboard → Developers → Webhooks → seu endpoint → Signing Secret

### Prompt 5 — Revisão

```
Revise o que você criou. Confirme que o checkout redireciona pro Stripe, que o webhook ativa o plano no banco, que as chaves estão protegidas no .env.local e que o build passa sem erros.
```

### Prompt 6 — Commit intermediário

```
Faça um commit intermediário com o checkout e webhook do Stripe.
```

---

## Aula 4.2 — Billing & Limites de Plano

> Referência: [m4-4.2-billing-planos.html](../../../aulas-html/m4-pagamentos/m4-4.2-billing-planos.html)

### Prompt 1 — Limites + Billing

```
Implemente os limites de plano e a página de cobrança conforme o PLAN.md:
- Plano Free: máximo 50 leads e 2 membros. Mostrar aviso quando atingir o limite.
- Página de billing mostrando plano atual, comparação Free vs Pro, e botão de assinar
- Botão "Gerenciar Assinatura" que abre o portal do Stripe (trocar cartão, cancelar, nota fiscal)
```

### Prompt 2 — Revisão

```
Revise tudo que foi implementado no módulo de Stripe. Confirme que:
- Checkout redireciona e volta corretamente
- Webhook ativa e desativa o plano
- Limites do Free bloqueiam quando excedidos
- Página de billing mostra plano correto
- Customer Portal abre sem erros
- Build passa sem erros
```

### Prompt 3 — Teste

```
Teste completo na câmera:
1. /settings/billing → "Assinar Pro" → Stripe Checkout → cartão 4242 → volta → plano Pro ativo
2. Criar >50 leads no Free → erro "limite atingido"
3. Supabase Studio → tabela subscriptions → plan = "pro"
4. Customer Portal → cancelar → plano volta pra Free
5. Confirmar que limites voltaram a funcionar
```

> Cartão de teste Stripe: `4242 4242 4242 4242` · qualquer data futura · qualquer CVV

### Prompt 4 — Commit + PR

```
Faça o commit final do módulo Stripe, abra o PR pra main, faça o merge e delete a branch.
```
