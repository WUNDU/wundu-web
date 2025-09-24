// Átomos
export interface IconProps {
  initials: string;
  color: string;
  bgColor: string;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export interface TransactionProps {
  icon: IconProps;
  title: string;
  transactions: number;
  amount: number;
  percentage: number;
}

export interface TabProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
}

// Moléculas
export interface ChartProps {
  data: ChartDataPoint[];
  lineColor: string;
  dotColor: string;
  selectedMonth?: string;
}

export interface HeaderProps {
  title: string;
  amount: number;
  isCredit: boolean;
}

// Organismos
export interface TransactionsListProps {
  transactions: TransactionProps[];
}

// Páginas
export type ViewMode = 'line' | 'pie' | 'bar';
export type TimeRange = '1D' | '1S' | '1M' | '6M' | '1A';

export interface DashboardPageProps {
  data: ChartDataPoint[];
  transactions: TransactionProps[];
}
