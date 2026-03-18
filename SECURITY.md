# Politica de Seguranca — PipeFlow CRM

## Reportando Vulnerabilidades

Se voce encontrar uma vulnerabilidade de seguranca, **NAO abra uma issue publica**. Entre em contato diretamente pelo e-mail do mantenedor do repositorio.

Inclua na sua mensagem:
- Descricao da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestao de correcao (se houver)

## Arquitetura de Seguranca

### Isolamento Multi-Tenant (Row Level Security)

Todas as tabelas possuem politicas RLS no Supabase que garantem:
- Usuarios so acessam dados de workspaces dos quais sao membros
- Funcao `get_user_workspace_ids()` centraliza a verificacao de pertencimento
- Operacoes de admin (remover membros, atualizar workspace) requerem role `admin`
- Exclusao de atividades restrita ao autor (`performed_by`)

### Autenticacao

- Supabase Auth com e-mail/senha
- Middleware Next.js valida sessao em todas as rotas protegidas
- Cookies gerenciados automaticamente pelo `@supabase/ssr`
- Rotas publicas explicitas: `/`, `/login`, `/signup`

### Verificacao de Workspace nas APIs

Todas as rotas de API que acessam recursos individuais (GET/PUT/DELETE por ID) validam que o recurso pertence ao workspace do usuario autenticado, prevenindo ataques IDOR (Insecure Direct Object Reference).

### Stripe e Pagamentos

- Chave secreta do Stripe usada apenas server-side
- Webhook roda como Supabase Edge Function (`supabase/functions/stripe-webhook/`)
- Webhook verifica assinatura (`stripe.webhooks.constructEvent`) antes de processar
- Apenas admins podem criar sessoes de checkout
- Nenhuma informacao de cartao e armazenada na aplicacao

### Variaveis de Ambiente

- `.env.local` excluido do Git via `.gitignore`
- Apenas variaveis com prefixo `NEXT_PUBLIC_` sao expostas ao navegador
- `SUPABASE_SERVICE_ROLE_KEY` usada apenas em contextos administrativos (webhooks)

## Boas Praticas para Contribuidores

1. **Nunca commite credenciais** — Use `.env.local` para valores reais e `.env.example` como template
2. **Sempre valide workspace_id** — Em novas rotas de API, sempre verifique que o recurso pertence ao workspace do usuario
3. **Nao exponha erros internos** — Retorne mensagens genericas ao cliente; logue detalhes apenas no servidor
4. **Use RLS como defesa em profundidade** — Nao dependa apenas da validacao na API; mantenha as politicas RLS atualizadas
5. **Valide inputs** — Sanitize dados de entrada, especialmente em campos de busca e filtros
6. **Mantenha dependencias atualizadas** — Verifique regularmente por vulnerabilidades com `npm audit`

## Checklist de Seguranca para Deploy

- [ ] Variaveis de ambiente configuradas no provedor de hospedagem (Vercel/similar)
- [ ] `.env.local` **NAO** esta no repositorio
- [ ] RLS habilitado em todas as tabelas do Supabase
- [ ] Webhook do Stripe apontando para URL de producao
- [ ] Chaves de teste substituidas por chaves de producao
- [ ] `NEXT_PUBLIC_APP_URL` apontando para o dominio correto
- [ ] Rotacao de chaves apos qualquer exposicao acidental
- [ ] `npm audit` executado sem vulnerabilidades criticas
