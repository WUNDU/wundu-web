import { apiClient } from "@/api/api";
import type { TransactionResponse } from "@/types/dtos/transaction.dto";

export interface AiQueryFilter {
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
  categoryName?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
  [key: string]: unknown;
}

export interface AiQueryResponse {
  filter: AiQueryFilter;
  transactions: TransactionResponse[];
}

class AiService {
  async query(question: string): Promise<AiQueryResponse> {
    const { data } = await apiClient.post<AiQueryResponse>("/ai/query", { question });
    return data;
  }
}

export const aiService = new AiService();
