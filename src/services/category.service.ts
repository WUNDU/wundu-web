import { api } from "@/api/api";
import type { Category } from "@/types/dtos/category.dto";

const normalizeCategoriesResponse = (payload: unknown): Category[] => {
  if (Array.isArray(payload)) return payload as Category[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.content)) return obj.content as Category[];
    if (Array.isArray(obj.data)) return obj.data as Category[];
  }
  return [];
};

export const CategoriesService = {
  async list(): Promise<Category[]> {
    const { data } = await api.get("/categories");
    return normalizeCategoriesResponse(data);
  },
};
