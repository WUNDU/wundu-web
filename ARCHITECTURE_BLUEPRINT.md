# Arquitetura Real do Projeto (As-Built)

Este documento espelha a arquitetura que já está implementada no repositório hoje, com foco em:

- organização de diretórios,
- separação dos hooks customizáveis,
- fluxo real entre páginas, hooks, stores e services.

---

## 1) Organização de Diretórios (Real)

```txt
app/
   layout.tsx
   page.tsx
   not-found.tsx
   (public)/
      login/
         page.tsx
      register/
         page.tsx
   (dasboard)/
      layout.tsx
      dashboard/
         page.tsx
      backoffice/
         page.tsx
      categories/
         page.tsx
      products/
         page.tsx
      ingredients/
         page.tsx
      recipes/
         page.tsx
      stock/
         page.tsx
      pdv/
         page.tsx
      reports/
         page.tsx
      finances/
         page.tsx
      profile/
         page.tsx

src/
   api/
   components/
      layout/
      ui/
   config/
   contexts/
   hooks/
   services/
   store/
   types/
      dtos/
   utils/
```

Observações de estrutura:

- A separação principal está em `app` (rotas) e `src` (camadas de aplicação).
- O route group autenticado está hoje nomeado como `(dasboard)`.
- O código segue um modelo híbrido: organização técnica em `src` com padrão por domínio dentro de `hooks/services/store/types`.

---

## 2) Camadas Implementadas Hoje

### Roteamento e Shell

- `app/layout.tsx` define o shell raiz e injeta o layout cliente.
- `app/(public)` concentra telas sem sessão.
- `app/(dasboard)` concentra telas com sessão.

### Layout e Controle de Acesso

- `client-layout` faz bootstrap de sessão e hidratação inicial.
- `protected-page-wrapper` aplica proteção por autenticação e por role.
- `public-only-wrapper` impede acesso a telas públicas quando já autenticado.

### Infra HTTP e Configuração

- `config/env` valida variáveis de ambiente.
- `config/api-config` cria cliente HTTP com timeout, headers e `withCredentials`.
- `api/api` fornece wrapper genérico de requisições.

### Domínio de Dados

- `services` encapsula operações remotas por domínio.
- `store` mantém estado por domínio (Zustand).
- `hooks` orquestra fetch/mutation/cache/erro para consumo em UI.

### UI

- `components/ui` contém primitives reutilizáveis.
- páginas em `app/(dasboard)/*` montam experiência com hooks + store + componentes.

---

## 3) Separação dos Hooks Customizáveis

Os hooks estão organizados em 4 grupos funcionais:

### 3.1 Hooks de Sessão/Autenticação

Responsabilidade:

- acesso ao estado de autenticação,
- login/logout/registro,
- bootstrap de sessão no arranque.

Composição:

- hooks finos ligados ao `auth-store` e ao `auth-service`.

### 3.2 Hooks Transversais (Shared)

Responsabilidade:

- comportamento comum entre domínios.

Inclui:

- cache genérico com TTL + deduplicação de request em voo,
- toast/notificação,
- loading global via contexto.

### 3.3 Hooks de Domínio (Feature Hooks)

Responsabilidade:

- orquestrar uma entidade de negócio específica.

Padrão atual por domínio:

1. lê estado no store da feature,
2. usa service para API,
3. usa cache compartilhado quando aplicável,
4. expõe métodos de `get/save/update/delete` + estado (`data`, `isLoading`, `error`).

Domínios presentes hoje:

- categoria, produto, ingrediente, receita,
- vendas, receitas financeiras, despesas,
- estoque, tenant, backoffice, registro.

### 3.4 Hook de Orquestração entre Domínios

Responsabilidade:

- coordenar efeitos entre múltiplos domínios.

Exemplo do padrão atual:

- ao registrar movimento, invalida cache/estado de stock e produto para manter consistência.

---

## 4) Fluxo Real de Dados na Aplicação

## 4.1 Sessão no Arranque

1. shell cliente aguarda hidratação do estado persistido,
2. dispara bootstrap de autenticação,
3. consulta sessão atual no backend,
4. atualiza `auth-store` com user/estado de validação,
5. wrappers de rota permitem/negam navegação.

## 4.2 Leitura de uma Feature

1. página chama método de leitura no hook,
2. hook verifica cache local (TTL),
3. se necessário, chama service,
4. store da feature é atualizado,
5. UI lê dados renderizáveis.

## 4.3 Mutação de uma Feature

1. página chama método de mutação no hook,
2. hook envia comando ao service,
3. hook sincroniza store local ou força revalidação,
4. UI reflete o estado final + mensagens de erro/sucesso.

---

## 5) Padrão de Dependências (Como Está Hoje)

Padrão predominante:

`Page -> Hook -> Service -> API Client -> Backend`

`Hook <-> Store`

`Page -> UI Components`

Exceção atual (importante):

- algumas páginas também leem diretamente stores (além de hooks) para acesso a coleções locais.
- portanto, o projeto hoje é híbrido: “hook-driven” com pontos de leitura direta de store na UI.

---

## 6) Contrato Arquitetural por Domínio

Para replicar este mesmo modelo noutra base:

1. Criar DTOs/contratos de domínio.
2. Implementar service da feature (integração remota).
3. Implementar store da feature (estado + operações locais).
4. Implementar hook da feature (orquestração e cache).
5. Implementar página/fluxo de UI consumindo hook (e store quando necessário no modelo atual).

Resultado:

- consistência de implementação entre módulos,
- previsibilidade de manutenção,
- evolução gradual sem quebrar padrão já existente.

---

## 7) Regras para Manter Coerência com a Arquitetura Atual

- Toda nova feature deve nascer com `service + store + hook`.
- Regras de cache e deduplicação devem permanecer centralizadas em hook transversal.
- Controle de acesso deve continuar nos wrappers/layout de rota.
- Sessão deve continuar baseada em bootstrap + estado persistido + validação remota.
- Evitar chamadas HTTP diretas dentro de componentes de página.

---

## 8) Direção de Evolução (Sem Contrariar o As-Built)

Para reduzir acoplamento futuro, a evolução natural é:

- mover leitura direta de stores nas páginas para dentro dos hooks de domínio,
- manter páginas apenas com estado de interação e composição visual,
- padronizar todos os hooks com mesma assinatura de retorno.

Esta evolução é incremental e compatível com a base atual.
