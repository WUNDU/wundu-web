"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  NoMovementIcon,
  ArrowRotateIcon,
  SearchIcon,
  SettingsIcon,
  DownloadIcon,
} from "@/constants/icons";
import { categories, investmentTypes, mockArticles } from "@/constants/mock-data";
import { Button } from "@/components/ui";
import { Article, InvestmentType, InvestmentContentProps } from "@/types/ui";
import { CategoryFilterProps } from "@/types/ui";
import { ROUTES } from "@/constants/routes";

const EASE_OUT = "easeOut" as const;

const sectionAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } },
};

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
  <motion.div
    variants={sectionAnim}
    className="mb-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
  >
    <div className="flex items-center mb-2">
      <span className="font-semibold text-slate-900 mr-2">{investmentType.name}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${investmentType.riskLevel}`}></span>
    </div>
    <p className="text-slate-600 text-sm mb-3">{investmentType.description}</p>
    <ul className="space-y-1.5">
      {investmentType.examples.map((example, index) => (
        <li key={index} className="text-sm text-slate-700 flex items-start">
          <span className="text-[#003cc3] mr-2">•</span>
          {example}
        </li>
      ))}
    </ul>
  </motion.div>
);

const InvestmentContent: React.FC<InvestmentContentProps & { imageUrl?: string }> = ({
  types,
  imageUrl,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={sectionAnim}
      className="bg-white rounded-xl relative p-3 lg:p-4 border border-slate-100 shadow-sm"
    >
      <div className="mb-3">
        <div className="flex items-center mb-3">
          <span className="text-sm mr-2">🚀</span>
          <h2 className="text-sm font-bold text-slate-900">O que é investimento?</h2>
          <div className="flex flex-col flex-1 items-end justify-end">
            <button className="rounded-xl p-2 border border-slate-200 bg-slate-50 hover:bg-[#fff9d6] transition-colors shadow-sm">
              <DownloadIcon className="h-5 w-5 text-[#003cc3]" />
            </button>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Investir é colocar o teu dinheiro a trabalhar por ti, com o objetivo de multiplicá-lo ao
          longo do tempo. Em vez de deixá-lo parado, tu aplicas em algo que pode gerar retorno.
        </p>
      </div>

      {imageUrl && (
        <motion.div variants={sectionAnim} className="mb-3">
          <img
            src={imageUrl}
            alt="Investment illustration"
            className="w-full h-32 sm:h-36 object-cover rounded-lg border border-slate-100"
          />
        </motion.div>
      )}

      <div className="mb-3">
        <div className="flex items-center mb-3">
          <span className="text-sm mr-2">🧠</span>
          <h2 className="text-sm font-bold text-slate-900">Tipos de investimento</h2>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.05 }}
          className="space-y-3"
        >
          {types.map((type) => (
            <InvestmentTypeCard key={type.id} investmentType={type} />
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="more"
          label="Ler mais"
          onClick={handleLoadMore}
          loading={isLoading}
          color="bg-slate-100 hover:bg-slate-200"
        />
      </div>
    </motion.div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col flex-1 border border-slate-100 px-4 rounded-xl items-center justify-center bg-white">
    <div className="bg-slate-100 mb-3 p-2 rounded-full">
      <NoMovementIcon className="w-8 h-8 text-slate-500" />
    </div>
    <p className="text-slate-500 text-center text-sm max-w-xs">{message}</p>
  </div>
);

const SearchBar = ({
  placeholder,
  onSearch,
  onFilterClick,
}: {
  placeholder: string;
  onSearch: (q: string) => void;
  onFilterClick: () => void;
}) => {
  const [query, setQuery] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-row">
      <div className="flex flex-1 items-center rounded-xl px-4 py-2.5 border border-slate-200 bg-white">
        <SearchIcon className="h-5 w-5 text-slate-400 mr-3" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 outline-none"
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <button
          type="button"
          onClick={onFilterClick}
          className="ml-2.5 p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
        >
          <SettingsIcon className="h-5 w-5 text-[#003cc3]" />
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

  const visibleArticles = useMemo(() => {
    if (!searchQuery.trim()) return mockArticles;
    const q = searchQuery.toLowerCase();
    return mockArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q),
    );
  }, [searchQuery]);

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

  const ArticleCard = ({
    article,
    onReadMore,
  }: {
    article: Article;
    onReadMore: (id: string) => void;
  }) => (
    <motion.div
      variants={sectionAnim}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
    >
      <div className="relative h-32">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        {article.isNew && (
          <div className="absolute top-2 right-2 bg-[#003cc3] text-white text-xs px-2 py-1 rounded-full">
            Novo
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-slate-600 text-xs mb-3 line-clamp-2">{article.description}</p>
        <div className="flex flex-col items-end justify-center">
          <button
            onClick={() => onReadMore(article.id)}
            className="flex items-center text-[#003cc3] text-xs font-semibold hover:text-[#002fa0] transition-colors"
          >
            Saber Mais
            <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ArticleGrid = ({
    articles,
    onReadMore,
  }: {
    articles: Article[];
    onReadMore: (id: string) => void;
  }) => (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} onReadMore={onReadMore} />
      ))}
    </motion.div>
  );

  const RightSideContent = () => (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="p-3 lg:p-4 border-b border-slate-100">
        <SearchBar
          placeholder="Pesquisar por um artigo"
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {!selectedArticle ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <NoMovementIcon />
            </div>
            <p className="text-center text-sm">
              Sem artigos abertos. Clique em um dos artigos para visualizar aqui.
            </p>
          </div>
        ) : (
          <div className="p-3 lg:p-4">
            <InvestmentContent imageUrl={selectedArticle.imageUrl} types={investmentTypes} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Layout Mobile */}
      <div className="flex flex-col min-h-screen bg-slate-100 pb-4 sm:pb-6 lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="m-2 sm:m-3 flex flex-col flex-1 rounded-xl bg-white border border-slate-100 shadow-sm"
        >
          <div className="px-4 py-4 sm:py-5 border-b border-slate-100">
            <SearchBar
              placeholder="Pesquisar por um artigo"
              onSearch={handleSearch}
              onFilterClick={handleFilterClick}
            />
          </div>
          <div className="px-4 py-4 bg-white border-b border-slate-100">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="flex flex-1 flex-col px-4 py-4 sm:py-5">
            {!showArticles ? (
              <div className="flex flex-1 flex-col items-center justify-center">
                <EmptyState message="Sem movimentos artigo para mostrar" />
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Artigos Novos</h2>
                  <ArticleGrid
                    articles={visibleArticles}
                    onReadMore={(id) => handleReadMore(id, visibleArticles)}
                  />
                </div>
                <div className="flex justify-center mt-3">
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
        </motion.div>
      </div>

      {/* Layout Desktop */}
      <div className="hidden lg:flex h-screen bg-slate-50 relative overflow-hidden font-sans antialiased text-gray-800">
        <main className="flex-1 px-3 lg:px-4 pb-0 flex h-full overflow-hidden">
          <div className="flex flex-1 gap-3 lg:gap-4 h-full py-3 lg:py-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="lg:w-[42%] xl:w-2/5 flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm"
            >
              <div className="px-4 lg:px-5 py-4 lg:py-5 border-b border-slate-100">
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
              <div className="flex-1 px-4 lg:px-5 py-4 lg:py-5 overflow-y-auto">
                {!showArticles ? (
                  <div className="flex flex-1 flex-col items-center justify-center h-full">
                    <EmptyState message="Sem movimentos artigo para mostrar" />
                  </div>
                ) : (
                  <>
                    <div className="mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900 mb-3">Artigos Novos</h2>
                      <ArticleGrid
                        articles={visibleArticles}
                        onReadMore={(id) => handleSelectArticle(id, visibleArticles)}
                      />
                    </div>
                    <div className="flex justify-center mt-3">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.04 }}
              className="lg:w-[58%] xl:w-3/5"
            >
              <RightSideContent />
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LibraryScreen;
