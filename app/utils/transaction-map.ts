import type { TransactionDTO as ApiTransaction } from "@/types/dtos/transaction.dto";
import type { TransactionDTO } from "../types/dto/transaction.dto";
import type { TransactionCategory } from "../types/transaction";

export const TRANSACTION_CATEGORIES: readonly TransactionCategory[] = [
  "Levantamento",
  "Transporte",
  "Freelance",
  "Educação",
  "Salário",
  "Saúde",
  "Outros",
  "Alimentação",
  "Habitação",
  "Lazer",
  "Negócio",
  "Biscato",
];

export function getCategory(name?: string | null): TransactionCategory {
  return (
    TRANSACTION_CATEGORIES.find(
      (category) =>
        category.toLocaleLowerCase() === name?.trim().toLocaleLowerCase(),
    ) ?? "Outros"
  );
}

/** Transação da API → DTO de exibição usado nas telas. */
export function toAppTransaction(
  transaction: ApiTransaction,
  index: number,
): TransactionDTO {
  const categoryName = transaction.category?.name;
  return {
    id: transaction.id ?? `api-${index}-${transaction.createdAt ?? ""}`,
    title:
      transaction.description?.trim() ||
      categoryName ||
      (transaction.type === "INCOME" ? "Entrada" : "Despesa"),
    amount: transaction.amount,
    type: transaction.type === "INCOME" ? "income" : "expense",
    category: getCategory(categoryName),
    description: transaction.description ?? undefined,
    date: transaction.transactionDate ?? transaction.createdAt ?? "",
    transactionDate: transaction.transactionDate,
    createdAt: transaction.createdAt,
  };
}
