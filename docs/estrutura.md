# Estrutura de Pastas — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## Estrutura de Pastas
```
wundu-web/
├── app/                          # App Router (Next.js 15)
│   ├── layout.tsx                # Root layout + providers
│   ├── page.tsx                  # Landing ("/")
│   ├── loading.tsx / not-found.tsx
│   ├── (auth)/                   # Grupo público
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx (+ google/)
│   │   ├── verify-*/page.tsx
│   │   ├── reset_password/page.tsx
│   │   └── google-callback/page.tsx
│   ├── (protected)/              # Grupo privado (middleware)
│   │   ├── layout.tsx
│   │   └── (dashboard)/home/
│   │       ├── page.tsx (dashboard)
│   │       ├── analytics/page.tsx
│   │       ├── categories/page.tsx
│   │       ├── chat/page.tsx
│   │       ├── financial/page.tsx
│   │       ├── goals/page.tsx
│   │       ├── library/ (page + article/)
│   │       ├── transactions/page.tsx
│   │       └── profile/ (page + control_panel/ + support/)
│   ├── about/page.tsx / (legal)/legal/page.tsx
│   └── api/ (proxy, auth, push)
├── src/
│   ├── api/api.ts                # Axios central
│   ├── services/                 # ai, category, chat, document, goal, transaction, user, notification, password-recovery, angola-location
│   ├── store/                    # user-store, chat-store, ui-store
│   ├── hooks/                    # 20+ hooks (use-auth, use-transaction, use-goal, use-chat, use-balance, use-category, use-notification...)
│   ├── components/
│   │   ├── ui/ (button, input, select, modal, tab, message, tutorial-overlay...)
│   │   ├── layout/ (navbar, sidebar, header, footer, top-bar...)
│   │   ├── home/ (upload-section, add-transaction-modal, ocr-status...)
│   │   ├── financial/ (balance-card, consumption-meter...)
│   │   ├── goals/ (goal-row, new-goal-modal...)
│   │   ├── charts/ (bar, line, pie)
│   │   ├── transactions/ (transaction-item, filter-modal)
│   │   ├── profile/ (edit-profile-modal...)
│   │   └── providers/ (query-provider, session-provider)
│   ├── types/dtos/               # auth, transaction, category, goal, chat, user, common
│   ├── lib/ (query-client, currency)
│   ├── utils/ (api-error, pending-verification, currency)
│   ├── constants/ (routes, brand-colors, icons, images, mock-data)
│   ├── config/ (env, tutorials)
│   ├── contexts/ (loading, cookie-consent)
│   └── icons/ (svg components)
├── public/                       # assets estáticos
├── middleware.ts                 # Guard de rotas
├── next.config.ts                # rewrites, images, tracing
├── tailwind.config.ts / postcss.config.mjs
└── tsconfig.json / package.json / netlify.toml
```

## Responsabilidade de Cada Pasta
| Pasta | Responsabilidade | Não deve conter |
|-------|-----------------|-----------------|
| `app/` | Páginas e layouts (Server Components) | Lógica de fetch |
| `src/components/ui/` | Primitivos reutilizáveis com `cva` | Lógica de negócio |
| `src/components/layout/` | Estrutura (navbar, sidebar) | Estado de domínio |
| `src/services/` | Chamadas HTTP tipadas | JSX |
| `src/hooks/` | Lógica + Query | JSX pesado |
| `src/store/` | Zustand client | Server state |
| `src/types/` | DTOs | `any` |
| `src/constants/` | `ROUTES`, cores | Segredos |
| `public/` | Assets estáticos (imgs, fonts) | Código |
| `src/icons/` | SVGs como componentes | Lógica |

## Principais Ficheiros
- `middleware.ts` — guard `/home/*` via `wundu_session`
- `src/api/api.ts` — axios + `ApiError`
- `src/store/user-store.ts` — auth + `refreshPromise`
- `src/constants/routes.ts` — `ROUTES` central
- `next.config.ts` — rewrites proxy

## Organização dos Módulos
Por domínio: `transaction` (service + hook + store + dto + component), idem `goal`, `category`, `chat`, `document`.

## Organização dos Componentes
`ui/` genéricos → `layout/` estrutura → `home/`/`financial/`/`goals/` domínio → `charts/` visualização.

## Organização das Páginas/Screens
File-based `app/`: `(auth)` públicas, `(protected)/(dashboard)/home/*` privadas, `loading.tsx`/`not-found.tsx` globais.

## Organização dos Assets
`public/` (estático) + `src/constants/images.ts` (imports) + `src/icons/` (SVGs) + `tailwind.config.ts` cores.

## Organização dos Hooks
`use-auth` (login/logout), `use-transaction` (CRUD+polling), `use-goal`, `use-chat` (SSE), `use-balance`, `use-category`, `use-notification`, `use-document-polling`.

## Organização dos Services
Cada `*.service.ts` expõe `list/get/create/update/delete` tipados via `apiClient`.

## Organização dos Utils
`currency.ts` (pt-AO), `api-error.ts` (`getApiErrorMessage`), `pending-verification.ts`.

Próximos: [Arquitectura](arquitectura.md) | [Componentes](componentes.md)
