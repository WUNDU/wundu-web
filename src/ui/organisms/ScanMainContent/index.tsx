"use client";

import React from "react";
import { useCategoryContext } from "@/contexts/CategoryContext";
import SentDocumentsSection from "@/ui/organisms/SendDocumentSection";
import CategoryScreen from "@/ui/templates/CategoryScreen";
import DetailsModal from "@/ui/organisms/DetailsModal";
import { Document } from "@/types/button";

interface ScanMainContentProps {
  documents: Document[];
  showUploadOptions: boolean;
  showModal: boolean;
  handleCloseModal: () => void;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
  onManualClick?: () => void;
}

const ScanMainContent: React.FC<ScanMainContentProps> = ({
  documents,
  showUploadOptions,
  showModal,
  handleCloseModal,
  handleFileSelect,
  onCategoryCloseOrSuccess,
  onManualClick,
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
                onManualClick={onManualClick}
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

export default ScanMainContent;
