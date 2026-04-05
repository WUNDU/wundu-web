import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BudgetEntry {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  monthlyLimit: number; // in Kz
}

interface BudgetStore {
  budgets: BudgetEntry[];
  setBudget: (entry: BudgetEntry) => void;
  removeBudget: (categoryName: string) => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      budgets: [],

      setBudget: (entry) =>
        set((state) => {
          const idx = state.budgets.findIndex((b) => b.categoryName === entry.categoryName);
          if (idx >= 0) {
            const updated = [...state.budgets];
            updated[idx] = entry;
            return { budgets: updated };
          }
          return { budgets: [...state.budgets, entry] };
        }),

      removeBudget: (categoryName) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.categoryName !== categoryName),
        })),
    }),
    {
      name: "wundu-budgets-cache",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
