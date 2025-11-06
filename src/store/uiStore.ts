// store/uiStore.ts
import { create } from "zustand";

export type NotificationType = "success" | "error" | "info";

interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  onClose?: () => void;
}

interface UiStore {
  notification: Notification | null;
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    options?: { duration?: number; onClose?: () => void }
  ) => void;
  closeNotification: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  notification: null,
  showNotification: (
    type,
    title,
    message,
    { duration = 40000, onClose } = {}
  ) => {
    // Fecha notificação anterior imediatamente se existir
    get().closeNotification();

    const notification: Notification = { type, title, message, onClose };

    set({ notification });

    setTimeout(() => {
      get().closeNotification();
    }, duration);
  },
  closeNotification: () => {
    const { notification } = get();
    notification?.onClose?.();
    set({ notification: null });
  },
}));
