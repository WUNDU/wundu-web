import { create } from "zustand";
import type { UserCategoryLimitRequest, UserCategoryLimitResponse } from "@/types/dtos/limit.dto";
import { limitService } from "@/services/limit.service";

interface LimitStore {
  limits: Record<string, UserCategoryLimitResponse>;
  isLoading: boolean;
  error: string | null;
  define(payload: UserCategoryLimitRequest): Promise<boolean>;
  fetchLimit(userId: string, categoryId: string): Promise<void>;
  clearAll(): void;
}

export const useLimitStore = create<LimitStore>((set, get) => ({
  limits: {},
  isLoading: false,
  error: null,

  define: async (payload: UserCategoryLimitRequest): Promise<boolean> => {
    const { notify, loading } = await import("@/hooks/use-notification");
    loading.show("Definindo limite...");
    try {
      const result = await limitService.define(payload);
      const key = `${payload.userId}_${payload.categoryId}`;
      set((s) => ({ limits: { ...s.limits, [key]: result } }));
      loading.hide();
      notify.success("Limite definido com sucesso!");
      return true;
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao definir limite";
      loading.hide();
      notify.error(err);
      return false;
    }
  },

  fetchLimit: async (userId: string, categoryId: string) => {
    const key = `${userId}_${categoryId}`;
    if (get().limits[key]) return;
    set({ isLoading: true });
    try {
      const result = await limitService.getByUserAndCategory(userId, categoryId);
      set((s) => ({ limits: { ...s.limits, [key]: result }, isLoading: false }));
    } catch (error: any) {
      const err = error?.response?.data?.message || "Limite não encontrado";
      set({ error: err, isLoading: false });
    }
  },

  clearAll: () => {
    set({ limits: {}, isLoading: false, error: null });
  },
}));
