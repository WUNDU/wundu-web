import { create } from "zustand";
import { toast } from "sonner";

export type NotificationType = "success" | "error" | "info";

interface UiStore {
  showNotification: (
    type: NotificationType,
    title: string,
    message: string,
    options?: { duration?: number },
  ) => void;
  isNotificationCenterOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isNotificationCenterOpen: false,
  showNotification: (type, title, message, { duration = 4000 } = {}) => {
    const fn = type === "success" ? toast.success : type === "error" ? toast.error : toast.info;
    fn(title, { description: message, duration });
  },
  openNotificationCenter: () => set({ isNotificationCenterOpen: true }),
  closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),
}));
