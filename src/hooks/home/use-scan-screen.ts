import { useState } from "react";
import { Document } from "@/types/button";
import {
  ManualCompletionRequiredError,
  TransactionService,
} from "@/services/transaction-service";
import { useUiStore } from "@/shared/store/ui-store";
import {
  ALLOWED_UPLOAD_MIME,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  MAX_UPLOAD_FILE_SIZE_MB,
} from "@/constants/upload";

export type UseScanScreenReturn = {
  documents: Document[];
  showUploadOptions: boolean;
  isLoading: boolean;
  showManualModal: boolean;
  isManualSubmitting: boolean;
  manualFormDefaults: {
    description: string;
    amount: number | null;
    transactionDate: string;
  } | null;
  toggleUploadOptions: () => void;
  handleFileSelect: (file: File, type: "image" | "document") => Promise<void>;
  handleCategoryCloseOrSuccess: () => void;
  handleManualModalClose: () => void;
  handleManualModalSubmit: (values: {
    description: string;
    amount: number;
    transactionDate: string;
  }) => Promise<void>;
};

export const useScanScreen = (): UseScanScreenReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [manualData, setManualData] = useState<{
    transactionId: string;
    defaults: {
      description?: string;
      amount?: number;
      transactionDate?: string;
      operationNumber?: string;
    };
  } | null>(null);
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const { showNotification } = useUiStore();

  const toggleUploadOptions = () => {
    setShowUploadOptions((prev) => !prev);
  };

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    if (file.type !== ALLOWED_UPLOAD_MIME) {
      showNotification(
        "error",
        "Formato inválido",
        "Envie apenas comprovativos em PDF.",
      );
      return;
    }

    if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
      showNotification(
        "error",
        "Arquivo muito grande",
        `O PDF deve ter no máximo ${MAX_UPLOAD_FILE_SIZE_MB}MB.`,
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await TransactionService.processDocumentTransaction(file, {
        documentType: type === "image" ? "IMAGE" : "DOCUMENT",
      });

      const extracted = result.ocr.extractedData ?? {};
      setDocuments((prevDocs) => [
        {
          type: "transaction",
          name: extracted.description ?? file.name,
          description: extracted.description,
          amount: extracted.amount,
          timestamp: extracted.transactionDate,
        },
        ...prevDocs,
      ]);

      showNotification(
        "success",
        "Comprovativo processado",
        "Transação criada automaticamente a partir do OCR.",
      );
    } catch (error) {
      if (error instanceof ManualCompletionRequiredError) {
        setManualData({
          transactionId: error.transactionId,
          defaults: error.defaults,
        });
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível processar o comprovativo.";
        showNotification("error", "Falha no processamento", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryCloseOrSuccess = () => {
    setShowUploadOptions(false);
  };

  const handleManualModalClose = () => {
    setManualData(null);
  };

  const handleManualModalSubmit = async (values: {
    description: string;
    amount: number;
    transactionDate: string;
  }) => {
    if (!manualData) return;
    setIsManualSubmitting(true);
    try {
      await TransactionService.finalizeManualTransaction(
        manualData.transactionId,
        {
          description: values.description,
          amount: values.amount,
          transactionDate: values.transactionDate,
          operationNumber: manualData.defaults.operationNumber,
          type: "expense",
        },
      );

      setDocuments((prevDocs) => [
        {
          type: "transaction",
          name: values.description,
          description: values.description,
          amount: values.amount,
          timestamp: values.transactionDate,
        },
        ...prevDocs,
      ]);

      showNotification(
        "success",
        "Transação completada",
        "Os dados foram registados manualmente.",
      );
      setManualData(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a transação.";
      showNotification("error", "Erro ao salvar", message);
    } finally {
      setIsManualSubmitting(false);
    }
  };

  const manualFormDefaults = manualData
    ? {
        description: manualData.defaults.description ?? "",
        amount: manualData.defaults.amount ?? null,
        transactionDate:
          manualData.defaults.transactionDate ?? new Date().toISOString(),
      }
    : null;

  return {
    documents,
    showUploadOptions,
    isLoading,
    showManualModal: Boolean(manualData),
    isManualSubmitting,
    manualFormDefaults,
    toggleUploadOptions,
    handleFileSelect,
    handleCategoryCloseOrSuccess,
    handleManualModalClose,
    handleManualModalSubmit,
  };
};
