export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface CategoryContextType {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  transactionDescription: string;
  setTransactionDescription: (description: string) => void;
  saveCategory: () => void;
  onCloseDetailsModal: () => void; // Added to close DetailsModal
}

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}