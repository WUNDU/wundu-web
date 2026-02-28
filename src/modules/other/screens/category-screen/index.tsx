import { defaultCategories } from "@/constants/mock-data";
import { useCategoryContext } from "@/contexts/category-context";
import { Category } from "@/shared/types/category";
import React from "react";
import { useCategoryScreen } from "@/hooks/category/use-category-screen";

interface CategoryScreenProps {
  onCloseOrSuccess?: () => void;
}

const CategoryScreen = ({ onCloseOrSuccess }: CategoryScreenProps) => {
  const {
    selectedCategory,
    setSelectedCategory,
    isCategoryModalOpen,
    transactionDescription,
    setTransactionDescription,
    showSuccessScreen,
    handleCategorySelect,
    handleSave,
    handleClose,
  } = useCategoryScreen(onCloseOrSuccess);

  if (!isCategoryModalOpen) return null;

  return (
    <>
      {/* Mobile: Tela inteira para definir categoria */}
      <div className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto">
        <div className="min-h-screen bg-gray-50">
          {/* Header e Conteúdo para Mobile (inalterado) */}
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
            <h2 className="text-xl font-semibold text-gray-900">Categorias</h2>
            <div className="w-10"></div>
          </div>
          <div className="p-6 bg-gray-100 rounded-2xl">
            <div className="bg-white rounded-2xl p-4">
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-700 mb-6">
                  Categorias padrão
                </h3>
                <div className="flex flex-wrap gap-3">
                  {defaultCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedCategory?.id === category.id
                          ? "bg-yellow-400 text-white shadow-lg scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
              <div className="flex justify-center mb-8">
                <button className="w-14 h-14 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  <svg
                    className="w-7 h-7"
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
              </div>
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

      {/* Desktop: Altera o conteúdo com base no estado de sucesso */}
      <div className="hidden md:block mt-2 w-full h-full overflow-y-auto">
        {/* Condicional para renderização de sucesso vs. formulário */}
        {showSuccessScreen ? (
          <div className="bg-white rounded-2xl shadow-lg w-full p-8 text-center flex flex-col items-center justify-center h-full">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-gray-600">
              O movimento "Débito" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4">
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-700 mb-6">
                Categorias padrão
              </h3>
              <div className="rounded-2xl border-2 border-gray-100 p-8">
                <div className="flex flex-wrap gap-3">
                  {defaultCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                        selectedCategory?.id === category.id
                          ? "bg-yellow-400 text-white shadow-lg scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
                <div className="flex justify-end-safe mb-8">
                  <button className="w-14 h-14 border-2 border-dashed border-blue-300 rounded-full flex items-center justify-center text-blue-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                    <svg
                      className="w-7 h-7"
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
                </div>
              </div>
            </div>
            {selectedCategory && (
              <div className="mb-8">
                <h3 className="text-base font-medium text-gray-700 mb-4">
                  Descrição
                </h3>
                <textarea
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                  placeholder="Escrever"
                  className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
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

      {/* Modal de sucesso (overlay) */}
      {showSuccessScreen && (
        <div className="md:hidden fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categoria definida com sucesso
            </h3>
            <p className="text-sm text-gray-600">
              O movimento "Débito" foi definido na categoria{" "}
              {selectedCategory?.name.toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryScreen;
