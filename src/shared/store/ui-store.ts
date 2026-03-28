import { create } from "zustand";
import { toast } from "sonner";

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
    options?: { duration?: number; onClose?: () => void },
  ) => void;
  closeNotification: () => void;
  isNotificationCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  notification: null,
  isNotificationCenterOpen: false,
  showNotification: (
    type,
    title,
    message,
    { duration = 4000, onClose } = {},
  ) => {
    get().closeNotification();

    const notification: Notification = { type, title, message, onClose };
    set({ notification });

    // Also surface via Sonner for consistent global feedback
    const sonnerFn =
      type === "success"
        ? toast.success
        : type === "error"
          ? toast.error
          : toast.info;
    sonnerFn(title, { description: message, duration });

    setTimeout(() => {
      get().closeNotification();
    }, duration);
  },
  closeNotification: () => {
    const { notification } = get();
    notification?.onClose?.();
    set({ notification: null });
  },
  openNotificationCenter: () => set({ isNotificationCenterOpen: true }),
  closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),
}));
