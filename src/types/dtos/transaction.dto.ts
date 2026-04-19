import type { CategoryResponse } from "./category.dto";

export type TransactionSource = "PDF" | "IMG" | "OCR" | "GEMINI" | "MANUAL";

export type TransactionStatus =
  | "PENDING"
  | "CONFIRMED"
  | "NOT_RECOGNIZED"
  | "ERROR_OCR"
  | "AWAITING_USER_INPUT";

export interface TransactionRequest {
  type: "income" | "expense";
  source: TransactionSource;
  amount: number;
  description?: string;
  operationNumber?: string;
  transactionDate: string;
  status?: TransactionStatus;
  category?: CategoryRequest;
}

interface CategoryRequest {
  name: string;
}

export interface TransactionUpdateRequest {
  description: string;
  amount?: number;
  transactionDate?: string;
  operationNumber?: string;
}

export interface DefineCategoryRequest {
  description?: string;
  categoryName: string;
}

export interface TransactionResponse {
  id: string;
  type: "income" | "expense";
  source?: TransactionSource;
  amount: number;
  userId: string;
  description?: string | null;
  status: TransactionStatus;
  operationNumber?: string | null;
  transactionDate: string;
  createdAt: string;
  category?: CategoryResponse | null;
}

/** Flexible type used for both read and write operations */
export interface TransactionDTO {
  id?: string;
  type: "income" | "expense";
  source?: TransactionSource;
  amount: number;
  userId: string;
  description?: string | null;
  status?: TransactionStatus;
  operationNumber?: string | null;
  transactionDate?: string;
  createdAt?: string;
  category?: { name?: string } | null;
}

export interface TransactionQueryFilter {
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  categoryName?: string;
  type?: string;
}

export interface TransactionQueryResult {
  filter: TransactionQueryFilter;
  transactions: TransactionResponse[];
}

export interface TransactionFormData {
  type: "income" | "expense";
  source?: TransactionSource;
  amount: string;
  userId: string;
  description: string;
  transactionDate: string;
  category: string;
}

export type TransactionFormField = keyof TransactionFormData;
