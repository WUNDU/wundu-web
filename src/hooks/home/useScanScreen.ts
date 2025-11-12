import { useState } from "react";
import { Document } from "@/types/button";

export type UseScanScreenReturn = {
  documents: Document[];
  showUploadOptions: boolean;
  isLoading: boolean;
  showModal: boolean;
  toggleUploadOptions: () => void;
  handleFileSelect: (file: File, type: "image" | "document") => Promise<void>;
  handleCloseModal: () => void;
  handleCategoryCloseOrSuccess: () => void;
};

export const useScanScreen = (): UseScanScreenReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleUploadOptions = () => {
    setShowUploadOptions((prev) => !prev);
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

  return {
    documents,
    showUploadOptions,
    isLoading,
    showModal,
    toggleUploadOptions,
    handleFileSelect,
    handleCloseModal,
    handleCategoryCloseOrSuccess,
  };
};
