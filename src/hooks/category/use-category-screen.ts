"use client";

import { useState } from "react";
import { useCategoryContext } from "@/contexts/category-context";
import { Category } from "@/shared/types/category";

export const useCategoryScreen = (onCloseOrSuccess?: () => void) => {
  const {
    selectedCategory,
    setSelectedCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    transactionDescription,
    setTransactionDescription,
    saveCategory,
    onCloseDetailsModal,
  } = useCategoryContext();

  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSave = () => {
    if (selectedCategory && transactionDescription.trim()) {
      try {
        saveCategory();
        setShowSuccessScreen(true);
        setTimeout(() => {
          setShowSuccessScreen(false);
          setIsCategoryModalOpen(false);
          onCloseDetailsModal();
          setSelectedCategory(null);
          setTransactionDescription("");
          onCloseOrSuccess?.();
        }, 2000);
      } catch (error) {}
    }
  };

  const handleClose = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setTransactionDescription("");
    onCloseOrSuccess?.();
  };

  return {
    selectedCategory,
    setSelectedCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    transactionDescription,
    setTransactionDescription,
    showSuccessScreen,
    handleCategorySelect,
    handleSave,
    handleClose,
  };
};
