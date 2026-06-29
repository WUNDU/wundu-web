import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalService } from "@/services/goal.service";
import { useUiStore } from "@/store/ui-store";
import type { Goal, GoalPayload } from "@/types/dtos/goal.dto";

export { getGoalProgress, buildGoalCardData, formatGoalCurrency } from "@/utils/goal";

const GOALS_KEY = ["goals"] as const;

const notifyError = (title: string, error: any, fallback: string) => {
  const err = error instanceof Error ? error.message : fallback;
  useUiStore.getState().showNotification("error", title, err);
};

export function useGoal() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetched, error } = useQuery({
    queryKey: GOALS_KEY,
    queryFn: () => goalService.list(),
  });

  const patchGoal = (updated: Goal) =>
    queryClient.setQueryData<Goal[]>(GOALS_KEY, (old = []) =>
      old.map((g) => (g.id === updated.id ? updated : g)),
    );

  const addMutation = useMutation({
    mutationFn: (payload: GoalPayload) => goalService.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      useUiStore
        .getState()
        .showNotification("success", "Objetivo criado", "O seu objetivo financeiro foi criado com sucesso.");
    },
    onError: (error: any) => notifyError("Erro ao salvar", error, "Não foi possível salvar o objetivo."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: Goal["id"]; payload: GoalPayload }) => goalService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_KEY });
      useUiStore
        .getState()
        .showNotification("success", "Objetivo atualizado", "As informações do objetivo foram atualizadas com sucesso.");
    },
    onError: (error: any) => notifyError("Erro ao atualizar", error, "Não foi possível atualizar o objetivo agora."),
  });

  const addProgressMutation = useMutation({
    mutationFn: async ({ goalId, amount, progressDate }: { goalId: string; amount: number; progressDate?: string }) => {
      await goalService.addProgress(goalId, amount, progressDate);
      return goalService.getById(goalId);
    },
    onSuccess: (updated) => {
      patchGoal(updated);
      useUiStore.getState().showNotification("success", "Progresso registrado", "Progresso adicionado com sucesso!");
    },
    onError: (error: any) => {
      const is422 = error?.response?.status === 422;
      const err = is422
        ? (error.response?.data?.message ?? "Valor excede o disponível para este objectivo.")
        : (error instanceof Error ? error.message : "Erro ao registrar progresso");
      useUiStore.getState().showNotification("error", "Erro", err);
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({
      goalId,
      progressId,
      amount,
      progressDate,
    }: { goalId: string; progressId: string; amount: number; progressDate?: string }) => {
      await goalService.updateProgress(goalId, progressId, amount, progressDate);
      return goalService.getById(goalId);
    },
    onSuccess: (updated) => {
      patchGoal(updated);
      useUiStore.getState().showNotification("success", "Progresso atualizado", "Progresso editado com sucesso!");
    },
    onError: (error: any) => notifyError("Erro", error, "Erro ao editar progresso"),
  });

  const deleteProgressMutation = useMutation({
    mutationFn: async ({ goalId, progressId }: { goalId: string; progressId: string }) => {
      await goalService.deleteProgress(goalId, progressId);
      return goalService.getById(goalId);
    },
    onSuccess: (updated) => {
      patchGoal(updated);
      useUiStore.getState().showNotification("success", "Progresso removido", "Progresso removido com sucesso!");
    },
    onError: (error: any) => notifyError("Erro", error, "Erro ao remover progresso"),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => goalService.delete(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData<Goal[]>(GOALS_KEY, (old = []) => old.filter((g) => g.id !== id));
      useUiStore.getState().showNotification("success", "Objetivo removido", "Objetivo removido com sucesso!");
    },
    onError: (error: any) => notifyError("Erro", error, "Erro ao remover objetivo"),
  });

  const getGoals = useCallback(
    () => queryClient.prefetchQuery({ queryKey: GOALS_KEY, queryFn: () => goalService.list() }),
    [queryClient],
  );
  const getAll = getGoals;
  const refreshGoals = useCallback(
    () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
    [queryClient],
  );
  const addGoal = useCallback(
    (payload: GoalPayload) => addMutation.mutateAsync(payload).then(() => true).catch(() => false),
    [addMutation.mutateAsync],
  );
  const createGoal = addGoal;
  const updateGoal = useCallback(
    (id: Goal["id"], payload: GoalPayload) =>
      updateMutation.mutateAsync({ id, payload }).then(() => true).catch(() => false),
    [updateMutation.mutateAsync],
  );
  const addProgress = useCallback(
    (goalId: string, amount: number, progressDate?: string) =>
      addProgressMutation.mutateAsync({ goalId, amount, progressDate }).then(() => true).catch(() => false),
    [addProgressMutation.mutateAsync],
  );
  const updateProgress = useCallback(
    (goalId: string, progressId: string, amount: number, progressDate?: string) =>
      updateProgressMutation.mutateAsync({ goalId, progressId, amount, progressDate }).then(() => true).catch(() => false),
    [updateProgressMutation.mutateAsync],
  );
  const deleteProgress = useCallback(
    (goalId: string, progressId: string) =>
      deleteProgressMutation.mutateAsync({ goalId, progressId }).then(() => true).catch(() => false),
    [deleteProgressMutation.mutateAsync],
  );
  const removeGoal = useCallback(
    (id: string) => removeMutation.mutateAsync(id).then(() => true).catch(() => false),
    [removeMutation.mutateAsync],
  );
  const clearGoals = useCallback(
    () => queryClient.removeQueries({ queryKey: GOALS_KEY }),
    [queryClient],
  );
  const clearAll = clearGoals;

  return {
    goals: data ?? [],
    isLoading,
    error: error ? (error instanceof Error ? error.message : "Erro ao carregar objetivos") : null,
    hasFetched: isFetched,
    getGoals,
    getAll,
    refreshGoals,
    addGoal,
    createGoal,
    updateGoal,
    addProgress,
    updateProgress,
    deleteProgress,
    removeGoal,
    clearGoals,
    clearAll,
  };
}
