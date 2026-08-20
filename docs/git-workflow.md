# Git Workflow — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

## 1. Branches
| Branch | Origem | Propósito | Protecção |
|--------|--------|-----------|-----------|
| `main` | `release` | Produção (deploy Netlify prod) | PR obrigatório + CI verde + 1 approval |
| `dev` | `main` | Integração contínua (base para features) | PR obrigatório |
| `demo` | `dev` | Staging para PO/QA (Netlify preview) | PR de `dev` |
| `release` | `demo` | Congelamento pré-prod | PR de `demo` |
| `feature/*` | `dev` | Nova funcionalidade | `feature/nome-curto-kebab` |
| `fix/*` | `dev` | Correção bug | `fix/transactions-500` |
| `hotfix/*` | `main` | Hotfix produção | `hotfix/urgent-ocr` |

> Observado: `wundu-web` usa `dev` como integração, `backend` usava `develop`. Padrão actual: `dev`.

## 2. Naming de Branches
- `feature/<kebab>`: `feature/chat-sse`, `feature/goal-progress`
- `fix/<kebab>`: `fix/middleware-redirect`
- `chore/<kebab>`: `chore/update-deps`
- `hotfix/<kebab>`: `hotfix/login-loop`
- Sem `camelCase`, sem prefixo pessoa, max 40 chars.

## 3. Conventional Commits
Formato observado misto PT/EN com emoji, mas recomendado **Conventional Commits** sem emoji para tooling:
```
<tipo>(escopo): descrição curta
```
Tipos: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`, `build`
Exemplos reais do repo:
- `✨ feat: receitas e categorias para receitas adicionadas` → `feat(transactions): adicionar receitas e categorias`
- `🐛 fix: correção no scroll da pagina de analise` → `fix(analytics): corrigir scroll`
- `📕 chore: ajuste no dashboard` → `chore(dashboard): ajuste layout`
- `♻️ refactor: refactoração no uso de zustand` → `refactor(store): migrar para zustand`

Regras: mensagem ≤72 chars, corpo explica `porquê`, footer `Closes #123`.

## 4. Pull Requests
**Criação:**
```bash
git checkout dev && git pull
git checkout -b feature/minha-feature
# ... commits
git push -u origin feature/minha-feature
# Abrir PR no GitHub: base `dev` ← compare `feature/minha-feature`
```
**Título:** `feat: adicionar filtro de transações` (ou com emoji se equipa preferir)
**Descrição template:**
```
## Contexto
## Mudanças
- ...
## Screenshots
## Como testar
## Checklist
- [ ] Testes manuais
- [ ] `pnpm build` passou
- [ ] Sem secrets
```

## 5. Code Review
- Toda PR precisa de review por ≥1 dev além do autor.
- Comentários por linha (`Request changes` vs `Approve`).
- Resolver conversas antes de merge; usar `Conversations → Resolve`.
- Foco: lógica, segurança (token, XSS), performance, tipagem.

## 6. Checklist de PR
- [ ] Branch a partir de `dev` e rebased (`git pull --rebase origin dev`)
- [ ] `npx tsc --noEmit` e `pnpm build` sem erro
- [ ] `pnpm lint` (se configurado) sem erro
- [ ] Sem `.env` ou secrets commitados
- [ ] DTOs tipados, sem `any` injustificado
- [ ] `ROUTES` usado, sem hardcode de rotas
- [ ] Screenshots para UI

## 7. Processo de Aprovação
1. Autor abre PR → assign reviewers.
2. Reviewers comentam (24h SLA).
3. Autor corrige → push → re-review.
4. CI verde (quando existir workflow) + 1 `Approve` → `Ready to merge`.
5. Autor faz squash ou maintainer faz merge (ver §8).

## 8. Processo de Merge
- **Padrão: Squash and merge** para histórico linear (`feature` → 1 commit em `dev`).
- **Merge commit** permitido para `dev→demo→release→main` para preservar histórico de ambiente.
- Nunca `Rebase and merge` em branches partilhadas sem coordenação.
- Nunca `git push -f` em `main/dev/demo/release`.
- Após merge `dev→demo`: QA em preview Netlify; após `demo→release`: freeze; após `release→main`: tag `vX.Y.Z` + deploy prod.

## Próximos
[Convenções](convencoes.md) | [Guia Local](guia-local.md)
