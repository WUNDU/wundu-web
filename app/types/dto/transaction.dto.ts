import type { TransactionType, TransactionCategory } from "../transaction";

export interface TransactionDTO {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  /** Origem na API: MANUAL | PDF | IMG | AUTOMATICO */
  source?: string;
  date: string;
  transactionDate?: string;
  createdAt?: string;
}
