import type { TransactionCategory } from "../transaction";

export type GoalType = "SHORT_TERM" | "LONG_TERM";

export interface GoalDTO {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  category: TransactionCategory;
  categoryId: string;
}
