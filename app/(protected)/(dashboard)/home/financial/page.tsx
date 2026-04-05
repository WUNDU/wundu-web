"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import {
  DocumentIcon,
  HistoryIcon,
  NoMovementIcon,
  PlusIcon,
} from "@/constants/icons";
import { Button } from "@/components/ui";
import EditModal from "@/components/ui/edit-modal";
import { buildGoalCardData, getGoalProgress } from "@/store/goal-store";
import { useGoal } from "@/hooks/use-goal";
import type { Goal } from "@/types/dtos/goal.dto";
import {
  GOAL_DRAFT_COMMIT_EVENT,
  GOAL_DRAFT_CONTINUE_EVENT,
  GOAL_DRAFT_EVENT,
  clearGoalDraftStorage,
  getGoalDraft,
} from "@/utils/goal-draft";
import FinancialProgressCard from "@/components/financial/financial-progress-card";
import { IconContainer } from "@/components/financial/financial-progress-card";
import ObjectiveForm from "@/components/financial/objective-form";

const FinancialObjectiveScreen: React.FC = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Goal | null>(null);
  const [hasDraft, setHasDraft] = useState(() => Boolean(getGoalDraft()));
  const { goals, isLoading, error, refreshGoals: refresh } = useGoal();

  const fulfilledObjectives = useMemo(
    () => goals.filter((g) => getGoalProgress(g) >= 100).map(buildGoalCardData),
    [goals],
  );

  const unfulfilledObjectives = useMemo(
    () => goals.filter((g) => getGoalProgress(g) < 100).map(buildGoalCardData),
    [goals],
  );

  const handleEdit = (goal: Goal) => {
    if (!goal) return;
    setSelectedObjective(goal);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedObjective(null);
  };

  const handleModalUpdated = () => {
    refresh();
  };

  const dispatchDraftCommit = () => {
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event(GOAL_DRAFT_COMMIT_EVENT));
  };

  const handleFinancialNewObjective = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setShowForm(true);
      refresh();
    } else {
      dispatchDraftCommit();
      router.push(ROUTES.FINANCIAL_NEW_OBJECTIVE);
    }
  };

  const handleFinancialObjective = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (showForm) dispatchDraftCommit();
      setShowForm(false);
      refresh();
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
      if (typeof window !== "undefined")
        window.removeEventListener(GOAL_DRAFT_EVENT, listener);
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
    dispatchDraftCommit();
  };

  const isLoadingGoals = isLoading;
  const goalsError = error;

  return (
    <>
      <main className="p-4 pb-6 space-y-6 flex-1 min-h-0 animate-slide-up">
          <div className="flex flex-col flex-1 min-h-0 rounded-2xl p-5 space-y-10">
            <h2
              className="text-lg font-semibold text-gray-800 md:hidden animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Objectivos financeiros
            </h2>
            <div
              className="space-y-4 md:space-y-0 md:space-x-0 grid grid-cols-1 md:grid-cols-2 gap-3 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              {/* FinancialObjectiveCard: Criar objectivo */}
              <div
                className={`rounded-2xl bg-transparent p-0.5 md:p-2 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] ${
                  showForm ? "ring-1 ring-yellow-200 bg-yellow-50/60" : ""
                }`}
                onClick={handleFinancialNewObjective}
              >
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm md:shadow-none border-l-yellow-400 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center space-x-4 transition-all duration-300 ease-out">
                    <IconContainer icon={PlusIcon} bgColor="bg-white" iconColor="text-yellow-400" />
                    <div>
                      <h3 className="text-base font-semibold text-yellow-400 md:text-gray-900 transition-all duration-300 ease-out">
                        Crie um objectivo financeiro
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 transition-all duration-300 ease-out">
                        São metas específicas relacionadas ao dinheiro.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* FinancialObjectiveCard: Meus objectivos */}
              <div
                className={`rounded-2xl bg-transparent p-0.5 md:p-2 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] ${
                  !showForm ? "ring-1 ring-rose-200 bg-rose-50/60" : ""
                }`}
                onClick={handleFinancialObjective}
              >
                <div className="bg-rose-50 p-4 rounded-xl shadow-sm md:shadow-none border-l-rose-400 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center space-x-4 transition-all duration-300 ease-out">
                    <IconContainer icon={HistoryIcon} bgColor="bg-white" iconColor="text-rose-500" />
                    <div>
                      <h3 className="text-base font-semibold text-rose-500 md:text-gray-900 transition-all duration-300 ease-out">
                        Meus objectivos
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 transition-all duration-300 ease-out">
                        Visualize todos os seus objectivos criados.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hidden md:flex mt-8 md:mt-0 rounded-2xl h-full min-h-130 p-2 pb-6 md:min-w-full animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {showForm ? (
                <div className="flex flex-1 gap-6 min-h-0 w-full animate-fade-in">
                  <div className="flex flex-[1.5] min-h-0 w-full">
                    <ObjectiveForm onSuccess={refresh} />
                  </div>
                  <div className="flex flex-1 min-h-0 w-full">
                    {/* SketchPanel */}
                    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
                      <div className="w-full text-center space-y-4">
                        <div
                          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-gray-500 transition-colors ${
                            hasDraft ? "bg-yellow-100 text-yellow-500" : "bg-gray-50"
                          }`}
                        >
                          {hasDraft ? (
                            <DocumentIcon className="h-8 w-8" />
                          ) : (
                            <NoMovementIcon className="h-8 w-8" />
                          )}
                        </div>
                        {hasDraft ? (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-base font-semibold text-gray-800">
                                Você tem um rascunho salvo.
                              </h3>
                              <p className="text-sm text-gray-500">
                                Continue de onde parou ou descarte para começar novamente.
                              </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                              <Button variant="warning" onClick={handleDraftContinue}>
                                Continuar rascunho
                              </Button>
                              <Button variant="secondary" onClick={handleDraftDiscard}>
                                Descartar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-base font-semibold text-gray-700">
                              Sem rascunhos.
                            </h3>
                            <p className="text-sm text-gray-500">
                              Todos os seus rascunhos irão aparecer aqui.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 w-full min-h-0">
                  <div className="flex flex-1 flex-col rounded-3xl bg-white p-6 mb-5 pb-8 shadow-lg border border-gray-100 min-h-0 max-h-[calc(100vh-220px)] overflow-hidden">
                    <div className="flex-1 pr-2 min-h-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Objectivos
                          </h3>
                          {goalsError && (
                            <p className="text-sm text-red-500 mt-1">
                              {goalsError}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
                        {/* Meus objetivos financeiros */}
                        <div
                          className="flex h-full flex-col gap-4 animate-slide-up min-h-0"
                          style={{ animationDelay: "0.5s" }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                            Meus objectivos financeiros
                          </h3>
                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-4">
                            {isLoadingGoals && unfulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : unfulfilledObjectives.length ? (
                              unfulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                >
                                  <div className="rounded-2xl p-3 transition-all duration-300 ease-out">
                                    <FinancialProgressCard
                                      title={obj.title}
                                      valorAlvo={obj.valorAlvo}
                                      valorPoupado={obj.valorPoupado}
                                      percentage={obj.percentage}
                                      iconColor="text-indigo-600"
                                      onEdit={() => handleEdit(obj.goal)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum objetivo em andamento.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Objectivos cumpridos */}
                        <div
                          className="flex h-full flex-col gap-4 animate-slide-up min-h-0"
                          style={{ animationDelay: "0.7s" }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                            Objectivos cumpridos
                          </h3>
                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-4">
                            {isLoadingGoals && fulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : fulfilledObjectives.length ? (
                              fulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                                >
                                  <div className="rounded-2xl p-3 transition-all duration-300 ease-out">
                                    <FinancialProgressCard
                                      title={obj.title}
                                      valorAlvo={obj.valorAlvo}
                                      valorPoupado={obj.valorPoupado}
                                      percentage={obj.percentage}
                                      iconColor="text-green-600"
                                      onEdit={() => handleEdit(obj.goal)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum objetivo cumprido.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Objectivos por cumprir */}
                        <div
                          className="flex h-full flex-col gap-4 animate-slide-up min-h-0"
                          style={{ animationDelay: "0.9s" }}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300 ease-out">
                            Objectivos por cumprir
                          </h3>
                          <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-4">
                            {isLoadingGoals && unfulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : unfulfilledObjectives.length ? (
                              unfulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{ animationDelay: `${1.0 + index * 0.1}s` }}
                                >
                                  <div className="rounded-2xl p-3 transition-all duration-300 ease-out">
                                    <FinancialProgressCard
                                      title={obj.title}
                                      valorAlvo={obj.valorAlvo}
                                      valorPoupado={obj.valorPoupado}
                                      percentage={obj.percentage}
                                      iconColor="text-red-600"
                                      onEdit={() => handleEdit(obj.goal)}
                                    />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum objetivo pendente.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      <EditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdated={handleModalUpdated}
        objective={selectedObjective}
      />
    </>
  );
};

export default FinancialObjectiveScreen;
