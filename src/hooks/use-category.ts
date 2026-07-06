import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useUiStore } from "@/store/ui-store";
import type { Category, CategoryRequest } from "@/types/dtos/category.dto";

const CATEGORIES_KEY = ["categories", "active"] as const;

const sortCategories = (cats: Category[]): Category[] =>
  [...cats].sort((a, b) => {
    if (a.name === "Outros") return 1;
    if (b.name === "Outros") return -1;
    return a.name.localeCompare(b.name, "pt");
  });

const fetchSortedCategories = async () => sortCategories(await categoryService.getActive());

export function useCategory() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetched, error } = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: fetchSortedCategories,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CategoryRequest) => categoryService.create(payload),
    onSuccess: (newCategory) => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old = []) =>
        sortCategories([...old, newCategory]),
      );
      useUiStore
        .getState()
        .showNotification("success", "Categoria criada", "Categoria criada com sucesso!");
    },
    onError: (error: any) => {
      // `apiClient`'s response interceptor throws a plain Error augmented
      // with `.status`/`.errorCode` (see src/api/api.ts) — not an axios
      // error, so `error.response.status` is always undefined here.
      if (error?.status === 409) {
        // Não é um erro do utilizador — a categoria já existe (default do
        // sistema ou já criada antes); `createCategory` resolve para a
        // existente nesse caso, então isto é só um aviso neutro.
        useUiStore
          .getState()
          .showNotification("info", "Já existe", "Essa categoria já existe — foi seleccionada.");
        return;
      }
      if (error?.status === 422) {
        useUiStore
          .getState()
          .showNotification("error", "Nome inválido", "Nome inválido (máx. 50 caracteres).");
        return;
      }
      const err = error instanceof Error ? error.message : "Erro ao criar categoria";
      useUiStore.getState().showNotification("error", "Erro", err);
    },
  });

  const getCategories = useCallback(
    () => queryClient.prefetchQuery({ queryKey: CATEGORIES_KEY, queryFn: fetchSortedCategories }),
    [queryClient],
  );
  const fetchActive = getCategories;

  const clearCategories = useCallback(
    () => queryClient.removeQueries({ queryKey: CATEGORIES_KEY }),
    [queryClient],
  );
  const clearAll = clearCategories;

  const createCategory = useCallback(
    async (payload: CategoryRequest) => {
      try {
        return await createMutation.mutateAsync(payload);
      } catch (error: any) {
        if (error?.status === 409) {
          // Já existe — devolve a categoria existente em vez de `null`, para
          // quem chamou poder seleccioná-la como se tivesse acabado de criar.
          const existing = queryClient
            .getQueryData<Category[]>(CATEGORIES_KEY)
            ?.find(
              (c) =>
                c.name.toLowerCase() === payload.name.toLowerCase() &&
                c.flow === payload.flow,
            );
          if (existing) return existing;
        }
        return null;
      }
    },
    [createMutation.mutateAsync, queryClient],
  );

  const getCategoryById = useCallback(
    (id: string) =>
      categoryService.getById(id).catch((error: any) => {
        const err = error instanceof Error ? error.message : "Categoria não encontrada";
        useUiStore.getState().showNotification("error", "Erro", err);
        return null;
      }),
    [],
  );

  return {
    categories: data ?? [],
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Não foi possível carregar as categorias.") : null,
    hasFetched: isFetched,
    getCategories,
    fetchActive,
    clearCategories,
    clearAll,
    createCategory,
    getCategoryById,
  };
}
