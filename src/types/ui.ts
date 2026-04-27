import { ButtonHTMLAttributes, ReactNode } from "react";
import type { Goal } from "@/types/dtos/goal.dto";

// ─── article ──────────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: "finanças" | "investimentos" | "poupança" | "gestão";
  readTime?: string;
  isNew?: boolean;
}

export interface InvestmentType {
  id: string;
  name: string;
  description: string;
  riskLevel: "baixo" | "médio" | "alto";
  examples: string[];
}

export interface InvestmentContentProps {
  types: InvestmentType[];
}

export interface ArticleGridProps {
  articles: Article[];
  onReadMore: (articleId: string) => void;
}

// ─── button ───────────────────────────────────────────────────────────────────

export type CloseButtonProps = {
  onClick: () => void;
};

export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "google";
  type?: "submit" | "button";
  disabled?: any;
}

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  "aria-label": string;
}

export interface OptionButtonProps {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
}

export interface CategoryButtonProps {
  label: string;
  onClick?: () => void;
}

export interface UploadProps {
  onUploadClick: () => void;
}

export type DocumentType = "image" | "document" | "transaction";

export interface Document {
  type: DocumentType;
  name: string;
  description?: string;
  amount?: number;
  category?: string;
  timestamp?: string;
  isIncome?: boolean;
  color?: string;
}

export interface SentDocumentsSectionProps {
  documents: Document[];
  showOptions: boolean;
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick?: () => void;
}

export interface UploadOptionsProps {
  onFileSelect: (file: File, type: "image" | "document") => void;
  onManualClick?: () => void;
}

export interface NavigationBackProps {
  prev?: () => void;
  color?: string;
}

export interface MoreButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  color?: string;
  label: string;
}

export interface OptionChatButtonProps {
  label: string;
}

export interface LandingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
}

// ─── card ─────────────────────────────────────────────────────────────────────

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

// ─── ctaSection ───────────────────────────────────────────────────────────────

export interface CtaSectionProps {
  title: string;
  subtitle: string;
  isError?: boolean;
}

export interface DetailsSectionProps {
  icon?: React.ReactNode;
  label?: string;
  children: React.ReactNode;
}

export interface StatsSectionProps {
  totalFiles: number;
  totalProofs: number;
  totalImages: number;
}

// ─── form ─────────────────────────────────────────────────────────────────────

export interface FormSectionProps {
  onLogin: () => void;
  onErrorChange?: (hasError: boolean) => void;
}

// ─── header ───────────────────────────────────────────────────────────────────

export interface HeaderProps {
  userName: string;
}

// ─── icon (nav) ───────────────────────────────────────────────────────────────

export interface NavIconProps {
  isActive?: boolean;
}

// ─── input ────────────────────────────────────────────────────────────────────

export interface InputProps {
  id?: string;
  label: string;
  type: string;
  placeholder: string;
  isError?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLenght?: number;
}

export interface CodeInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
  isSuccess?: boolean;
}

export interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  onFilterClick: () => void;
}

// ─── item ─────────────────────────────────────────────────────────────────────

export interface BenefitItemProps {
  icon: React.ReactNode;
  text: string;
}

// ─── logo ─────────────────────────────────────────────────────────────────────

export interface LogoProps {
  src: string;
}

// ─── message ──────────────────────────────────────────────────────────────────

export interface MessageProps {
  text: string;
  isUser: boolean;
}

// ─── modal ────────────────────────────────────────────────────────────────────

export type ModalType = "success" | "error" | "info" | null;

export type ModalIconProps = {
  type: "success" | "error" | "info" | null;
};

export type ModalContentProps = {
  type: ModalType;
  title: string;
  message: string;
};

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  title: string;
  message: string;
  onClose: () => void;
  openModal: (
    type: ModalType,
    title: string,
    message: string,
    onClose?: () => void,
  ) => void;
  closeModal: () => void;
}

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export interface DetailsModalProps {
  onClose: () => void;
}

export interface SuccessModalProps {
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Goal | null;
  onUpdated?: () => void;
}

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: {
    type: string;
    amount: number;
    description: string;
    transactionDate: string;
    category_id: string;
  }) => void;
}

// ─── panel ────────────────────────────────────────────────────────────────────

export interface IconProps {
  initials: string;
  color: string;
  bgColor: string;
  chartColor?: string;
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

export interface ChartProps {
  data: ChartDataPoint[];
  lineColor: string;
  dotColor: string;
  selectedMonth?: string;
  className?: string;
}

export interface PanelHeaderProps {
  title: string;
  amount: number;
  isCredit: boolean;
}

export interface TransactionsListProps {
  transactions: TransactionProps[];
}

export type ViewMode = "line" | "pie" | "bar";
export type TimeRange = "1D" | "1S" | "1M" | "6M" | "1A";

export interface DashboardPageProps {
  data: ChartDataPoint[];
  transactions: TransactionProps[];
}

// ─── profile ──────────────────────────────────────────────────────────────────

export interface ProfileTemplateProps {
  userName: string;
  onEditAvatar?: () => void;
  onMenuItemClick: (menuText: string) => void;
  onControlPanelClick?: () => void;
}

// ─── route ────────────────────────────────────────────────────────────────────

export interface ProtectedRouteProps {
  children: ReactNode;
}

// ─── select ───────────────────────────────────────────────────────────────────

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

// ─── sidebar ──────────────────────────────────────────────────────────────────

export interface SidebarRightProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── password ─────────────────────────────────────────────────────────────────

export interface PasswordResetData {
  phoneOrEmail?: string;
  code?: string;
  newPassword?: string;
}

// ─── category (UI only) ───────────────────────────────────────────────────────

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}
