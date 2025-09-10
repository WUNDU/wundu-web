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