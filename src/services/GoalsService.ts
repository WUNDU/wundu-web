import api from "../lib/api";
import { withCache, cache, CACHE_TAGS } from "../lib/cache";

export type GoalType = "SHORT_TERM" | "LONG_TERM";

export interface GoalPayload {
  title: string;
  description: string;
  type: GoalType;
  targetAmount: number;
  startDate: string;
  endDate: string;
  categoryId: string;
  currentAmount?: number;
}

export interface Goal extends Partial<GoalPayload> {
  id: string | number;
  currentAmount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  progressPercentage?: number;
  progress_percentage?: number;
  categoryName?: string;
  category_id?: string;
  category?: {
    id: string;
    name: string;
  };
}

const extractDataArray = (payload: unknown): Goal[] => {
  if (Array.isArray(payload)) {
    return payload as Goal[];
  }

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.content)) {
      return obj.content as Goal[];
    }

    if (Array.isArray(obj.data)) {
      return obj.data as Goal[];
    }
  }

  return [];
};

const normalizeGoal = (goal: Goal): Goal => {
  const normalizedCategoryId = goal.categoryId ?? goal.category_id ?? goal.category?.id;
  const normalizedCategoryName = goal.category?.name ?? goal.categoryName;

  return {
    ...goal,
    categoryId: normalizedCategoryId ?? goal.categoryId,
    categoryName: normalizedCategoryName ?? goal.categoryName,
  };
};

const fetchGoalsList = async (): Promise<Goal[]> => {
  const { data } = await api.get("/goals");
  return extractDataArray(data).map(normalizeGoal);
};

export const GoalsService = {
  add: async (payload: GoalPayload) => {
    const { data } = await api.post("/goals", payload);
    // Invalidate goals cache
    cache.invalidateByTag(CACHE_TAGS.GOALS);
    return data;
  },

  list: async (): Promise<Goal[]> => {
    return withCache(
      fetchGoalsList,
      `${CACHE_TAGS.GOALS}:list`,
      { ttl: 30000, tag: CACHE_TAGS.GOALS } // 30 seconds
    );
  },

  update: async (goalId: Goal["id"], payload: GoalPayload) => {
    const { data } = await api.put(`/goals/${goalId}`, payload);
    // Invalidate goals cache
    cache.invalidateByTag(CACHE_TAGS.GOALS);
    return data;
  },
};
