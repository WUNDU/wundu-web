/**
 * Case-insensitive transaction type helpers.
 * API may return "EXPENSE", "Expense", "expense" — all treated identically.
 */
export function isExpense(type?: string | null): boolean {
  return type?.toUpperCase() === "EXPENSE";
}

export function isIncome(type?: string | null): boolean {
  return type?.toUpperCase() === "INCOME";
}
