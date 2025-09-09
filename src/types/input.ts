export interface InputProps {
  id?: string
  label: string;
  type: string;
  placeholder: string;
  isError?: boolean;
  required?: boolean
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLenght?: number
}

export interface CodeInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
  isSuccess?: boolean
}