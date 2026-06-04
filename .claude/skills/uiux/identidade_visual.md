# Wundu — Design System para Construção do Site

> Plataforma angolana de finanças pessoais. Site: www.wundu.ao | Email: geral@wundu.com

---

## Marca

**Nome:** Wundu — significa caminho, jornada ou direção em línguas bantu (umbundu).
**Slogan:** "O caminho para liberdade financeira"
**Mensagem secundária:** "Dinheiro no controlo, mente em paz!"
**Público:** Angolanos que querem gerir as suas finanças pessoais de forma simples e dinâmica.
**Tom de voz:** Motivador, acessível, confiante.

---

## Cores

```css
/* Paleta principal */
--color-yellow:       #ffd400;   /* CTA, botões, destaques, ícones */
--color-yellow-dark:  #ca6f05;   /* Gradiente do amarelo, hover states */
--color-blue:         #003cc3;   /* Primária fria, links, navbar */
--color-blue-dark:    #00216b;   /* Fundo escuro, footer, headers */

/* Gradientes */
--gradient-warm: linear-gradient(135deg, #ffd400, #ca6f05);   /* Cards, botões primários, hero */
--gradient-cool: linear-gradient(135deg, #003cc3, #00216b);   /* Navbar, footer, secções escuras */

/* Neutros */
--color-white: #ffffff;
--color-black: #000000;
```

**Regras de uso:**
- Fundo escuro (azul) → logo/texto em branco
- Fundo claro (branco) → logo/texto em azul ou amarelo
- Botões primários → gradiente amarelo-laranja com texto branco
- Botões secundários → fundo azul escuro com texto branco

---

## Tipografia

```css
/* Importar no <head> */
/* Arial Rounded MT Bold é sistema; Poppins via Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

--font-heading: 'Arial Rounded MT Bold', 'Arial', sans-serif;  /* Títulos, navbar, logo */
--font-body:    'Poppins', sans-serif;                          /* Corpo, botões, labels */
```

**Hierarquia sugerida:**
- `h1` — Arial Rounded MT Bold, 48–64px, cor azul escuro ou branco
- `h2` — Arial Rounded MT Bold, 32–40px
- `h3` — Poppins SemiBold 600, 20–24px
- Corpo — Poppins Regular 400, 16px, line-height 1.6
- Botões — Poppins SemiBold 600, 15–16px

---

## Logótipo

**Composição:** Símbolo "W" estilizado (gráfico em ascensão com seta) inscrito num círculo azul + wordmark "Wundu" em amarelo + tagline em amarelo.

**Versões para o site:**
- **Navbar/Header** → versão horizontal (símbolo + nome lado a lado)
- **Footer / fundo escuro** → logo branco sobre fundo azul escuro
- **Favicon / app icon** → apenas o símbolo circular

**Zona de protecção:** manter espaço mínimo equivalente à altura da letra "W" em todos os lados do logo.

---

## Componentes UI

### Botão Primário
```css
background: var(--gradient-warm);
color: #ffffff;
font-family: var(--font-body);
font-weight: 600;
border-radius: 8px;
padding: 12px 28px;
border: none;
```

### Botão Secundário
```css
background: var(--color-blue-dark);
color: #ffffff;
border-radius: 8px;
padding: 12px 28px;
```

### Card
```css
background: #ffffff;
border-radius: 16px;
box-shadow: 0 4px 20px rgba(0, 33, 107, 0.08);
padding: 24px;
```

### Navbar
```css
background: var(--color-blue-dark);  /* ou branco com logo colorido */
color: #ffffff;
font-family: var(--font-body);
font-weight: 500;
```

### Elemento decorativo (ondas)
O layout usa formas de onda suaves em azul e amarelo no fundo das secções — characteristic da marca. Aplicar via SVG ou `border-radius` assimétrico em pseudo-elementos.

---

## Estrutura sugerida para o Site

```
Hero          → fundo branco + onda azul + logo vertical centrado + CTA amarelo
Sobre         → fundo azul escuro + texto branco + conceito da marca
Funcionalidades → cards brancos em grid, ícones amarelos
App Preview   → mockup do telemóvel sobre fundo degradé amarelo
CTA final     → fundo gradiente azul + botão amarelo
Footer        → fundo #00216b + logo branco + links + www.wundu.ao
```

---

## Assets e Contactos

- **Website:** www.wundu.ao
- **Email:** geral@wundu.com
- **Logo:** disponível em versão colorida, branco e monocromático (PNG/SVG)
- **Ícone da app:** "W" circular, versões amarela, azul, preta e branca