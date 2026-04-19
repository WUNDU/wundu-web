"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Document } from "@/types/ui";
import { LoadingSpinner } from "@/components/ui";
import { StatsSection } from "@/components/layout";

import {
  ManualCompletionRequiredError,
  transactionService,
} from "@/services/transaction.service";
import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/hooks/use-auth";
import { useTransaction } from "@/hooks/use-transaction";
import {
  ALLOWED_UPLOAD_MIME,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  MAX_UPLOAD_FILE_SIZE_MB,
} from "@/constants/upload";
import { Category } from "@/types/dtos/category.dto";

import UploadSection from "@/components/home/upload-section";
import UploadOptions from "@/components/home/upload-options";
import AddTransactionModal from "@/components/home/add-transaction-modal";
import ManualTransactionModal from "@/components/home/manual-transaction-modal";
import MovementSection from "@/components/home/movement-section";
import CategoryScreen from "@/components/home/category-screen";
import { useAddTransactionModal } from "@/hooks/use-add-transaction-modal";
import posthog from "posthog-js";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HomeScreen = () => {
  const { user } = useAuth();
  const [pendingDocs, setPendingDocs] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
        isIncome: tx.type === "income",
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

    setIsUploading(true);
    try {
      const result = await transactionService.processDocumentTransaction(file, {
        documentType: type === "image" ? "IMAGE" : "DOCUMENT",
      });

      const extracted = result.ocr.extractedData ?? {};
      setPendingDocs((prev) => [
        {
          type: "transaction",
          name: extracted.description ?? file.name,
          description: extracted.description,
          amount: extracted.amount,
          timestamp: extracted.transactionDate,
        },
        ...prev,
      ]);
      showNotification(
        "success",
        "Comprovativo processado",
        "Transação criada automaticamente a partir do OCR.",
      );
      posthog.capture("document_uploaded", {
        document_type: type,
        file_name: file.name,
        file_size: file.size,
      });

      await refreshTransactions();
      setPendingDocs([]);
    } catch (error) {
      if (error instanceof ManualCompletionRequiredError) {
        setManualData({
          transactionId: error.transactionId,
          defaults: error.defaults,
        });
        showNotification(
          "info",
          "Dados incompletos",
          "Revise descrição, montante e data para concluir o comprovativo.",
        );
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível processar o comprovativo.";
        showNotification("error", "Falha no processamento", message);
        posthog.capture("document_upload_failed", {
          document_type: type,
          reason: message,
        });
        posthog.captureException(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryCloseOrSuccess = () => {
    setShowUploadOptions(false);
  };

  const manualFormDefaults = manualData
    ? {
        description: manualData.defaults.description ?? "",
        amount: manualData.defaults.amount ?? null,
        transactionDate:
          manualData.defaults.transactionDate ?? new Date().toISOString(),
      }
    : null;

  const handleManualModalClose = () => {
    setManualData(null);
  };

  const handleManualModalSubmit = async ({
    description,
    amount,
    transactionDate,
  }: {
    description: string;
    amount: number;
    transactionDate: string;
  }) => {
    if (!manualData) return;
    setIsManualSubmitting(true);
    try {
      await transactionService.finalizeManualTransaction(
        manualData.transactionId,
        {
          description,
          amount,
          transactionDate,
          operationNumber: manualData.defaults.operationNumber,
          type: "expense",
        },
      );

      await refreshTransactions();
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

      <ManualTransactionModal
        isOpen={Boolean(manualData)}
        defaults={manualFormDefaults}
        isSubmitting={isManualSubmitting}
        onClose={handleManualModalClose}
        onSubmit={handleManualModalSubmit}
      />
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
