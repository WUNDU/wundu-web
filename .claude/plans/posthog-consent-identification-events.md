# PostHog: Consentimento, Identificação e Eventos de Interface

## Context

O SDK do PostHog está a ser inicializado incondicionalmente em `instrumentation-client.ts` e os eventos disparam sem respeitar o consentimento do utilizador. Isto viola a Lei 22/11 (Protecção de Dados Pessoais, Angola) que exige consentimento explícito para tratamento analítico. O backend fornece `analyticsConsent` e `analyticsConsentAt` no `GET /api/v1/users/me`, e o endpoint `PATCH /api/v1/users/me/consent/analytics` permite ao utilizador conceder/retirar consentimento.

**Problemas actuais:**
- PostHog inicializa sempre, mesmo sem consentimento
- Identificação usa email em vez do `userId` do backend
- Eventos não têm origem "web"
- Não há paragem imediata de recolecção quando consentimento é retirado
- Cookie consent (UI) não está integrado com PostHog

## Ficheiros a Criar

### 1. `src/lib/analytics.ts` — Módulo central de analytics
- Funções: `initAnalytics()`, `identifyUser()`, `resetIdentification()`, `captureEvent()`, `stopAnalytics()`, `hasConsent()`
- `initAnalytics()`: Verifica `analyticsConsent` do utilizador; só inicializa PostHog se `true`
- `identifyUser(userId, properties)`: Chama `posthog.identify(userId, properties)`
- `resetIdentification()`: Chama `posthog.reset()`
- `captureEvent(event, properties)`: Adiciona `$source: "web"` e só captura se consentido
- `stopAnalytics()`: Chama `posthog.opt_out_capturing()` e `posthog.reset()`
- `hasConsent()`: Retorna estado actual do consentimento
- Estado de consentimento mantido em variável module-level (não em localStorage)

### 2. `src/services/analytics-consent.service.ts` — Serviço de consentimento
- `updateAnalyticsConsent(granted: boolean)`: PATCH `/users/me/consent/analytics` com `{ granted }`
- Retorna `User` actualizado

### 3. `src/contexts/analytics-context.tsx` — Context de analytics
- `AnalyticsProvider`: Envolve a app, fornece `analyticsConsent`, `setAnalyticsConsent()`
- No mount: lê `analyticsConsent` do user no store
- `setAnalyticsConsent(granted)`: Chama API + actualiza PostHog + actualiza store

## Ficheiros a Modificar

### 4. `src/types/dtos/auth.dto.ts`
- Adicionar `analyticsConsent: boolean` e `analyticsConsentAt: string | null` ao `UserResponse`

### 5. `instrumentation-client.ts`
- Remover inicialização incondicional do PostHog
- PostHog passa a ser inicializado por `initAnalytics()` em `src/lib/analytics.ts`

### 6. `src/store/user-store.ts`
- Após `checkAuthStatus()` e `login()`: chamar `initAnalytics(user)` para inicializar/actualizar consentimento
- Após `logout()`: chamar `stopAnalytics()` + `resetIdentification()`
- Após `applyGoogleSession()`: chamar `initAnalytics(user)`

### 7. `app/(auth)/login/page.tsx`
- Substituir `posthog.identify(email, {email})` por `identifyUser(user.id, { email, name })` (via `src/lib/analytics`)
- Substituir `posthog.capture(...)` por `captureEvent(...)` 
- Remover import directo de `posthog`

### 8. `app/(auth)/google-callback/page.tsx`
- Substituir `posthog.identify(...)` e `posthog.capture(...)` por funções do módulo analytics
- Identificar com `userId` em vez de email

### 9. `app/(auth)/register/page.tsx`
- Substituir `posthog.identify(...)` e `posthog.capture(...)` por funções do módulo analytics
- Identificar com `userId` em vez de email

### 10. `app/(auth)/register/google/page.tsx`
- Substituir `posthog.identify(...)` e `posthog.capture(...)` por funções do módulo analytics
- Identificar com `userId` em vez de email

### 11. `src/components/layout/sidebar-right.tsx`
- `handleLogout()`: chamar `stopAnalytics()` + `resetIdentification()` em vez de `posthog.capture/reset`
- Remover import directo de `posthog`

### 12. `app/(protected)/(dashboard)/home/page.tsx`
- Substituir `posthog.capture(...)` por `captureEvent(...)` em todos os eventos
- Remover import directo de `posthog`

### 13. `src/components/home/add-transaction-modal.tsx`
- Substituir `posthog.capture(...)` por `captureEvent(...)`
- Remover import directo de `posthog`

### 14. `src/components/goals/new-goal-modal.tsx`
- Substituir `posthog.capture(...)` por `captureEvent(...)`
- Remover import directo de `posthog`

### 15. `app/(protected)/(dashboard)/home/chat/page.tsx`
- Substituir `posthog.capture(...)` por `captureEvent(...)`
- Remover import directo de `posthog`

### 16. `app/(protected)/(dashboard)/home/transactions/page.tsx`
- Substituir `posthog.capture(...)` por `captureEvent(...)`
- Remover import directo de `posthog`

### 17. `app/(protected)/(dashboard)/home/profile/page.tsx`
- Substituir `posthog.capture(...)` por `captureEvent(...)`
- Remover import directo de `posthog`

### 18. `src/components/layout/cookie-consent.tsx`
- No `acceptAllCookies()` e `savePreferences()`: chamar `setAnalyticsConsent()` do analytics context quando o toggle de analytics muda
- integrar com o consentimento do PostHog

### 19. `app/layout.tsx`
- Adicionar `AnalyticsProvider` na hierarchy de providers (antes de `CookieConsentProvider`)

## Ordem de Implementação

1. **Tipos** — Adicionar `analyticsConsent`/`analyticsConsentAt` ao `UserResponse`
2. **Serviço** — Criar `analytics-consent.service.ts`
3. **Módulo analytics** — Criar `src/lib/analytics.ts`
4. **Context** — Criar `analytics-context.tsx`
5. **Provider** — Adicionar `AnalyticsProvider` ao root layout
6. **instrumentation-client.ts** — Simplificar (remover init)
7. **User store** — Integrar analytics no lifecycle (login/logout/checkAuth)
8. **Eventos** — Actualizar todos os ficheiros com eventos para usar `captureEvent()`
9. **Identificação** — Actualizar login/callback/register para usar `identifyUser()` com userId
10. **Consentimento** — Integrar cookie consent banner com analytics context
11. **Verificação** — Correr `npm run lint` e `npm run typecheck`

## Validação

- `npm run lint` — sem erros
- `npm run typecheck` — sem erros
- Testar manualmente: login → eventos disparam com `$source: "web"`
- Testar manualmente: logout → `posthog.reset()` chamado, identificação limpa
- Testar manualmente: sem consentimento → PostHog não inicializa, nenhum evento dispara
- Testar manualmente: retirar consentimento via API → `posthog.opt_out_capturing()` chamado imediatamente
- Verificar que `analyticsConsent` é lido do `GET /api/v1/users/me` no arranque
