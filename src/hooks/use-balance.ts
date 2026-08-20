import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { useShallow } from "zustand/shallow";
import { transactionService } from "@/services/transaction.service";

export const balanceKey = (from?: string, to?: string) =>
  ["transactions", "balance", from ?? null, to ?? null] as const;

export function useBalance(from?: string, to?: string) {
  const { isAuthenticated, isAuthLoading } = useUserStore(
    useShallow((s) => ({ isAuthenticated: s.isAuthenticated, isAuthLoading: s.isLoading })),
  );
  const authReady = isAuthenticated && !isAuthLoading;
  return useQuery({
    queryKey: balanceKey(from, to),
    queryFn: () => transactionService.getBalance(from, to),
    enabled: authReady,
  });
}
