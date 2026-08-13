# Build & Deploy — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## Comando de Build
```bash
pnpm build   # next build --turbopack
pnpm dev     # dev
pnpm start   # serve prod
```

## Configuração do Build
`next.config.ts`: `outputFileTracingRoot`, `skipTrailingSlashRedirect`, `images: { qualities:[75,85,100], formats:["avif","webp"], minimumCacheTTL: 2592000 }`, `rewrites` para proxy e PostHog. `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json` (strict).

## Variáveis Utilizadas
`BACKEND_API_BASE_URL` em build-time para rewrites; `NEXTAUTH_*` em runtime.

## Output Gerado
`.next/` (server, static, cache), `.next/static` (assets hashed), `standalone` se `output: "standalone"`.

## Build DEV
`pnpm dev` → sem minify, HMR, `NODE_ENV=development`, rewrites para localhost.

## Build PROD
`pnpm build` → minificado, hashed, `NODE_ENV=production`.

## Validação do Build
```bash
npx tsc --noEmit
pnpm build # deve terminar sem erro, verificar .next existe
```

## Deploy DEV
- **Pré-requisitos**: Node 20, `BACKEND_API_BASE_URL` dev, Netlify CLI se manual.
- **Processo**: `git push dev` → Netlify preview deploy automático; ou `netlify deploy --dir=.next --alias dev`.
- **Variáveis**: `BACKEND_API_BASE_URL=http://localhost:8080/api/v1` (ou preview URL).
- **Validação pós-deploy**: Abrir preview URL, login, `GET /home` 200, `GET /api/proxy/actuator/health` 200.
- **Health check**: `GET /` 200 + `GET /api/proxy/actuator/health` → `{"status":"UP"}`.
- **Rollback**: Netlify → Deploys → Preview → “Stop preview” ou redeploy anterior.
- **Troubleshooting**: rewrites 404 → sem `/api/v1`; auth loop → `NEXTAUTH_SECRET` missing.

## Deploy PROD
- **Pré-requisitos**: tag `main`, `NEXTAUTH_SECRET` seguro, `NEXTAUTH_URL` prod, `BACKEND_API_BASE_URL` prod.
- **Processo**: `dev→demo→release→main` PRs → Netlify prod auto-deploy; manual `netlify deploy --prod --dir=.next`.
- **Variáveis**: `BACKEND_API_BASE_URL=https://wundu-api-production.up.railway.app/api/v1`, `NEXTAUTH_URL=https://wundu-web.netlify.app`.
- **Validação**: Smoke login + transações + chat; `curl https://wundu-web.netlify.app/api/proxy/actuator/health`.
- **Health check**: idem DEV + PostHog ingest OK.
- **Rollback**: Netlify → Deploys → “Publish deploy” anterior ou `git revert` + push `main`.
- **Troubleshooting**: 500 → verificar `BACKEND_API_BASE_URL`; NextAuth error → `NEXTAUTH_URL` mismatch.

Próximos: [Guia Local](guia-local.md) | [Env](env.md)
