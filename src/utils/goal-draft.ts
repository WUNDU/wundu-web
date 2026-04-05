import type { GoalType } from "@/types/dtos/goal.dto";

export const GOAL_DRAFT_STORAGE_KEY = "objectiveFormDraft";
export const GOAL_DRAFT_EVENT = "goal-draft-changed";
export const GOAL_DRAFT_CONTINUE_EVENT = "goal-draft-continue";
export const GOAL_DRAFT_COMMIT_EVENT = "goal-draft-commit";

export interface ObjectiveFormState {
  title: string;
  description: string;
  targetAmount: string;
  startDate: string;
  endDate: string;
  type: GoalType;
  categoryId: string;
}

export interface GoalDraftStoragePayload {
  data: ObjectiveFormState;
  committed: boolean;
}

export const createDefaultForm = (): ObjectiveFormState => ({
  title: "",
  description: "",
  targetAmount: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  type: "SHORT_TERM",
  categoryId: "",
});

export const readDraftPayload = (): GoalDraftStoragePayload | null => {
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

export const writeDraftPayload = (payload: GoalDraftStoragePayload) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GOAL_DRAFT_STORAGE_KEY, JSON.stringify(payload));
};

export const toDraftState = (
  payload: GoalDraftStoragePayload | null,
): ObjectiveFormState | null => {
  if (!payload) return null;
  return { ...createDefaultForm(), ...payload.data };
};

export const isDraftEmpty = (data: ObjectiveFormState) =>
  !data.title &&
  !data.description &&
  !data.targetAmount &&
  !data.endDate &&
  !data.categoryId;

export const notifyDraftChange = () => {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(GOAL_DRAFT_EVENT));
};

export const getGoalDraft = (): ObjectiveFormState | null => {
  const payload = readDraftPayload();
  if (!payload || !payload.committed) return null;
  return toDraftState(payload);
};

export const clearGoalDraftStorage = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GOAL_DRAFT_STORAGE_KEY);
  notifyDraftChange();
};
