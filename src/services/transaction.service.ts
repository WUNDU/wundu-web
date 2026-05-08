import { apiClient } from "@/api/api";
import type {
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
  async add(data: TransactionDTO): Promise<boolean> {
    try {
      await apiClient.post("/transactions", data);
      return true;
    } catch {
      return false;
    }
  }

  async get(): Promise<TransactionDTO[]> {
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

  async getAll(page = 0, size = 20): Promise<Page<TransactionResponse>> {
    const { data } = await apiClient.get<Page<TransactionResponse>>("/transactions", { params: { page, size } });
    return data as Page<TransactionResponse>;
  }

  async getAllNotPaginated(): Promise<TransactionResponse[]> {
    const { data } = await apiClient.get<TransactionResponse[]>("/transactions/me");
    return Array.isArray(data) ? data : [];
  }

  async getById(id: string): Promise<TransactionResponse> {
    const { data } = await apiClient.get<TransactionResponse>(`/transactions/find/${id}`);
    return data;
  }

  async getFiltered(
    page = 0,
    size = 20,
    filters?: Record<string, any>,
  ): Promise<Page<TransactionResponse>> {
    const { data } = await apiClient.get<Page<TransactionResponse>>("/transactions/filters", {
      params: { page, size, ...filters },
    });
    return data as Page<TransactionResponse>;
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
}

export const transactionService = new TransactionService();
