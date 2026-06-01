import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
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
  const {
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
    fetch,
    refresh,
    add,
    create,
    complete,
    update,
    defineCategory,
    remove,
    getAllNotPaginated,
    loadPage,
    loadMore,
    resetPagination,
    clearAll,
  } = useTransactionStore(
    useShallow((s) => ({
      transactions: s.transactions,
      notPaginated: s.notPaginated,
      allTransactions: s.allTransactions,
      isLoading: s.isLoading,
      isLoadingAll: s.isLoadingAll,
      isRefreshing: s.isRefreshing,
      isLoadingMore: s.isLoadingMore,
      error: s.error,
      hasFetched: s.hasFetched,
      hasFetchedAll: s.hasFetchedAll,
      currentPage: s.currentPage,
      totalPages: s.totalPages,
      totalElements: s.totalElements,
      isLastPage: s.isLastPage,
      fetch: s.fetch,
      refresh: s.refresh,
      add: s.add,
      create: s.create,
      complete: s.complete,
      update: s.update,
      defineCategory: s.defineCategory,
      remove: s.remove,
      getAllNotPaginated: s.getAllNotPaginated,
      loadPage: s.loadPage,
      loadMore: s.loadMore,
      resetPagination: s.resetPagination,
      clearAll: s.clearAll,
    })),
  );

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
