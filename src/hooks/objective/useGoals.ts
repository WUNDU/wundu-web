"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Goal, GoalsService } from "@/services/GoalsService";

const currencyFormatter = new Intl.NumberFormat("pt-AO", {
  style: "currency",
  currency: "AOA",
  minimumFractionDigits: 2,
});

export const formatGoalCurrency = (value?: number) =>
  currencyFormatter.format(value ?? 0);

export const getGoalProgress = (goal: Goal): number => {
  const target = goal.targetAmount ?? 0;
  if (!target) {
    return 0;
  }
  const current = goal.currentAmount ?? 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

export interface GoalCardData {
  id: Goal["id"];
  title: string;
  valorAlvo: string;
  valorPoupado: string;
  percentage: number;
  goal: Goal;
}

export const buildGoalCardData = (goal: Goal): GoalCardData => ({
  id: goal.id,
  title: goal.title ?? "Objetivo sem título",
  valorAlvo: formatGoalCurrency(goal.targetAmount),
  valorPoupado: formatGoalCurrency(goal.currentAmount),
  percentage: getGoalProgress(goal),
  goal,
});

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string>("");

  const fetchGoals = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await GoalsService.list();
      setGoals(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os objetivos."
      );
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const fulfilledGoals = useMemo(
    () => goals.filter((goal) => getGoalProgress(goal) >= 100),
    [goals]
  );

  const unfulfilledGoals = useMemo(
    () => goals.filter((goal) => getGoalProgress(goal) < 100),
    [goals]
  );

  const fulfilledGoalCards = useMemo(
    () => fulfilledGoals.map(buildGoalCardData),
    [fulfilledGoals]
  );

  const unfulfilledGoalCards = useMemo(
    () => unfulfilledGoals.map(buildGoalCardData),
    [unfulfilledGoals]
  );

  return {
    goals,
    fulfilledGoalCards,
    unfulfilledGoalCards,
    status,
    error,
    refreshGoals: fetchGoals,
  };
};
