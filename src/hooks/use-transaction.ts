import { useTransactionStore } from "@/store/transaction-store";

export function useTransaction() {
  const { transactions, isLoading, isRefreshing, error, hasFetched, fetch, refresh, add, clearAll } =
    useTransactionStore();

  return {
    transactions,
    isLoading,
    isRefreshing,
    error,
    hasFetched,
    getTransactions: fetch,
    refreshTransactions: refresh,
    addTransaction: add,
    clearTransactions: clearAll,
  };
}
