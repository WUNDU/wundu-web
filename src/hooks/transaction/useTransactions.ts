import { useCallback, useEffect, useState } from "react";
import { TransactionService } from "@/services/TransactionService";
import type { TransactionDTO } from "@/types/transaction/transaction_dto";
import type { Document } from "@/types/button";

const mapTransactionToDocument = (
  transaction: TransactionDTO,
  index: number
): Document => {
  const fallbackName = `Transação ${index + 1}`;
  return {
    type: "transaction",
    name: transaction.description || transaction.category?.name || fallbackName,
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category?.name,
    timestamp: transaction.transactionDate,
    isIncome: transaction.type === "income",
  };
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent;
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await TransactionService.get();
        const sorted = [...data].sort((a, b) => {
          const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
          const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
          return dateB - dateA;
        });
        const mapped = sorted.map(mapTransactionToDocument);
        setTransactions(mapped);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar transações";
        setTransactions([]);
        setError(message);
      } finally {
        if (silent) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const refresh = useCallback(() => loadTransactions({ silent: true }), [loadTransactions]);

  return {
    transactions,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
};
