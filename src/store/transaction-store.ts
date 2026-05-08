import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { transactionService } from "@/services/transaction.service";
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

  fetch(): Promise<void>;
  refresh(): Promise<void>;
  add(data: TransactionDTO): Promise<boolean>;
  clearAll(): void;

  // Paginated operations
  getAllNotPaginated(): Promise<void>;
  loadPage(page: number): Promise<void>;
  loadMore(): Promise<void>;
  resetPagination(): void;

  // CRUD
  create(payload: TransactionRequest): Promise<boolean>;
  complete(id: string, payload: TransactionUpdateRequest): Promise<boolean>;
  update(id: string, payload: TransactionPatchPayload): Promise<TransactionResponse | null>;
  defineCategory(id: string, payload: DefineCategoryRequest): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}

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

      fetch: async () => {
        if (get().hasFetched) return;
        set({ isLoading: true, error: null });
        try {
          const data = await transactionService.get();
          set({
            transactions: sortByDate(data),
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
        set({ isRefreshing: true, error: null });
        try {
          const data = await transactionService.get();
          set({
            transactions: sortByDate(data),
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
        const success = await transactionService.add(data);
        if (success) {
          await get().refresh();
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
        return success;
      },

      clearAll: () => {
        set({
          transactions: [],
          isLoading: false,
          isRefreshing: false,
          error: null,
          hasFetched: false,
          allTransactions: null,
          notPaginated: null,
          isLoadingMore: false,
          hasFetchedAll: false,
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          isLastPage: false,
        });
      },

      // ── Paginated / bulk fetches ─────────────────────────────────────────────

      getAllNotPaginated: async () => {
        if (get().hasFetchedAll) return;
        set({ isLoading: true });
        try {
          const data = await transactionService.getAllNotPaginated();
          set({ notPaginated: data, isLoading: false, hasFetchedAll: true });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar transações";
          set({ error: err, isLoading: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      loadPage: async (page: number) => {
        set({ isLoadingMore: true, error: null });
        try {
          const response = await transactionService.getAll(page, 20);
          set({
            allTransactions: response.content,
            currentPage: response.number,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
            isLastPage: response.last,
            isLoadingMore: false,
          });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar transações";
          set({ error: err, isLoadingMore: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      loadMore: async () => {
        const { currentPage, isLastPage, isLoadingMore } = get();
        if (isLastPage || isLoadingMore) return;
        set({ isLoadingMore: true });
        try {
          const nextPage = currentPage + 1;
          const response = await transactionService.getAll(nextPage, 20);
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
        });
      },

      // ── CRUD ─────────────────────────────────────────────────────────────────

      create: async (payload: TransactionRequest): Promise<boolean> => {
        try {
          const newTx = await transactionService.create(payload);
          set((s) => ({
            transactions: sortByDate([newTx as unknown as TransactionDTO, ...s.transactions]),
            notPaginated: s.notPaginated ? [newTx, ...s.notPaginated] : [newTx],
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
        transactions: state.transactions,
        notPaginated: state.notPaginated,
      }),
    },
  ),
);
