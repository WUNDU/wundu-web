"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EditIcon, ObjectiveIcon } from "@/constants/icons";
import { LoadingSpinner } from "@/components/ui";
const IconContainer: React.FC<{ icon: React.ElementType; bgColor: string; iconColor: string; className?: string }> = ({ icon: Icon, bgColor, iconColor, className }) => (
  <div className={`p-3 rounded-full flex-shrink-0 ${bgColor} ${className ?? ""}`}><Icon className={`h-6 w-6 ${iconColor}`} /></div>
);
import EditModal from "@/components/ui/edit-modal";
import { createPortal } from "react-dom";
import { useUiStore } from "@/store/ui-store";
import { ModalContent } from "@/components/ui/modal-content";
import { CloseIcon } from "@/constants/icons";
import {
  buildGoalCardData,
  getGoalProgress,
  useGoalStore,
} from "@/store/goal-store";
import type { Goal } from "@/types/dtos/goal.dto";

// ── FinancialProgressCard ──────────────────────────────────────────────────────

interface FinancialProgressCardProps {
  title: string;
  valorAlvo: string;
  valorPoupado: string;
  percentage: number;
  iconColor?: string;
  onEdit?: () => void;
  isCompleted?: boolean;
}

const FinancialProgressCard: React.FC<FinancialProgressCardProps> = ({
  title,
  valorAlvo,
  valorPoupado,
  percentage,
  onEdit,
  iconColor = "text-indigo-600",
  isCompleted = false,
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isGoalComplete = percentage >= 100 || isCompleted;
  const ringColor = isGoalComplete ? "stroke-emerald-500" : "stroke-rose-400";
  const progressTextColor = isGoalComplete ? "text-emerald-600" : "text-rose-500";

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f5f6fb] p-4 shadow-sm border border-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <IconContainer
          icon={ObjectiveIcon}
          bgColor="bg-white"
          iconColor={iconColor}
          className="shadow-sm ring-1 ring-slate-100"
        />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#675af5] leading-tight">
            {title}
          </h3>
          <p className="text-sm font-medium text-[#4caf50]">
            Valor-alvo:
            <span className="ml-2 font-semibold text-slate-700">{valorAlvo}</span>
          </p>
          <p className="text-sm font-medium text-[#ff8a65]">
            Valor poupado:
            <span className="ml-2 font-semibold text-slate-700">{valorPoupado}</span>
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!isGoalComplete) onEdit?.();
        }}
        aria-label={isGoalComplete ? "Objetivo concluído" : "Editar objetivo"}
        className={`relative flex flex-col items-center gap-1 rounded-full p-1 transition-opacity duration-200 ${
          isGoalComplete ? "cursor-default opacity-80" : "hover:opacity-80"
        }`}
        disabled={isGoalComplete}
      >
        <div className="relative w-12 h-12">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48" fill="none">
            <circle
              strokeWidth="4"
              stroke="rgba(148, 163, 184, 0.4)"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
            />
            <circle
              className={ringColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.8s ease-out",
              }}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${progressTextColor}`}
          >
            {percentage}%
          </span>
        </div>
        {!isGoalComplete && (
          <IconContainer
            icon={EditIcon}
            bgColor="bg-white"
            iconColor="text-slate-500"
            className="scale-90"
          />
        )}
      </button>
    </div>
  );
};

// ── NotificationToast ──────────────────────────────────────────────────────────

const NotificationToast: React.FC = () => {
  const { notification, closeNotification } = useUiStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (notification) {
      setIsAnimating(true);
    } else {
      timeout = setTimeout(() => setIsAnimating(false), 150);
    }
    return () => clearTimeout(timeout);
  }, [notification]);

  if (!isMounted || (!isAnimating && !notification)) return null;
  if (!notification) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-9999 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm
        ${notification ? "animate-backdrop-in" : "animate-backdrop-out pointer-events-none"}
      `}
      onClick={closeNotification}
    >
      <div
        className={`
          relative w-full max-w-md bg-white rounded-3xl shadow-2xl
          ${notification ? "animate-sweetalert-show" : "animate-sweetalert-hide"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeNotification}
          aria-label="Fechar notificação"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
        <div className="px-6 py-8 sm:px-8 sm:py-10 text-center">
          <ModalContent
            type={notification.type}
            title={notification.title}
            message={notification.message}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────

const FinancialProgressScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Goal | null>(null);
  const { goals, isLoading, error, fetch, refresh } = useGoalStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

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

  const isLoading_ = isLoading;
  const hasAnyGoal =
    unfulfilledObjectives.length > 0 || fulfilledObjectives.length > 0;

  return (
    <>
      <main className="p-4 pb-6 space-y-6 flex-1 flex flex-col">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Meus objectivos
          </h2>
        </div>

        <div className="flex flex-col flex-1 bg-white rounded-2xl p-5 space-y-6 shadow-lg border border-gray-100">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {isLoading_ ? (
            <div className="flex flex-1 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : hasAnyGoal ? (
            <div className="space-y-6">
              {[
                { title: "Em andamento", data: unfulfilledObjectives },
                { title: "Concluídos", data: fulfilledObjectives },
              ].map(({ title, data }) => (
                <section key={title} className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800">
                    {title}
                  </h3>
                  {data.length ? (
                    <div className="space-y-3">
                      {data.map((obj) => (
                        <div
                          key={obj.id}
                          className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50/80 p-3 hover:bg-white transition-colors"
                        >
                          <FinancialProgressCard
                            title={obj.title}
                            valorAlvo={obj.valorAlvo}
                            valorPoupado={obj.valorPoupado}
                            percentage={obj.percentage}
                            onEdit={() => handleEdit(obj.goal)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Nenhum objetivo {title.toLowerCase()}.
                    </p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center space-y-3">
              <p className="text-gray-500 text-sm">
                Ainda não há objetivos registados. Crie o seu primeiro objectivo
                financeiro!
              </p>
            </div>
          )}
        </div>
      </main>
      <EditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdated={handleModalUpdated}
        objective={selectedObjective}
      />
      <NotificationToast />
    </>
  );
};

export default FinancialProgressScreen;
