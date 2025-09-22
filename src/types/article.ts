export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'finanças' | 'investimentos' | 'poupança' | 'gestão';
  readTime?: string;
  isNew?: boolean;
}

export interface InvestmentType {
  id: string;
  name: string;
  description: string;
  riskLevel: 'baixo' | 'médio' | 'alto';
  examples: string[];
}

export interface InvestmentContentProps {
  types: InvestmentType[];
}

export interface ArticleGridProps {
  articles: Article[];
  onReadMore: (articleId: string) => void;
}
