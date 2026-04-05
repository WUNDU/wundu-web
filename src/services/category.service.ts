import { apiClient } from "@/api/api";
import type { CategoryRequest, CategoryResponse } from "@/types/dtos/category.dto";
import type { Page, Pageable } from "@/types/dtos/common.dto";

const normalizeCategoriesResponse = (payload: unknown): CategoryResponse[] => {
  if (Array.isArray(payload)) return payload as CategoryResponse[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.content)) return obj.content as CategoryResponse[];
    if (Array.isArray(obj.data)) return obj.data as CategoryResponse[];
  }
  return [];
};

class CategoryService {
  async list(pageable?: Partial<Pageable>): Promise<Page<CategoryResponse>> {
    const { data } = await apiClient.get<Page<CategoryResponse>>("/categories", pageable ? { params: pageable } : undefined);
    return data;
  }

  async getActive(): Promise<CategoryResponse[]> {
    const { data } = await apiClient.get<CategoryResponse[]>("/categories/active");
    return normalizeCategoriesResponse(data);
  }

  async getById(id: string): Promise<CategoryResponse> {
    const { data } = await apiClient.get<CategoryResponse>(`/categories/${id}`);
    return data;
  }

  async create(payload: CategoryRequest): Promise<CategoryResponse> {
    const { data } = await apiClient.post<CategoryResponse>("/categories", payload);
    return data;
  }
}

export const categoryService = new CategoryService();
