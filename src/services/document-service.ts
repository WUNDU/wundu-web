import api from "@/shared/lib/api";

type DocumentCountResponse = {
  totalDocuments?: number;
  total?: number;
};

const DOCUMENT_COUNT_TTL_MS = 60 * 1000;
let cachedDocumentCount: number | null = null;
let cachedDocumentCountTimestamp: number | null = null;

const normalizeCount = (
  payload: number | DocumentCountResponse | unknown,
): number => {
  if (typeof payload === "number") {
    return payload;
  }
  if (payload && typeof payload === "object") {
    const obj = payload as DocumentCountResponse;
    if (typeof obj.totalDocuments === "number") {
      return obj.totalDocuments;
    }
    if (typeof obj.total === "number") {
      return obj.total;
    }
  }
  return 0;
};

const shouldUseCache = () => {
  if (cachedDocumentCount === null || cachedDocumentCountTimestamp === null) {
    return false;
  }
  const now = Date.now();
  return now - cachedDocumentCountTimestamp < DOCUMENT_COUNT_TTL_MS;
};

export const DocumentService = {
  getTotalDocuments: async (options?: {
    bypassCache?: boolean;
  }): Promise<number> => {
    if (!options?.bypassCache && shouldUseCache()) {
      return cachedDocumentCount ?? 0;
    }

    const { data } = await api.get<number | DocumentCountResponse>(
      "/documents/count",
    );
    const normalized = normalizeCount(data);

    cachedDocumentCount = normalized;
    cachedDocumentCountTimestamp = Date.now();

    return normalized;
  },

  clearCache: () => {
    cachedDocumentCount = null;
    cachedDocumentCountTimestamp = null;
  },
};

export default DocumentService;
