import { ArticleCardProps } from "@/types/card";
import React from "react";

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onReadMore }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative h-32">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.isNew && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Novo
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {article.description}
        </p>
        <div className="flex flex-col items-end justify-center">
          <button
            onClick={() => onReadMore(article.id)}
            className="flex items-center text-gray-900 text-xs font-medium hover:text-gray-700 transition-colors"
          >
            Saber Mais
            <svg
              className="h-3 w-3 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
