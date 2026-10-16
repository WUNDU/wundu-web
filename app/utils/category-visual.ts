import { MoneyIcon } from "@/constants/icons";
import { transactionCategoryConfig } from "../components/config/transaction-category-config";
import type { TransactionCategory } from "../types/transaction";

export type CategoryFlow = "INCOME" | "EXPENSE";

export type CategoryVisual = {
  icon: React.ComponentType<{ className?: string; width?: number }>;
  /** Cor do texto */
  color: string;
  /** Cor do ícone (por omissão usa `color`) */
  iconColor?: string;
  /** Fundo tintado */
  background: string;
  flow: CategoryFlow;
};

/**
 * Visual de uma categoria pelo nome.
 * - Nomes do catálogo estático → config registada.
 * - Nomes personalizados (criados na página de categorias) → fallback por
 *   fluxo, para continuarem seleccionáveis/exibíveis nos forms.
 */
export function categoryVisual(
  name: string,
  apiFlow?: CategoryFlow,
): CategoryVisual {
  const hit =
    transactionCategoryConfig[name.trim() as TransactionCategory];
  if (hit) {
    return {
      icon: hit.icon as CategoryVisual["icon"],
      color: hit.color,
      iconColor: hit.iconColor,
      background: hit.background,
      flow: hit.flow,
    };
  }
  const income = apiFlow === "INCOME";
  return {
    icon: MoneyIcon,
    color: income ? "text-success-text" : "text-danger-300",
    iconColor: income ? "text-success" : undefined,
    background: income ? "bg-success/10" : "bg-danger-300/10",
    flow: apiFlow ?? "EXPENSE",
  };
}

/** Fluxo de uma categoria pelo nome (catálogo estático ou lista da API). */
export function resolveCategoryFlow(
  name: string,
  apiCategories?: { name: string; flow: CategoryFlow }[],
): CategoryFlow | undefined {
  const hit =
    transactionCategoryConfig[name.trim() as TransactionCategory];
  if (hit) return hit.flow;
  return apiCategories?.find(
    (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase(),
  )?.flow;
}
