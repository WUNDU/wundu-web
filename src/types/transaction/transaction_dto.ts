export interface TransactionDTO {
  id?: string;
  type: "income" | "expense";
  source?: string;
  amount: number;
  userId: string;
  description?: string | null;
  status?: string;
  operationNumber?: string | null;
  transactionDate?: string;
  createdAt?: string;
  category?: {
    name?: string;
  } | null;
}
