import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";

export const balanceKey = (from?: string, to?: string) =>
  ["transactions", "balance", from ?? null, to ?? null] as const;

export function useBalance(from?: string, to?: string) {
  return useQuery({
    queryKey: balanceKey(from, to),
    queryFn: () => transactionService.getBalance(from, to),
  });
}
