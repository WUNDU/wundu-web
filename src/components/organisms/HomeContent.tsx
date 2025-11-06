// src/components/organisms/HomeContent.tsx
import React from "react";
import { Document } from "@/src/types/button";
import { useCategoryContext } from "@/src/contexts/CategoryContext";
import UploadSection from "../organisms/UploadSection";
import StatsSection from "../molecules/StatsSection";
import SentDocumentsSection from "../organisms/SendDocumentSection";
import MovementSection from "../molecules/MovimentSection";
import DetailsModal from "../organisms/DetailsModal";
import CategoryScreen from "../pages/CategoryScreen";

interface HomeContentProps {
  documents: Document[];
  showUploadOptions: boolean;
  showDetailsModal: boolean;
  onUploadClick: () => void;
  onCloseDetails: () => void;
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick: () => void;
  onCategorySuccess: () => void;
}

export const HomeContent: React.FC<HomeContentProps> = ({
  documents,
  showUploadOptions,
  showDetailsModal,
  onUploadClick,
  onCloseDetails,
  onFileSelect,
  onManualClick,
  onCategorySuccess,
}) => {
  const { isCategoryModalOpen } = useCategoryContext();

  // Determina o conteúdo da área direita no desktop
  const getRightContent = () => {
    if (showDetailsModal) return <DetailsModal onClose={onCloseDetails} />;
    if (isCategoryModalOpen) return <CategoryScreen />;
    return <MovementSection documents={documents} />;
  };

  return (
    <>
      {/* Seção Superior - Stats e Upload */}
      <header className="md:grid md:grid-cols-3 md:gap-2 flex items-center justify-between m-0 h-auto transition-all duration-300">
        {/* Mobile: Apenas Stats */}
        <div className="md:hidden flex flex-col flex-1">
          <StatsSection totalFiles={0} totalProofs={0} totalImages={0} />
        </div>

        {/* Desktop: Upload + Stats */}
        <div className="hidden md:flex flex-col flex-1">
          <UploadSection onUploadClick={onUploadClick} />
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center md:col-span-2">
          <StatsSection totalFiles={0} totalProofs={0} totalImages={0} />
        </div>
      </header>

      {/* Seção Principal - Conteúdo Dinâmico */}
      <section
        className={`flex flex-col flex-1 transition-all duration-300 ${
          showUploadOptions && "md:grid md:grid-cols-4 md:gap-4 md:h-full"
        }`}
      >
        {!showUploadOptions ? (
          // Modo Normal: Apenas Movements/Modais
          <div className="flex flex-col flex-1 h-full">
            <div className="md:hidden flex flex-1 flex-col">
              <MovementSection documents={documents} />
            </div>
            <div className="hidden md:block flex-col flex-1 h-full">
              {getRightContent()}
            </div>
          </div>
        ) : (
          // Modo Upload: SentDocuments + Área Direita
          <>
            {/* Mobile: Apenas SentDocuments */}
            <div className="flex flex-col flex-1 h-full md:hidden">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={onFileSelect}
                onManualClick={onManualClick}
              />
            </div>

            {/* Desktop: Grid com SentDocuments + Área Direita */}
            <div className="hidden md:flex items-start mt-2 h-full">
              <SentDocumentsSection
                documents={[]}
                showOptions={true}
                onFileSelect={onFileSelect}
                onManualClick={onManualClick}
              />
            </div>
            <div className="hidden md:block flex-col flex-1 h-full col-span-3">
              {getRightContent()}
            </div>
          </>
        )}
      </section>

      {/* Mobile: Modais como Overlay */}
      <div className="md:hidden">
        {showDetailsModal && <DetailsModal onClose={onCloseDetails} />}
        {isCategoryModalOpen && (
          <CategoryScreen onCloseOrSuccess={onCategorySuccess} />
        )}
      </div>
    </>
  );
};
