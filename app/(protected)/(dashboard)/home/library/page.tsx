"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NoMovementIcon, ArrowRotateIcon, SearchIcon, SettingsIcon, DownloadIcon } from "@/constants/icons";
import { categories, investmentTypes, mockArticles } from "@/constants/mock-data";
import { Button } from "@/components/ui";
import { Article, InvestmentType, InvestmentContentProps } from "@/types/ui";
import { CategoryFilterProps } from "@/types/ui";
import { ROUTES } from "@/constants/routes";

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => (
  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
    {categories.map((category) => (
      <Button
        key={category}
        label={category}
        active={activeCategory === category}
        onClick={() => onCategoryChange(category)}
      />
    ))}
  </div>
);

const InvestmentTypeCard = ({ investmentType }: { investmentType: InvestmentType }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <span className="font-semibold text-gray-900 mr-2">{investmentType.name}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${investmentType.riskLevel}`}></span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{investmentType.description}</p>
    <ul className="space-y-1">
      {investmentType.examples.map((example, index) => (
        <li key={index} className="text-sm text-gray-700 flex items-start">
          <span className="text-gray-400 mr-2">•</span>
          {example}
        </li>
      ))}
    </ul>
  </div>
);

const InvestmentContent: React.FC<InvestmentContentProps & { imageUrl?: string }> = ({ types, imageUrl }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-white md:bg-gray-50 rounded-2xl -mt-6 relative p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🚀</span>
          <h2 className="text-lg font-bold text-gray-900">O que é investimento?</h2>
          <div className="flex flex-col flex-1 items-end justify-end md:items-end-safe md:justify-end-safe">
            <div className="rounded-full p-2 border-2 border-gray-300 hover:border-gray-100 transition-colors md:fixed md:bottom-1 md:right-15 md:p-3 md:bg-gray-200 md:hover:bg-gray-400 md:rounded-full md:text-white md:transition-colors md:shadow-lg md:z-20 lg:block">
              <DownloadIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          Investir é colocar o teu dinheiro a trabalhar por ti, com o objetivo de multiplicá-lo ao longo do tempo.
          Em vez de deixá-lo parado (como debaixo do colchão ou numa conta sem juros), tu aplicas em algo que pode gerar retorno.
        </p>
      </div>
      {imageUrl && (
        <div className="mb-6">
          <img src={imageUrl} alt="Investment illustration" className="w-full h-48 object-cover rounded-tr-3xl rounded-bl-3xl" />
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-2">🧠</span>
          <h2 className="text-lg font-bold text-gray-900">Tipos de investimento</h2>
        </div>
        <div className="space-y-4">
          {types.map((type) => (
            <InvestmentTypeCard key={type.id} investmentType={type} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="more" label="Ler mais" onClick={handleLoadMore} loading={isLoading} color="bg-gray-100 hover:bg-gray-200" />
      </div>
    </div>
  );
};


const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col flex-1 border border-gray-400 px-10 rounded-2xl items-center justify-center">
    <div className="bg-gray-200 mb-4 p-1 rounded-full">
      <NoMovementIcon className="w-10 h-10" />
    </div>
    <p className="text-gray-500 text-center text-sm max-w-xs">{message}</p>
  </div>
);

const SearchBar = ({ placeholder, onSearch, onFilterClick }: { placeholder: string; onSearch: (q: string) => void; onFilterClick: () => void }) => {
  const [query, setQuery] = useState("");
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSearch(query); };
  return (
    <form onSubmit={handleSubmit} className="relative flex flex-row">
      <div className="flex items-center rounded-xl px-4 py-3 border border-gray-300">
        <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
        <input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 bg-transparent text-red-700 placeholder-gray-400 outline-none" />
      </div>
      <div className="flex flex-col flex-1 items-start justify-center">
        <button type="button" onClick={onFilterClick} className="ml-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <SettingsIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </form>
  );
};

const LibraryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Finanças");
  const [isLoading, setIsLoading] = useState(false);
  const [showArticles, setShowArticles] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const router = useRouter();

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleFilterClick = () => {};
  const handleCategoryChange = (category: string) => setActiveCategory(category);

  const handleReadMore = (articleId: string, list: Article[]) => {
    const article = list.find((a) => a.id === articleId);
    if (article) {
      setSelectedArticle(article);
      router.push(ROUTES.ARTICLE);
    }
  };

  const handleSelectArticle = (articleId: string, list: Article[]) => {
    const article = list.find((a) => a.id === articleId) || null;
    setSelectedArticle(article);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowArticles(true);
      setIsLoading(false);
    }, 1500);
  };

  const ArticleCard = ({ article, onReadMore }: { article: Article; onReadMore: (id: string) => void }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative h-32">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        {article.isNew && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Novo
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{article.description}</p>
        <div className="flex flex-col items-end justify-center">
          <button
            onClick={() => onReadMore(article.id)}
            className="flex items-center text-gray-900 text-xs font-medium hover:text-gray-700 transition-colors"
          >
            Saber Mais
            <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const ArticleGrid = ({ articles, onReadMore }: { articles: Article[]; onReadMore: (id: string) => void }) => (
    <div className="grid grid-cols-2 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} onReadMore={onReadMore} />
      ))}
    </div>
  );

  const RightSideContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <SearchBar
          placeholder="Pesquisar por um artigo"
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {!selectedArticle ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <NoMovementIcon />
            </div>
            <p className="text-center">
              Sem artigos abertos. Clique em um dos artigos para visualizar aqui.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <InvestmentContent imageUrl={selectedArticle.imageUrl} types={investmentTypes} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Layout Mobile */}
      <div className="flex flex-col min-h-screen bg-gray-100 pb-6 md:hidden">
        <div className="m-2 flex flex-col flex-1 rounded-2xl bg-white">
          <div className="px-4 py-6 shadow-sm">
            <SearchBar
              placeholder="Pesquisar por um artigo"
              onSearch={handleSearch}
              onFilterClick={handleFilterClick}
            />
          </div>
          <div className="px-4 py-4 bg-white border-b border-gray-100">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="flex flex-1 flex-col px-4 py-6">
            {!showArticles ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <EmptyState message="Sem movimentos artigo para mostrar" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Artigos Novos</h2>
                  <ArticleGrid
                    articles={mockArticles}
                    onReadMore={(id) => handleReadMore(id, mockArticles)}
                  />
                </div>
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
      </div>

      {/* Layout Desktop */}
      <div className="hidden md:flex h-screen bg-gray-50 relative overflow-hidden font-sans antialiased text-gray-800">
          <main className="flex-1 px-4 pb-0 flex h-full overflow-hidden">            <div className="flex flex-1 gap-4 h-full">
              <div className="w-2/5 flex flex-col bg-gray-50 rounded-2xl overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-100">
                  <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
                <div className="flex-1 px-6 py-6 overflow-y-auto">
                  {!showArticles ? (
                    <div className="flex flex-1 flex-col items-center justify-center h-full">
                      <EmptyState message="Sem movimentos artigo para mostrar" />
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 bg-white p-4 rounded-2xl">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Artigos Novos</h2>
                        <ArticleGrid
                          articles={mockArticles}
                          onReadMore={(id) => handleSelectArticle(id, mockArticles)}
                        />
                      </div>
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
              <div className="w-3/5 bg-gray-50 rounded-2xl overflow-hidden">
                <RightSideContent />
              </div>
            </div>
          </main>
      </div>
    </>
  );
};

export default LibraryScreen;
