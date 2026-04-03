import type { CategoryResponse } from "./category.dto";

export type GoalType = "SHORT_TERM" | "LONG_TERM";
export type GoalStatus = "ACTIVE" | "AT_RISK" | "DONE" | "ARCHIVED";

export interface GoalRequest {
  title: string;
  description?: string;
  type: GoalType;
  targetAmount: number;
  currentAmount?: number;
  startDate: string;
  endDate: string;
  categoryId: string;
}

export type GoalPayload = GoalRequest;

export interface GoalProgress {
  id: string;
  amount: number;
  progressDate: string;
  createdAt: string;
}

export interface GoalResponse {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  startDate: string;
  endDate: string;
  status: GoalStatus;
  createdAt: string;
  categoryId: string;
  category?: CategoryResponse;
  categoryName?: string;
  progress?: GoalProgress[];
}

export type Goal = GoalResponse;
