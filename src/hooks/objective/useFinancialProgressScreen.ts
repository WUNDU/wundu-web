"use client";

import { useState } from "react";
import { useGoals } from "@/hooks/objective/useGoals";

export const useFinancialProgressScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);
  const { unfulfilledGoalCards, fulfilledGoalCards, status, error } = useGoals();

  const handleEdit = (obj: any) => {
    setSelectedObjective({
      ...obj,
      categoria: "Viagem",
      prioridade: "Alta",
      dataLimite: "01/01/2026",
    });
    setIsModalOpen(true);
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
  };
};
