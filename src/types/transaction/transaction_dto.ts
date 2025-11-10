export interface TransactionDTO {
  type: "income" | "expense";
  source?: string;
  amount: number;
  userId: string;
  description: string;
  transactionDate: string;
  category: {
    name: string;
  };
}
