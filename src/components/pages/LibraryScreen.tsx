'use client'
import { useState } from "react";
import SearchBar from "../molecules/SearchBar"
import { Article } from "@/src/types/article";
import CategoryFilter from "../molecules/CategoryFilter";
import EmptyState from "../molecules/EmptyState";
import ArticleGrid from "../organisms/ArticleGrid";
import MoreButton from "../atoms/MoreButton";
import BottomNavigation from "../organisms/BottomNavigation";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";

const LibraryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Finanças');
  const [isLoading, setIsLoading] = useState(false);
  const [showArticles, setShowArticles] = useState(true);
  const route = useRouter();

  const categories = ['Finanças', 'Investimentos', 'Poupança', 'Gestão'];

  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'Gerencie o seu dinheiro',
      description: 'Aprenda a cuidar do seudinheiro da maneira certa investindo em...',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg',
      category: 'finanças',
      isNew: true
    },
    {
      id: '2',
      title: 'Como investir o seu dinheiro',
      description: 'Aprenda a cuidar do seudinheiro da maneira certa investindo em...',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg',
      category: 'investimentos',
      isNew: true
    },
    {
      id: '3',
      title: 'Gerencie o seu dinheiro',
      description: 'Aprenda a cuidar do seudinheiro da maneira certa investindo em...',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg',
      category: 'finanças'
    },
    {
      id: '4',
      title: 'Investimentos',
      description: 'Aprenda a cuidar do seudinheiro da maneira certa investindo em...',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg',
      category: 'investimentos'
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleFilterClick = () => {
    // Implement filter modal logic here
    console.log('Filter clicked');
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleReadMore = (articleId: string) => {
    // Navigate to article detail page
    route.push(ROUTES.ARTICLE);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setShowArticles(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20 md:hidden">
      <div className="m-2 flex flex-col flex-1 rounded-2xl bg-white">
        {/* Search Section */}
        <div className=" px-4 py-6 shadow-sm">
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">Artigos Novos</h2>
                <ArticleGrid
                  articles={mockArticles}
                  onReadMore={handleReadMore}
                />
              </div>

              {/* Load More Button */}
              <div className="flex justify-center mt-6">
                <MoreButton
                  label="Ver mais"
                  onClick={handleLoadMore}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};


export default LibraryScreen