import { useEffect } from "react";
import { useTransactionStore } from "@/store/transaction-store";
import type {
  DefineCategoryRequest,
  TransactionRequest,
  TransactionUpdateRequest,
} from "@/types/dtos/transaction.dto";

export function useTransaction() {
  const transactions = useTransactionStore((s) => s.transactions);
  const notPaginated = useTransactionStore((s) => s.notPaginated);
  const allTransactions = useTransactionStore((s) => s.allTransactions);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const isRefreshing = useTransactionStore((s) => s.isRefreshing);
  const isLoadingMore = useTransactionStore((s) => s.isLoadingMore);
  const error = useTransactionStore((s) => s.error);
  const hasFetched = useTransactionStore((s) => s.hasFetched);
  const hasFetchedAll = useTransactionStore((s) => s.hasFetchedAll);
  const currentPage = useTransactionStore((s) => s.currentPage);
  const totalPages = useTransactionStore((s) => s.totalPages);
  const totalElements = useTransactionStore((s) => s.totalElements);
  const isLastPage = useTransactionStore((s) => s.isLastPage);
  const fetch = useTransactionStore((s) => s.fetch);
  const refresh = useTransactionStore((s) => s.refresh);
  const add = useTransactionStore((s) => s.add);
  const create = useTransactionStore((s) => s.create);
  const complete = useTransactionStore((s) => s.complete);
  const defineCategory = useTransactionStore((s) => s.defineCategory);
  const remove = useTransactionStore((s) => s.remove);
  const getAllNotPaginated = useTransactionStore((s) => s.getAllNotPaginated);
  const loadPage = useTransactionStore((s) => s.loadPage);
  const loadMore = useTransactionStore((s) => s.loadMore);
  const resetPagination = useTransactionStore((s) => s.resetPagination);
  const clearAll = useTransactionStore((s) => s.clearAll);

  useEffect(() => {
    if (!hasFetched) {
      fetch();
    }
  }, [hasFetched, fetch]);

  return {
    transactions,
    notPaginated,
    allTransactions,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasFetched,
    hasFetchedAll,
    currentPage,
    totalPages,
    totalElements,
    isLastPage,
    getTransactions: fetch,
    refreshTransactions: refresh,
    addTransaction: add,
    clearTransactions: clearAll,
    clearAll,
    createTransaction: (payload: TransactionRequest) => create(payload),
    completeTransaction: (id: string, payload: TransactionUpdateRequest) => complete(id, payload),
    defineCategoryTransaction: (id: string, payload: DefineCategoryRequest) => defineCategory(id, payload),
    removeTransaction: (id: string) => remove(id),
    getAllNotPaginated,
    loadPage,
    loadMore,
    resetPagination,
  };
}
