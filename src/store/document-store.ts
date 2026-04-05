import { create } from "zustand";
import type {
  DocumentList,
  DocumentResult,
  DocumentStatus,
  UploadResponse,
} from "@/types/dtos/document.dto";
import { documentService } from "@/services/document.service";

type DocStatus = "pending" | "processed" | "error" | "duplicate";

interface DocumentStore {
  documents: DocumentList[] | null;
  selectedDocument: DocumentStatus | null;
  documentResult: DocumentResult | null;
  isUploading: boolean;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  count: number;
  upload(file: FormData): Promise<UploadResponse | null>;
  fetchAll(): Promise<void>;
  fetchById(id: string): Promise<void>;
  fetchByStatus(status: DocStatus): Promise<void>;
  fetchCount(): Promise<void>;
  fetchResult(id: string): Promise<void>;
  clearAll(): void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: null,
  selectedDocument: null,
  documentResult: null,
  isUploading: false,
  isLoading: false,
  error: null,
  hasFetched: false,
  count: 0,

  upload: async (file: FormData): Promise<UploadResponse | null> => {
    set({ isUploading: true, error: null });
    const { notify, loading } = await import("@/hooks/use-notification");
    loading.show("Enviando documento...");
    try {
      const response = await documentService.upload(file);
      set({ isUploading: false, hasFetched: false });
      loading.hide();
      notify.success("Documento enviado com sucesso!");
      return response;
    } catch (error: any) {
      const err =
        error?.response?.status === 409
          ? "Arquivo duplicado: já foi enviado anteriormente"
          : error?.response?.status === 400
            ? "Arquivo inválido. Use PDF, JPG ou PNG com até 20MB"
            : error?.response?.data?.message || "Erro ao enviar documento";
      set({ error: err, isUploading: false });
      loading.hide();
      notify.error(err);
      return null;
    }
  },

  fetchAll: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true });
    try {
      const documents = await documentService.getAll();
      set({ documents, isLoading: false, hasFetched: true });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao carregar documentos";
      set({ error: err, isLoading: false });
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true });
    try {
      const doc = await documentService.getById(id);
      set({ selectedDocument: doc, isLoading: false });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Documento não encontrado";
      set({ error: err, isLoading: false });
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  fetchByStatus: async (status: DocStatus) => {
    set({ isLoading: true });
    try {
      const documents = await documentService.getByStatus(status);
      set({ documents, isLoading: false });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao filtrar documentos";
      set({ error: err, isLoading: false });
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  fetchCount: async () => {
    try {
      const count = await documentService.getCount();
      set({ count });
    } catch {
      // silently fail
    }
  },

  fetchResult: async (id: string) => {
    set({ isLoading: true });
    try {
      const result = await documentService.getResult(id);
      set({ documentResult: result, isLoading: false });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Resultado não disponível";
      set({ error: err, isLoading: false });
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  clearAll: () => {
    set({
      documents: null,
      selectedDocument: null,
      documentResult: null,
      isUploading: false,
      isLoading: false,
      error: null,
      hasFetched: false,
      count: 0,
    });
  },
}));
