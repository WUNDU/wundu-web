import api from "@/lib/api";

type DocumentCountResponse = {
  totalDocuments?: number;
  total?: number;
};

const normalizeCount = (payload: number | DocumentCountResponse | unknown): number => {
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

export const DocumentService = {
  getTotalDocuments: async (): Promise<number> => {
    const { data } = await api.get<number | DocumentCountResponse>("/documents/count");
    return normalizeCount(data);
  },
};

export default DocumentService;
