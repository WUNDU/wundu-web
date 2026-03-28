"use client";
import SidebarRight from "@/shared/components/side-bar-right";
import { NoMovementIcon } from "@/constants/icons";

import {
  categories,
  investmentTypes,
  mockArticles,
} from "@/constants/mock-data";
import {
  ArticleGrid,
  BottomNavigation,
  Button,
  CategoryFilter,
  EmptyState,
  GreetingHeader,
  InvestmentContent,
  SearchBar,
} from "@/shared/components";
import { ArrowRotateIcon } from "@/constants/icons";
import { Article } from "@/shared/types/article";
import { useSidebar } from "@/hooks/layout/use-sidebar";
import { useLibraryScreen } from "@/hooks/library/use-library-screen";

const LibraryScreen = () => {
  const { isLeftOpen, isRightOpen, toggleLeft, toggleRight } = useSidebar(
    true,
    false,
  );
  const {
    searchQuery,
    activeCategory,
    isLoading,
    showArticles,
    selectedArticle,
    setSelectedArticle,
    handleSearch,
    handleFilterClick,
    handleCategoryChange,
    handleReadMore,
    handleSelectArticle,
    handleLoadMore,
  } = useLibraryScreen();

  const RightSideContent = () => {
    return (
      <div className="h-full flex flex-col">
        {/* Search Bar - sempre visível */}
        <div className="p-6 border-b border-gray-100">
          <SearchBar
            placeholder="Pesquisar por um artigo"
            onSearch={handleSearch}
            onFilterClick={handleFilterClick}
          />
        </div>

        {/* Conteúdo do artigo usando InvestmentContent */}
        <div className="flex-1 overflow-y-auto">
          {!selectedArticle ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <NoMovementIcon />
              </div>
              <p className="text-center">
                Sem artigos abertos. Clique em um dos artigos para visualizar
                aqui.
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Imagem do artigo com bordas específicas */}

              {/* Usa o InvestmentContent do ArticleDetailScreen */}
              <InvestmentContent
                imageUrl={selectedArticle.imageUrl}
                types={investmentTypes}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Layout Mobile - Mantém exatamente igual */}
      <div className="flex flex-col min-h-screen bg-gray-100 pb-20 md:hidden">
        <div className="m-2 flex flex-col flex-1 rounded-2xl bg-white">
          {/* Search Section */}
          <div className="px-4 py-6 shadow-sm">
            <SearchBar
              placeholder="Pesquisar por um artigo"
              onSearch={handleSearch}
              onFilterClick={handleFilterClick}
            />
          </div>

          {/* Category Filter */}
          <div className="px-4 py-4 bg-white border-b border-gray-100">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col px-4 py-6">
            {!showArticles ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <EmptyState message="Sem movimentos artigo para mostrar" />
              </div>
            ) : (
              <>
                {/* New Articles Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Artigos Novos
                  </h2>
                  <ArticleGrid
                    articles={mockArticles}
                    onReadMore={(id) => handleReadMore(id, mockArticles)}
                  />
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-6">
                  <Button
                    variant="more"
                    label="Ver mais"
                    rightIcon={<ArrowRotateIcon />}
                    onClick={handleLoadMore}
                    loading={isLoading}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <BottomNavigation />
      </div>

      {/* Layout Desktop - Seguindo exatamente a imagem */}
      <div className="hidden md:flex h-screen bg-gray-50 relative overflow-hidden font-sans antialiased text-gray-800">
        {/* Conteúdo Principal */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isLeftOpen ? "md:ml-64" : "md:ml-0"
          } h-full`}
        >
          <GreetingHeader onToggleSidebar={toggleRight} />

          {/* Container principal */}
          <main className="flex-1 px-4 pb-0 flex h-full overflow-hidden">
            <div className="flex flex-1 gap-4 h-full">
              {/* Área esquerda - Lista de artigos (menor espaço) */}
              <div className="w-2/5 flex flex-col bg-gray-50 rounded-2xl overflow-hidden">
                {/* Category Filter - mesmo nível do searchbar */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-6 overflow-y-auto">
                  {!showArticles ? (
                    <div className="flex flex-1 flex-col items-center justify-center h-full">
                      <EmptyState message="Sem movimentos artigo para mostrar" />
                    </div>
                  ) : (
                    <>
                      {/* New Articles Section */}
                      <div className="mb-6 bg-white p-4 rounded-2xl">
                        <h2 className="text-lg font-bold  text-gray-900 mb-4">
                          Artigos Novos
                        </h2>
                        <ArticleGrid
                          articles={mockArticles}
                          onReadMore={(id) =>
                            handleSelectArticle(id, mockArticles)
                          }
                        />
                      </div>

                      {/* Load More Button */}
                      <div className="flex justify-center mt-6">
                        <Button
                          variant="more"
                          label="Ver mais"
                          rightIcon={<ArrowRotateIcon />}
                          onClick={handleLoadMore}
                          loading={isLoading}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Área direita - Visualização do artigo (maior espaço) */}
              <div className="w-3/5 bg-gray-50 rounded-2xl overflow-hidden">
                <RightSideContent />
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar Direito */}
        <SidebarRight isOpen={isRightOpen} onClose={toggleRight} />
      </div>
    </>
  );
};

export default LibraryScreen;
