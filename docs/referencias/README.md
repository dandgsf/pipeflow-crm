# Referências de Design — PipeFlow CRM

Esta pasta contém os arquivos de referência visual e de design do projeto.

---

## design-scope.html

Documento HTML standalone que serve como **fonte única da verdade** para o design system do PipeFlow CRM. Abra diretamente no navegador — não tem dependências externas.

### Por que este arquivo é fundamental

Todo trabalho de frontend — seja um componente novo, uma correção de estilo ou uma página inteira — deve partir deste arquivo. Ele evita inconsistências visuais e garante que o produto mantenha identidade coesa do início ao fim.

### O que está documentado

| Seção | Conteúdo |
|---|---|
| **Paleta de cores** | Tokens CSS `--pf-*` usados em toda a interface (accent, surface, border, text) |
| **Tipografia** | Syne (display/headlines), DM Sans (body/UI), IBM Plex Mono (métricas/código) |
| **Componentes** | Padrões visuais para cards, botões, badges, formulários e tabelas |
| **Animações** | Classes utilitárias: `pf-orb-float`, `pf-glass`, `pf-glow-btn`, `pf-page-enter`, etc. |
| **App shell** | Estrutura do layout autenticado: sidebar, navbar, dark mode (`#111111` surface) |
| **Landing page** | Seções, espaçamentos e estilos da página pública (`#0A0A0A` background) |

### Como usar

1. Abra `design-scope.html` no navegador
2. Use como referência ao criar ou revisar qualquer componente
3. Ao configurar o Tailwind ou variáveis CSS, este arquivo é a fonte de verdade — não o contrário
