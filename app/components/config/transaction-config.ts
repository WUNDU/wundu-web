import type { TransactionType } from "../../types/transaction";
import { ArrowDown, ArrowUp } from "lucide-react";

export const transactionTypeConfig: Record<
  TransactionType,
  {
    color: string;
    background: string;
    sign: "+" | "-";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  income: {
    color: "text-success",
    background: "bg-success/10",
    sign: "+",
    icon: ArrowDown,
  },
  expense: {
    color: "text-danger-300",
    background: "bg-danger-300/10",
    sign: "-",
    icon: ArrowUp,
  },
} as const;
