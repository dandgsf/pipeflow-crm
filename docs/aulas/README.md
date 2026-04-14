# Material das Aulas — PipeFlow CRM

> Cada módulo tem dois arquivos:
> - **`prompts.md`** — prompts prontos para usar no Claude Code, em ordem
> - **`*.html`** — referência visual da aula (abra no navegador)

---

## Como usar

1. Abra o arquivo HTML da aula no navegador para ver o conteúdo visual
2. Abra o `prompts.md` do módulo correspondente
3. Cole os prompts **em ordem** no Claude Code
4. Siga o ciclo: **Planejar → Construir → Revisar → Commit**

> Antes de começar qualquer aula, o Claude Code precisa ter acesso ao `CLAUDE.md` e ao `PLAN.md`
> na raiz do projeto. Eles são o "cérebro" do agente.

---

## Módulos

### M1 — Planejamento & Setup
| Arquivo | Descrição |
|---|---|
| [prompts.md](m1-planejamento-setup/prompts.md) | Setup do ambiente, instalação de dependências |
| [aula-1.1-pensamento-computacional.html](m1-planejamento-setup/aula-1.1-pensamento-computacional.html) | Pensamento computacional com IA |
| [aula-1.3-tools-and-features.html](m1-planejamento-setup/aula-1.3-tools-and-features.html) | Ferramentas e features do Claude Code |
| [aula-1.4-setup-ambiente.html](m1-planejamento-setup/aula-1.4-setup-ambiente.html) | Configurando o ambiente de desenvolvimento |

### M2 — Desenvolvimento UI
| Arquivo | Descrição |
|---|---|
| [prompts.md](m2-desenvolvimento/prompts.md) | Todos os prompts de M2 (2.1 a 2.6) |
| [m2-2.1-design-system-app-shell.html](m2-desenvolvimento/m2-2.1-design-system-app-shell.html) | Design System & App Shell |
| [m2-2.2-auth-onboarding.html](m2-desenvolvimento/m2-2.2-auth-onboarding.html) | Auth & Onboarding (UI) |
| [m2-2.3-gestao-leads.html](m2-desenvolvimento/m2-2.3-gestao-leads.html) | Gestão de Leads |
| [m2-2.4-pipeline-kanban.html](m2-desenvolvimento/m2-2.4-pipeline-kanban.html) | Pipeline Kanban |
| [m2-2.5-dashboard-metricas.html](m2-desenvolvimento/m2-2.5-dashboard-metricas.html) | Dashboard de Métricas |
| [m2-2.6-landing-page.html](m2-desenvolvimento/m2-2.6-landing-page.html) | Landing Page |

### M3 — Backend & Integração
| Arquivo | Descrição |
|---|---|
| [prompts.md](m3-backend-integracao/prompts.md) | Todos os prompts de M3 (3.1 a 3.5) |
| [aula-3.1-setup-supabase.html](m3-backend-integracao/aula-3.1-setup-supabase.html) | Setup Supabase & Chaves |
| [aula-3.2-migrations-rls.html](m3-backend-integracao/aula-3.2-migrations-rls.html) | Migrations & Segurança RLS |
| [aula-3.3-auth-real.html](m3-backend-integracao/aula-3.3-auth-real.html) | Auth Real & Proteção de Rotas |
| [aula-3.4-leads-dados-reais.html](m3-backend-integracao/aula-3.4-leads-dados-reais.html) | Leads & Pipeline com Dados Reais |
| [aula-3.5-workspace-colaboracao.html](m3-backend-integracao/aula-3.5-workspace-colaboracao.html) | Workspace & Colaboração |

### M4 — Pagamentos
| Arquivo | Descrição |
|---|---|
| [prompts.md](m4-pagamentos/prompts.md) | Todos os prompts de M4 (4.1 e 4.2) |
| [m4-4.1-checkout-webhook.html](m4-pagamentos/m4-4.1-checkout-webhook.html) | Stripe Checkout & Webhook |
| [m4-4.2-billing-planos.html](m4-pagamentos/m4-4.2-billing-planos.html) | Billing & Limites de Plano |

### M5 — Go-Live & Segurança
| Arquivo | Descrição |
|---|---|
| [prompts.md](m5-golive-seguranca/prompts.md) | Todos os prompts de M5 (5.1 a 5.4) |
| [aula-5.1-seguranca.html](m5-golive-seguranca/aula-5.1-seguranca.html) | Auditoria de Segurança |
| [aula-5.2-responsividade-polish.html](m5-golive-seguranca/aula-5.2-responsividade-polish.html) | Responsividade & Polish Visual |
| [aula-5.3-deploy-producao.html](m5-golive-seguranca/aula-5.3-deploy-producao.html) | Deploy em Produção |
| [aula-5.4-recapitulacao.html](m5-golive-seguranca/aula-5.4-recapitulacao.html) | Recapitulação Final |

---

## Framework de PRD

Para criar o seu próprio PRD antes de iniciar o projeto, use o framework:
**[prd-claude-code.lovable.app](https://prd-claude-code.lovable.app/)**

O PRD gerado substitui/complementa o `docs/PRD.md` deste repositório.
