import { useCategoryStore } from "@/store/category-store";

export function useCategory() {
  const { categories, isLoading, error, hasFetched, fetch, clearAll } =
    useCategoryStore();

  return {
    categories,
    isLoading,
    error,
    hasFetched,
    getCategories: fetch,
    clearCategories: clearAll,
  };
}
