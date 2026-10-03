import type { TransactionCategory } from "../../types/transaction";

export type CategoryBadge = "system" | "custom";

/**
 * Categoria para exibição — montada a partir da API
 * (`CategoryResponse`) + estatísticas das transações reais.
 */
export interface CategoryDTO {
  id: string;
  name: string;
  /** Chave para ícone/cor (config de categorias) e filtros. */
  configKey: TransactionCategory;
  /** Fluxo da categoria na API. */
  flow: "EXPENSE" | "INCOME";
  /** Nº de transações reais com esta categoria. */
  transactions: number;
  /** Soma dos valores reais com esta categoria. */
  spent: number;
  /** Limite mensal da API (`GET /limits/:id`); null = sem limite. */
  limit?: number | null;
  /** "system" = categoria global (userId nulo); "custom" = do utilizador. */
  badge: CategoryBadge;
}
