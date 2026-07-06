export interface CategoryRequest {
  name: string;
  flow: "EXPENSE" | "INCOME";
}

export interface CategoryResponse {
  id: string;
  userId?: string | null;
  name: string;
  color?: string;
  flow: "EXPENSE" | "INCOME";
}

export type Category = CategoryResponse;
