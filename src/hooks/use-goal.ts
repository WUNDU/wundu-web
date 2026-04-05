import { useEffect } from "react";
import {
  useGoalStore,
  getGoalProgress,
  buildGoalCardData,
  formatGoalCurrency,
} from "@/store/goal-store";

export { getGoalProgress, buildGoalCardData, formatGoalCurrency };

export function useGoal() {
  const goals = useGoalStore((s) => s.goals);
  const isLoading = useGoalStore((s) => s.isLoading);
  const error = useGoalStore((s) => s.error);
  const hasFetched = useGoalStore((s) => s.hasFetched);
  const fetch = useGoalStore((s) => s.fetch);
  const refresh = useGoalStore((s) => s.refresh);
  const add = useGoalStore((s) => s.add);
  const update = useGoalStore((s) => s.update);
  const addProgress = useGoalStore((s) => s.addProgress);
  const remove = useGoalStore((s) => s.remove);
  const clearAll = useGoalStore((s) => s.clearAll);

  useEffect(() => {
    if (!hasFetched) {
      fetch();
    }
  }, [hasFetched, fetch]);

  return {
    goals,
    isLoading,
    error,
    hasFetched,
    getGoals: fetch,
    refreshGoals: refresh,
    addGoal: add,
    createGoal: add,
    updateGoal: update,
    addProgress,
    removeGoal: remove,
    clearGoals: clearAll,
    clearAll,
  };
}
