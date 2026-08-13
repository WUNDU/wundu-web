# Variáveis de Ambiente — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## Identificar Todas as Variáveis
`grep -r "process.env" src/ app/ next.config.ts` → `BACKEND_API_BASE_URL`, `NEXT_AUTH_GOOGLE_CLIENT_ID`, `NEXT_AUTH_GOOGLE_CLIENT_SECRET`, `GOOGLE_CLIENT_ID` (legado), `GOOGLE_CLIENT_SECRET` (legado), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_API_BASE_URL`, `NODE_ENV`.

## Descrever Cada Variável
| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `BACKEND_API_BASE_URL` | Base API Spring (sem trailing slash, com `/api/v1`) | `https://backend.wundu.tech/... (prod) / https://backend.test.wundu.tech/... (test)` |
| `NEXT_AUTH_GOOGLE_CLIENT_ID` | OAuth client ID (igual backend) | `xxx.apps.googleusercontent.com` |
| `NEXT_AUTH_GOOGLE_CLIENT_SECRET` | OAuth secret | `GOCSPX-...` |
| `GOOGLE_CLIENT_ID/SECRET` | Alias legado | — |
| `NEXTAUTH_URL` | URL pública app | `http://localhost:3000` (dev) / `https://wundu.app` (prod) |
| `NEXTAUTH_SECRET` | Assinatura sessão | `openssl rand -base64 32` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog key | `phc_...` |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host | `https://us.i.posthog.com` |
| `NEXT_PUBLIC_WS_URL` | WebSocket | `wss://.../ws` |
| `NEXT_PUBLIC_API_BASE_URL` | Override client (raro) | `/api/proxy` |
| `NODE_ENV` | `development`/`production` | `development` |

## Criar/Actualizar .env.example
Já existe `wundu-web/.env.example` com todas acima (sem valores reais). Garantir que permanece sem secrets.

## Documentar Ambiente DEV
```bash
BACKEND_API_BASE_URL=http://localhost:8080/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-at-least-32-chars
# Google opcional em dev pode deixar vazio
```

## Documentar Ambiente PROD
```bash
BACKEND_API_BASE_URL=https://backend.wundu.tech/... (prod) / https://backend.test.wundu.tech/... (test)
NEXTAUTH_URL=https://wundu-web.netlify.app
NEXTAUTH_SECRET=<gerado seguro>
NEXT_AUTH_GOOGLE_CLIENT_ID=<prod client>
NEXT_AUTH_GOOGLE_CLIENT_SECRET=<prod secret>
NEXT_PUBLIC_POSTHOG_KEY=<prod key>
```

## Identificar Variáveis Obrigatórias
`BACKEND_API_BASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (e Google se login Google activo).

## Identificar Variáveis Opcionais
`NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_API_BASE_URL`.

## Garantir que Não Existem Secrets Reais
- `.env` está em `.gitignore`; só `.env.example` commitado com placeholders vazios.
- Verificar: `git log --all -p | grep -E "GOCSPX|phc_|BEGIN PRIVATE"` → nada.
- `grep -r "apps.googleusercontent" .env.example` → só `NEXT_AUTH_GOOGLE_CLIENT_ID=` vazio.

Próximos: [Guia Local](guia-local.md) | [Build & Deploy](build-deploy.md)
