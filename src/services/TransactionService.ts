import api from "../lib/api";
import type { TransactionDTO } from "../types/transaction/transaction_dto";

type PaginationMeta = {
  isPaginated: boolean;
  last?: boolean;
  totalPages?: number;
};

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

const extractPaginationMeta = (payload: unknown): PaginationMeta => {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const isPaginated =
      "pageable" in obj ||
      "totalPages" in obj ||
      "numberOfElements" in obj ||
      "last" in obj;

    if (isPaginated) {
      return {
        isPaginated: true,
        last: typeof obj.last === "boolean" ? obj.last : undefined,
        totalPages: typeof obj.totalPages === "number" ? obj.totalPages : undefined,
      };
    }
  }

  return { isPaginated: false };
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
      const fallbackMessage =
        "Serviço temporariamente indisponível. Tente novamente em instantes.";
      const message =
        error instanceof Error && error.message && error.message !== "Internal Server Error"
          ? error.message
          : fallbackMessage;
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
      const aggregated: TransactionDTO[] = [];
      let page = 0;
      let shouldContinue = true;

      while (shouldContinue) {
        const pageSuffix = page > 0 ? `?page=${page}` : "";
        const { data } = await api.get<
          | TransactionDTO[]
          | {
              data?: TransactionDTO[];
              content?: TransactionDTO[];
              last?: boolean;
              totalPages?: number;
            }
        >(`/transactions${pageSuffix}`);

        const items = normalizeTransactionsResponse(data);
        const meta = extractPaginationMeta(data);
        aggregated.push(...items);

        if (!meta.isPaginated) {
          shouldContinue = false;
        } else {
          const noMoreItems = items.length === 0;
          const reachedLastFlag = meta.last === true;
          const reachedTotal =
            typeof meta.totalPages === "number" ? page + 1 >= meta.totalPages : false;

          if (noMoreItems || reachedLastFlag || reachedTotal) {
            shouldContinue = false;
          } else {
            page += 1;
          }
        }
      }

      cachedTransactions = aggregated;
      cachedTransactionsTimestamp = Date.now();
      return cachedTransactions;
    } catch (error) {
      const fallbackMessage =
        "Não foi possível conectar ao serviço agora. Tente novamente em instantes.";
      const message =
        error instanceof Error && error.message && error.message !== "Internal Server Error"
          ? error.message
          : fallbackMessage;
      console.log("TransactionService.get error:", message);
      throw new Error(message);
    }
  },
};
