import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NotificationResponse } from "@/types/dtos/notification.dto";
import { notificationService } from "@/services/notification.service";

interface ApiNotificationStore {
  notifications: NotificationResponse[] | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchAll(): Promise<void>;
  fetchUnread(): Promise<void>;
  fetchUnreadCount(): Promise<void>;
  markAsRead(id: string): Promise<boolean>;
  clearAll(): void;
}

export const useApiNotificationStore = create<ApiNotificationStore>()(
  persist(
    (set, get) => ({
      notifications: null,
      unreadCount: 0,
      isLoading: false,
      error: null,
      hasFetched: false,

      fetchAll: async () => {
        if (get().hasFetched) return;
        set({ isLoading: true });
        try {
          const notifications = await notificationService.getAll();
          const unread = notifications.filter((n) => !n.isRead).length;
          set({ notifications, unreadCount: unread, isLoading: false, hasFetched: true });
        } catch (error: any) {
          const err = error?.response?.data?.message || "Erro ao carregar notificações";
          set({ error: err, isLoading: false });
        }
      },

      fetchUnread: async () => {
        set({ isLoading: true });
        try {
          const unread = await notificationService.getUnread();
          const current = get().notifications ?? [];
          const unreadIds = new Set(unread.map((n) => n.id));
          const merged = [...unread, ...current.filter((n) => !unreadIds.has(n.id))];
          set({ notifications: merged, unreadCount: unread.length, isLoading: false });
        } catch (error: any) {
          const err = error?.response?.data?.message || "Erro ao carregar notificações não lidas";
          set({ error: err, isLoading: false });
        }
      },

      fetchUnreadCount: async () => {
        try {
          const { unreadCount } = await notificationService.getUnreadCount();
          set({ unreadCount });
        } catch {
          // silently fail — count is non-critical
        }
      },

      markAsRead: async (id: string): Promise<boolean> => {
        try {
          await notificationService.markAsRead(id);
          set((s) => ({
            notifications:
              s.notifications?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? null,
            unreadCount: Math.max(0, s.unreadCount - 1),
          }));
          return true;
        } catch (error: any) {
          const err = error?.response?.data?.message || "Erro ao marcar notificação";
          // Lazy import to avoid circular dependency
          import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
          return false;
        }
      },

      clearAll: () => {
        set({ notifications: null, unreadCount: 0, isLoading: false, error: null, hasFetched: false });
      },
    }),
    {
      name: "wundu-api-notifications-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
);
