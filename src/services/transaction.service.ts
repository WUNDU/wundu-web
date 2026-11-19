import { apiClient } from "@/api/api";
import type {
  BalanceResponse,
  DefineCategoryRequest,
  TransactionDTO,
  TransactionPatchPayload,
  TransactionRequest,
  TransactionResponse,
  TransactionUpdateRequest,
} from "@/types/dtos/transaction.dto";
import type { Page } from "@/types/dtos/common.dto";

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
  type?: "INCOME" | "EXPENSE";
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

export interface NonPaginatedQueryOptions {
  startDate?: string;
  endDate?: string;
}

export type TotalsGranularity = "day" | "week" | "month" | "year";

export interface TotalsBucket {
  bucketStart: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface TotalsByPeriodResponse {
  granularity: string;
  periodStart: string;
  periodEnd: string;
  buckets: TotalsBucket[];
}

export interface SpendingBreakdownSlice {
  categoryName: string;
  total: number;
  percentage: number;
}

// Concorrência máxima do fan-out de páginas — evita picos de dezenas de
// pedidos simultâneos ao backend quando um intervalo tem muitas páginas.
const PAGE_FANOUT_LIMIT = 4;

async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, signal?: AbortSignal) => Promise<R>,
  signal?: AbortSignal,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        signal?.throwIfAborted();
        const index = next++;
        results[index] = await fn(items[index], signal);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

const normalizeTransactionsResponse = (payload: unknown): TransactionDTO[] => {
  if (Array.isArray(payload)) return payload as TransactionDTO[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as TransactionDTO[];
    if (Array.isArray(obj.content)) return obj.content as TransactionDTO[];
  }
  return [];
};

const extractPaginationMeta = (payload: unknown): PaginationMeta => {
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const isPaginated =
      "pageable" in obj || "totalPages" in obj || "last" in obj;
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

class TransactionService {
  async add(data: TransactionDTO): Promise<TransactionDTO | null> {
    try {
      const { data: created } = await apiClient.post<TransactionDTO>("/transactions", data);
      return created;
    } catch {
      return null;
    }
  }

  async get(): Promise<TransactionDTO[]> {
    try {
      const { data } = await apiClient.get<unknown>("/transactions/me");
      return normalizeTransactionsResponse(data);
    } catch {
      // fallback for environments where /transactions/me is unavailable
    }

    const aggregated: TransactionDTO[] = [];
    let page = 0;
    let shouldContinue = true;

    while (shouldContinue) {
      const pageSuffix = page > 0 ? `?page=${page}` : "";
      const { data } = await apiClient.get<unknown>(`/transactions${pageSuffix}`);
      const items = normalizeTransactionsResponse(data);
      const meta = extractPaginationMeta(data);
      aggregated.push(...items);

      if (!meta.isPaginated) {
        shouldContinue = false;
      } else {
        const done =
          items.length === 0 ||
          meta.last === true ||
          (typeof meta.totalPages === "number" &&
            page + 1 >= meta.totalPages);
        if (done) shouldContinue = false;
        else page += 1;
      }
    }

    return aggregated;
  }

  async uploadDocument(file: File, options?: { documentType?: string }): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.documentType) {
      formData.append("type", options.documentType);
    }

    const { data } = await apiClient.post<DocumentUploadResponse>(
      "/documents/upload",
      formData,
    );
    return data;
  }

  async processDocumentOcr(documentId: string): Promise<OcrProcessResponse> {
    const { data } = await apiClient.post<OcrProcessResponse>(
      `/ocr/process/${documentId}`,
    );
    return data;
  }

  async completeTransaction(
    transactionId: string,
    payload: TransactionCompletionPayload,
  ): Promise<void> {
    await apiClient.patch(
      `/transactions/${transactionId}/complete`,
      payload,
    );
  }

  async categorizeTransaction(transactionId: string): Promise<CategorizationResponse> {
    const { data } = await apiClient.post<CategorizationResponse>(
      `/nlp/categorize/${transactionId}`,
    );
    return data;
  }

  async processDocumentTransaction(
    file: File,
    options: {
      documentType?: string;
      completionOverrides?: TransactionCompletionPayload;
    } = {},
  ) {
    const uploadResult = await this.uploadDocument(file, {
      documentType: options.documentType,
    });

    let ocrResult: OcrProcessResponse;
    try {
      ocrResult = await this.processDocumentOcr(uploadResult.documentId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const isDuplicate = message.toLowerCase().includes("documento duplicado");

      if (isDuplicate) {
        const transactions = await this.get();
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
      const transactions = await this.get();
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
      const transactions = await this.get();
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
      type: "EXPENSE",
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

    await this.completeTransaction(
      ocrResult.transactionId,
      completionPayload,
    );

    const categorization = await this.categorizeTransaction(
      ocrResult.transactionId,
    );

    return {
      upload: uploadResult,
      ocr: ocrResult,
      categorization,
    };
  }

  async finalizeManualTransaction(
    transactionId: string,
    payload: TransactionCompletionPayload,
  ): Promise<CategorizationResponse> {
    await this.completeTransaction(transactionId, payload);

    const categorization = await this.categorizeTransaction(transactionId);
    return categorization;
  }

  // ── Methods from mobile API ─────────────────────────────────────────────────

  async getAll(page = 0, size = 20, signal?: AbortSignal): Promise<Page<TransactionResponse>> {
    // Listagem paginada pelo servidor (`GET /transactions/me` — a spec só
    // documenta `/me` e `/filters` para leitura; não existe listagem base
    // em `GET /transactions`). A UI faz "ver mais" página a página em vez
    // de descarregar o histórico todo.
    const { data } = await apiClient.get<Page<TransactionResponse>>("/transactions/me", {
      params: { page, size },
      signal,
    });
    return data as Page<TransactionResponse>;
  }

  async getAllNotPaginated(options?: NonPaginatedQueryOptions, signal?: AbortSignal): Promise<TransactionResponse[]> {
    if (!options?.startDate && !options?.endDate) {
      // `GET /transactions/me` é paginado (máx. 100/pág.) e pode devolver
      // array puro ou Page — percorre todas as páginas em vez de assumir array.
      // Só usar sem intervalo quando for mesmo preciso (exportações); as
      // telas devem preferir paginação no servidor ou agregados do backend.
      const aggregated: TransactionResponse[] = [];
      let page = 0;
      for (;;) {
        signal?.throwIfAborted();
        const { data } = await apiClient.get<unknown>("/transactions/me", {
          params: { page, size: 100 },
          signal,
        });
        const items = normalizeTransactionsResponse(data);
        aggregated.push(...(items as TransactionResponse[]));
        const meta = extractPaginationMeta(data);
        if (!meta.isPaginated) break;
        const done =
          items.length === 0 ||
          meta.last === true ||
          (typeof meta.totalPages === "number" && page + 1 >= meta.totalPages);
        if (done) break;
        page += 1;
      }
      return aggregated;
    }

    // 1. Fetch first page to get metadata (total pages)
    const firstPage = await this.getFiltered(0, 100, {
      startDate: options.startDate,
      endDate: options.endDate,
    }, signal);

    if (!firstPage.content.length || firstPage.last || firstPage.totalPages <= 1) {
      return firstPage.content;
    }

    // 2. Fetch remaining pages com concorrência limitada (antes: Promise.all
    // sem teto — N páginas simultâneas derrubavam o backend em contas
    // antigas) e canceláveis via signal.
    const remainingPageNumbers = Array.from(
      { length: firstPage.totalPages - 1 },
      (_, i) => i + 1,
    );

    const remainingPages = await mapWithLimit(
      remainingPageNumbers,
      PAGE_FANOUT_LIMIT,
      (page, pageSignal) =>
        this.getFiltered(page, 100, {
          startDate: options.startDate,
          endDate: options.endDate,
        }, pageSignal),
      signal,
    );

    // 3. Aggregate all results
    const aggregated = [...firstPage.content];
    remainingPages.forEach((page) => {
      aggregated.push(...page.content);
    });

    return aggregated;
  }

  async getById(id: string): Promise<TransactionResponse> {
    const { data } = await apiClient.get<TransactionResponse>(`/transactions/find/${id}`);
    return data;
  }

  async getFiltered(
    page = 0,
    size = 20,
    filters?: Record<string, any>,
    signal?: AbortSignal,
  ): Promise<Page<TransactionResponse>> {
    const { data } = await apiClient.get<Page<TransactionResponse>>("/transactions/filters", {
      params: { page, size, ...filters },
      signal,
    });
    return data as Page<TransactionResponse>;
  }

  async getTotalsByPeriod(
    granularity: TotalsGranularity = "month",
    from?: string,
    to?: string,
    signal?: AbortSignal,
  ): Promise<TotalsByPeriodResponse> {
    // Agregado no servidor: sem from/to devolve os últimos 12 buckets
    // completos — ideal para o gráfico de 12 meses sem descarregar nada.
    const { data } = await apiClient.get<TotalsByPeriodResponse>(
      "/transactions/totals-by-period",
      { params: { granularity, ...(from ? { from } : {}), ...(to ? { to } : {}) }, signal },
    );
    const buckets = Array.isArray((data as TotalsByPeriodResponse)?.buckets)
      ? (data as TotalsByPeriodResponse).buckets
      : [];
    return { ...(data as TotalsByPeriodResponse), buckets };
  }

  async getSpendingBreakdown(
    period = "1M",
    signal?: AbortSignal,
  ): Promise<SpendingBreakdownSlice[]> {
    const { data } = await apiClient.get<unknown>(
      "/transactions/spending-breakdown",
      { params: { period }, signal },
    );
    if (Array.isArray(data)) return data as SpendingBreakdownSlice[];
    if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
      return (data as { data: SpendingBreakdownSlice[] }).data;
    }
    return [];
  }

  async getByCategory(categoryId: string): Promise<TransactionResponse[]> {
    const { data } = await apiClient.get<TransactionResponse[]>(`/transactions/category/${categoryId}`);
    return Array.isArray(data) ? data : [];
  }

  async getAwaitingInput(): Promise<TransactionResponse[]> {
    const { data } = await apiClient.get<TransactionResponse[]>("/transactions/awaiting-input");
    return Array.isArray(data) ? data : [];
  }

  async getIncompleteCount(): Promise<Record<string, number>> {
    const { data } = await apiClient.get<Record<string, number>>("/transactions/incomplete-count");
    return data;
  }

  async getBalance(from?: string, to?: string): Promise<BalanceResponse> {
    const { data } = await apiClient.get<BalanceResponse>("/transactions/balance", {
      params: { from, to },
    });
    return data;
  }

  async create(payload: TransactionRequest): Promise<TransactionResponse> {
    const { data } = await apiClient.post<TransactionResponse>("/transactions", payload);
    return data;
  }

  async complete(id: string, payload: TransactionUpdateRequest): Promise<TransactionResponse> {
    const { data } = await apiClient.patch<TransactionResponse>(`/transactions/${id}/complete`, payload);
    return data;
  }

  async defineCategory(id: string, payload: DefineCategoryRequest): Promise<TransactionResponse> {
    const { data } = await apiClient.put<TransactionResponse>(`/transactions/${id}/define-category`, payload);
    return data;
  }

  async update(id: string, payload: TransactionPatchPayload): Promise<TransactionResponse> {
    const { data } = await apiClient.patch<TransactionResponse>(`/transactions/${id}`, payload);
    return data;
  }

  async updateCategory(id: string, categoryId: string): Promise<TransactionResponse> {
    const { data } = await apiClient.patch<TransactionResponse>(`/transactions/${id}/category`, { categoryId });
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  }

  async getByStatus(status: string): Promise<{ count: number; transactions: TransactionResponse[] }> {
    const { data } = await apiClient.get<{ count: number; transactions: TransactionResponse[] }>(
      `/transactions/by-status/${status}`,
    );
    return data;
  }

  async getBySource(source: string): Promise<{ count: number; transactions: TransactionResponse[] }> {
    const { data } = await apiClient.get<{ count: number; transactions: TransactionResponse[] }>(
      `/transactions/by-source/${source}`,
    );
    return data;
  }
}

export const transactionService = new TransactionService();
