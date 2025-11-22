"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/objective/useGoals";
import type { Goal } from "@/services/GoalsService";

export const useFinancialProgressScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Goal | null>(null);
  const { unfulfilledGoalCards, fulfilledGoalCards, status, error, refreshGoals } = useGoals();

  const handleEdit = (goal: Goal) => {
    if (!goal) {
      return;
    }
    setSelectedObjective(goal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedObjective(null);
  };

  const handleModalUpdated = () => {
    refreshGoals();
  };

  return {
    isModalOpen,
    setIsModalOpen,
    selectedObjective,
    setSelectedObjective,
    handleEdit,
    unfulfilledObjectives: unfulfilledGoalCards,
    fulfilledObjectives: fulfilledGoalCards,
    goalsStatus: status,
    goalsError: error,
    refreshGoals,
    handleModalClose,
    handleModalUpdated,
  };
};
