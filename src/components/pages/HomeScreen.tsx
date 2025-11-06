"use client";
import React from "react";
import LoadingSpinner from "../atoms/LoadingSpinner";
import { CategoryProvider } from "@/src/contexts/CategoryContext";
import { NotificationToast } from "../organisms/NotificationToast";
import AddTransactionModal from "../molecules/AddTransactionModal";
import { useAddTransactionModal } from "@/src/hooks/transaction/useAddTransaction";
import { HomeContent } from "../organisms/HomeContent";
import { useHomeScreen } from "@/src/hooks/home/useHomeScreen";
import { HomeScreenLayout } from "../organisms/HomeScreenLayout";

/**
 * HomeScreen - Tela principal da aplicação
 *
 * Responsabilidades:
 * - Gerenciar estado global da tela (sidebars, modais, documentos)
 * - Coordenar interações entre componentes filhos
 * - Prover contexto de categorias para componentes aninhados
 */
const HomeScreen: React.FC = () => {
  // Custom hooks para gerenciamento de estado
  const {
    documents,
    isLoading,
    modals,
    sidebars,
    toggleModal,
    toggleSidebar,
    closeModal,
    handleFileSelect,
    handleCategorySuccess,
  } = useHomeScreen();

  const {
    isOpen: isTransactionModalOpen,
    submitError,
    formData,
    isLoading: isTransactionLoading,
    errors,
    openModal: openTransactionModal,
    closeModal: closeTransactionModal,
    handleChange: handleTransactionChange,
    handleSubmit: handleTransactionSubmit,
  } = useAddTransactionModal();

  // Renderização condicional de loading
  if (isLoading) {
    return (
      <HomeScreenLayout
        isSidebarOpen={sidebars.left}
        isSidebarRightOpen={sidebars.right}
        onToggleSidebar={() => toggleSidebar("left")}
        onToggleSidebarRight={() => toggleSidebar("right")}
      >
        <div className="flex flex-1 items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </HomeScreenLayout>
    );
  }

  return (
    <HomeScreenLayout
      isSidebarOpen={sidebars.left}
      isSidebarRightOpen={sidebars.right}
      onToggleSidebar={() => toggleSidebar("left")}
      onToggleSidebarRight={() => toggleSidebar("right")}
    >
      <CategoryProvider onClose={() => closeModal("details")}>
        <HomeContent
          documents={documents}
          showUploadOptions={modals.uploadOptions}
          showDetailsModal={modals.details}
          onUploadClick={() => toggleModal("uploadOptions")}
          onCloseDetails={() => closeModal("details")}
          onFileSelect={handleFileSelect}
          onManualClick={openTransactionModal}
          onCategorySuccess={handleCategorySuccess}
        />
      </CategoryProvider>

      {/* Notificações Globais */}
      <NotificationToast />

      {/* Modal de Adicionar Transação */}
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        onSubmit={handleTransactionSubmit}
        formData={formData}
        errors={errors}
        isLoading={isTransactionLoading}
        submitError={submitError}
        onFormChange={handleTransactionChange}
      />
    </HomeScreenLayout>
  );
};

export default HomeScreen;
