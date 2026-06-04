import { useState, useEffect, useCallback } from "react";
import { userService, type SessionInfo } from "@/services/user.service";
import { notify } from "@/hooks/use-notification";
import { useUserStore } from "@/store/user-store";

export function useSessions() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const { logoutUser } = useUserStore();

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getSessions();
      setSessions(data);
    } catch {
      notify.error("Não foi possível carregar as sessões.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const revokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await userService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      notify.success("Sessão terminada.");
    } catch {
      notify.error("Não foi possível terminar a sessão.");
    } finally {
      setRevokingId(null);
    }
  };

  const logoutAll = async () => {
    setIsRevokingAll(true);
    try {
      await userService.logoutAll();
      notify.success("Todas as sessões foram terminadas.");
      await logoutUser();
    } catch {
      notify.error("Não foi possível terminar todas as sessões.");
    } finally {
      setIsRevokingAll(false);
    }
  };

  return { sessions, isLoading, revokingId, isRevokingAll, revokeSession, logoutAll, refetch: fetchSessions };
}
