export interface CategoryRequest {
  name: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  color?: string;
}

export type Category = CategoryResponse;
