"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GreetingHeader } from "@/ui/molecules";
import UploadSection from "@/ui/organisms/UploadSection";
import { BottomNavigation } from "@/ui/organisms";
import SentDocumentsSection from "@/ui/organisms/SendDocumentSection";
import { Document } from "@/types/button";
import { LoadingSpinner } from "@/ui/atoms";
import { Sidebar } from "@/ui/molecules";
import { StatsSection } from "@/ui/molecules";
import SidebarRight from "@/ui/molecules/SideBarRight";
import { ArrowsLeftIcon } from "@/constants/icons";
import {
  CategoryProvider,
  useCategoryContext,
} from "@/contexts/CategoryContext";
import CategoryScreen from "@/ui/templates/CategoryScreen";
import MovementSection from "@/ui/molecules/MovimentSection";
import AddTransactionModal from "@/ui/molecules/AddTransactionModal";
import { useAddTransactionModal } from "@/hooks/transaction/useAddTransaction";
import { NotificationToast } from "@/ui/organisms/NotificationToast";
import { useTransactions } from "@/hooks/transaction/useTransactions";
import {
  ManualCompletionRequiredError,
  TransactionService,
} from "@/services/TransactionService";
import { useUiStore } from "@/store/uiStore";
import ManualTransactionModal from "@/ui/molecules/ManualTransactionModal";

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState<boolean>(false);
  const [manualData, setManualData] = useState<
    | {
        transactionId: string;
        defaults: {
          description?: string;
          amount?: number;
          transactionDate?: string;
          operationNumber?: string;
        };
      }
    | null
  >(null);
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const {
    transactions,
    isLoading: isTransactionsLoading,
    isRefreshing: isTransactionsRefreshing,
    error: transactionsError,
    refresh: refreshTransactions,
  } = useTransactions();
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

  const handleTransactionSubmit = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      await refreshTransactions();
    }
    return success;
  }, [handleSubmit, refreshTransactions]);

  useEffect(() => {
    setDocuments(transactions);
    console.log(transactions);
  }, [transactions]);

  const handleOpenTransactionModal = () => {
    openModal();
  };

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    setIsUploading(true);
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
        "Transação criada automaticamente a partir do OCR."
      );

      await refreshTransactions();
    } catch (error) {
      if (error instanceof ManualCompletionRequiredError) {
        setManualData({ transactionId: error.transactionId, defaults: error.defaults });
        showNotification(
          "info",
          "Dados incompletos",
          "Revise descrição, montante e data para concluir o comprovativo."
        );
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível processar o comprovativo.";
        showNotification("error", "Falha no processamento", message);
        console.log("Erro ao fazer upload do arquivo:", error);
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
        transactionDate: manualData.defaults.transactionDate ?? new Date().toISOString(),
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
      await TransactionService.finalizeManualTransaction(manualData.transactionId, {
        description,
        amount,
        transactionDate,
        operationNumber: manualData.defaults.operationNumber,
        type: "expense",
      });

      await refreshTransactions();
      showNotification(
        "success",
        "Transação completada",
        "Os dados foram registados manualmente."
      );
      setManualData(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível concluir a transação.";
      showNotification("error", "Erro ao salvar", message);
    } finally {
      setIsManualSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden font-sans antialiased text-gray-800">
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ease-out h-full animate-fade-in`}
      >
        <GreetingHeader onToggleSidebar={toggleSidebarRight} />

        {/* Container principal com padding para BottomNavigation no mobile */}
        <main className="flex-1 mb-0 px-4 pb-20 md:pb-0 flex flex-col h-full overflow-hidden">
          {isUploading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Seção Superior */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch m-0 h-auto transition-all duration-500 ease-out animate-slide-up hover:-translate-y-0.5">
                <div className="md:hidden flex flex-col flex-1">
                  <StatsSection />
                </div>
                <div className="hidden md:flex flex-col flex-1">
                  <UploadSection onUploadClick={toggleUploadOptions} />
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center md:col-span-2">
                  <StatsSection />
                </div>
              </div>

              {/* Seção Principal */}
              <CategoryProvider onClose={() => {}}>
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
              </CategoryProvider>
            </>
          )}
        </main>

        {/* BottomNavigation - apenas no mobile */}
        <BottomNavigation />
      </div>

      {/* Sidebar Direito */}
      <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
      <NotificationToast />
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
  const { isCategoryModalOpen } = useCategoryContext();

  const rightContentDesktop = isCategoryModalOpen ? (
    <CategoryScreen />
  ) : (
    <MovementSection
      documents={documents}
      isLoading={isTransactionsLoading}
      isRefreshing={isTransactionsRefreshing}
      onRefresh={onRefreshTransactions}
      error={transactionsError}
    />
  );

  return (
    <>
      <div
        className={`flex flex-col flex-1 min-h-0 mt-3 md:mt-4 transition-all duration-500 ease-out animate-slide-up hover:-translate-y-0.5  ${
          showUploadOptions && "md:grid md:grid-cols-4 md:gap-4 md:h-full"
        }`}
      >
        {!showUploadOptions ? (
          <div className="flex flex-col flex-1 h-full min-h-0">
            {/* Mobile: Sempre MovementSection ou modais como overlay */}
            <div className="md:hidden flex flex-1 flex-col min-h-0">
              <MovementSection
                documents={documents}
                isLoading={isTransactionsLoading}
                isRefreshing={isTransactionsRefreshing}
                onRefresh={onRefreshTransactions}
                error={transactionsError}
              />
            </div>
            {/* Desktop: Substitui por modais se ativos, full width quando !showUploadOptions */}
            <div className="hidden md:block flex-col flex-1 h-full min-h-0">
              {rightContentDesktop}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: SentDocumentsSection full */}
            <div className="flex flex-col flex-1 h-full md:hidden">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={handleFileSelect}
                onManualClick={onManualClick}
              />
            </div>
            {/* Desktop: SentDocumentsSection sempre visível à esquerda */}
            <div className="md:flex items-start mt-2 h-full hidden">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={handleFileSelect}
                onManualClick={onManualClick}
              />
            </div>
            {/* Desktop: Área direita (substituição da MovementSection) */}
            <div className="sm:flex flex-col flex-1 h-full min-h-0 hidden col-span-3 md:block">
              {rightContentDesktop}
            </div>
          </>
        )}
      </div>
      {/* Mobile: Modais como overlay */}
      <div className="md:hidden">
        {isCategoryModalOpen && (
          <CategoryScreen onCloseOrSuccess={onCategoryCloseOrSuccess} />
        )}
      </div>
    </>
  );
};
export default HomeScreen;
