import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type SessionInfo } from "@/services/user.service";
import { notify } from "@/hooks/use-notification";
import { useUserStore } from "@/store/user-store";
import { useShallow } from "zustand/shallow";

const SESSIONS_KEY = ["sessions"] as const;

export function useSessions() {
  const queryClient = useQueryClient();
  const { logoutUser } = useUserStore();
  // Tracked separately from mutation.isPending/variables so revoking two
  // different sessions in quick succession doesn't have the second call
  // clobber the first row's pending indicator (a shared useMutation only
  // tracks its single latest call).
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const { isAuthenticated, isAuthLoading } = useUserStore(
    useShallow((s) => ({ isAuthenticated: s.isAuthenticated, isAuthLoading: s.isLoading })),
  );
  const authReady = isAuthenticated && !isAuthLoading;

  const { data, isLoading } = useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: () => userService.getSessions(),
    enabled: authReady,
  });

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => userService.revokeSession(sessionId),
    onSuccess: (_void, sessionId) => {
      queryClient.setQueryData<SessionInfo[]>(SESSIONS_KEY, (old) =>
        old?.filter((s) => s.id !== sessionId),
      );
      notify.success("Sessão terminada.");
    },
    onError: () => notify.error("Não foi possível terminar a sessão."),
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => userService.logoutAll(),
    onSuccess: async () => {
      notify.success("Todas as sessões foram terminadas.");
      await logoutUser();
    },
    onError: () => notify.error("Não foi possível terminar todas as sessões."),
  });

  const revokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await revokeMutation.mutateAsync(sessionId);
    } finally {
      setRevokingId(null);
    }
  };

  return {
    sessions: data ?? [],
    isLoading,
    revokingId,
    isRevokingAll: logoutAllMutation.isPending,
    revokeSession,
    logoutAll: () => logoutAllMutation.mutateAsync(),
    refetch: () => queryClient.invalidateQueries({ queryKey: SESSIONS_KEY }),
  };
}
