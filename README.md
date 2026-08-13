# Wundu WEB

Aplicação web de gestão financeira — **Next.js 15** · **React 19** · **Tailwind 4** · **Zustand** · **TanStack Query**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org) [![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)

> **Navegação rápida** · [Arquitectura](docs/arquitectura.md) · [Estrutura](docs/estrutura.md) · [Navegação](docs/navegacao.md) · [API Client](docs/api-client.md) · [Componentes](docs/componentes.md) · [Env](docs/env.md) · [Build & Deploy](docs/build-deploy.md) · [Guia Local](docs/guia-local.md)

## Descrição
Dashboard financeiro com auth (email+Google), transacções manuais e OCR, categorias, objectivos, analytics (Chart.js), chat IA (SSE), biblioteca, perfil com demografia e sessões. Consome `wundu-api` via `/api/proxy`.

## Tecnologias
Next.js 15 (App Router, Turbopack), React 19, TypeScript 6, Tailwind 4, Zustand 5, TanStack Query 5, Axios 1.12, NextAuth 4, PostHog, Chart.js, Framer Motion, Lucide.

## Pré-requisitos
- Node >=20, pnpm >=9, Git
- Backend `wundu-api` em `http://localhost:8080` ou prod `https://wundu-api-production.up.railway.app/api/v1`

## Instalação
```bash
git clone <url> wundu-web && cd wundu-web
cp .env.example .env   # ver [Configuração](#configuração)
pnpm install
```

## Configuração
Ver [docs/env.md](docs/env.md) e `.env.example`:
```bash
BACKEND_API_BASE_URL=http://localhost:8080/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_AUTH_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
NEXT_AUTH_GOOGLE_CLIENT_SECRET=xxx
```

## Execução Local
```bash
pnpm dev    # http://localhost:3000 (Turbopack)
pnpm build  # .next/
pnpm start  # prod preview
```
Ver [Guia Local](docs/guia-local.md) para passo a passo completo (portas, dev vs prod, troubleshooting).

## Build
`pnpm build` → `.next/` (ver [Build & Deploy](docs/build-deploy.md) para validação, Netlify, rollback).

## Testes
Ainda sem suite. Estratégia recomendada: Vitest + Testing Library. `npx tsc --noEmit` como validação mínima.

## Principais Comandos
| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Dev 3000 |
| `pnpm build` | Build prod |
| `pnpm start` | Serve prod |
| `npx tsc --noEmit` | Typecheck |

## Documentação
| Doc | Conteúdo |
|-----|----------|
| [Índice docs](docs/README.md) | Mapa completo |
| [Arquitectura](docs/arquitectura.md) | Camadas, fluxo, diagrama |
| [Estrutura](docs/estrutura.md) | Pastas, ficheiros, organização |
| [Navegação](docs/navegacao.md) | Rotas, guards, 404 |
| [API Client](docs/api-client.md) | HTTP, auth, endpoints |
| [Componentes](docs/componentes.md) | UI + exemplos |
| [Git Workflow](docs/git-workflow.md) | Branches, PRs |
| [Convenções](docs/convencoes.md) | Regras equipa |

---
> Dica: no GitHub, comece por [docs/README.md](docs/README.md).
