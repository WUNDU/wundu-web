"use client";

import { useState } from "react";

export const useFinancialProgressScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);

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
  };
};
