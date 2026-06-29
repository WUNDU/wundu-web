import { useCallback, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import type { NonPaginatedQueryOptions } from "@/services/transaction.service";
import type { Page } from "@/types/dtos/common.dto";
import type {
  DefineCategoryRequest,
  TransactionDTO,
  TransactionPatchPayload,
  TransactionRequest,
  TransactionResponse,
  TransactionUpdateRequest,
} from "@/types/dtos/transaction.dto";
import { useUiStore } from "@/store/ui-store";

const PAGE_SIZE = 20;
const LIST_KEY = ["transactions", "list"] as const;
const rangeKey = (options?: NonPaginatedQueryOptions) =>
  ["transactions", "range", options?.startDate ?? "all", options?.endDate ?? "all"] as const;

const sortByDate = (items: TransactionDTO[]): TransactionDTO[] =>
  [...items].sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
    const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
    return dateB - dateA;
  });

const notify = (type: "success" | "error", title: string, message: string) =>
  useUiStore.getState().showNotification(type, title, message);

const errorMessage = (error: any, fallback: string) =>
  error instanceof Error ? error.message : fallback;

type ListData = InfiniteData<Page<TransactionResponse>>;

const patchListById = (old: ListData | undefined, id: string, updated: TransactionResponse): ListData | undefined => {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      content: page.content.map((t) => (t.id === id ? updated : t)),
    })),
  };
};

const removeFromList = (old: ListData | undefined, id: string): ListData | undefined => {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      content: page.content.filter((t) => t.id !== id),
    })),
  };
};

const prependToList = (old: ListData | undefined, created: TransactionResponse): ListData | undefined => {
  if (!old || old.pages.length === 0) return old;
  const [first, ...rest] = old.pages;
  return {
    ...old,
    pages: [
      { ...first, content: [created, ...first.content], totalElements: first.totalElements + 1 },
      ...rest,
    ],
  };
};

interface UseTransactionOptions {
  autoFetch?: boolean;
}

export function useTransaction({ autoFetch = true }: UseTransactionOptions = {}) {
  const queryClient = useQueryClient();
  const [rangeRequested, setRangeRequested] = useState(false);
  const [rangeOptions, setRangeOptions] = useState<NonPaginatedQueryOptions>({});

  const listQuery = useInfiniteQuery({
    queryKey: LIST_KEY,
    queryFn: ({ pageParam }) => transactionService.getAll(pageParam as number, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: autoFetch,
    // Hard ceiling against unbounded memory growth (e.g. a tab left open
    // scrolling for a long session) — drops the oldest page once exceeded.
    // 50 pages (1000 transactions) is far beyond any normal scroll session,
    // so this never engages in practice; it's a safety net, not a UX limit.
    maxPages: 50,
  });

  const rangeQuery = useQuery({
    queryKey: rangeKey(rangeOptions),
    queryFn: () => transactionService.getAllNotPaginated(rangeOptions),
    enabled: rangeRequested,
  });

  const pages = listQuery.data?.pages ?? [];
  const lastPage = pages[pages.length - 1];
  const allTransactions = listQuery.data ? pages.flatMap((p) => p.content) : null;
  const transactions = sortByDate((pages[0]?.content ?? []) as unknown as TransactionDTO[]);

  const invalidateRanges = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["transactions", "range"] }),
    [queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (payload: TransactionRequest) => transactionService.create(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<ListData>(LIST_KEY, (old) => prependToList(old, created));
      invalidateRanges();
      notify("success", "Transação registrada", "Transação registrada com sucesso!");
    },
    onError: (error: any) => notify("error", "Erro", errorMessage(error, "Erro ao salvar transação")),
  });

  const addMutation = useMutation({
    mutationFn: (data: TransactionDTO) => transactionService.add(data),
    onSuccess: (created) => {
      if (!created) {
        notify("error", "Erro ao adicionar", "Não foi possível concluir o registo.");
        return;
      }
      queryClient.setQueryData<ListData>(LIST_KEY, (old) =>
        prependToList(old, created as unknown as TransactionResponse),
      );
      invalidateRanges();
      notify("success", "Transação adicionada", "O movimento foi registado com sucesso.");
    },
    onError: () => notify("error", "Erro ao adicionar", "Não foi possível concluir o registo."),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TransactionUpdateRequest }) =>
      transactionService.complete(id, payload),
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData<ListData>(LIST_KEY, (old) => patchListById(old, id, updated));
      invalidateRanges();
      notify("success", "Transação atualizada", "Transação atualizada com sucesso!");
    },
    onError: (error: any) => notify("error", "Erro", errorMessage(error, "Erro ao atualizar transação")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TransactionPatchPayload }) =>
      transactionService.update(id, payload),
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData<ListData>(LIST_KEY, (old) => patchListById(old, id, updated));
      invalidateRanges();
      notify("success", "Transação actualizada", "Alterações guardadas com sucesso!");
    },
    onError: (error: any) => notify("error", "Erro", errorMessage(error, "Erro ao actualizar transação")),
  });

  const defineCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DefineCategoryRequest }) =>
      transactionService.defineCategory(id, payload),
    onSuccess: (updated, { id }) => {
      queryClient.setQueryData<ListData>(LIST_KEY, (old) => patchListById(old, id, updated));
      invalidateRanges();
      notify("success", "Categoria definida", "Categoria definida com sucesso!");
    },
    onError: (error: any) => notify("error", "Erro", errorMessage(error, "Erro ao categorizar transação")),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData<ListData>(LIST_KEY, (old) => removeFromList(old, id));
      invalidateRanges();
      notify("success", "Transação removida", "Transação removida com sucesso!");
    },
    onError: (error: any) => notify("error", "Erro", errorMessage(error, "Erro ao remover transação")),
  });

  const getTransactions = useCallback(() => listQuery.refetch(), [listQuery.refetch]);
  const refreshTransactions = useCallback(() => listQuery.refetch(), [listQuery.refetch]);

  const addTransaction = useCallback(
    (data: TransactionDTO) => addMutation.mutateAsync(data).then(() => true).catch(() => false),
    [addMutation.mutateAsync],
  );

  const clearTransactions = useCallback(
    () => queryClient.removeQueries({ queryKey: ["transactions"] }),
    [queryClient],
  );
  const clearAll = clearTransactions;

  const createTransaction = useCallback(
    (payload: TransactionRequest) => createMutation.mutateAsync(payload).then(() => true).catch(() => false),
    [createMutation.mutateAsync],
  );

  const completeTransaction = useCallback(
    (id: string, payload: TransactionUpdateRequest) =>
      completeMutation.mutateAsync({ id, payload }).then(() => true).catch(() => false),
    [completeMutation.mutateAsync],
  );

  const updateTransaction = useCallback(
    (id: string, payload: TransactionPatchPayload) =>
      updateMutation.mutateAsync({ id, payload }).then((r) => r).catch(() => null),
    [updateMutation.mutateAsync],
  );

  const defineCategoryTransaction = useCallback(
    (id: string, payload: DefineCategoryRequest) =>
      defineCategoryMutation.mutateAsync({ id, payload }).then(() => true).catch(() => false),
    [defineCategoryMutation.mutateAsync],
  );

  const removeTransaction = useCallback(
    (id: string) => removeMutation.mutateAsync(id).then(() => true).catch(() => false),
    [removeMutation.mutateAsync],
  );

  // Bails out to the SAME options reference when the range hasn't actually
  // changed — calling this from a render-triggered effect must not force a
  // new state value every time, or it loops forever (the query key is keyed
  // off the primitive start/end dates, not object identity, so this is safe).
  const getAllNotPaginated = useCallback(
    (options?: NonPaginatedQueryOptions) => {
      const normalized = options ?? {};
      setRangeOptions((prev) =>
        prev.startDate === normalized.startDate && prev.endDate === normalized.endDate ? prev : normalized,
      );
      setRangeRequested(true);
      return queryClient.fetchQuery({
        queryKey: rangeKey(options),
        queryFn: () => transactionService.getAllNotPaginated(options),
      });
    },
    [queryClient],
  );

  const loadPage = useCallback(
    (page: number, force = false) => {
      if (force) return queryClient.resetQueries({ queryKey: LIST_KEY });
      if (page === 0 && !listQuery.data) return listQuery.fetchNextPage();
      return Promise.resolve();
    },
    [queryClient, listQuery.data, listQuery.fetchNextPage],
  );

  const loadMore = useCallback(() => {
    if (listQuery.hasNextPage && !listQuery.isFetchingNextPage) return listQuery.fetchNextPage();
    return Promise.resolve();
  }, [listQuery.hasNextPage, listQuery.isFetchingNextPage, listQuery.fetchNextPage]);

  const resetPagination = useCallback(
    () => queryClient.removeQueries({ queryKey: LIST_KEY }),
    [queryClient],
  );

  return {
    transactions,
    notPaginated: rangeQuery.data ?? null,
    allTransactions,
    isLoading: listQuery.isLoading,
    isLoadingAll: rangeQuery.isLoading,
    isRefreshing: listQuery.isRefetching,
    isLoadingMore: listQuery.isFetchingNextPage,
    error: listQuery.error
      ? errorMessage(listQuery.error, "Erro ao carregar transações")
      : rangeQuery.error
        ? errorMessage(rangeQuery.error, "Erro ao carregar transações")
        : null,
    hasFetched: listQuery.isFetched,
    hasFetchedAll: rangeQuery.isFetched,
    currentPage: lastPage?.number ?? 0,
    totalPages: lastPage?.totalPages ?? 0,
    totalElements: lastPage?.totalElements ?? 0,
    isLastPage: lastPage?.last ?? false,

    getTransactions,
    refreshTransactions,
    addTransaction,
    clearTransactions,
    clearAll,
    createTransaction,
    completeTransaction,
    updateTransaction,
    defineCategoryTransaction,
    removeTransaction,
    getAllNotPaginated,
    loadPage,
    loadMore,
    resetPagination,
  };
}
