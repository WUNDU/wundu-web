import api from "../shared/lib/api";
import type { TransactionDTO } from "../types/transaction/transaction_dto";
import { cache, CACHE_TAGS } from "../shared/lib/cache";

type DocumentUploadResponse = {
  documentId: string;
  status: string;
  message?: string;
};

type OcrExtractedData = {
  description?: string;
  amount?: number;
  transactionDate?: string;
  operationNumber?: string;
};

type OcrProcessResponse = {
  documentId: string;
  status: string;
  transactionId?: string;
  extractedData?: OcrExtractedData;
};

export type TransactionCompletionPayload = {
  description?: string;
  amount?: number;
  transactionDate?: string;
  operationNumber?: string;
  type?: "expense";
};

type CategorizationResponse = {
  transactionId: string;
  category?: string;
  confidence?: number;
  status: string;
};

export class ManualCompletionRequiredError extends Error {
  constructor(
    public readonly transactionId: string,
    public readonly defaults: TransactionCompletionPayload,
  ) {
    super("Manual completion required");
    this.name = "ManualCompletionRequiredError";
  }
}

export class DuplicateDocumentError extends Error {
  constructor(
    public readonly transaction: TransactionDTO,
    message?: string,
  ) {
    super(message ?? "Documento já registrado");
    this.name = "DuplicateDocumentError";
  }
}

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
        totalPages:
          typeof obj.totalPages === "number" ? obj.totalPages : undefined,
      };
    }
  }

  return { isPaginated: false };
};

const TRANSACTION_CACHE_KEY = `${CACHE_TAGS.TRANSACTIONS}:list`;
const TRANSACTION_CACHE_TTL = 60000; // 60 seconds

export const TransactionService = {
  add: async (data: TransactionDTO) => {
    try {
      const payload: TransactionDTO = {
        ...data,
        type: "expense",
      };
      const response = await api.post("/transactions", payload);
      // Invalidate transactions cache
      cache.invalidateByTag(CACHE_TAGS.TRANSACTIONS);
      return true;
    } catch (error) {
      const fallbackMessage =
        "Serviço temporariamente indisponível. Tente novamente em instantes.";
      const message =
        error instanceof Error &&
        error.message &&
        error.message !== "Internal Server Error"
          ? error.message
          : fallbackMessage;
      return false;
    }
  },

  get: async (options?: {
    bypassCache?: boolean;
  }): Promise<TransactionDTO[]> => {
    const bypassCache = options?.bypassCache ?? false;

    // Check cache first (unless bypassing)
    if (!bypassCache) {
      const cached = cache.get<TransactionDTO[]>(
        TRANSACTION_CACHE_KEY,
        TRANSACTION_CACHE_TTL,
      );
      if (cached !== null) {
        return cached;
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
            typeof meta.totalPages === "number"
              ? page + 1 >= meta.totalPages
              : false;

          if (noMoreItems || reachedLastFlag || reachedTotal) {
            shouldContinue = false;
          } else {
            page += 1;
          }
        }
      }

      // Store in cache
      cache.set(TRANSACTION_CACHE_KEY, aggregated);
      return aggregated;
    } catch (error) {
      const fallbackMessage =
        "Não foi possível conectar ao serviço agora. Tente novamente em instantes.";
      const message =
        error instanceof Error &&
        error.message &&
        error.message !== "Internal Server Error"
          ? error.message
          : fallbackMessage;
      throw new Error(message);
    }
  },

  uploadDocument: async (file: File, options?: { documentType?: string }) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.documentType) {
      formData.append("type", options.documentType);
    }

    const { data } = await api.post<DocumentUploadResponse>(
      "/documents/upload",
      formData,
    );
    return data;
  },

  processDocumentOcr: async (documentId: string) => {
    const { data } = await api.post<OcrProcessResponse>(
      `/ocr/process/${documentId}`,
    );
    return data;
  },

  completeTransaction: async (
    transactionId: string,
    payload: TransactionCompletionPayload,
  ) => {
    const { data } = await api.patch(
      `/transactions/${transactionId}/complete`,
      {
        ...payload,
        type: "expense",
      },
    );
    return data;
  },

  categorizeTransaction: async (transactionId: string) => {
    const { data } = await api.post<CategorizationResponse>(
      `/nlp/categorize/${transactionId}`,
    );
    return data;
  },

  processDocumentTransaction: async (
    file: File,
    options: {
      documentType?: string;
      completionOverrides?: TransactionCompletionPayload;
    } = {},
  ) => {
    const uploadResult = await TransactionService.uploadDocument(file, {
      documentType: options.documentType,
    });

    let ocrResult: OcrProcessResponse;
    try {
      ocrResult = await TransactionService.processDocumentOcr(
        uploadResult.documentId,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const isDuplicate = message.toLowerCase().includes("documento duplicado");

      if (isDuplicate) {
        const transactions = await TransactionService.get({
          bypassCache: true,
        });
        const duplicated = transactions.find((transaction) =>
          transaction.source?.includes(uploadResult.documentId),
        );

        if (duplicated) {
          throw new DuplicateDocumentError(duplicated, message);
        }
      }

      throw error;
    }
    let relatedTransaction: TransactionDTO | undefined;

    if (!ocrResult.transactionId) {
      const transactions = await TransactionService.get({ bypassCache: true });
      const pendingTransaction = transactions.find((transaction) =>
        transaction.source?.includes(uploadResult.documentId),
      );

      if (!pendingTransaction?.id) {
        throw new Error(
          "Não foi possível obter o identificador da transação após o processamento OCR.",
        );
      }

      ocrResult.transactionId = pendingTransaction.id;
      ocrResult.status = pendingTransaction.status ?? ocrResult.status;
      relatedTransaction = pendingTransaction;
    }

    if (!relatedTransaction) {
      const transactions = await TransactionService.get({ bypassCache: true });
      relatedTransaction = transactions.find(
        (transaction) => transaction.id === ocrResult.transactionId,
      );
    }

    const extracted = ocrResult.extractedData ?? {};
    const completionPayload: TransactionCompletionPayload = {
      description:
        options.completionOverrides?.description ??
        extracted.description ??
        relatedTransaction?.description ??
        relatedTransaction?.category?.name ??
        undefined,
      amount:
        options.completionOverrides?.amount ??
        extracted.amount ??
        relatedTransaction?.amount ??
        undefined,
      transactionDate:
        options.completionOverrides?.transactionDate ??
        extracted.transactionDate ??
        relatedTransaction?.transactionDate ??
        undefined,
      operationNumber:
        options.completionOverrides?.operationNumber ??
        extracted.operationNumber ??
        relatedTransaction?.operationNumber ??
        undefined,
      type: "expense",
    };

    if (
      completionPayload.description === undefined ||
      completionPayload.amount === undefined ||
      completionPayload.transactionDate === undefined
    ) {
      throw new ManualCompletionRequiredError(
        ocrResult.transactionId,
        completionPayload,
      );
    }

    await TransactionService.completeTransaction(
      ocrResult.transactionId,
      completionPayload,
    );

    const categorization = await TransactionService.categorizeTransaction(
      ocrResult.transactionId,
    );

    return {
      upload: uploadResult,
      ocr: ocrResult,
      categorization,
    };
  },

  finalizeManualTransaction: async (
    transactionId: string,
    payload: TransactionCompletionPayload,
  ) => {
    await TransactionService.completeTransaction(transactionId, {
      ...payload,
      type: "expense",
    });

    const categorization =
      await TransactionService.categorizeTransaction(transactionId);
    return categorization;
  },
};
