# Política de Segurança — PipeFlow CRM

## Reportando Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança, **NÃO abra uma issue pública**. Entre em contato diretamente pelo e-mail do mantenedor do repositório.

Inclua na sua mensagem:
- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestão de correção (se houver)

## Arquitetura de Segurança

### Isolamento Multi-Tenant (Row Level Security)

Todas as tabelas possuem políticas RLS no Supabase que garantem:
- Usuários só acessam dados de workspaces dos quais são membros
- Função `get_user_workspace_ids()` centraliza a verificação de pertencimento
- Operações de admin (remover membros, atualizar workspace) requerem role `admin`
- Exclusão de atividades restrita ao autor (`performed_by`)

### Autenticação

- Supabase Auth com e-mail/senha
- Middleware Next.js valida sessão em todas as rotas protegidas
- Cookies gerenciados automaticamente pelo `@supabase/ssr`
- Rotas públicas explícitas: `/`, `/login`, `/signup`

### Verificação de Workspace nas APIs

Todas as rotas de API que acessam recursos individuais (GET/PUT/DELETE por ID) validam que o recurso pertence ao workspace do usuário autenticado, prevenindo ataques IDOR (Insecure Direct Object Reference).

### Stripe e Pagamentos

- Chave secreta do Stripe usada apenas server-side
- Webhook roda como Supabase Edge Function (`supabase/functions/stripe-webhook/`)
- Webhook verifica assinatura (`stripe.webhooks.constructEvent`) antes de processar
- Apenas admins podem criar sessões de checkout
- Nenhuma informação de cartão é armazenada na aplicação

### Variáveis de Ambiente

- `.env.local` excluído do Git via `.gitignore`
- Apenas variáveis com prefixo `NEXT_PUBLIC_` são expostas ao navegador
- `SUPABASE_SERVICE_ROLE_KEY` usada apenas em contextos administrativos (webhooks)

## Boas Práticas para Contribuidores

1. **Nunca faça commit de credenciais** — Use `.env.local` para valores reais e `.env.example` como template
2. **Sempre valide workspace_id** — Em novas rotas de API, sempre verifique que o recurso pertence ao workspace do usuário
3. **Não exponha erros internos** — Retorne mensagens genéricas ao cliente; logue detalhes apenas no servidor
4. **Use RLS como defesa em profundidade** — Não dependa apenas da validação na API; mantenha as políticas RLS atualizadas
5. **Valide inputs** — Sanitize dados de entrada, especialmente em campos de busca e filtros
6. **Mantenha dependências atualizadas** — Verifique regularmente por vulnerabilidades com `npm audit`

## Checklist de Segurança para Deploy

- [ ] Variáveis de ambiente configuradas no provedor de hospedagem (Vercel/similar)
- [ ] `.env.local` **NÃO** está no repositório
- [ ] RLS habilitado em todas as tabelas do Supabase
- [ ] Webhook do Stripe apontando para URL de produção
- [ ] Chaves de teste substituídas por chaves de produção
- [ ] `NEXT_PUBLIC_APP_URL` apontando para o domínio correto
- [ ] Rotação de chaves após qualquer exposição acidental
- [ ] `npm audit` executado sem vulnerabilidades críticas
