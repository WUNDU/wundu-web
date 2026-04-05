import { useLimitStore } from "@/store/limit-store";
import type { UserCategoryLimitRequest } from "@/types/dtos/limit.dto";

export function useLimit() {
  const limits = useLimitStore((s) => s.limits);
  const isLoading = useLimitStore((s) => s.isLoading);
  const error = useLimitStore((s) => s.error);
  const define = useLimitStore((s) => s.define);
  const fetchLimit = useLimitStore((s) => s.fetchLimit);
  const clearAll = useLimitStore((s) => s.clearAll);

  return {
    limits,
    isLoading,
    error,
    defineLimit: (payload: UserCategoryLimitRequest) => define(payload),
    fetchLimit,
    getLimitKey: (userId: string, categoryId: string) => `${userId}_${categoryId}`,
    clearAll,
  };
}
