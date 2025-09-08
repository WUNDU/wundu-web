export interface InputProps {
  id?: string
  label: string;
  type: string;
  placeholder: string;
  isError?: boolean;
  required?: boolean
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}