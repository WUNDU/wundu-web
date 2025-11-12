"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { objectives } from "@/constants/mockData";

export const useFinancialObjectiveScreen = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
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

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const toggleSidebarRight = () => setIsSidebarRightOpen((v) => !v);

  const handleFinancialNewObjective = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowForm(true);
    } else {
      router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
    }
  };

  const handleFinancialObjective = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowForm(false);
    } else {
      router.push(ROUTES.FINANCIAL_OBJECTIVE);
    }
  };

  const fulfilledObjectives = objectives.filter((obj) => obj.percentage === 100);
  const unfulfilledObjectives = objectives.filter((obj) => obj.percentage < 100);

  return {
    isSidebarOpen,
    isSidebarRightOpen,
    toggleSidebar,
    toggleSidebarRight,
    showForm,
    isModalOpen,
    setIsModalOpen,
    selectedObjective,
    setSelectedObjective,
    handleEdit,
    handleFinancialNewObjective,
    handleFinancialObjective,
    fulfilledObjectives,
    unfulfilledObjectives,
  };
};
