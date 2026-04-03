import {
  useGoalStore,
  getGoalProgress,
  buildGoalCardData,
  formatGoalCurrency,
} from "@/store/goal-store";

export { getGoalProgress, buildGoalCardData, formatGoalCurrency };

export function useGoal() {
  const { goals, isLoading, error, hasFetched, fetch, refresh, add, update, clearAll } =
    useGoalStore();

  return {
    goals,
    isLoading,
    error,
    hasFetched,
    getGoals: fetch,
    refreshGoals: refresh,
    addGoal: add,
    updateGoal: update,
    clearGoals: clearAll,
  };
}
