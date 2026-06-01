import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { transactionService } from "@/services/transaction.service";
import type { NonPaginatedQueryOptions } from "@/services/transaction.service";
import type {
  DefineCategoryRequest,
  TransactionDTO,
  TransactionPatchPayload,
  TransactionRequest,
  TransactionResponse,
  TransactionUpdateRequest,
} from "@/types/dtos/transaction.dto";
import { useUiStore } from "@/store/ui-store";

interface TransactionState {
  // Legacy flat list (used by existing home/financial screens)
  transactions: TransactionDTO[];
  isLoading: boolean;
  isLoadingAll: boolean; // separate flag for getAllNotPaginated — avoids blocking loadPage/fetch
  isRefreshing: boolean;
  error: string | null;
  hasFetched: boolean;

  // Paginated state (for full transaction list with load-more)
  allTransactions: TransactionResponse[] | null;
  notPaginated: TransactionResponse[] | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  isLoadingMore: boolean;
  isLastPage: boolean;
  hasFetchedAll: boolean;
  notPaginatedQueryKey: string | null;

  fetch(): Promise<void>;
  refresh(): Promise<void>;
  add(data: TransactionDTO): Promise<boolean>;
  clearAll(): void;

  // Paginated operations
  getAllNotPaginated(options?: NonPaginatedQueryOptions): Promise<void>;
  loadPage(page: number, force?: boolean): Promise<void>;
  loadMore(): Promise<void>;
  resetPagination(): void;

  // CRUD
  create(payload: TransactionRequest): Promise<boolean>;
  complete(id: string, payload: TransactionUpdateRequest): Promise<boolean>;
  update(id: string, payload: TransactionPatchPayload): Promise<TransactionResponse | null>;
  defineCategory(id: string, payload: DefineCategoryRequest): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}

const MAX_PERSISTED_TRANSACTIONS = 200;
const PAGE_SIZE = 20;

const sortByDate = (items: TransactionDTO[]): TransactionDTO[] =>
  [...items].sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
    const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
    return dateB - dateA;
  });

const patchList = <T extends { id?: string }>(
  list: T[] | null,
  id: string,
  updated: T,
): T[] | null => list?.map((t) => (t.id === id ? updated : t)) ?? null;

const filterList = <T extends { id?: string }>(
  list: T[] | null,
  id: string,
): T[] | null => list?.filter((t) => t.id !== id) ?? null;

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      isLoadingAll: false,
      isRefreshing: false,
      error: null,
      hasFetched: false,

      allTransactions: null,
      notPaginated: null,
      currentPage: 0,
      totalPages: 0,
      totalElements: 0,
      isLoadingMore: false,
      isLastPage: false,
      hasFetchedAll: false,
      notPaginatedQueryKey: null,

      fetch: async () => {
        if (get().hasFetched || get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const response = await transactionService.getAll(0, PAGE_SIZE);
          set({
            transactions: sortByDate(response.content as unknown as TransactionDTO[]),
            isLoading: false,
            hasFetched: true,
          });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar transações";
          set({ error: err, isLoading: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      refresh: async () => {
        if (get().isRefreshing) return;
        set({ isRefreshing: true, error: null });
        try {
          const response = await transactionService.getAll(0, PAGE_SIZE);
          set({
            transactions: sortByDate(response.content as unknown as TransactionDTO[]),
            isRefreshing: false,
            hasFetched: true,
          });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar transações";
          set({ error: err, isRefreshing: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      add: async (data) => {
        const created = await transactionService.add(data);
        if (created) {
          // Optimistic insert — no refresh(), no visible flash
          set((s) => ({
            transactions: sortByDate([created, ...s.transactions]),
            allTransactions: s.allTransactions
              ? [created as unknown as TransactionResponse, ...s.allTransactions]
              : null,
            totalElements: s.totalElements + 1,
            // Invalidate non-paginated cache so category/analytics pages refetch
            hasFetchedAll: false,
            notPaginatedQueryKey: null,
          }));
          useUiStore
            .getState()
            .showNotification(
              "success",
              "Transação adicionada",
              "O movimento foi registado com sucesso.",
            );
        } else {
          useUiStore
            .getState()
            .showNotification(
              "error",
              "Erro ao adicionar",
              "Não foi possível concluir o registo.",
            );
        }
        return !!created;
      },

      clearAll: () => {
        set({
          transactions: [],
          isLoading: false,
          isLoadingAll: false,
          isRefreshing: false,
          error: null,
          hasFetched: false,
          allTransactions: null,
          notPaginated: null,
          isLoadingMore: false,
          hasFetchedAll: false,
          notPaginatedQueryKey: null,
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          isLastPage: false,
        });
      },

      // ── Paginated / bulk fetches ─────────────────────────────────────────────

      getAllNotPaginated: async (options) => {
        const queryKey = `${options?.startDate ?? "all"}|${options?.endDate ?? "all"}`;
        const { hasFetchedAll, notPaginatedQueryKey, isLoadingAll, transactions, totalElements, hasFetched } = get();
        if (isLoadingAll) return;
        if (hasFetchedAll && queryKey === notPaginatedQueryKey) return;

        // Optimization: if we already have the first page and total items fit in it,
        // we have everything. No need for a fresh "bulk" fetch if no dates are requested
        // or if we can just filter locally.
        const isAllTime = !options?.startDate && !options?.endDate;
        if (hasFetched && totalElements <= PAGE_SIZE && isAllTime) {
          set({
            notPaginated: transactions as unknown as TransactionResponse[],
            hasFetchedAll: true,
            notPaginatedQueryKey: queryKey,
          });
          return;
        }

        set({
          isLoadingAll: true,
          ...(queryKey !== notPaginatedQueryKey ? { notPaginated: null, hasFetchedAll: false } : {}),
        });
        try {
          const data = await transactionService.getAllNotPaginated(options);
          set({
            notPaginated: data,
            isLoadingAll: false,
            hasFetchedAll: true,
            notPaginatedQueryKey: queryKey,
          });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar transações";
          set({ error: err, isLoadingAll: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      loadPage: async (page: number, force = false) => {
        const current = get();

        // Guard: skip if already loading (unless forcing a refresh)
        if (!force && (current.isLoading || current.isLoadingMore)) return;

        if (
          !force &&
          current.currentPage === page &&
          current.allTransactions !== null &&
          current.allTransactions.length > 0
        ) {
          return;
        }

        const isInitialPage = page === 0;
        // Silent refresh (force + page 0): keep existing list visible, use isRefreshing flag
        const isSilentRefresh = force && isInitialPage;

        set({
          isLoadingMore: !isSilentRefresh,
          isLoading: isInitialPage && !isSilentRefresh,
          isRefreshing: isSilentRefresh,
          error: null,
        });
        try {
          const response = await transactionService.getAll(page, PAGE_SIZE);
          set({
            allTransactions: response.content,
            transactions:
              page === 0
                ? sortByDate(response.content as unknown as TransactionDTO[])
                : get().transactions,
            currentPage: response.number,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
            isLastPage: response.last,
            isLoadingMore: false,
            isLoading: false,
            isRefreshing: false,
            hasFetched: page === 0 ? true : get().hasFetched,
          });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar transações";
          set({ error: err, isLoadingMore: false, isLoading: false, isRefreshing: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      loadMore: async () => {
        const { currentPage, isLastPage, isLoadingMore } = get();
        if (isLastPage || isLoadingMore) return;
        set({ isLoadingMore: true });
        try {
          const nextPage = currentPage + 1;
          const response = await transactionService.getAll(nextPage, PAGE_SIZE);
          set((s) => ({
            allTransactions: [...(s.allTransactions ?? []), ...response.content],
            currentPage: response.number,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
            isLastPage: response.last,
            isLoadingMore: false,
          }));
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar mais transações";
          set({ isLoadingMore: false, error: err });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      resetPagination: () => {
        set({
          allTransactions: null,
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          isLastPage: false,
          isLoadingMore: false,
          isLoading: false,
        });
      },

      // ── CRUD ─────────────────────────────────────────────────────────────────

      create: async (payload: TransactionRequest): Promise<boolean> => {
        try {
          const newTx = await transactionService.create(payload);
          set((s) => ({
            transactions: sortByDate([newTx as unknown as TransactionDTO, ...s.transactions]),
            allTransactions: s.allTransactions
              ? [newTx, ...s.allTransactions]
              : null,
            totalElements: s.totalElements + 1,
            // Invalidate non-paginated cache — date-range aware pages will refetch
            hasFetchedAll: false,
            notPaginatedQueryKey: null,
          }));
          useUiStore.getState().showNotification("success", "Transação registrada", "Transação registrada com sucesso!");
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao salvar transação";
          useUiStore.getState().showNotification("error", "Erro", err);
          return false;
        }
      },

      complete: async (id: string, payload: TransactionUpdateRequest): Promise<boolean> => {
        try {
          const updated = await transactionService.complete(id, payload);
          set((s) => ({
            transactions: sortByDate(
              patchList(s.transactions as unknown as TransactionResponse[], id, updated) as unknown as TransactionDTO[],
            ),
            allTransactions: patchList(s.allTransactions, id, updated),
            notPaginated: patchList(s.notPaginated, id, updated),
          }));
          useUiStore.getState().showNotification("success", "Transação atualizada", "Transação atualizada com sucesso!");
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao atualizar transação";
          useUiStore.getState().showNotification("error", "Erro", err);
          return false;
        }
      },

      update: async (id: string, payload: TransactionPatchPayload): Promise<TransactionResponse | null> => {
        try {
          const updated = await transactionService.update(id, payload);
          set((s) => ({
            transactions: sortByDate(
              patchList(
                s.transactions as unknown as TransactionResponse[],
                id,
                updated,
              ) as unknown as TransactionDTO[],
            ),
            allTransactions: patchList(s.allTransactions, id, updated),
            notPaginated: patchList(s.notPaginated, id, updated),
          }));
          useUiStore.getState().showNotification("success", "Transação actualizada", "Alterações guardadas com sucesso!");
          return updated;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao actualizar transação";
          useUiStore.getState().showNotification("error", "Erro", err);
          return null;
        }
      },

      defineCategory: async (id: string, payload: DefineCategoryRequest): Promise<boolean> => {
        try {
          const updated = await transactionService.defineCategory(id, payload);
          set((s) => ({
            transactions: sortByDate(
              patchList(s.transactions as unknown as TransactionResponse[], id, updated) as unknown as TransactionDTO[],
            ),
            allTransactions: patchList(s.allTransactions, id, updated),
            notPaginated: patchList(s.notPaginated, id, updated),
          }));
          useUiStore.getState().showNotification("success", "Categoria definida", "Categoria definida com sucesso!");
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao categorizar transação";
          useUiStore.getState().showNotification("error", "Erro", err);
          return false;
        }
      },

      remove: async (id: string): Promise<boolean> => {
        try {
          await transactionService.delete(id);
          set((s) => ({
            transactions: filterList(s.transactions as unknown as TransactionResponse[], id) as unknown as TransactionDTO[],
            allTransactions: filterList(s.allTransactions, id),
            notPaginated: filterList(s.notPaginated, id),
          }));
          useUiStore.getState().showNotification("success", "Transação removida", "Transação removida com sucesso!");
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao remover transação";
          useUiStore.getState().showNotification("error", "Erro", err);
          return false;
        }
      },
    }),
    {
      name: "wundu-transactions-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions.slice(0, MAX_PERSISTED_TRANSACTIONS),
        hasFetched: state.hasFetched,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.hasFetched = state.hasFetched && state.transactions.length > 0;
      },
    },
  ),
);
