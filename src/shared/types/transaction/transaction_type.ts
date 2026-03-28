export interface TransactionFormData {
  type: "income" | "expense";
  source?: string;
  amount: string;
  userId: string;
  description: string;
  transactionDate: string;
  category: string;
}

export type TransactionFormField = keyof TransactionFormData;
