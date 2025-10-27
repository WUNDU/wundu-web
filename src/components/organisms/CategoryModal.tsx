import { useCategoryContext } from "@/src/contexts/CategoryContext";
import { Category } from "@/src/types/category";
import React, { useState } from "react";

const CategoryModal = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    transactionDescription,
    setTransactionDescription,
    saveCategory,
  } = useCategoryContext();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Categorias padrão
  const defaultCategories: Category[] = [
    { id: "transport", name: "Transporte", color: "#F59E0B" },
    { id: "food", name: "Alimentação" },
    { id: "entertainment", name: "Entretenimento" },
    { id: "health", name: "Saúde" },
    { id: "education", name: "Educação" },
    { id: "leisure", name: "Lazer" },
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSave = () => {
    if (selectedCategory && transactionDescription.trim()) {
      saveCategory();
      setShowSuccessModal(true);

      // Fechar modal de sucesso após 2 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        setIsCategoryModalOpen(false);
      }, 2000);
    }
  };

  const handleClose = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setTransactionDescription("");
  };

  if (!isCategoryModalOpen) return null;

  // Modal de sucesso
  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Categoria definida com sucesso
          </h3>
          <p className="text-sm text-gray-600">
            O movimento "Débito" foi definido na categoria{" "}
            {selectedCategory?.name.toLowerCase()}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="p-2 -m-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
          <div className="w-9"></div>
        </div>

        <div className="p-6">
          {/* Categorias padrão */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Categorias padrão
            </h3>
            <div className="flex flex-wrap gap-3">
              {defaultCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory?.id === category.id
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    selectedCategory?.id === category.id && category.color
                      ? { backgroundColor: category.color }
                      : {}
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Botão adicionar categoria */}
          <button className="w-12 h-12 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:border-blue-400 hover:text-blue-600 transition-colors mx-auto mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          {/* Descrição */}
          {selectedCategory && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Descrição
              </h3>
              <textarea
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                placeholder="Escrever"
                className="w-full h-24 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          {/* Botão Guardar */}
          <button
            onClick={handleSave}
            disabled={!selectedCategory || !transactionDescription.trim()}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
              selectedCategory && transactionDescription.trim()
                ? "bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
