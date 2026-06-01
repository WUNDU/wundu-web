import { useEffect } from "react";
import { useTransactionStore } from "@/store/transaction-store";
import type { NonPaginatedQueryOptions } from "@/services/transaction.service";
import type {
  DefineCategoryRequest,
  TransactionPatchPayload,
  TransactionRequest,
  TransactionUpdateRequest,
} from "@/types/dtos/transaction.dto";

interface UseTransactionOptions {
  autoFetch?: boolean;
}

export function useTransaction({ autoFetch = true }: UseTransactionOptions = {}) {
  const transactions = useTransactionStore((s) => s.transactions);
  const notPaginated = useTransactionStore((s) => s.notPaginated);
  const allTransactions = useTransactionStore((s) => s.allTransactions);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const isLoadingAll = useTransactionStore((s) => s.isLoadingAll);
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
  const update = useTransactionStore((s) => s.update);
  const defineCategory = useTransactionStore((s) => s.defineCategory);
  const remove = useTransactionStore((s) => s.remove);
  const getAllNotPaginated = useTransactionStore((s) => s.getAllNotPaginated);
  const loadPage = useTransactionStore((s) => s.loadPage);
  const loadMore = useTransactionStore((s) => s.loadMore);
  const resetPagination = useTransactionStore((s) => s.resetPagination);
  const clearAll = useTransactionStore((s) => s.clearAll);

  useEffect(() => {
    if (autoFetch && !hasFetched) {
      fetch();
    }
  }, [autoFetch, hasFetched, fetch]);

  return {
    transactions,
    notPaginated,
    allTransactions,
    isLoading,
    isLoadingAll,
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
    updateTransaction: (id: string, payload: TransactionPatchPayload) => update(id, payload),
    defineCategoryTransaction: (id: string, payload: DefineCategoryRequest) => defineCategory(id, payload),
    removeTransaction: (id: string) => remove(id),
    getAllNotPaginated: (options?: NonPaginatedQueryOptions) => getAllNotPaginated(options),
    loadPage,
    loadMore,
    resetPagination,
  };
}
