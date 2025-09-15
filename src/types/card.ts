export interface StatsCardProps {
  icon: React.ElementType;
  count: number;
  label: string;
  color: string;
  iconColor: string
  border?: string
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
  iconColor?: string
}