export interface UserCategoryLimitRequest {
  categoryId: string;
  monthlyLimit: number;
}

export interface UserCategoryLimitResponse {
  id: string;
  userId: string;
  categoryId: string;
  monthlyLimit: number;
}
