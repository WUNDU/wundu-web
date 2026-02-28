import React from "react";
import ArticleCard from "@/shared/components/article-card";
import { ArticleGridProps } from "@/shared/types/article";

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onReadMore }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onReadMore={onReadMore}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;
