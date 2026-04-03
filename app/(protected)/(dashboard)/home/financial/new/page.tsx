"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Select, TextInput, Button } from "@/components/ui";
import { useRouter as useNavRouter } from "next/navigation";
const NavigationBack: React.FC<{ prev?: () => void; color?: string }> = ({ prev, color }) => {
  const router = useNavRouter();
  return (
    <button onClick={prev ?? (() => router.back())} className={`p-2 -ml-2 ${color ?? "text-gray-700"} hover:bg-gray-100 rounded-full transition-colors`} aria-label="Voltar">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </button>
  );
};
import { createPortal } from "react-dom";
import { useUiStore } from "@/store/ui-store";
import { ModalContent } from "@/components/ui/modal-content";
import { CloseIcon } from "@/constants/icons";
import { useGoalStore } from "@/store/goal-store";
import { useCategoryStore } from "@/store/category-store";
import type { GoalPayload, GoalType } from "@/types/dtos/goal.dto";

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

const NewFinancialObjectiveScreen: React.FC = () => {
  const [form, setFormState] = useState<ObjectiveFormState>(() =>
    createDefaultForm(),
  );
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
    <>
      <main className="p-4 pb-6 space-y-6 flex-1 flex flex-col">
        <NavigationBack />
        <div className="flex-1">
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
                    type="number"
                    placeholder="Digite o valor"
                    value={form.targetAmount}
                    onChange={(e) => setField("targetAmount", e.target.value)}
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
        </div>
      </main>
      <NotificationToast />
    </>
  );
};

export default NewFinancialObjectiveScreen;
