"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Select, TextInput } from "@/components/ui";
import { maskAOAInput, parseAOA, formatAOA } from "@/lib/currency";
import { useGoal } from "@/hooks/use-goal";
import { useCategory } from "@/hooks/use-category";
import type { GoalPayload } from "@/types/dtos/goal.dto";
import {
  type ObjectiveFormState,
  GOAL_DRAFT_STORAGE_KEY,
  GOAL_DRAFT_CONTINUE_EVENT,
  GOAL_DRAFT_COMMIT_EVENT,
  createDefaultForm,
  clearGoalDraftStorage,
  notifyDraftChange,
  writeDraftPayload,
  toDraftState,
  isDraftEmpty,
  readDraftPayload,
  getGoalDraft,
} from "@/utils/goal-draft";

export interface ObjectiveFormProps {
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
  const { addGoal } = useGoal();
  const latestFormRef = useRef<ObjectiveFormState>(form);
  const skipAutosaveRef = useRef(false);
  const skipCleanupRemovalRef = useRef(false);
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategory();

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
              onChange={(value) => setField("type", value)}
              options={typeOptions}
              required
            />
            <Select
              label="Categoria"
              value={form.categoryId}
              onChange={(value) => setField("categoryId", value)}
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

export default ObjectiveForm;
