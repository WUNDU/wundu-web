"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import {
  DocumentIcon,
  EditIcon,
  HistoryIcon,
  NoMovementIcon,
  ObjectiveIcon,
  PlusIcon,
} from "@/constants/icons";
import { Button, Select, TextInput } from "@/components/ui";
import { maskAOAInput, parseAOA, formatAOA } from "@/lib/currency";
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
import { useCategoryStore } from "@/store/category-store";
import type { Goal, GoalPayload, GoalType } from "@/types/dtos/goal.dto";

// ── Draft management ───────────────────────────────────────────────────────────

const GOAL_DRAFT_STORAGE_KEY = "objectiveFormDraft";
const GOAL_DRAFT_EVENT = "goal-draft-changed";
const GOAL_DRAFT_CONTINUE_EVENT = "goal-draft-continue";
const GOAL_DRAFT_COMMIT_EVENT = "goal-draft-commit";

interface ObjectiveFormState {
  title: string;
  description: string;
  targetAmount: string;
  startDate: string;
  endDate: string;
  type: GoalType;
  categoryId: string;
}

const createDefaultForm = (): ObjectiveFormState => ({
  title: "",
  description: "",
  targetAmount: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  type: "SHORT_TERM",
  categoryId: "",
});

interface GoalDraftStoragePayload {
  data: ObjectiveFormState;
  committed: boolean;
}

const readDraftPayload = (): GoalDraftStoragePayload | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(GOAL_DRAFT_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (
      parsed &&
      typeof parsed === "object" &&
      "data" in parsed &&
      "committed" in parsed
    ) {
      const payload = parsed as GoalDraftStoragePayload;
      return {
        data: { ...createDefaultForm(), ...payload.data },
        committed: Boolean(payload.committed),
      };
    }
    return {
      data: { ...createDefaultForm(), ...(parsed as ObjectiveFormState) },
      committed: true,
    };
  } catch {
    return null;
  }
};

const writeDraftPayload = (payload: GoalDraftStoragePayload) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GOAL_DRAFT_STORAGE_KEY, JSON.stringify(payload));
};

const toDraftState = (
  payload: GoalDraftStoragePayload | null,
): ObjectiveFormState | null => {
  if (!payload) return null;
  return { ...createDefaultForm(), ...payload.data };
};

const isDraftEmpty = (data: ObjectiveFormState) =>
  !data.title &&
  !data.description &&
  !data.targetAmount &&
  !data.endDate &&
  !data.categoryId;

const notifyDraftChange = () => {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(GOAL_DRAFT_EVENT));
};

const getGoalDraft = (): ObjectiveFormState | null => {
  const payload = readDraftPayload();
  if (!payload || !payload.committed) return null;
  return toDraftState(payload);
};

const clearGoalDraftStorage = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
  notifyDraftChange();
};

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

// ── ObjectiveForm ──────────────────────────────────────────────────────────────

interface ObjectiveFormProps {
  onSuccess?: () => void;
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ onSuccess }) => {
  const [form, setFormState] = useState<ObjectiveFormState>(() =>
    createDefaultForm(),
  );
  const [targetAmountDisplay, setTargetAmountDisplay] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { add: addGoal } = useGoalStore();
  const latestFormRef = useRef<ObjectiveFormState>(form);
  const skipAutosaveRef = useRef(false);
  const skipCleanupRemovalRef = useRef(false);
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    fetch: fetchCategories,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetFormState = useCallback((opts?: { skipAutosave?: boolean }) => {
    if (opts?.skipAutosave) skipAutosaveRef.current = true;
    setFormState(createDefaultForm());
    setTargetAmountDisplay("");
  }, []);

  useEffect(() => {
    latestFormRef.current = form;
  }, [form]);

  useEffect(() => {
    if (!form.startDate || !form.endDate) return;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
    if (end < start) {
      setFormState((prev) => ({ ...prev, endDate: prev.startDate }));
      return;
    }
    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const desiredType = diffDays <= 60 ? "SHORT_TERM" : "LONG_TERM";
    if (form.type !== desiredType)
      setFormState((prev) => ({ ...prev, type: desiredType }));
  }, [form.startDate, form.endDate, form.type]);

  const saveUncommittedDraft = useCallback((data: ObjectiveFormState) => {
    if (typeof window === "undefined") return;
    if (isDraftEmpty(data)) {
      const payload = readDraftPayload();
      if (!payload || !payload.committed)
        window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
      return;
    }
    writeDraftPayload({ data, committed: false });
  }, []);

  const commitDraft = useCallback(
    (opts?: { resetForm?: boolean }) => {
      if (typeof window === "undefined") return;
      const data = latestFormRef.current;
      if (isDraftEmpty(data)) {
        if (skipCleanupRemovalRef.current) {
          skipCleanupRemovalRef.current = false;
          return;
        }
        if (getGoalDraft()) {
          window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
          notifyDraftChange();
        }
        return;
      }
      writeDraftPayload({ data, committed: true });
      notifyDraftChange();
      if (opts?.resetForm) {
        resetFormState({ skipAutosave: true });
        skipCleanupRemovalRef.current = true;
      }
    },
    [resetFormState],
  );

  const handleContinueDraft = useCallback(() => {
    const payload = readDraftPayload();
    const draftState = toDraftState(payload);
    if (!draftState) return;
    setFormState(draftState);
    if (draftState.targetAmount) {
      setTargetAmountDisplay(formatAOA(parseFloat(draftState.targetAmount) || 0));
    }
    writeDraftPayload({ data: draftState, committed: false });
    notifyDraftChange();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    saveUncommittedDraft(form);
  }, [form, saveUncommittedDraft]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") commitDraft({ resetForm: true });
    };
    const pageHideHandler = () => commitDraft({ resetForm: true });
    const beforeUnloadHandler = () => commitDraft({ resetForm: true });
    document.addEventListener("visibilitychange", visibilityHandler);
    window.addEventListener("pagehide", pageHideHandler);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("pagehide", pageHideHandler);
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [commitDraft]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const continueListener = () => handleContinueDraft();
    const commitListener = () => commitDraft({ resetForm: true });
    window.addEventListener(GOAL_DRAFT_CONTINUE_EVENT, continueListener);
    window.addEventListener(GOAL_DRAFT_COMMIT_EVENT, commitListener);
    return () => {
      window.removeEventListener(GOAL_DRAFT_CONTINUE_EVENT, continueListener);
      window.removeEventListener(GOAL_DRAFT_COMMIT_EVENT, commitListener);
    };
  }, [handleContinueDraft, commitDraft]);

  useEffect(() => {
    return () => {
      commitDraft({ resetForm: true });
    };
  }, [commitDraft]);

  const setField = (field: keyof ObjectiveFormState, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const save = async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const payload: GoalPayload = {
        title: form.title,
        description: form.description,
        type: form.type,
        targetAmount: Number(form.targetAmount) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        categoryId: form.categoryId,
      };
      const success = await addGoal(payload);
      if (success) {
        setStatus("success");
        resetFormState();
        clearGoalDraftStorage();
        onSuccess?.();
        return true;
      }
      setStatus("error");
      return false;
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o objetivo.",
      );
      return false;
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const typeOptions = [
    { value: "SHORT_TERM", label: "Curto prazo" },
    { value: "LONG_TERM", label: "Longo prazo" },
  ];
  const categoryOptions = [
    {
      value: "",
      label: isCategoriesLoading
        ? "Carregando categorias..."
        : "Selecione a categoria",
    },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];
  const isSubmitting = status === "loading";

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="flex h-full w-full max-w-3xl flex-col rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-gray-100 min-h-0">
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <TextInput
              label="Nome do objetivo"
              placeholder="Digite o nome do objectivo"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              type="text"
            />
            <TextInput
              label="Valor necessário"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={targetAmountDisplay}
              onChange={(e) => {
                const masked = maskAOAInput(e.target.value);
                setTargetAmountDisplay(masked);
                setField("targetAmount", parseAOA(masked));
              }}
              required
            />
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-gray-600 text-sm font-medium">
                Descrição
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[96px]"
                placeholder="Conte-nos mais sobre este objetivo"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-gray-600 text-sm font-medium">
                Data inicial
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setField("startDate", e.target.value)}
                  placeholder="Selecione a data de início"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10"
                  min={today}
                  required
                />
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="text-gray-600 text-sm font-medium">
                Data final
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setField("endDate", e.target.value)}
                  placeholder="Selecione a data final"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 pr-10"
                  min={form.startDate || today}
                  required
                />
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <Select
              label="Tipo"
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
              options={typeOptions}
              required
            />
            <Select
              label="Categoria"
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              options={categoryOptions}
              required
            />
            {categoriesError && (
              <p className="text-xs text-red-500">{categoriesError}</p>
            )}
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>
        <Button
          onClick={save}
          variant="warning"
          fullWidth
          className="mt-6 rounded-2xl py-4 text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Objectivo"}
        </Button>
      </div>
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

const FinancialObjectiveScreen: React.FC = () => {
  const router = useRouter();
  const [isSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Goal | null>(null);
  const [hasDraft, setHasDraft] = useState(() => Boolean(getGoalDraft()));
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
              {/* <div
                className={`hidden md:block rounded-xl shadow-sm md:shadow-none mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md`}
                onClick={handleFinancialIAObjective}
              >
                <FinancialObjectiveCard
                  icon={IAIcon}
                  title="Gerar objetivo com AI"
                  description="Peça à AI que ajude você a criar os seus objetivos"
                  borderColor="border-l-purple-400"
                  bgColor="bg-purple-100 md:bg-white"
                  iconBgColor="bg-white md:bg-purple-100"
                  iconColor="text-purple-600"
                />
              </div> */}
            </div>

            {/* <div className="md:hidden mt-8">
              <h2 className="text-lg font-semibold text-gray-400">Gerar o objectivo financeiro com AI</h2>
              <div
                className="rounded-xl shadow-sm mt-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                onClick={handleFinancialIAObjective}
              >
                <FinancialObjectiveCard
                  icon={IAIcon}
                  title="Gerar objetivo com AI"
                  description="Peça à AI que ajude você a criar os seus objetivos"
                  borderColor="border-l-purple-400"
                  bgColor="bg-purple-100"
                  iconBgColor="bg-white"
                  iconColor="text-purple-600"
                />
              </div>
            </div> */}
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
                    {/* SketchPanel (inlined) */}
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
                            {isLoadingGoals &&
                            unfulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : unfulfilledObjectives.length ? (
                              unfulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{
                                    animationDelay: `${0.6 + index * 0.1}s`,
                                  }}
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
                            {isLoadingGoals &&
                            fulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : fulfilledObjectives.length ? (
                              fulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{
                                    animationDelay: `${0.8 + index * 0.1}s`,
                                  }}
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
                            {isLoadingGoals &&
                            unfulfilledObjectives.length === 0 ? (
                              <p className="text-sm text-gray-500">
                                Carregando objetivos...
                              </p>
                            ) : unfulfilledObjectives.length ? (
                              unfulfilledObjectives.map((obj, index) => (
                                <div
                                  key={obj.id}
                                  className="cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:-translate-y-1"
                                  style={{
                                    animationDelay: `${1.0 + index * 0.1}s`,
                                  }}
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
      <NotificationToast />
    </>
  );
};

export default FinancialObjectiveScreen;
