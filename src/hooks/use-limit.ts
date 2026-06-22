import { useCallback, useState } from "react";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { limitService } from "@/services/limit.service";
import type { UserCategoryLimitRequest, UserCategoryLimitResponse } from "@/types/dtos/limit.dto";

const limitKey = (categoryId: string) => ["limits", categoryId] as const;

export function useLimit() {
  const queryClient = useQueryClient();
  const [trackedIds, setTrackedIds] = useState<string[]>([]);

  const results = useQueries({
    queries: trackedIds.map((categoryId) => ({
      queryKey: limitKey(categoryId),
      queryFn: () => limitService.getByCategory(categoryId),
      retry: false,
    })),
  });

  const limits = trackedIds.reduce<Record<string, UserCategoryLimitResponse>>((acc, id, index) => {
    const data = results[index]?.data;
    if (data) acc[id] = data;
    return acc;
  }, {});

  const isLoading = results.some((r) => r.isLoading);

  const defineMutation = useMutation({
    mutationFn: (payload: UserCategoryLimitRequest) => limitService.define(payload),
    onMutate: async () => {
      const { notify, loading } = await import("@/hooks/use-notification");
      loading.show("Definindo limite...");
      return { notify, loading };
    },
    onSuccess: (result, _payload, context) => {
      queryClient.setQueryData(limitKey(result.categoryId), result);
      context?.loading.hide();
      context?.notify.success("Limite definido com sucesso!");
    },
    onError: (error: any, _payload, context) => {
      const err = error?.response?.data?.message || "Erro ao definir limite";
      context?.loading.hide();
      context?.notify.error(err);
    },
  });

  const fetchLimit = useCallback(
    (categoryId: string) =>
      setTrackedIds((ids) => (ids.includes(categoryId) ? ids : [...ids, categoryId])),
    [],
  );

  // Bails out to the SAME array reference when no new id is added — calling this
  // repeatedly with the same categoryIds (e.g. from a render-triggered effect)
  // must not produce a new state value, or it loops forever.
  const fetchMultipleLimits = useCallback(
    (categoryIds: string[]) =>
      setTrackedIds((ids) => {
        const missing = categoryIds.filter((id) => !ids.includes(id));
        return missing.length === 0 ? ids : [...ids, ...missing];
      }),
    [],
  );

  const defineLimit = useCallback(
    (payload: UserCategoryLimitRequest) =>
      defineMutation.mutateAsync(payload).then(() => true).catch(() => false),
    [defineMutation.mutateAsync],
  );

  const getLimitKey = useCallback(
    (userId: string, categoryId: string) => `${userId}_${categoryId}`,
    [],
  );

  const clearAll = useCallback(() => {
    setTrackedIds([]);
    queryClient.removeQueries({ queryKey: ["limits"] });
  }, [queryClient]);

  return {
    limits,
    isLoading,
    error: null,
    defineLimit,
    fetchLimit,
    fetchMultipleLimits,
    getLimitKey,
    clearAll,
  };
}
