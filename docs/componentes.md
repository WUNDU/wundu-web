# Componentes Reutilizáveis — WEB

> [← Voltar ao índice](README.md) | [README principal](../README.md)

63 componentes em `src/components`.

## Listar Componentes Reutilizáveis
`ui/button`, `ui/input`, `ui/text-input`, `ui/select`, `ui/category-select`, `ui/tab`, `ui/modal-content`, `ui/edit-modal`, `ui/loading-spinner`, `ui/message`, `ui/tutorial-overlay`, `ui/hero-section`, `ui/icon`, `ui/transaction`, `layout/navbar`, `layout/sidebar`, `layout/sidebar-right`, `layout/header`, `layout/top-bar`, `layout/footer`, `layout/landing-header`, `layout/cookie-consent`, `financial/balance-card`, `financial/category-expense-card`, `financial/consumption-meter-card`, `financial/financial-progress-card`, `goals/goal-row`, `goals/new-goal-modal`, `goals/ring`, `home/upload-section`, `home/add-transaction-modal`, `home/manual-transaction-modal`, `home/ocr-status-modal`, `charts/bar-chart`, `charts/line-chart`, `charts/pie-chart`, `transactions/transaction-item`, `transactions/filter-modal`, `profile/edit-profile-modal`...

## Descrever Cada Componente
| Componente | Finalidade |
|------------|------------|
| `Button` | Ação primária/secundária com loading |
| `Input` | Campo com label e erro |
| `Select` | Dropdown tipado |
| `BalanceCard` | Exibe saldo + tendência |
| `GoalRow` | Linha de objectivo com `Ring` |
| `UploadSection` | Drag&drop OCR |
| `BarChart` | Gráfico barras (chart.js) |

## Documentar Props
```ts
// Button
type ButtonProps = { variant?: "primary"|"outline"|"ghost"; size?: "sm"|"md"|"lg"; isLoading?: boolean; disabled?: boolean; onClick?:()=>void; children: ReactNode; type?: "button"|"submit" };
// Input
type InputProps = { label?: string; error?: string; placeholder?: string; value: string; onChange:(v:string)=>void; type?: string; disabled?: boolean };
// BalanceCard
type BalanceCardProps = { balance: number; trend: number; currency?: string; onClick?:()=>void };
// GoalRow
type GoalRowProps = { goal: GoalResponse; onEdit:(id:string)=>void; onDelete:(id:string)=>void };
```

## Documentar Events
| Componente | Evento | Quando dispara |
|------------|--------|----------------|
| `Button` | `onClick` | Clique |
| `Input` | `onChange` | Digitação |
| `Select` | `onChange` | Seleção |
| `Modal` | `onClose` | Fechar (ESC, overlay) |
| `GoalRow` | `onEdit`/`onDelete` | Ações |
| `UploadSection` | `onUpload` | Arquivo selecionado |

## Documentar States
| Componente | State | Descrição |
|------------|-------|-----------|
| `Button` | `isLoading` | Mostra Spinner, desabilita |
| `Input` | `error` | Borda vermelha + mensagem |
| `Modal` | `isOpen` | Controla visibilidade |
| `GoalRow` | `isDeleting` | Loading na ação |
| `UploadSection` | `isUploading` | Progresso |

## Documentar Dependências
- `tailwind-merge` + `clsx` (`cn`), `class-variance-authority` (variantes), `lucide-react` (ícones), `framer-motion` (animações), `chart.js` (gráficos), `sonner` (toast).

## Documentar Regras de Utilização
- Importar via `@/components/ui` barrel, não relativo profundo.
- Props tipadas, sem `any`.
- Usar `cva` + `cn` para variantes.
- Novo genérico → `ui/`; domínio → `financial/`/`goals/` etc.

## Adicionar Exemplos de Utilização
```tsx
import { Button, Input, Select } from "@/components/ui";
import { BalanceCard } from "@/components/financial";
import { GoalRow } from "@/components/goals";

<Button variant="primary" isLoading={saving} onClick={save}>Salvar</Button>
<Input label="Email" value={email} onChange={setEmail} error={errors.email} />
<Select options={categories} value={cat} onChange={setCat} placeholder="Categoria" />
<BalanceCard balance={1234.56} trend={+5.2} />
<GoalRow goal={goal} onEdit={openEdit} onDelete={confirmDelete} />
```

Próximos: [Estrutura](estrutura.md)
