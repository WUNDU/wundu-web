import { useEffect } from "react";
import { useCategoryStore } from "@/store/category-store";
import type { CategoryRequest } from "@/types/dtos/category.dto";

export function useCategory() {
  const categories = useCategoryStore((s) => s.categories);
  const isLoading = useCategoryStore((s) => s.isLoading);
  const error = useCategoryStore((s) => s.error);
  const hasFetched = useCategoryStore((s) => s.hasFetched);
  const fetchActive = useCategoryStore((s) => s.fetchActive);
  const create = useCategoryStore((s) => s.create);
  const getById = useCategoryStore((s) => s.getById);
  const clearAll = useCategoryStore((s) => s.clearAll);

  useEffect(() => {
    if (!hasFetched) {
      fetchActive();
    }
  }, [hasFetched, fetchActive]);

  return {
    categories,
    isLoading,
    error,
    hasFetched,
    getCategories: fetchActive,
    fetchActive,
    clearCategories: clearAll,
    clearAll,
    createCategory: (payload: CategoryRequest) => create(payload),
    getCategoryById: (id: string) => getById(id),
  };
}
