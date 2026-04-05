import { apiClient } from "@/api/api";
import type { Goal, GoalPayload, GoalProgress } from "@/types/dtos/goal.dto";

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

class GoalService {
  async list(status?: string): Promise<Goal[]> {
    const { data } = await apiClient.get<Goal[]>("/goals", status ? { params: { status } } : undefined);
    return extractDataArray(data).map(normalizeGoal);
  }

  async getById(id: string): Promise<Goal> {
    const { data } = await apiClient.get<Goal>(`/goals/${id}`);
    return normalizeGoal(data);
  }

  async add(payload: GoalPayload): Promise<Goal> {
    const { data } = await apiClient.post<Goal>("/goals", payload);
    return normalizeGoal(data);
  }

  async update(goalId: Goal["id"], payload: Partial<GoalPayload>): Promise<Goal> {
    const { data } = await apiClient.put<Goal>(`/goals/${goalId}`, payload);
    return normalizeGoal(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  }

  async getProgress(goalId: string): Promise<GoalProgress[]> {
    const { data } = await apiClient.get<GoalProgress[]>(`/goals/${goalId}/progress`);
    return data;
  }

  async addProgress(goalId: string, amount: number, progressDate?: string): Promise<GoalProgress> {
    const params = new URLSearchParams({ amount: String(amount) });
    if (progressDate) params.append("progressDate", progressDate);
    const { data } = await apiClient.post<GoalProgress>(
      `/goals/${goalId}/progress?${params.toString()}`,
      null,
    );
    return data;
  }
}

export const goalService = new GoalService();
