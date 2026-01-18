"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GoalsService, GoalPayload, GoalType } from "@/services/goals-service";
import { useUiStore } from "@/shared/store/ui-store";

export interface ObjectiveFormState {
  title: string;
  description: string;
  targetAmount: string;
  startDate: string;
  endDate: string;
  type: GoalType;
  categoryId: string;
}

interface UseObjectiveFormOptions {
  onSuccess?: () => void;
}

export const GOAL_DRAFT_STORAGE_KEY = "objectiveFormDraft";
export const GOAL_DRAFT_EVENT = "goal-draft-changed";
export const GOAL_DRAFT_CONTINUE_EVENT = "goal-draft-continue";
export const GOAL_DRAFT_COMMIT_EVENT = "goal-draft-commit";

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
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(GOAL_DRAFT_STORAGE_KEY);
  if (!stored) {
    return null;
  }

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
        data: {
          ...createDefaultForm(),
          ...payload.data,
        },
        committed: Boolean(payload.committed),
      };
    }

    return {
      data: {
        ...createDefaultForm(),
        ...(parsed as ObjectiveFormState),
      },
      committed: true,
    };
  } catch {
    return null;
  }
};

const writeDraftPayload = (payload: GoalDraftStoragePayload) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GOAL_DRAFT_STORAGE_KEY, JSON.stringify(payload));
};

const toDraftState = (
  payload: GoalDraftStoragePayload | null,
): ObjectiveFormState | null => {
  if (!payload) {
    return null;
  }

  return {
    ...createDefaultForm(),
    ...payload.data,
  };
};

const isDraftEmpty = (data: ObjectiveFormState) =>
  !data.title &&
  !data.description &&
  !data.targetAmount &&
  !data.endDate &&
  !data.categoryId;

const notifyDraftChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(GOAL_DRAFT_EVENT));
  }
};

export const getGoalDraft = (): ObjectiveFormState | null => {
  const payload = readDraftPayload();
  if (!payload || !payload.committed) {
    return null;
  }

  return toDraftState(payload);
};

export const clearGoalDraftStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
  notifyDraftChange();
};

export const useObjectiveForm = (options?: UseObjectiveFormOptions) => {
  const [form, setForm] = useState<ObjectiveFormState>(() =>
    createDefaultForm(),
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasDraft, setHasDraft] = useState<boolean>(() =>
    Boolean(getGoalDraft()),
  );
  const { showNotification } = useUiStore();
  const latestFormRef = useRef<ObjectiveFormState>(form);
  const skipAutosaveRef = useRef(false);
  const skipCleanupRemovalRef = useRef(false);

  const resetFormState = useCallback((options?: { skipAutosave?: boolean }) => {
    if (options?.skipAutosave) {
      skipAutosaveRef.current = true;
    }
    setForm(createDefaultForm());
  }, []);

  useEffect(() => {
    latestFormRef.current = form;
  }, [form]);

  useEffect(() => {
    if (!form.startDate || !form.endDate) {
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    if (end < start) {
      setForm((prev) => ({ ...prev, endDate: prev.startDate }));
      return;
    }

    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    const desiredType = diffDays <= 60 ? "SHORT_TERM" : "LONG_TERM";

    if (form.type !== desiredType) {
      setForm((prev) => ({ ...prev, type: desiredType }));
    }
  }, [form.startDate, form.endDate, form.type]);

  const saveUncommittedDraft = useCallback((data: ObjectiveFormState) => {
    if (typeof window === "undefined") {
      return;
    }

    if (isDraftEmpty(data)) {
      const payload = readDraftPayload();
      if (!payload || !payload.committed) {
        window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
      }
      return;
    }

    writeDraftPayload({ data, committed: false });
  }, []);

  const commitDraft = useCallback(
    (options?: { resetForm?: boolean }) => {
      if (typeof window === "undefined") {
        return;
      }

      const data = latestFormRef.current;

      if (isDraftEmpty(data)) {
        if (skipCleanupRemovalRef.current) {
          skipCleanupRemovalRef.current = false;
          return;
        }

        if (getGoalDraft()) {
          window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
          setHasDraft(false);
          notifyDraftChange();
        }
        return;
      }

      writeDraftPayload({ data, committed: true });
      setHasDraft(true);
      notifyDraftChange();
      if (options?.resetForm) {
        resetFormState({ skipAutosave: true });
        skipCleanupRemovalRef.current = true;
      }
    },
    [resetFormState],
  );

  const handleContinueDraft = useCallback(() => {
    const payload = readDraftPayload();
    const draftState = toDraftState(payload);
    if (!draftState) {
      return;
    }

    setForm(draftState);
    writeDraftPayload({ data: draftState, committed: false });
    setHasDraft(false);
    notifyDraftChange();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    saveUncommittedDraft(form);
  }, [form, saveUncommittedDraft]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        commitDraft({ resetForm: true });
      }
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
    if (typeof window === "undefined") {
      return;
    }

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

  const setField = (field: keyof ObjectiveFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    resetFormState();
  };

  const clearDraft = () => {
    clearGoalDraftStorage();
    setHasDraft(false);
    resetFormState();
  };

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
      await GoalsService.add(payload);
      setStatus("success");
      resetFormState();
      setHasDraft(false);
      clearGoalDraftStorage();
      showNotification(
        "success",
        "Objetivo criado",
        "O seu objetivo financeiro foi criado com sucesso.",
      );
      options?.onSuccess?.();
      return true;
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o objetivo.",
      );
      showNotification(
        "error",
        "Erro ao salvar",
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o objetivo.",
      );
      return false;
    }
  };

  return {
    form,
    setField,
    status,
    errorMessage,
    save,
    hasDraft,
    clearDraft,
  };
};
