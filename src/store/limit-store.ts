import { create } from "zustand";
import type { UserCategoryLimitRequest, UserCategoryLimitResponse } from "@/types/dtos/limit.dto";
import { limitService } from "@/services/limit.service";

interface LimitStore {
  limits: Record<string, UserCategoryLimitResponse>;
  isLoading: boolean;
  error: string | null;
  define(payload: UserCategoryLimitRequest): Promise<boolean>;
  fetchLimit(categoryId: string): Promise<void>;
  fetchMultipleLimits(categoryIds: string[]): Promise<void>;
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
      set((s) => ({ limits: { ...s.limits, [result.categoryId]: result } }));
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

  fetchLimit: async (categoryId: string) => {
    if (get().limits[categoryId]) return;
    set({ isLoading: true });
    try {
      const result = await limitService.getByCategory(categoryId);
      set((s) => ({ limits: { ...s.limits, [categoryId]: result }, isLoading: false }));
    } catch (error: any) {
      set({ isLoading: false });
    }
  },

  fetchMultipleLimits: async (categoryIds: string[]) => {
    const { limits } = get();
    const missing = categoryIds.filter((id) => !limits[id]);
    if (missing.length === 0) return;

    set({ isLoading: true });
    try {
      const results = await Promise.all(
        missing.map((id) => limitService.getByCategory(id).catch(() => null))
      );
      const newLimits = { ...limits };
      results.forEach((res) => {
        if (res) newLimits[res.categoryId] = res;
      });
      set({ limits: newLimits, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  clearAll: () => {
    set({ limits: {}, isLoading: false, error: null });
  },
}));
