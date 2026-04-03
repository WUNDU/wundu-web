import { CategoriesService } from "@/services/category.service";
import { create } from "zustand";
import type { Category } from "@/types/dtos/category.dto";
import { useUiStore } from "@/store/ui-store";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetch(): Promise<void>;
  clearAll(): void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  hasFetched: false,

  fetch: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true, error: null });
    try {
      const data = await CategoriesService.list();
      set({ categories: data, isLoading: false, hasFetched: true });
    } catch (error: any) {
      const err =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as categorias.";
      set({ error: err, isLoading: false });
      useUiStore.getState().showNotification("error", "Erro", err);
    }
  },

  clearAll: () => {
    set({ categories: [], isLoading: false, error: null, hasFetched: false });
  },
}));
