import api from "@/shared/lib/api";
import type { Category } from "@/shared/types/category";
import { withCache, CACHE_TAGS } from "@/shared/lib/cache";

const normalizeCategoriesResponse = (payload: unknown): Category[] => {
  if (Array.isArray(payload)) {
    return payload as Category[];
  }

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.content)) {
      return obj.content as Category[];
    }

    if (Array.isArray(obj.data)) {
      return obj.data as Category[];
    }
  }

  return [];
};

const fetchCategoriesList = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return normalizeCategoriesResponse(data);
};

export const CategoriesService = {
  async list(): Promise<Category[]> {
    return withCache(
      fetchCategoriesList,
      `${CACHE_TAGS.CATEGORIES}:list`,
      { ttl: 300000, tag: CACHE_TAGS.CATEGORIES }, // 5 minutes
    );
  },
};
