import { useDocumentStore } from "@/store/document-store";
import type { UploadResponse } from "@/types/dtos/document.dto";

type DocStatus = "pending" | "processed" | "error" | "duplicate";

export function useDocument() {
  const documents = useDocumentStore((s) => s.documents);
  const selectedDocument = useDocumentStore((s) => s.selectedDocument);
  const documentResult = useDocumentStore((s) => s.documentResult);
  const isUploading = useDocumentStore((s) => s.isUploading);
  const isLoading = useDocumentStore((s) => s.isLoading);
  const error = useDocumentStore((s) => s.error);
  const hasFetched = useDocumentStore((s) => s.hasFetched);
  const count = useDocumentStore((s) => s.count);
  const upload = useDocumentStore((s) => s.upload);
  const fetchAll = useDocumentStore((s) => s.fetchAll);
  const fetchById = useDocumentStore((s) => s.fetchById);
  const fetchByStatus = useDocumentStore((s) => s.fetchByStatus);
  const fetchCount = useDocumentStore((s) => s.fetchCount);
  const fetchResult = useDocumentStore((s) => s.fetchResult);
  const clearAll = useDocumentStore((s) => s.clearAll);

  return {
    documents,
    selectedDocument,
    documentResult,
    isUploading,
    isLoading,
    error,
    hasFetched,
    count,
    uploadDocument: (file: FormData): Promise<UploadResponse | null> => upload(file),
    fetchAll,
    fetchById,
    fetchByStatus: (status: DocStatus) => fetchByStatus(status),
    fetchCount,
    fetchResult,
    clearAll,
  };
}
