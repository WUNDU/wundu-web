import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { categoryService } from "@/services/category.service";
import type { Category, CategoryRequest } from "@/types/dtos/category.dto";
import { useUiStore } from "@/store/ui-store";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetch(): Promise<void>;
  fetchActive(): Promise<void>;
  create(payload: CategoryRequest): Promise<Category | null>;
  getById(id: string): Promise<Category | null>;
  clearAll(): void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoading: false,
      error: null,
      hasFetched: false,

      fetch: async () => {
        if (get().hasFetched) return;
        return get().fetchActive();
      },

      fetchActive: async () => {
        if (get().hasFetched) return;
        set({ isLoading: true, error: null });
        try {
          const data = await categoryService.getActive();
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

      create: async (payload: CategoryRequest): Promise<Category | null> => {
        try {
          const newCategory = await categoryService.create(payload);
          set((s) => ({
            categories: [...s.categories, newCategory],
          }));
          useUiStore.getState().showNotification("success", "Categoria criada", "Categoria criada com sucesso!");
          return newCategory;
        } catch (error: any) {
          const err =
            error?.response?.status === 409
              ? "Categoria já existe"
              : error instanceof Error
                ? error.message
                : "Erro ao criar categoria";
          useUiStore.getState().showNotification("error", "Erro", err);
          return null;
        }
      },

      getById: async (id: string): Promise<Category | null> => {
        try {
          return await categoryService.getById(id);
        } catch (error: any) {
          const err = error instanceof Error ? error.message : "Categoria não encontrada";
          useUiStore.getState().showNotification("error", "Erro", err);
          return null;
        }
      },

      clearAll: () => {
        set({ categories: [], isLoading: false, error: null, hasFetched: false });
      },
    }),
    {
      name: "wundu-categories-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
      }),
    },
  ),
);
