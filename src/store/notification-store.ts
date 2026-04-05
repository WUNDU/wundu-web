import { create } from "zustand";
import { toast } from "sonner";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface NotificationState {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;

  isLoading: boolean;
  loadingMessage?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  showToast: (message: string, type: ToastType = "info", duration = 4000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Also show via Sonner for native web notifications
    const sonnerFn =
      type === "success" ? toast.success
      : type === "error" ? toast.error
      : type === "warning" ? toast.warning
      : toast.info;
    sonnerFn(message, { duration });

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },

  removeToast: (id: string) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  isLoading: false,
  loadingMessage: undefined,
  showLoading: (message?: string) => set({ isLoading: true, loadingMessage: message }),
  hideLoading: () => set({ isLoading: false, loadingMessage: undefined }),
}));
