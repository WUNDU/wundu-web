import { api } from "@/api/api";
import type { Goal, GoalPayload } from "@/types/dtos/goal.dto";

const extractDataArray = (payload: unknown): Goal[] => {
  if (Array.isArray(payload)) return payload as Goal[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.content)) return obj.content as Goal[];
    if (Array.isArray(obj.data)) return obj.data as Goal[];
  }
  return [];
};

const normalizeGoal = (goal: Goal): Goal => ({
  ...goal,
  categoryId: goal.categoryId ?? goal.category?.id,
  categoryName: goal.category?.name ?? goal.categoryName,
});

export const GoalsService = {
  add: async (payload: GoalPayload) => {
    const { data } = await api.post("/goals", payload);
    return data;
  },

  list: async (): Promise<Goal[]> => {
    const { data } = await api.get("/goals");
    return extractDataArray(data).map(normalizeGoal);
  },

  update: async (goalId: Goal["id"], payload: GoalPayload) => {
    const { data } = await api.put(`/goals/${goalId}`, payload);
    return data;
  },
};
