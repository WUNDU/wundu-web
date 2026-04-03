import { GoalsService } from "@/services/goal.service";
import type { Goal, GoalPayload } from "@/types/dtos/goal.dto";
import { create } from "zustand";
import { useUiStore } from "@/store/ui-store";

// ── Helper utilities (moved from use-goals hook) ───────────────────────────────

const currencyFormatter = new Intl.NumberFormat("pt-AO", {
  style: "currency",
  currency: "AOA",
  minimumFractionDigits: 2,
});

export const formatGoalCurrency = (value?: number) =>
  currencyFormatter.format(value ?? 0);

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
  refresh(): Promise<void>;
  add(payload: GoalPayload): Promise<boolean>;
  update(id: Goal["id"], payload: GoalPayload): Promise<boolean>;
  clearAll(): void;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,
  hasFetched: false,

  fetch: async () => {
    if (get().hasFetched) return;
    set({ isLoading: true, error: null });
    try {
      const data = await GoalsService.list();
      set({ goals: data, isLoading: false, hasFetched: true });
    } catch (error: any) {
      const err =
        error instanceof Error ? error.message : "Erro ao carregar objetivos";
      set({ error: err, isLoading: false });
      useUiStore.getState().showNotification("error", "Erro", err);
    }
  },

  refresh: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await GoalsService.list();
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
      await GoalsService.add(payload);
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

  update: async (id, payload) => {
    try {
      await GoalsService.update(id, payload);
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

  clearAll: () => {
    set({ goals: [], isLoading: false, error: null, hasFetched: false });
  },
}));
