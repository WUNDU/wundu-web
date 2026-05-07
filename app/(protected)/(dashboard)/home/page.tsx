"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Document } from "@/types/ui";
import { LoadingSpinner } from "@/components/ui";
import { StatsSection } from "@/components/layout";

import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/hooks/use-auth";
import { useTransaction } from "@/hooks/use-transaction";
import { useDocumentPolling } from "@/hooks/use-document-polling";
import { documentService } from "@/services/document.service";
import {
  ALLOWED_UPLOAD_MIMES,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  MAX_UPLOAD_FILE_SIZE_MB,
} from "@/constants/upload";
import { Category } from "@/types/dtos/category.dto";

import UploadSection from "@/components/home/upload-section";
import UploadOptions from "@/components/home/upload-options";
import AddTransactionModal from "@/components/home/add-transaction-modal";
import MovementSection from "@/components/home/movement-section";
import CategoryScreen from "@/components/home/category-screen";
import OcrStatusModal from "@/components/home/ocr-status-modal";
import { useAddTransactionModal } from "@/hooks/use-add-transaction-modal";
import posthog from "posthog-js";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HomeScreen = () => {
  const { user } = useAuth();
  const [pendingDocs, setPendingDocs] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const {
    transactions: rawTransactions,
    isLoading: isTransactionsLoading,
    isRefreshing: isTransactionsRefreshing,
    error: transactionsError,
    getTransactions: fetchTransactions,
    refreshTransactions,
  } = useTransaction();

  const documents = useMemo<Document[]>(
    () => [
      ...pendingDocs,
      ...rawTransactions.map((tx, index) => ({
        type: "transaction" as const,
        name: tx.description || tx.category?.name || `Transação ${index + 1}`,
        description: tx.description ?? undefined,
        amount: tx.amount,
        category: tx.category?.name ?? undefined,
        timestamp: tx.transactionDate,
        isIncome: tx.type === "INCOME",
      })),
    ],
    [rawTransactions, pendingDocs],
  );
  const { showNotification } = useUiStore();
  const {
    isOpen: isTransactionModalOpen,
    submitError,
    formData,
    isLoading: isTransactionLoading,
    errors,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
  } = useAddTransactionModal();

  const { doc: pollingDoc, isPolling, startPolling, reset: resetPolling } = useDocumentPolling({
    onTerminal: (doc) => {
      const status = doc.status?.toUpperCase();
      if (status === "PROCESSED") {
        refreshTransactions();
        posthog.capture("document_ocr_processed", { documentId: doc.id });
      }
    },
  });

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransactionSubmit = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      setPendingDocs([]);
      await refreshTransactions();
    }
    return success;
  }, [handleSubmit, refreshTransactions]);

  const handleOpenTransactionModal = () => {
    openModal();
  };

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedMimes.includes(file.type)) {
      showNotification(
        "error",
        "Formato inválido",
        "Envie comprovativos em PDF, JPG ou PNG.",
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

    setIsUploading(true);
    resetPolling();
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await documentService.upload(formData);
      posthog.capture("document_uploaded", {
        document_type: type,
        file_name: file.name,
        file_size: file.size,
        documentId: response.documentId,
      });
      setOcrModalOpen(true);
      setShowUploadOptions(false);
      startPolling(response.documentId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível enviar o comprovativo.";
      showNotification("error", "Falha no envio", message);
      posthog.capture("document_upload_failed", { reason: message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOcrModalClose = () => {
    setOcrModalOpen(false);
    resetPolling();
  };

  const handleOcrSuccess = useCallback(async () => {
    setOcrModalOpen(false);
    resetPolling();
    await refreshTransactions();
    showNotification("success", "Pronto!", "Transação registada com sucesso.");
  }, [resetPolling, refreshTransactions, showNotification]);

  const handleOcrRetry = () => {
    setOcrModalOpen(false);
    resetPolling();
    setShowUploadOptions(true);
  };

  const handleCategoryCloseOrSuccess = () => {
    setShowUploadOptions(false);
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto flex flex-col gap-3">
      {/* Header da Página */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Olá, {user?.name?.split(" ")[0] || "Usuário"}! 👋
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Aqui está o que está acontecendo com suas finanças hoje.
        </p>
      </motion.div>

      {isUploading ? (
        <div className="flex flex-1 items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Grid de Cards Superiores - Alinhados e Proporcionais */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            <div className="lg:col-span-4 flex">
              <UploadSection onUploadClick={toggleUploadOptions} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.08 }}
              className="lg:col-span-8 flex"
            >
              <StatsSection />
            </motion.div>
          </div>

          {/* Seção de Conteúdo Principal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.12 }}
            className="min-h-[320px] lg:min-h-[360px]"
          >
            <MainContent
              documents={documents}
              showUploadOptions={showUploadOptions}
              handleFileSelect={handleFileSelect}
              onCategoryCloseOrSuccess={handleCategoryCloseOrSuccess}
              onManualClick={handleOpenTransactionModal}
              isTransactionsLoading={isTransactionsLoading}
              isTransactionsRefreshing={isTransactionsRefreshing}
              transactionsError={transactionsError}
              onRefreshTransactions={refreshTransactions}
            />
          </motion.div>
        </div>
      )}

      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeModal}
        onSubmit={handleTransactionSubmit}
        formData={formData}
        errors={errors}
        isLoading={isTransactionLoading}
        submitError={submitError}
        onFormChange={handleChange}
      />
      <OcrStatusModal
        isOpen={ocrModalOpen}
        doc={pollingDoc}
        isPolling={isPolling}
        onClose={handleOcrModalClose}
        onSuccess={handleOcrSuccess}
        onRetry={handleOcrRetry}
      />
    </div>
  );
};

const MainContent = ({
  documents,
  showUploadOptions,
  handleFileSelect,
  onCategoryCloseOrSuccess,
  onManualClick,
  isTransactionsLoading,
  isTransactionsRefreshing,
  transactionsError,
  onRefreshTransactions,
}: {
  documents: Document[];
  showUploadOptions: boolean;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
  onManualClick: () => void;
  isTransactionsLoading: boolean;
  isTransactionsRefreshing: boolean;
  transactionsError: string | null;
  onRefreshTransactions: () => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [transactionDescription, setTransactionDescription] = useState("");

  const categoryProps = {
    selectedCategory,
    setSelectedCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    transactionDescription,
    setTransactionDescription,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="flex flex-col xl:flex-row gap-3 items-start h-full"
    >
      <AnimatePresence initial={false}>
        {showUploadOptions && (
          <motion.div
            key="upload-options-panel"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="w-full xl:w-[300px] flex-shrink-0"
          >
            <div className="bg-white rounded-xl border border-slate-100 p-3 lg:p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.14em] mb-4 text-center lg:text-left">
                Opções de Envio
              </h3>
              <UploadOptions
                onFileSelect={handleFileSelect}
                onManualClick={onManualClick}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 min-w-0 w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          {isCategoryModalOpen ? (
            <motion.div
              key="category-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className="h-full"
            >
              <CategoryScreen
                {...categoryProps}
                onCloseOrSuccess={onCategoryCloseOrSuccess}
              />
            </motion.div>
          ) : (
            <motion.div
              key="movement-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="h-full"
            >
              <MovementSection
                documents={documents}
                isLoading={isTransactionsLoading}
                isRefreshing={isTransactionsRefreshing}
                onRefresh={onRefreshTransactions}
                error={transactionsError}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
