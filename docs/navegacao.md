# Navegação — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## 1. Middleware (`middleware.ts`)
```ts
const PROTECTED_PREFIX = "/home";
const AUTH_PATHS = ["/login","/register","/reset_password"];
if (pathname.startsWith("/home") && !cookies.has("wundu_session")) 
  redirect("/login?next=pathname");
if (AUTH_PATHS.some(p=>pathname.startsWith(p)) && cookies.has("wundu_session")) 
  redirect("/home");
```
`matcher: ["/home/:path*", "/login", "/register", "/reset_password"]`

## 2. Mapa de Rotas
| Rota | Ficheiro | Tipo | Guard | Query/Params |
|------|----------|------|-------|--------------|
| `/` | `app/page.tsx` | pública | — | — |
| `/about` | `app/about/page.tsx` | pública | — | — |
| `/legal` | `app/(legal)/legal/page.tsx` | pública | — | — |
| `/login` | `app/(auth)/login/page.tsx` | pública (auth) | redirect se já auth | `?next=/home` |
| `/register` | `app/(auth)/register/page.tsx` | pública (auth) | redirect se já auth | — |
| `/register/google` | `app/(auth)/register/google/page.tsx` | pública | — | `?idToken` |
| `/verify-pending` | `app/(auth)/verify-pending/page.tsx` | pública | — | — |
| `/verify-email` | `app/(auth)/verify-email/page.tsx` | pública | — | `?email` |
| `/reset_password` | `app/(auth)/reset_password/page.tsx` | pública (auth) | redirect se já auth | — |
| `/google-callback` | `app/(auth)/google-callback/page.tsx` | pública | — | `?code` |
| `/home` | `app/(protected)/(dashboard)/home/page.tsx` | privada | middleware | — |
| `/home/analytics` | `.../analytics/page.tsx` | privada | middleware | `?range=7d` |
| `/home/categories` | `.../categories/page.tsx` | privada | middleware | — |
| `/home/chat` | `.../chat/page.tsx` | privada | middleware | `?conversationId` |
| `/home/financial` | `.../financial/page.tsx` | privada | middleware | — |
| `/home/goals` | `.../goals/page.tsx` | privada | middleware | `?status` |
| `/home/transactions` | `.../transactions/page.tsx` | privada | middleware | `?page&size&filter` |
| `/home/library` | `.../library/page.tsx` | privada | middleware | `?q` |
| `/home/library/article` | `.../library/article/page.tsx` | privada | middleware | `?id` |
| `/home/profile` | `.../profile/page.tsx` | privada | middleware | — |
| `/home/profile/control_panel` | `.../profile/control_panel/page.tsx` | privada | middleware | — |
| `/home/profile/support` | `.../profile/support/page.tsx` | privada | middleware | — |

`404` → `app/not-found.tsx`. `loading.tsx` exibido em suspense.

## 3. Regras de Acesso
- Não autenticado → tenta `/home/*` → login com `next` param → após login volta para destino.
- Autenticado → tenta `/login` → `/home`.
- `ROUTES` (`src/constants/routes.ts`) centraliza strings para evitar hardcode: `ROUTES.HOME`, `ROUTES.LOGIN`, etc.

## 4. Parâmetros e Redirects
- Dinâmicos: não há `[id]` na WEB (só Mobile/Backoffice); filtros via `searchParams` (`useSearchParams`).
- Redirects: `next.config.ts` não usa `redirects`, só `rewrites` (`/api/proxy` e `/ingest`).

## Próximos passos
- [Arquitectura](arquitectura.md) | [Estrutura](estrutura.md) | [API Client](api-client.md)
