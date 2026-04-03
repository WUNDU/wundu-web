import { TransactionService } from "@/services/transaction.service";
import { create } from "zustand";
import type { TransactionDTO } from "@/types/dtos/transaction.dto";
import { useUiStore } from "@/store/ui-store";

interface TransactionState {
  transactions: TransactionDTO[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasFetched: boolean;

  fetch(): Promise<void>;
  refresh(): Promise<void>;
  add(data: TransactionDTO): Promise<boolean>;
  clearAll(): void;
}

const sortByDate = (items: TransactionDTO[]): TransactionDTO[] =>
  [...items].sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
    const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
    return dateB - dateA;
  });

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  hasFetched: false,

  fetch: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true, error: null });
    try {
      const data = await TransactionService.get();
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
      const data = await TransactionService.get();
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
    const success = await TransactionService.add(data);
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
    });
  },
}));
