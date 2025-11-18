import api from "../lib/api";

export type GoalType = "SHORT_TERM" | "LONG_TERM";

export interface GoalPayload {
  title: string;
  description: string;
  type: GoalType;
  targetAmount: number;
  startDate: string;
  endDate: string;
  categoryId: string;
}

export interface Goal extends Partial<GoalPayload> {
  id: string | number;
  currentAmount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const extractDataArray = (data: unknown): Goal[] => {
  if (Array.isArray(data)) {
    return data as Goal[];
  }

  if (data && typeof data === "object" && Array.isArray((data as any).data)) {
    return (data as any).data as Goal[];
  }

  return [];
};

export const GoalsService = {
  add: async (payload: GoalPayload) => {
    const { data } = await api.post("/goals", payload);
    return data;
  },
  list: async (): Promise<Goal[]> => {
    const { data } = await api.get("/goals");
    return extractDataArray(data);
  },
};
