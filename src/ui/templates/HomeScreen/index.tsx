"use client";

import React, { useEffect, useState } from "react";
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
import DetailsModal from "@/ui/organisms/DetailsModal";
import AddTransactionModal from "@/ui/molecules/AddTransactionModal";
import { useAddTransactionModal } from "@/hooks/transaction/useAddTransaction";
import { NotificationToast } from "@/ui/organisms/NotificationToast";
import { useTransactions } from "@/hooks/transaction/useTransactions";

const HomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState<boolean>(false);
  const [setIsTransactionModalOpen] = useState(false);
  const {
    transactions,
    isLoading: isTransactionsLoading,
    isRefreshing: isTransactionsRefreshing,
    error: transactionsError,
    refresh: refreshTransactions,
  } = useTransactions();
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
    setDocuments(transactions);
  }, [transactions]);

  const handleOpenTransactionModal = () => {
    openModal();
  };

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDocuments((prevDocs) => [...prevDocs, { name: file.name, type }]);
    } catch (error) {
      console.log("Erro ao fazer upload do arquivo:", error);
    } finally {
      setIsUploading(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCategoryCloseOrSuccess = () => {
    setShowUploadOptions(false);
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
              <div className="md:grid md:grid-cols-3 md:gap-2 flex items-center justify-between m-0 h-auto transition-all duration-500 ease-out animate-slide-up hover:-translate-y-0.5">
                <div className="md:hidden flex flex-col flex-1">
                  <StatsSection
                    totalFiles={0}
                    totalProofs={0}
                    totalImages={0}
                  />
                </div>
                <div className="hidden md:flex flex-col flex-1">
                  <UploadSection onUploadClick={toggleUploadOptions} />
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center md:col-span-2">
                  <StatsSection
                    totalFiles={0}
                    totalProofs={0}
                    totalImages={0}
                  />
                </div>
              </div>

              {/* Seção Principal */}
              <CategoryProvider onClose={handleCloseModal}>
                <MainContent
                  documents={documents}
                  showUploadOptions={showUploadOptions}
                  showModal={showModal}
                  handleCloseModal={handleCloseModal}
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
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
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
  showModal,
  handleCloseModal,
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
  showModal: boolean;
  handleCloseModal: () => void;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
  onManualClick: () => void;
  isTransactionsLoading: boolean;
  isTransactionsRefreshing: boolean;
  transactionsError: string | null;
  onRefreshTransactions: () => void;
}) => {
  const { isCategoryModalOpen } = useCategoryContext();

  const rightContentDesktop = showModal ? (
    <DetailsModal onClose={handleCloseModal} />
  ) : isCategoryModalOpen ? (
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
        {showModal && <DetailsModal onClose={handleCloseModal} />}
        {isCategoryModalOpen && (
          <CategoryScreen onCloseOrSuccess={onCategoryCloseOrSuccess} />
        )}
      </div>
    </>
  );
};export default HomeScreen;
