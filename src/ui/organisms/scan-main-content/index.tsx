"use client";

import React from "react";
import { useCategoryContext } from "@/contexts/category-context";
import SentDocumentsSection from "@/ui/organisms/send-socument-section";
import CategoryScreen from "@/ui/templates/category-screen";
import { Document } from "@/types/button";

interface ScanMainContentProps {
  documents: Document[];
  showUploadOptions: boolean;
  handleFileSelect: (file: File, type: "image" | "document") => void;
  onCategoryCloseOrSuccess: () => void;
  onManualClick?: () => void;
}

const ScanMainContent: React.FC<ScanMainContentProps> = ({
  documents,
  showUploadOptions,
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

      {/* Mobile: Modal de categoria como overlay */}
      <div>
        {isCategoryModalOpen && (
          <CategoryScreen onCloseOrSuccess={onCategoryCloseOrSuccess} />
        )}
      </div>
    </>
  );
};

export default ScanMainContent;
