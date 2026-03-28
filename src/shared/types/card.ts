import { Article } from "./article";

export interface StatsCardProps {
  icon: React.ElementType;
  count: number | string;
  label: string;
  color: string;
  iconColor: string;
  border?: string;
}

export interface FinancialObjectiveCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  borderColor: string;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

export interface IconContainerProps {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  className?: string;
}

export interface FinancialProgressCardProps {
  title: string;
  valorAlvo: string;
  valorPoupado: string;
  percentage: number;
  iconColor?: string;
  onEdit?: () => void;
  isCompleted?: boolean;
}

export interface ArticleCardProps {
  article: Article;
  onReadMore: (articleId: string) => void;
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}