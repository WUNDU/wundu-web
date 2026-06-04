import { apiClient } from "@/api/api";
import type {
  DocumentList,
  DocumentResult,
  DocumentStatus,
  UploadResponse,
} from "@/types/dtos/document.dto";

type DocStatus = "pending" | "processed" | "error" | "duplicate";

type DocumentCountResponse = {
  totalDocuments?: number;
  total?: number;
};

const normalizeCount = (
  payload: number | DocumentCountResponse | unknown,
): number => {
  if (typeof payload === "number") return payload;
  if (payload && typeof payload === "object") {
    const obj = payload as DocumentCountResponse;
    if (typeof obj.totalDocuments === "number") return obj.totalDocuments;
    if (typeof obj.total === "number") return obj.total;
  }
  return 0;
};

class DocumentService {
  async upload(file: FormData): Promise<UploadResponse> {
    const { data } = await apiClient.post<UploadResponse>("/documents/upload", file, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  async getAll(): Promise<DocumentList[]> {
    const { data } = await apiClient.get<DocumentList[]>("/documents");
    return data;
  }

  async getById(id: string): Promise<DocumentStatus> {
    const { data } = await apiClient.get<DocumentStatus>(`/documents/${id}`);
    return data;
  }

  async getByStatus(status: DocStatus): Promise<DocumentList[]> {
    const { data } = await apiClient.get<DocumentList[]>(`/documents/status/${status}`);
    return data;
  }

  async getCount(): Promise<number> {
    const { data } = await apiClient.get<number | DocumentCountResponse>("/documents/count");
    return normalizeCount(data);
  }

  async getTotalDocuments(): Promise<number> {
    return this.getCount();
  }

  async getResult(id: string): Promise<DocumentResult> {
    const { data } = await apiClient.get<DocumentResult>(`/documents/${id}/result`);
    return data;
  }

  async categorize(id: string, categoryId: string): Promise<void> {
    await apiClient.post(`/documents/${id}/categorize`, { categoryId });
  }

  async patchCategory(id: string, categoryId: string): Promise<void> {
    await apiClient.patch(`/documents/${id}/category`, { categoryId });
  }
}

export const documentService = new DocumentService();
