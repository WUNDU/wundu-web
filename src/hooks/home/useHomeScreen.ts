import { useState, useEffect } from "react";
import { Document } from "@/src/types/button";
import { useUiStore } from "@/src/store/uiStore";

export const useHomeScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modals, setModals] = useState({
    uploadOptions: false,
    details: false,
  });
  const [sidebars, setSidebars] = useState({
    left: true,
    right: false,
  });

  const toggleModal = (modal: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modal]: !prev[modal] }));
  };

  const toggleSidebar = (sidebar: keyof typeof sidebars) => {
    setSidebars((prev) => ({ ...prev, [sidebar]: !prev[sidebar] }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  };

  const handleFileSelect = async (file: File, type: "image" | "document") => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDocuments((prev) => [...prev, { name: file.name, type }]);
      setModals({ uploadOptions: false, details: true });
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySuccess = () => {
    closeModal("uploadOptions");
  };

  return {
    documents,
    isLoading,
    modals,
    sidebars,
    toggleModal,
    toggleSidebar,
    closeModal,
    handleFileSelect,
    handleCategorySuccess,
  };
};
