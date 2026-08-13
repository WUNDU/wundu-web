# Guia Local — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## 1. Clonar o Repositório
```bash
git clone https://github.com/WUNDU/wundu-web.git
cd wundu-web
git checkout dev && git pull
```

## 2. Instalar Ferramentas
- Node >=20: `node -v` (>=20)
- pnpm >=9: `npm i -g pnpm` ou `corepack enable`
- Git

## 3. Instalar Dependências
```bash
pnpm install
# alternativa: npm install / yarn
```

## 4. Configurar .env
```bash
cp .env.example .env
# Editar .env:
BACKEND_API_BASE_URL=http://localhost:8080/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_AUTH_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com # se usar Google
NEXT_AUTH_GOOGLE_CLIENT_SECRET=xxx
# opcional: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_WS_URL
```
Ver [env.md](env.md) para todas vars, obrigatórias vs opcionais, DEV vs PROD.

## 5. Iniciar o Projecto
```bash
pnpm dev   # http://localhost:3000 (Turbopack, hot reload)
```
Precisa backend em `http://localhost:8080/api/v1` (ou usar prod URL). Porta 3000.

## 6. Documentar Comandos Disponíveis
| Comando | Descrição | Quando usar |
|---------|-----------|-------------|
| `pnpm dev` | Dev server 3000 Turbopack | Desenvolvimento |
| `pnpm build` | Build prod `.next/` | Antes de deploy/test |
| `pnpm start` | Serve prod (`next start`) | Preview prod local |
| `npx tsc --noEmit` | Typecheck | Validação |
| `npx eslint .` | Lint | Validação |

## 7. Documentar Porta Utilizada
- Dev: `3000` (`next dev`)
- Prod preview: `3000` (`next start`)

## 8. Documentar Modo de Desenvolvimento
`pnpm dev` → Turbopack, sem minify, HMR, rewrites para API, `NODE_ENV=development`.

## 9. Documentar Modo de Produção
`pnpm build && pnpm start` → minificado, hashed, `outputFileTracingRoot`, `NODE_ENV=production`.

## 10. Documentar Build
Ver [build-deploy.md](build-deploy.md): `next build --turbopack`, `next.config.ts` (images avif/webp 30d), vars em build-time.

## 11. Documentar Preview
```bash
pnpm build && pnpm start
# Abrir http://localhost:3000, testar login, transações, chat
```

## 12. Executar Testes
Sem suite ainda. Validação mínima:
```bash
npx tsc --noEmit
pnpm build
```
Futuro: `vitest` + `@testing-library/react`.

## 13. Executar Lint
```bash
npx eslint . --fix
npx prettier --write .
```

## 14. Criar Primeira Alteração
```bash
git checkout -b feature/minha-primeira
# editar src/components/ui/button.tsx ou app/page.tsx
pnpm dev # testar
```

## 15. Criar Commit
```bash
git add .
git commit -m "feat: adicionar variante no Button"
# ou com emoji: git commit -m "✨ feat: adicionar variante"
```

## 16. Criar Pull Request
```bash
git push -u origin feature/minha-primeira
# GitHub → Compare & pull request → base `dev` ← `feature/minha-primeira`
# Preencher template, assign reviewer, checklist
```
Ver [git-workflow.md](git-workflow.md) para aprovação e merge.

Próximos: [Build & Deploy](build-deploy.md) | [Env](env.md)
