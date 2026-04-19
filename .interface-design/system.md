# Wundu Dashboard Design System

## Direction and feel
- **Tone:** profissional, confiável e moderno, com foco em educação financeira para Angola.
- **Brand anchors:** azul `#003cc3` (confiança/estrutura) e amarelo `#ffd400` (ação/progresso).
- **Base surfaces:** branco e slate neutro para legibilidade e performance.
- **Layout behavior:** conteúdo centralizado em desktop com largura máxima para evitar componentes esticados.

## Depth strategy
- **Primary strategy:** borda + sombra leve (sem blur pesado).
- **Overlays/modals:** fundo opaco/translúcido simples, sem `backdrop-blur-xl`.
- **Cards/panels:** `border-slate-200` + `shadow-sm`/`shadow-md` com hover discreto.

## Spacing base unit
- Base de **4px** (escala Tailwind).
- Ritmo principal de dashboard:
  - wrappers: `p-4` / `p-6` / `p-8`
  - gaps de seção: `gap-6` a `gap-12`
  - cards: `rounded-2xl` e `rounded-3xl` conforme hierarquia

## Motion patterns (Framer Motion)
- **Princípio:** microanimações leves, sem bounce agressivo.
- **Entradas:** fade + pequeno slide (`y: 8..12`) com duração ~`0.2–0.35s`.
- **Listas/cards:** stagger curto (`0.04–0.08`) para leitura progressiva.
- **Interações:** hover sutil (`y: -1/-2`, scale ~`1.01–1.03`).
- **Easing:** `easeOut` / `easeInOut` (tipado como `as const` em variants).

## Key component patterns
- **Dashboard shell:** sidebar esquerda + top bar + painel direito, com conteúdo central em container max-width.
- **Top bar:** header limpo com acento de marca e notificações discretas.
- **Stats cards:** hierarquia clara, card primário com azul da marca e destaque amarelo pontual.
- **Painel direito (perfil):** superfície branca com borda/sombra leve; animação lateral curta.
- **Biblioteca/chat/financeiro:** consistência de borda, raio e spacing com animação de entrada uniforme.

## Performance and constraints
- Evitar `blur-xl`, `blur-2xl`, `backdrop-blur-xl` em superfícies de dashboard.
- Priorizar animações de opacidade/transform para manter fluidez.

## Input states (updated for mobile consistency)
- Focus border: `border-[#003cc3]` + `ring-4 ring-[#003cc3]/[0.06]`
- Focus label/icon: `text-[#003cc3]`
- Default border: `border-slate-200`, bg: `bg-slate-50/50`
- Error: `border-red-500`, bg: `bg-red-50/30`

## Top bar signature (updated)
- Yellow accent line at bottom: `height: 2, backgroundColor: "#ffd400", opacity: 0.6` — matches mobile header
- Notification dot: red `#EF4444` (real alert color, not yellow)
- Avatar ring: `backgroundColor: "#ffd400"` — matches mobile's yellow avatar border

## Avatar consistency (updated)
- All profile avatars use yellow `#ffd400` ring — sidebar right, top bar
- Matches mobile header avatar treatment exactly

## Transaction animations (updated)
- Slide from right: `initial={{ x: 20 }}` → `animate={{ x: 0 }}`
- Stagger delay: `index * 0.055`, max 0.4s — mirrors mobile's 55ms stagger
- `whileHover={{ x: 2 }}` — subtle press-feel on desktop

## Loading state — TransactionsList
- Skeleton cards (5 rows) with `animate-pulse` at decreasing opacity
- Matches mobile's visual weight during loading

## Filter modal active state
- Active filter buttons: `bg-[#003cc3]` — consistent with brand blue
- **BalanceCard:** Card hero azul com gradiente (do #003cc3 para #001a66), mostra saldo total + tendência, ícone amarelo #ffd400.
- **GoalProgressCard:** Card branco com ring de progresso 45px raio. Amarelo durante progresso, verde quando completo. Valores em pills coloridas (emerald para poupado, azul para meta).
- **CategoryExpenseCard:** Card pequeno com barra horizontal de percentual, animada ao carregar. Cores por categoria rotacionadas (azul, amarelo, verde, vermelho, laranja).
- **Form Layout:** Modal inline em seção expansível, mantém contexto visível.
- **Hierarquia:** Saldo > Objetivos ativos > Categorias > Objetivos alcançados (completed para o final).
