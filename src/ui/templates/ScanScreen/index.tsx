"use client";

import React from "react";
import { GreetingHeader } from "@/ui/molecules";
import UploadSection from "@/ui/organisms/UploadSection";
import { BottomNavigation } from "@/ui/organisms";
import { LoadingSpinner } from "@/ui/atoms";
import {
  CategoryProvider,
} from "@/contexts/CategoryContext";
import ScanMainContent from "@/ui/organisms/ScanMainContent";
import { useScanScreen } from "@/hooks/home/useScanScreen";

const ScanScreen = () => {
  const {
    documents,
    showUploadOptions,
    isLoading,
    showModal,
    toggleUploadOptions,
    handleFileSelect,
    handleCloseModal,
    handleCategoryCloseOrSuccess,
  } = useScanScreen();

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
        <main className="flex-1 mb-0 px-4 pb-20 flex flex-col h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Seção Superior - Adaptada para Scan com botão de upload, apenas mobile */}
              <div className="flex items-center justify-between m-0 h-auto">
                {/* Para mobile, adicionar UploadSection ou botão similar */}
                <UploadSection onUploadClick={toggleUploadOptions} />
              </div>

              {/* Seção Principal */}
              <CategoryProvider onClose={handleCloseModal}>
                <ScanMainContent
                  documents={documents}
                  showUploadOptions={showUploadOptions}
                  showModal={showModal}
                  handleCloseModal={handleCloseModal}
                  handleFileSelect={handleFileSelect}
                  onCategoryCloseOrSuccess={handleCategoryCloseOrSuccess}
                />
              </CategoryProvider>
            </>
          )}
        </main>

        {/* BottomNavigation - Apenas no mobile */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ScanScreen;
