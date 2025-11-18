"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useGoals } from "@/hooks/objective/useGoals";
import {
  clearGoalDraftStorage,
  getGoalDraft,
  GOAL_DRAFT_COMMIT_EVENT,
  GOAL_DRAFT_CONTINUE_EVENT,
  GOAL_DRAFT_EVENT,
} from "@/hooks/objective/useObjectiveForm";

export const useFinancialObjectiveScreen = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<any>(null);
  const [hasDraft, setHasDraft] = useState(() => Boolean(getGoalDraft()));
  const {
    fulfilledGoalCards,
    unfulfilledGoalCards,
    status,
    error,
    refreshGoals,
  } = useGoals();

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

  const dispatchDraftCommit = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(GOAL_DRAFT_COMMIT_EVENT));
    }
  };

  const handleFinancialNewObjective = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowForm(true);
      refreshGoals();
    } else {
      dispatchDraftCommit();
      router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
    }
  };

  const handleFinancialObjective = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (showForm) {
        dispatchDraftCommit();
      }
      setShowForm(false);
      refreshGoals();
    } else {
      dispatchDraftCommit();
      router.push(ROUTES.FINANCIAL_OBJECTIVE);
    }
  };

  useEffect(() => {
    const listener = () => setHasDraft(Boolean(getGoalDraft()));
    if (typeof window !== "undefined") {
      window.addEventListener(GOAL_DRAFT_EVENT, listener);
      setHasDraft(Boolean(getGoalDraft()));
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(GOAL_DRAFT_EVENT, listener);
      }
    };
  }, []);

  const handleDraftContinue = () => {
    setShowForm(true);
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event(GOAL_DRAFT_CONTINUE_EVENT));
      });
    }
  };

  const handleDraftDiscard = () => {
    clearGoalDraftStorage();
    setHasDraft(false);
    if (typeof window !== "undefined") {
      dispatchDraftCommit();
    }
  };

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
    fulfilledObjectives: fulfilledGoalCards,
    unfulfilledObjectives: unfulfilledGoalCards,
    goalsStatus: status,
    goalsError: error,
    refreshGoals,
    hasDraft,
    handleDraftContinue,
    handleDraftDiscard,
  };
};
