import React from "react";
import NavigationBack from "../atoms/NavigationBack";

interface ArticleHeaderProps {
  onBack: () => void;
  onDownload?: () => void;
  backgroundImage?: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  onBack,
  onDownload,
  backgroundImage,
}) => {
  return (
    <div className="relative rounded-t-2xl h-48 bg-gradient-to-br  overflow-hidden">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Article background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Candlestick chart overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t" />

      <div className="relative flex items-start justify-between p-4 pt-12">
        <NavigationBack color="text-white" />
      </div>
    </div>
  );
};

export default ArticleHeader;
