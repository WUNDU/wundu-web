"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import type { Article } from "@/types/article";

export const useLibraryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Finanças");
  const [isLoading, setIsLoading] = useState(false);
  const [showArticles, setShowArticles] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = () => {};

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

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

  return {
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
  };
};
