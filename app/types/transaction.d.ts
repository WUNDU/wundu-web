import type { TransactionDTO } from "./dto/transaction.dto";

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Levantamento"
  | "Transporte"
  | "Freelance"
  | "Educação"
  | "Salário"
  | "Saúde"
  | "Outros"
  | "Alimentação"
  | "Habitação"
  | "Lazer"
  | "Negócio"
  | "Biscato";


export interface TransactionItemProps {
  transaction: TransactionDTO;
  /** Abre o formulário para editar esta transação. */
  onSelect?: () => void;
}

type CategoryConfig = {
  icon: React.ComponentType<{ className?: string }>;
  /** Cor do texto */
  color: string;
  /** Cor do ícone (por omissão usa `color`) */
  iconColor?: string;
  /** Fundo tintado */
  background: string;
  /** Fluxo da categoria (tem de coincidir com o tipo da transação). */
  flow: "INCOME" | "EXPENSE";
};

export interface TransactionGroup {
  dateKey: string;
  label: string;
  items: TransactionDTO[];
}
