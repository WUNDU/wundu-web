import { apiClient } from "@/api/api";
import type { UserCategoryLimitRequest, UserCategoryLimitResponse } from "@/types/dtos/limit.dto";

class LimitService {
  async define(payload: UserCategoryLimitRequest): Promise<UserCategoryLimitResponse> {
    const { data } = await apiClient.post<UserCategoryLimitResponse>("/limits", payload);
    return data;
  }

  async getByUserAndCategory(
    userId: string,
    categoryId: string,
  ): Promise<UserCategoryLimitResponse> {
    const { data } = await apiClient.get<UserCategoryLimitResponse>(`/limits/${userId}/${categoryId}`);
    return data;
  }
}

export const limitService = new LimitService();
