export interface CategoryRequest {
  name: string;
}

export interface CategoryResponse {
  id: string;
  userId?: string | null;
  name: string;
  color?: string;
}

export type Category = CategoryResponse;
