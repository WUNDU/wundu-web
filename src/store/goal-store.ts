import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { goalService } from "@/services/goal.service";
import type { Goal, GoalPayload } from "@/types/dtos/goal.dto";
import { useUiStore } from "@/store/ui-store";
import { formatAOA } from "@/lib/currency";

// ── Helper utilities ───────────────────────────────────────────────────────────

export const formatGoalCurrency = (value?: number) => formatAOA(value ?? 0);

const clampProgress = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const getGoalProgress = (goal: Goal): number => {
  const backendProgress =
    typeof goal.progressPercentage === "number"
      ? goal.progressPercentage
      : undefined;

  if (typeof backendProgress === "number") {
    return clampProgress(backendProgress);
  }

  const target = goal.targetAmount ?? 0;
  if (!target) return 0;
  const current = goal.currentAmount ?? 0;
  return clampProgress((current / target) * 100);
};

export interface GoalCardData {
  id: Goal["id"];
  title: string;
  valorAlvo: string;
  valorPoupado: string;
  percentage: number;
  isCompleted: boolean;
  canEdit: boolean;
  goal: Goal;
}

export const buildGoalCardData = (goal: Goal): GoalCardData => ({
  id: goal.id,
  title: goal.title ?? "Objetivo sem título",
  valorAlvo: formatGoalCurrency(goal.targetAmount),
  valorPoupado: formatGoalCurrency(goal.currentAmount),
  percentage: getGoalProgress(goal),
  isCompleted: getGoalProgress(goal) >= 100,
  canEdit: getGoalProgress(goal) < 100,
  goal,
});

// ── Store ──────────────────────────────────────────────────────────────────────

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetch(): Promise<void>;
  getAll(): Promise<void>;
  refresh(): Promise<void>;
  add(payload: GoalPayload): Promise<boolean>;
  create(payload: GoalPayload): Promise<boolean>;
  update(id: Goal["id"], payload: GoalPayload): Promise<boolean>;
  addProgress(goalId: string, amount: number, progressDate?: string): Promise<boolean>;
  remove(id: string): Promise<boolean>;
  clearAll(): void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      isLoading: false,
      error: null,
      hasFetched: false,

      fetch: async () => {
        if (get().hasFetched) return;
        set({ isLoading: true, error: null });
        try {
          const data = await goalService.list();
          set({ goals: data, isLoading: false, hasFetched: true });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar objetivos";
          set({ error: err, isLoading: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      getAll: async () => get().fetch(),

      refresh: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await goalService.list();
          set({ goals: data, isLoading: false, hasFetched: true });
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao carregar objetivos";
          set({ error: err, isLoading: false });
          useUiStore.getState().showNotification("error", "Erro", err);
        }
      },

      add: async (payload) => {
        try {
          await goalService.add(payload);
          await get().refresh();
          useUiStore
            .getState()
            .showNotification(
              "success",
              "Objetivo criado",
              "O seu objetivo financeiro foi criado com sucesso.",
            );
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error
              ? error.message
              : "Não foi possível salvar o objetivo.";
          useUiStore.getState().showNotification("error", "Erro ao salvar", err);
          return false;
        }
      },

      create: async (payload) => get().add(payload),

      update: async (id, payload) => {
        try {
          await goalService.update(id, payload);
          await get().refresh();
          useUiStore
            .getState()
            .showNotification(
              "success",
              "Objetivo atualizado",
              "As informações do objetivo foram atualizadas com sucesso.",
            );
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error
              ? error.message
              : "Não foi possível atualizar o objetivo agora.";
          useUiStore.getState().showNotification("error", "Erro ao atualizar", err);
          return false;
        }
      },

      addProgress: async (goalId: string, amount: number, progressDate?: string): Promise<boolean> => {
        try {
          await goalService.addProgress(goalId, amount, progressDate);
          const updated = await goalService.getById(goalId);
          set((s) => ({
            goals: s.goals.map((g) => (g.id === goalId ? updated : g)),
          }));
          useUiStore.getState().showNotification("success", "Progresso registrado", "Progresso adicionado com sucesso!");
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao registrar progresso";
          useUiStore.getState().showNotification("error", "Erro", err);
          return false;
        }
      },

      remove: async (id: string): Promise<boolean> => {
        try {
          await goalService.delete(id);
          set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
          useUiStore.getState().showNotification("success", "Objetivo removido", "Objetivo removido com sucesso!");
          return true;
        } catch (error: any) {
          const err =
            error instanceof Error ? error.message : "Erro ao remover objetivo";
          useUiStore.getState().showNotification("error", "Erro", err);
          return false;
        }
      },

      clearAll: () => {
        set({ goals: [], isLoading: false, error: null, hasFetched: false });
      },
    }),
    {
      name: "wundu-goals-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        goals: state.goals,
      }),
    },
  ),
);

