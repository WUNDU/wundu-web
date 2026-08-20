# Convenções — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## 1. Naming Conventions
- **Componentes**: PascalCase `BalanceCard.tsx`, `GoalRow.tsx`
- **Hooks**: `use-` + kebab `use-transaction.ts`, `use-auth.ts`
- **Services**: `*.service.ts` `transaction.service.ts`
- **Stores**: `*-store.ts` `user-store.ts`
- **Tipos**: `*.dto.ts` `transaction.dto.ts`, `common.dto.ts`
- **Constantes**: `UPPER_SNAKE` para `ROUTES`, `PAGE_SIZE`
- **Rotas**: kebab `/reset_password` legado → preferir `reset-password` novo
- **Variáveis**: `camelCase` `isLoading`, `formData`

## 2. Estrutura dos Componentes
```tsx
// ui/button.tsx
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
type Props = { variant?: "primary"|"outline"; size?: "sm"|"md"; isLoading?: boolean; onClick?:()=>void; children: ReactNode };
export function Button({ variant="primary", size="md", isLoading, children, ...props }: Props) {
  return <button className={cn(cva({...}))} {...props}>{isLoading ? <Spinner/> : children}</button>;
}
```
Regras: Props tipadas obrigatórias, sem `any`, `cn` para merge, `cva` para variantes, `lucide-react` para ícones, acessibilidade `aria-*`.

## 3. Organização dos Imports
```ts
// 1. React/Next
import { useState } from "react";
import Link from "next/link";
// 2. Libs externas
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// 3. Internos absolutos @/
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
// 4. Relativos
import "./styles.css";
```
ESLint `import/order` (se ativado) enforce esta ordem + linhas em branco.

## 4. Organização dos Ficheiros
- `app/` só páginas/layouts; `src/components/` só JSX; `src/services/` só chamadas; `src/hooks/` só lógica.
- Não criar componente fora de `src/components/`.
- Não importar `store` dentro de `api.ts` directamente (usar `require` lazy ou `setAuthHandlers` para evitar ciclo).

## 5. Regras TypeScript
- `strict: true` em `tsconfig.json` (`noImplicitAny`, `strictNullChecks`).
- `noUnusedLocals`, `noUnusedParameters` warn.
- DTOs são fonte da verdade; usar `unknown` + guard em vez de `any`.
- `type` para objetos, `interface` para contratos extensíveis.

## 6. ESLint
```json
// .eslintrc (Next.js)
extends: ["next/core-web-vitals", "prettier"]
rules: { "no-console": ["warn"], "@typescript-eslint/no-unused-vars": ["error"] }
```
Rodar: `npx eslint .` ou `pnpm lint` (se script). Fix: `--fix`.

## 7. Prettier
`prettier-plugin-tailwindcss` ordena classes Tailwind automaticamente. Config via `prettier` em `package.json` ou `.prettierrc`. Rodar `npx prettier --write .`.

## 8. Regras de Código
- Nunca `console.log` em prod (usar `posthog` para logs).
- Nunca commitar `.env` ou token.
- `FormData` para `multipart`, não JSON.
- `ROUTES` para rotas, não hardcode `"/home"`.
- `errorCode` para branching, não `message`.

## 9. Boas Práticas
- Hooks retornam `{data,isLoading,error}` + `mutate`; services tipados; `ApiError.errorCode` branching.
- `Skeleton` para loading, `EmptyState` para vazio, `sonner` para toast.
- Acessibilidade: `aria-label`, contraste, foco.
- Performance: `memo` para charts, `staleTime` 30s Query, `minimumCacheTTL` 30d images.

Próximos: [Estrutura](estrutura.md) | [Git Workflow](git-workflow.md)
