import api from "../lib/api";
import type { TransactionDTO } from "../types/transaction/transaction_dto";

const normalizeTransactionsResponse = (payload: unknown): TransactionDTO[] => {
  if (Array.isArray(payload)) {
    return payload as TransactionDTO[];
  }
  if (payload && typeof payload === "object") {
    const candidate = (payload as Record<string, unknown>).data;
    if (Array.isArray(candidate)) {
      return candidate as TransactionDTO[];
    }
    const content = (payload as Record<string, unknown>).content;
    if (Array.isArray(content)) {
      return content as TransactionDTO[];
    }
  }
  return [];
};

let cachedTransactions: TransactionDTO[] | null = null;
let cachedTransactionsTimestamp: number | null = null;
const TRANSACTION_CACHE_TTL_MS = 60 * 1000;

export const TransactionService = {
  add: async (data: TransactionDTO) => {
    try {
      console.log(data);
      const response = await api.post("/transactions", data);
      cachedTransactions = null;
      cachedTransactionsTimestamp = null;
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save transaction";
      console.log("TransactionService.add error:", message);
      return false;
    }
  },

  get: async (): Promise<TransactionDTO[]> => {
    if (cachedTransactions && cachedTransactionsTimestamp) {
      const now = Date.now();
      if (now - cachedTransactionsTimestamp < TRANSACTION_CACHE_TTL_MS) {
        return cachedTransactions;
      }
    }
    try {
      const { data } = await api.get<TransactionDTO[] | { data?: TransactionDTO[]; content?: TransactionDTO[] }>("/transactions");
      const normalized = normalizeTransactionsResponse(data);
      cachedTransactions = normalized;
      cachedTransactionsTimestamp = Date.now();
      return cachedTransactions;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get transaction";
      console.log("TransactionService.get error:", message);
      throw new Error(message);
    }
  },
};
