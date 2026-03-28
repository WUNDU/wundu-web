"use client";

import React from "react";
import UploadSection from "@/shared/components/upload-section";
import { BottomNavigation, GreetingHeader, LoadingSpinner } from "@/shared/components";
import { CategoryProvider } from "@/contexts/category-context";
import ScanMainContent from "@/modules/dashboard/components/scan-main-content";
import { useScanScreen } from "@/hooks/home/use-scan-screen";
import { useAddTransactionModal } from "@/hooks/transaction/use-add-transaction";
import AddTransactionModal from "@/shared/components/add-transaction-modal";
import { NotificationToast } from "@/modules/dashboard/components/notification-toast";
import ManualTransactionModal from "@/shared/components/manual-transaction-modal";

const ScanScreen = () => {
  const {
    documents,
    showUploadOptions,
    isLoading,
    showManualModal,
    isManualSubmitting,
    manualFormDefaults,
    toggleUploadOptions,
    handleFileSelect,
    handleCategoryCloseOrSuccess,
    handleManualModalClose,
    handleManualModalSubmit,
  } = useScanScreen();

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

  const handleManualTransaction = () => {
    if (!showUploadOptions) {
      toggleUploadOptions();
    }
    openModal();
  };

  const handleTransactionSubmit = async () => {
    return handleSubmit();
  };

  const transitionBase = "transition-all duration-700 ease-in-out";

  const uploadContainerClasses = showUploadOptions
    ? `flex flex-col items-center ${transitionBase} flex-none pt-4`
    : `flex flex-col items-center justify-center ${transitionBase} flex-1`;

  const mainClasses = `flex-1 mb-0 px-4 pb-20 flex flex-col h-full overflow-y-auto ${
    showUploadOptions ? "" : "justify-center"
  } ${transitionBase}`;

  const contentWrapperClasses = showUploadOptions
    ? "flex flex-col flex-1"
    : "flex flex-col items-center";

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800 flex-col">
      {/* Conteúdo Principal - Apenas mobile */}
      <div className="flex-1 flex flex-col h-full">
        <GreetingHeader
          onToggleSidebar={function (): void {
            throw new Error("Function not implemented.");
          }}
        />

        {/* Container principal com padding para BottomNavigation no mobile */}
        <main className={mainClasses}>
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <div className={contentWrapperClasses}>
              {/* UploadSection */}
              <div className={uploadContainerClasses}>
                <div
                  className={`w-full ${transitionBase} ${
                    showUploadOptions ? "scale-95" : "scale-100"
                  }`}
                >
                  <UploadSection onUploadClick={toggleUploadOptions} />
                </div>
              </div>

              {/* Seção Principal */}
              {showUploadOptions && (
                <div className={`mt-6 flex-1 w-full ${transitionBase}`}>
                  <CategoryProvider onClose={() => {}}>
                    <ScanMainContent
                      documents={documents}
                      showUploadOptions={showUploadOptions}
                      handleFileSelect={handleFileSelect}
                      onCategoryCloseOrSuccess={handleCategoryCloseOrSuccess}
                      onManualClick={handleManualTransaction}
                    />
                  </CategoryProvider>
                </div>
              )}
            </div>
          )}
        </main>

        {/* BottomNavigation - Apenas no mobile */}
        <BottomNavigation />
        <NotificationToast />
        <ManualTransactionModal
          isOpen={showManualModal}
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
    </div>
  );
};

export default ScanScreen;
