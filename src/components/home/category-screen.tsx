"use client";

import React, { useState } from "react";
import { useCategory } from "@/hooks/use-category";
import type { Category } from "@/types/dtos/category.dto";
import { Plus, Loader2 } from "lucide-react";
import { getCategoryStyle } from "@/utils/category-style";

export interface CategoryScreenProps {
  onCloseOrSuccess?: () => void;
  selectedCategory: Category | null;
  setSelectedCategory: (c: Category | null) => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  transactionDescription: string;
  setTransactionDescription: (desc: string) => void;
}

const CategoryScreen = ({
  onCloseOrSuccess,
  selectedCategory,
  setSelectedCategory,
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  transactionDescription,
  setTransactionDescription,
}: CategoryScreenProps) => {
  const { categories, isLoading, createCategory } = useCategory();
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCategorySelect = (category: Category) =>
    setSelectedCategory(category);

  const handleSave = () => {
    if (selectedCategory && transactionDescription.trim()) {
      setShowSuccessScreen(true);
      setTimeout(() => {
        setShowSuccessScreen(false);
        setIsCategoryModalOpen(false);
        setSelectedCategory(null);
        setTransactionDescription("");
        onCloseOrSuccess?.();
      }, 2000);
    }
  };

  const handleClose = () => {
    setIsCategoryModalOpen(false);
    setSelectedCategory(null);
    setTransactionDescription("");
    onCloseOrSuccess?.();
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setIsCreating(true);
    const created = await createCategory({ name });
    setIsCreating(false);
    if (created) {
      setNewCategoryName("");
      setSelectedCategory(created);
    }
  };

  if (!isCategoryModalOpen) return null;

  const globalCategories = categories.filter((c) => !c.userId);
  const myCategories = categories.filter((c) => !!c.userId);

  const CategoryList = () => (
    <>
      {/* Global categories */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Categorias do sistema
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {globalCategories.map((category) => {
              const style = getCategoryStyle(category.name);
              const Icon = style.icon;
              const isActive = selectedCategory?.id === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "text-white shadow-sm scale-105"
                      : "bg-white border border-slate-200 hover:bg-slate-50"
                  }`}
                  style={isActive ? { backgroundColor: style.color } : { color: style.color }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Personal categories */}
      {myCategories.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Personalizadas
          </h3>
          <div className="flex flex-wrap gap-2">
            {myCategories.map((category) => {
              const style = getCategoryStyle(category.name);
              const Icon = style.icon;
              const isActive = selectedCategory?.id === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-secondary text-white shadow-sm scale-105"
                      : "bg-blue-50 text-secondary border border-blue-100 hover:bg-blue-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Create custom category */}
      <div className="mb-6 border-t border-gray-100 pt-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Criar categoria personalizada
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
            placeholder="Nome da categoria"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
          <button
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim() || isCreating}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-400 text-white rounded-xl text-sm font-semibold hover:bg-yellow-500 active:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Criar
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: Tela inteira */}
      <div className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto">
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-between p-6 bg-gray-100 border-b border-gray-100">
            <button
              onClick={handleClose}
              className="p-2 -m-2 hover:bg-gray-100 rounded-full transition-colors"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-gray-900">Categorias</h2>
            <div className="w-10"></div>
          </div>
          <div className="p-4 bg-gray-100 rounded-xl">
            <div className="bg-white rounded-xl p-4">
              <CategoryList />
              {selectedCategory && (
                <div className="mb-8">
                  <h3 className="text-base font-medium text-gray-700 mb-4">
                    Descrição
                  </h3>
                  <textarea
                    value={transactionDescription}
                    onChange={(e) => setTransactionDescription(e.target.value)}
                    placeholder="Escrever"
                    className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-base"
                  />
                </div>
              )}
              {selectedCategory && transactionDescription.trim() && (
                <div className="mt-4">
                  <button
                    onClick={handleSave}
                    className="w-full py-4 rounded-xl font-semibold text-white bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 transition-all"
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block mt-2 w-full h-full overflow-y-auto">
        {showSuccessScreen ? (
          <div className="bg-white rounded-xl shadow-sm w-full p-4 text-center flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="29"
                height="17"
                viewBox="0 0 29 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.625 0.874725C20.5094 0.758845 20.372 0.666911 20.2208 0.604184C20.0696 0.541457 19.9075 0.509169 19.7438 0.509169C19.5801 0.509169 19.418 0.541457 19.2668 0.604184C19.1156 0.666911 18.9782 0.758845 18.8625 0.874725L11.8125 7.92472L13.575 9.68722L20.625 2.62472C21.1 2.14972 21.1 1.34972 20.625 0.874725ZM25.9251 0.862224L13.575 13.2122L9.22505 8.87472C8.99133 8.641 8.67433 8.5097 8.3438 8.5097C8.01327 8.5097 7.69627 8.641 7.46255 8.87472C7.22883 9.10845 7.09752 9.42544 7.09752 9.75597C7.09752 10.0865 7.22883 10.4035 7.46255 10.6372L12.6875 15.8622C13.175 16.3497 13.9625 16.3497 14.45 15.8622L27.6875 2.63722C27.8034 2.52158 27.8954 2.38422 27.9581 2.233C28.0208 2.08179 28.0531 1.91969 28.0531 1.75597C28.0531 1.59226 28.0208 1.43016 27.9581 1.27894C27.8954 1.12773 27.8034 0.990367 27.6875 0.874725H27.6751C27.5623 0.756727 27.4269 0.662584 27.2771 0.597884C27.1272 0.533184 26.9659 0.499244 26.8027 0.498078C26.6395 0.496912 26.4777 0.528544 26.3269 0.591097C26.1762 0.65365 26.0395 0.745849 25.9251 0.862224ZM0.400049 10.6497L5.62505 15.8747C6.11255 16.3622 6.90005 16.3622 7.38755 15.8747L8.26255 14.9997L2.16255 8.87472C2.04691 8.75884 1.90955 8.66691 1.75833 8.60418C1.60711 8.54146 1.44501 8.50917 1.2813 8.50917C1.11759 8.50917 0.955485 8.54146 0.804268 8.60418C0.653052 8.66691 0.515691 8.75884 0.400049 8.87472C-0.0874512 9.36222 -0.0874512 10.1622 0.400049 10.6497Z"
                  fill="#49B58F"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-slate-600">
              O movimento "{transactionDescription || "Movimento"}" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4">
            <CategoryList />
            {selectedCategory && (
              <div className="mb-8">
                <h3 className="text-base font-medium text-slate-700 mb-4">
                  Descrição
                </h3>
                <textarea
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                  placeholder="Escrever"
                  className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            )}
            {selectedCategory && transactionDescription.trim() && (
              <div className="mt-4">
                <button
                  onClick={handleSave}
                  className="w-full py-4 rounded-xl font-semibold text-white bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 transition-all"
                >
                  Guardar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de sucesso (overlay mobile) */}
      {showSuccessScreen && (
        <div className="md:hidden fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-sm w-full max-w-sm p-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="29"
                height="17"
                viewBox="0 0 29 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.625 0.874725C20.5094 0.758845 20.372 0.666911 20.2208 0.604184C20.0696 0.541457 19.9075 0.509169 19.7438 0.509169C19.5801 0.509169 19.418 0.541457 19.2668 0.604184C19.1156 0.666911 18.9782 0.758845 18.8625 0.874725L11.8125 7.92472L13.575 9.68722L20.625 2.62472C21.1 2.14972 21.1 1.34972 20.625 0.874725ZM25.9251 0.862224L13.575 13.2122L9.22505 8.87472C8.99133 8.641 8.67433 8.5097 8.3438 8.5097C8.01327 8.5097 7.69627 8.641 7.46255 8.87472C7.22883 9.10845 7.09752 9.42544 7.09752 9.75597C7.09752 10.0865 7.22883 10.4035 7.46255 10.6372L12.6875 15.8622C13.175 16.3497 13.9625 16.3497 14.45 15.8622L27.6875 2.63722C27.8034 2.52158 27.8954 2.38422 27.9581 2.233C28.0208 2.08179 28.0531 1.91969 28.0531 1.75597C28.0531 1.59226 28.0208 1.43016 27.9581 1.27894C27.8954 1.12773 27.8034 0.990367 27.6875 0.874725H27.6751C27.5623 0.756727 27.4269 0.662584 27.2771 0.597884C27.1272 0.533184 26.9659 0.499244 26.8027 0.498078C26.6395 0.496912 26.4777 0.528544 26.3269 0.591097C26.1762 0.65365 26.0395 0.745849 25.9251 0.862224ZM0.400049 10.6497L5.62505 15.8747C6.11255 16.3622 6.90005 16.3622 7.38755 15.8747L8.26255 14.9997L2.16255 8.87472C2.04691 8.75884 1.90955 8.66691 1.75833 8.60418C1.60711 8.54146 1.44501 8.50917 1.2813 8.50917C1.11759 8.50917 0.955485 8.54146 0.804268 8.60418C0.653052 8.66691 0.515691 8.75884 0.400049 8.87472C-0.0874512 9.36222 -0.0874512 10.1622 0.400049 10.6497Z"
                  fill="#49B58F"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-slate-600">
              O movimento "{transactionDescription || "Movimento"}" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryScreen;
