# Páginas / Screens — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## 1. Listar Páginas/Screens
22 páginas (`app/**/page.tsx`):

| # | Rota | Ficheiro | Tipo |
|---|------|----------|------|
| 1 | `/` | `app/page.tsx` | pública |
| 2 | `/about` | `app/about/page.tsx` | pública |
| 3 | `/legal` | `app/(legal)/legal/page.tsx` | pública |
| 4 | `/login` | `app/(auth)/login/page.tsx` | pública (auth) |
| 5 | `/register` | `app/(auth)/register/page.tsx` | pública (auth) |
| 6 | `/register/google` | `app/(auth)/register/google/page.tsx` | pública |
| 7 | `/verify-pending` | `app/(auth)/verify-pending/page.tsx` | pública |
| 8 | `/verify-email` | `app/(auth)/verify-email/page.tsx` | pública |
| 9 | `/reset_password` | `app/(auth)/reset_password/page.tsx` | pública (auth) |
| 10 | `/google-callback` | `app/(auth)/google-callback/page.tsx` | pública |
| 11 | `/home` | `app/(protected)/(dashboard)/home/page.tsx` | privada |
| 12 | `/home/analytics` | `.../analytics/page.tsx` | privada |
| 13 | `/home/categories` | `.../categories/page.tsx` | privada |
| 14 | `/home/chat` | `.../chat/page.tsx` | privada |
| 15 | `/home/financial` | `.../financial/page.tsx` | privada |
| 16 | `/home/goals` | `.../goals/page.tsx` | privada |
| 17 | `/home/transactions` | `.../transactions/page.tsx` | privada |
| 18 | `/home/library` | `.../library/page.tsx` | privada |
| 19 | `/home/library/article` | `.../library/article/page.tsx` | privada |
| 20 | `/home/profile` | `.../profile/page.tsx` | privada |
| 21 | `/home/profile/control_panel` | `.../profile/control_panel/page.tsx` | privada |
| 22 | `/home/profile/support` | `.../profile/support/page.tsx` | privada |

## 2. Descrever Cada Página
| Rota | Finalidade | Permissões | Estados | Componentes Utilizados | Fluxos Principais |
|------|------------|------------|---------|------------------------|-------------------|
| `/` | Landing marketing + hero + stats | público | `idle` | `HeroSection`, `Navbar`, `Footer`, `ScrollAnimationWrapper` | CTA → `/register`/`/login` |
| `/login` | Autenticar | público (redirect se auth) | `idle`, `loading`, `error` (`ApiError`) | `GoogleButton`, `Input`, `Button`, `useAuth` | submit → `POST /auth` → `useUserStore` → `/home` |
| `/register` | Registo multi-step | público | `step 1..3`, `loading` | `Input`, `AngolaLocationSelect` | `POST /users` → `verify-pending` |
| `/home` | Dashboard saldo + upload + movimentos | privado | `loading`, `empty`, `hasData` | `BalanceCard`, `UploadSection`, `MovementSection`, `TransactionHighlight` | upload → `POST /documents` → polling OCR |
| `/home/analytics` | Charts barre/linha/pizza | privado | `loading`, `hasData` | `BarChart`, `LineChart`, `PieChart`, `FilterTime` | `GET /transactions/summary` → render |
| `/home/chat` | Chat IA SSE | privado | `idle`, `streaming`, `rateLimit` | `Message`, `useChat`, `chat-store` | `POST /chat/conversations` SSE `token` |
| `/home/goals` | Listar/criar objectivos | privado | `loading`, `empty`, `modalOpen` | `GoalRow`, `NewGoalModal`, `Ring` | `GET /goals` → `POST /goals` |
| `/home/transactions` | Lista paginada + filtro | privado | `loading`, `filterOpen` | `TransactionItem`, `FilterModal`, `Pagination` | `GET /transactions?page&size` |
| `/home/profile` | Editar perfil + demografia + avatar + verificação | privado | `editing`, `saving`, `error` | `EditProfileModal`, `ProfileVerificationCard`, `DemographicFieldRow` | `PATCH /users/me/profile`, `POST /users/me/avatar` |

(... detalhe análogo para restantes; ver `navegacao.md` para rotas)

## 3. Documentar Rotas
Central em `src/constants/routes.ts` `ROUTES.*`. Ver [navegacao.md](navegacao.md) para mapa completo.

## 4. Documentar Componentes Utilizados
Cada página lista acima; ver [componentes.md](componentes.md) para props.

## 5. Documentar Permissões Necessárias
- Públicas: sem token.
- Privadas: `wundu_session` cookie + `Authorization` header; se 401 → refresh ou logout.

## 6. Documentar Estados da Página
`idle` → `loading` (Skeleton) → `hasData`/`empty` (`EmptyState`) → `error` (`Message error`). Chat: `isStreaming`.

## 7. Documentar Principais Fluxos
- **Auth**: `/login` → `useAuth.login` → `POST /auth` → `setUser` → `router.push("/home")`
- **OCR**: `UploadSection` → `POST /documents` multipart → `useDocumentPolling` → `GET /documents/:id/result`
- **Goal**: `NewGoalModal` → `POST /goals` → `invalidate ["goals"]` → `GoalRow` atualiza `Ring`

Próximos: [Navegação](navegacao.md) | [Componentes](componentes.md)
