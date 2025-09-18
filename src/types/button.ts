import { ButtonHTMLAttributes } from "react";

export type CloseButtonProps = {
  onClick: () => void;
};


export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'google';
  type?: 'submit' | 'button';
  disabled?: any;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  'aria-label': string;
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

export interface Document {
  type: 'image' | 'document';
  name: string;
}

export interface SentDocumentsSectionProps {
  documents: Document[];
  showOptions: boolean;
  onFileSelect: (file: File, type: 'image' | 'document') => void;
}

export interface UploadOptionsProps {
  onFileSelect: (file: File, type: 'image' | 'document') => void
}

export interface NavigationBackProps {
  prev?: () => void
}

export interface MoreButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  color?: string
}
