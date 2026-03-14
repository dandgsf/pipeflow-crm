# PipeFlow CRM — Identidade Visual v2
## Direção: Editorial Brutalist × Fintech

O visual anterior (glassmorphism, gradient text, partículas, neon glow) grita "IA fez isso". A nova direção é deliberadamente editorial, com personalidade de estúdio de design — não de template.

---

## Princípios de Design

1. **Contenção > Espetáculo** — Um acento bem posicionado vale mais que 10 efeitos
2. **Dados como interface** — O próprio pipeline É o visual. Sem enfeite decorativo
3. **Tipografia com caráter** — Fontes que têm opinião, não que "funcionam pra tudo"
4. **Brutalidade controlada** — Edges afiados, grid modular, sem border-radius exagerado
5. **Textura > Brilho** — Noise grain no fundo em vez de glow e blur

---

## Paleta de Cores

### Accent (uma cor só, com convicção)
| Nome | Hex | Uso |
|------|-----|-----|
| Acid Chartreuse | `#CAFF33` | Acento principal. CTAs, destaques, hover states, badge Pro |

A cor accent é inesperada. Não é cyan, não é roxo, não é o verde-teal que todo mundo usa. É chartreuse ácido — reconhecível, tech-forward, impossível de ignorar.

### Cores do Pipeline (funcionais, não decorativas)
| Etapa | Hex | Nome |
|-------|-----|------|
| Novo Lead | `#5B7FFF` | Cool blue |
| Contato | `#00B4D8` | Teal |
| Proposta | `#CAFF33` | Chartreuse (= accent) |
| Negociação | `#FF6B35` | Warm orange |
| Fechado Ganho | `#2ED573` | Positive green |
| Fechado Perdido | `#FF4757` | Negative red |

### Backgrounds
| Nome | Hex | Uso |
|------|-----|-----|
| bg | `#0C0C0E` | Fundo principal — quase preto com tint quente |
| surface | `#141416` | Cards, sidebar, áreas elevadas |
| surface-2 | `#1A1A1E` | Hover states, featured cards |
| border | `#2A2A2E` | Bordas visíveis |
| border-subtle | `#1E1E22` | Divisores internos |

### Texto
| Nome | Hex | Uso |
|------|-----|-----|
| text | `#E8E8E8` | Títulos, texto primário |
| text-secondary | `#8A8A8F` | Corpo, descrições |
| text-muted | `#555559` | Labels, placeholders, metadata |

### Semânticas
| Nome | Hex | Uso |
|------|-----|-----|
| positive | `#2ED573` | Sucesso, conversão, ganho |
| negative | `#FF4757` | Erro, perda, alerta |
| warm | `#FF6B35` | Negociação, urgência |
| cool | `#5B7FFF` | Novo, neutro, informativo |

---

## Tipografia

### Display: Syne
- **Uso:** Títulos, H1, H2, nome do produto, CTAs grandes
- **Pesos:** 600 (semibold), 700 (bold), 800 (extrabold)
- **Personalidade:** Geométrica, moderna, com caráter — não é genérica
- **Letter-spacing:** Negativo em títulos grandes (-1.5px a -2px)

### Body: DM Sans
- **Uso:** Corpo de texto, descrições, UI labels
- **Pesos:** 300 (light), 400 (regular), 500 (medium), 600 (semibold)
- **Personalidade:** Legível, limpa, não compete com os títulos

### Data: IBM Plex Mono
- **Uso:** Valores monetários, labels de pipeline, tags, metadata, badges
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold)
- **Personalidade:** Técnica, precisa, confiável — sem parecer "hacker"
- **Estilo:** Sempre uppercase + letter-spacing: 0.1-0.2em para labels

### Hierarquia
| Elemento | Font | Tamanho | Peso | Cor | Extras |
|----------|------|---------|------|-----|--------|
| H1 hero | Syne | 48-64px | 800 | text | letter-spacing: -2px |
| H2 seção | Syne | 28-42px | 700 | text | letter-spacing: -1.5px |
| H3 card | Syne | 18px | 600 | text | — |
| Body | DM Sans | 14-17px | 400 | text-secondary | line-height: 1.65 |
| Label | IBM Plex Mono | 10-11px | 500 | text-muted | uppercase, tracking: 0.15em |
| Métrica valor | Syne | 32px | 700 | text | letter-spacing: -1px |
| Métrica delta | IBM Plex Mono | 11px | 400 | positive/negative | — |
| Botão | DM Sans | 14px | 600 | bg (em primary) | — |
| Index (01, 02) | IBM Plex Mono | 11px | 400 | text-muted | — |

---

## Componentes

### Logo
- **Mark:** Quadrado 32×32px com border-radius 6px, background accent, letra "P" em Syne 800, cor bg
- **Text:** "PipeFlow" em Syne 600, cor text + "CRM" em Syne 400, cor text-muted
- **Uso:** Sem ícone SVG elaborado. O "P" no quadrado é direto e reconhecível

### Botão Primário
```css
background: var(--accent);
color: var(--bg);
padding: 14px 28px;
border-radius: 8px;
font-weight: 600;
```
Hover: `box-shadow: 0 0 0 4px rgba(202,255,51,0.15);`

### Cards de Feature
- Background: surface
- Sem border-radius excessivo (12px no container, 0 nos cards intermediários)
- Barra accent no hover (::before, width 0→100%, top edge)
- Index numérico (01, 02) em mono, muted

### Cards de Métricas
- Grid 4 colunas, separados por borda vertical
- Label em mono uppercase
- Valor em Syne bold
- Delta com seta e cor semântica

### Pipeline Visual (Hero)
- Estilo terminal/CLI — não Kanban colorido
- Barra de título com dots macOS (vermelho, amarelo, verde)
- Linhas com: stage name, barra de progresso, valor, contagem
- Barra de progresso: fill com cor da etapa, bg em surface-2
- Footer: total pipeline em accent

---

## Efeitos (com parcimônia)

### Noise Texture
Sutil overlay de ruído SVG no body (opacity 0.03). Dá textura orgânica ao fundo sem parecer filtro de Instagram.

### Reveal on Scroll
- Translate Y 16px + opacity 0 → 0 + 1
- Transition: 0.6s ease
- Stagger com delay incremental (0.1s, 0.2s, 0.3s)

### Accent Line on Hover (feature cards)
- `::before` no topo do card
- Width: 0 → 100% no hover
- Background: accent
- Transition: 0.4s ease

### Pipeline Bar Animation
- Bars começam em width 0% e animam para o valor real no load
- Transition: 1.5s ease

### O que NÃO usar
- Glassmorphism (backdrop-filter blur)
- Gradient text
- Partículas em canvas
- Neon glow / text-shadow
- Animate-float / orbitas flutuantes
- Border-radius exagerado (não mais que 12px)
- Múltiplas cores competindo (1 accent basta)

---

## Tailwind Config (para o projeto Next.js)

```javascript
colors: {
    'pf-bg': '#0C0C0E',
    'pf-surface': '#141416',
    'pf-surface-2': '#1A1A1E',
    'pf-border': '#2A2A2E',
    'pf-border-subtle': '#1E1E22',
    'pf-text': '#E8E8E8',
    'pf-text-secondary': '#8A8A8F',
    'pf-text-muted': '#555559',
    'pf-accent': '#CAFF33',
    'pf-positive': '#2ED573',
    'pf-negative': '#FF4757',
    'pf-warm': '#FF6B35',
    'pf-cool': '#5B7FFF',
},
fontFamily: {
    display: ['Syne', 'sans-serif'],
    body: ['DM Sans', 'sans-serif'],
    mono: ['IBM Plex Mono', 'monospace'],
}
```

---

## Aplicação no CRM

### Sidebar
- Background: pf-surface, borda direita pf-border-subtle
- Item ativo: background pf-accent/8%, texto accent
- Item hover: background white/3%
- Logo mark no topo (quadrado chartreuse com P)

### Pipeline Kanban (dentro do app)
- Headers de coluna: dot colorido + nome em mono uppercase
- Cards: background pf-surface, borda pf-border-subtle
- Card hover: borda accent/20%, barra accent no topo
- Valor em mono, cor da etapa
- Drag: card com opacidade 0.7, coluna destino com borda accent

### Tabela de Leads
- Header: mono, uppercase, tracking-wider, muted
- Rows: sem zebra stripe (muito genérico). Hover com bg surface-2
- Status badges: dot colorido 8px + texto
- Valores: mono

### Dashboard
- Métricas em grid com bordas verticais (não cards soltos)
- Gráficos com cores das etapas, background transparente
- Labels em mono, valores em Syne bold
