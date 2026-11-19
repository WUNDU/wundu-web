# Guia de Desenvolvimento — pasta `app/` (Novo Visual Wundu)

> Leia isto antes de mexer em qualquer código. Só a zona descrita aqui está ativa.

## 1. Regra de ouro

**Todo o desenvolvimento do novo visual acontece APENAS dentro de `app/`.**

- ✅ Pode mexer: `app/(protected)/(dashboard)/home/**` (rotas), `app/components/**`
- ⚠️ Pode **importar (só leitura, sem editar)**: `@/constants/*` e `@/icons/*` (ou seja, `src/constants/` e `src/icons/`)
- ❌ **NÃO mexa** em `app/(protected)/(dashboard)/legacy/**`, `(auth)`, `(legal)`, `about`, `api` — legado, não alterar nem reaproveitar como base.

Motivo: estamos a reconstruir as telas do zero. Misturar código novo com código antigo gera regressões e retrabalho.

## 2. Rotas activas (novo visual)

Todas sob `(protected)` (auth + providers) e usam o shell próprio
`app/components/layout` (`Menu` + `TopBar`, sem sidebar legada):

| Rota | Ecrã |
|---|---|
| `/home` | Dashboard (`app/.../home/page.tsx`) |
| `/home/transactions` | Transações |
| `/home/goals` | Metas |
| `/home/analytics` | Análises |
| `/home/accounts` | Contas (tab Contas) |
| `/home/categories` | Contas (tab Categorias) |
| `/home/profile/settings` | Definições |

`AccountScreen` serve as duas rotas de contas: a tab activa deriva do URL
(`/home/accounts` ↔ `/home/categories`), e o `Menu` destaca o item pela rota.

## 3. Shell: uma só moldura por ecrã

- Ecrãs novos trazem o próprio `<Layout>` (novo visual, largura total).
- `(dashboard)/layout.tsx` renderiza a shell legada (Sidebar/TopBar antigas)
  **apenas** em `/legacy/home/*`. Fora daí devolve só `{children}` —
  nunca embrulhar um ecrã novo noutra shell (sem duplo sidebar/topbar).
- `app/testview/` foi removido (era andaime; as telas vivem nas rotas acima).

## 4. O que pode usar de fora de `app/components/`

**Apenas 2 coisas:**

1. **Icons** — `src/icons/*.tsx` e/ou `src/constants/icons.ts`
   ```tsx
   import { WalletIcon } from "@/icons/wallet";
   // ou
   import { SettingsRightBarIcon } from "@/constants/icons";
   ```
2. **Constants** — `src/constants/*` (ex.: `routes.ts`, `images.ts`, `brand-colors.ts`)
   ```tsx
   import { ROUTES } from "@/constants/routes";
   import { imgDashboard } from "@/constants/images";
   ```

> Precisa de um icon ou constante nova? Crie primeiro localmente em `app/components/` e proponha a promoção para `src/` em code review. Não edite `src/` diretamente sem alinhamento.

Para UI genérica prefira `lucide-react`:
```tsx
import { Calendar, ChevronDown } from "lucide-react";
```

## 5. Padrões obrigatórios

- Páginas sob `home/` são `"use client"` quando interactivas; componentes reutilizáveis em `app/components/<dominio>/`; tipos em `app/components/types/`, mocks em `app/components/mock/`, formatação em `app/components/utils/`.
- Imports do design system usam o prefixo `app/components/...`:
  ```tsx
  import CardViews from "app/components/dashboard/CardViews";
  import Layout from "app/components/layout/Layout";
  ```
- Estilo com Tailwind + tokens CSS do novo visual: `bg-(--bg-card)`, `border-(--card-barras)`, `text-(--text-title)`, `text-primary-300`, `font-manrope`.
- Não importe nada de `(auth)`, `(protected)/legacy`, `@/components/...` (raiz). Se o import vem de uma pasta depreciada, está errado.
- Rotas canónicas no plural (`transactions`, `goals`, `analytics`, `accounts`, `categories`) e definições em `profile/settings` — igual ao `Menu`, `ROUTES` e sidebar legada. Não criar variantes no singular.
