import type { Goal } from "@/types/dtos/goal.dto";
import { formatAOA } from "@/lib/currency";

export const formatGoalCurrency = (value?: number) => formatAOA(value ?? 0);

const clampProgress = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const getGoalProgress = (goal: Goal): number => {
  const backendProgress =
    typeof goal.progressPercentage === "number"
      ? goal.progressPercentage
      : undefined;

  if (typeof backendProgress === "number") {
    return clampProgress(backendProgress);
  }

  const target = goal.targetAmount ?? 0;
  if (!target) return 0;
  const current = goal.currentAmount ?? 0;
  return clampProgress((current / target) * 100);
};

export interface GoalCardData {
  id: Goal["id"];
  title: string;
  valorAlvo: string;
  valorPoupado: string;
  percentage: number;
  isCompleted: boolean;
  canEdit: boolean;
  goal: Goal;
}

export const buildGoalCardData = (goal: Goal): GoalCardData => ({
  id: goal.id,
  title: goal.title ?? "Objetivo sem título",
  valorAlvo: formatGoalCurrency(goal.targetAmount),
  valorPoupado: formatGoalCurrency(goal.currentAmount),
  percentage: getGoalProgress(goal),
  isCompleted: getGoalProgress(goal) >= 100,
  canEdit: getGoalProgress(goal) < 100,
  goal,
});
