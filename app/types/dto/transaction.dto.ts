import type { TransactionType, TransactionCategory } from "../transaction";

export interface TransactionDTO {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  date: string;
  transactionDate?: string;
  createdAt?: string;
}
