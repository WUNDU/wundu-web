import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import type { NotificationResponse } from "@/types/dtos/notification.dto";

const ALL_KEY = ["notifications", "all"] as const;
const UNREAD_KEY = ["notifications", "unread"] as const;
const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;

export function useApiNotification() {
  const queryClient = useQueryClient();

  const allQuery = useQuery({
    queryKey: ALL_KEY,
    queryFn: () => notificationService.getAll(),
    enabled: false,
  });

  const unreadQuery = useQuery({
    queryKey: UNREAD_KEY,
    queryFn: () => notificationService.getUnread(),
    enabled: false,
  });

  const unreadCountQuery = useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: () => notificationService.getUnreadCount(),
    enabled: false,
  });

  const notifications = allQuery.data ?? null;
  const unreadNotifications = unreadQuery.data ?? null;
  const unreadCount = notifications
    ? notifications.filter((n) => !n.isRead).length
    : unreadCountQuery.data?.unreadCount ?? 0;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (_res, id) => {
      queryClient.setQueryData<NotificationResponse[]>(ALL_KEY, (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      queryClient.setQueryData<NotificationResponse[]>(UNREAD_KEY, (old) =>
        old?.filter((n) => n.id !== id),
      );
    },
    onError: async (error: any) => {
      const err = error?.response?.data?.message || "Erro ao marcar notificação";
      const { notify } = await import("@/hooks/use-notification");
      notify.error(err);
    },
  });

  const fetchAll = useCallback(
    () => queryClient.fetchQuery({ queryKey: ALL_KEY, queryFn: () => notificationService.getAll() }),
    [queryClient],
  );

  const fetchUnread = useCallback(
    () => queryClient.fetchQuery({ queryKey: UNREAD_KEY, queryFn: () => notificationService.getUnread() }),
    [queryClient],
  );

  const fetchUnreadCount = useCallback(
    () => queryClient.fetchQuery({ queryKey: UNREAD_COUNT_KEY, queryFn: () => notificationService.getUnreadCount() }),
    [queryClient],
  );

  const markAsRead = useCallback(
    (id: string) => markAsReadMutation.mutateAsync(id).then(() => true).catch(() => false),
    [markAsReadMutation.mutateAsync],
  );

  const clearAll = useCallback(
    () => queryClient.removeQueries({ queryKey: ["notifications"] }),
    [queryClient],
  );

  return {
    notifications,
    unreadNotifications,
    isLoading: allQuery.isLoading,
    error: allQuery.error
      ? allQuery.error instanceof Error
        ? allQuery.error.message
        : "Erro ao carregar notificações"
      : null,
    hasFetched: allQuery.isFetched,
    fetchAll,
    fetchUnread,
    fetchUnreadCount,
    unreadCount,
    markAsRead,
    clearAll,
  };
}
