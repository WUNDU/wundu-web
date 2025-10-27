import React, { createContext, useContext, useState, ReactNode } from "react";
import { Category, CategoryContextType } from "@/src/types/category";

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [transactionDescription, setTransactionDescription] = useState("");

  const saveCategory = () => {
    // Implement save logic (e.g., API call or local storage)
    console.log("Category saved:", selectedCategory, transactionDescription);
  };

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        isCategoryModalOpen,
        setIsCategoryModalOpen,
        transactionDescription,
        setTransactionDescription,
        saveCategory,
        onCloseDetailsModal: onClose, // Provide onClose from HomeScreen
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};
