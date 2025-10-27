"use client";

import React, { useState } from "react";
import GreetingHeader from "../molecules/GreetingHeader";
import UploadSection from "../organisms/UploadSection";
import BottomNavigation from "../organisms/BottomNavigation";
import SentDocumentsSection from "../organisms/SendDocumentSection";
import { Document } from "@/src/types/button";
import LoadingSpinner from "../atoms/LoadingSpinner";
import {
  CategoryProvider,
  useCategoryContext,
} from "@/src/contexts/CategoryContext";
import CategoryScreen from "./CategoryScreen";
import DetailsModal from "../organisms/DetailsModal";

// Tipagem para o componente principal
const ScanScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleUploadOptions = () => {
    setShowUploadOptions(!showUploadOptions);
  };

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDocuments((prevDocs) => [...prevDocs, { name: file.name, type }]);
    } catch (error) {
      console.log("Erro ao fazer upload do arquivo:", error);
    } finally {
      setIsLoading(false);
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

// Tipagem para o componente auxiliar
interface ScanMainContentProps {
  documents: Document[];
  showUploadOptions: boolean;
  showModal: boolean;
  handleCloseModal: () => void;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
}

// Componente auxiliar para o conteúdo principal, separado como organism/template
const ScanMainContent: React.FC<ScanMainContentProps> = ({
  documents,
  showUploadOptions,
  showModal,
  handleCloseModal,
  handleFileSelect,
  onCategoryCloseOrSuccess,
}) => {
  const { isCategoryModalOpen } = useCategoryContext();

  return (
    <>
      <div className="flex flex-col flex-1 h-full">
        {!showUploadOptions ? (
          <div className="flex flex-col flex-1 h-full">
            {/* Mobile: Área para conteúdo de scan */}
            <div className="flex flex-1 flex-col">
              {/* Aqui pode adicionar conteúdo específico para scan, como preview de câmera ou placeholder */}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: SentDocumentsSection full para upload options */}
            <div className="flex flex-col flex-1 h-full">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={handleFileSelect}
              />
            </div>
          </>
        )}
      </div>

      {/* Mobile: Modais como overlay */}
      <div>
        {showModal && <DetailsModal onClose={handleCloseModal} />}
        {isCategoryModalOpen && (
          <CategoryScreen onCloseOrSuccess={onCategoryCloseOrSuccess} />
        )}
      </div>
    </>
  );
};

export default ScanScreen;
