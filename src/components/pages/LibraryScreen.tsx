"use client";

import { useState } from "react";
import SearchBar from "../molecules/SearchBar";
import { Article } from "@/src/types/article";
import CategoryFilter from "../molecules/CategoryFilter";
import EmptyState from "../molecules/EmptyState";
import ArticleGrid from "../organisms/ArticleGrid";
import BottomNavigation from "../organisms/BottomNavigation";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import GreetingHeader from "../molecules/GreetingHeader";
import SidebarRight from "../molecules/SideBarRight";
import { NoMovementIcon } from "@/src/constants/icons";
import InvestmentContent from "../organisms/InvestmentContent";
import {
  categories,
  investmentTypes,
  mockArticles,
} from "@/src/constants/mockData";
import Button from "../atoms/Button";
import ArrowRotate from "../icons/ArrowRotate";

const LibraryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Finanças");
  const [isLoading, setIsLoading] = useState(false);
  const [showArticles, setShowArticles] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilterClick = () => {
    // Implement filter modal logic here
    console.log("Filter clicked");
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleReadMore = (articleId: string) => {
    const article = mockArticles.find((a) => a.id === articleId);
    if (article) {
      setSelectedArticle(article);
      // No mobile, navega para a página de detalhes
      // No desktop, mostra o conteúdo na sidebar direita
      router.push(ROUTES.ARTICLE);
    }
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setShowArticles(true);
      setIsLoading(false);
    }, 1500);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  // Componente para o conteúdo da área direita no desktop
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
                    onReadMore={handleReadMore}
                  />
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-6">
                  <Button
                    variant="more"
                    label="Ver mais"
                    rightIcon={<ArrowRotate />}
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
            isSidebarOpen ? "md:ml-64" : "md:ml-0"
          } h-full`}
        >
          <GreetingHeader onToggleSidebar={toggleSidebarRight} />

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
                          onReadMore={(articleId) => {
                            const article = mockArticles.find(
                              (a) => a.id === articleId
                            );
                            if (article) {
                              setSelectedArticle(article);
                            }
                          }}
                        />
                      </div>

                      {/* Load More Button */}
                      <div className="flex justify-center mt-6">
                        <Button
                          variant="more"
                          label="Ver mais"
                          rightIcon={<ArrowRotate />}
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
        <SidebarRight
          isOpen={isSidebarRightOpen}
          onClose={toggleSidebarRight}
        />
      </div>
    </>
  );
};

export default LibraryScreen;
