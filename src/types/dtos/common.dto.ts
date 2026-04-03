export interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

export interface ErrorMessage {
  path: string;
  method: string;
  status: number;
  statusText: string;
  message: string;
  errorCode: string;
  timestamp: string;
  erros?: Record<string, string>;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: { sorted: boolean; empty: boolean; unsorted: boolean };
  unpaged: boolean;
}

export interface Page<T> {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  size: number;
  content: T[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
