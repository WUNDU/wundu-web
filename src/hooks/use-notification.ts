import { useNotificationStore, type ToastType } from "@/store/notification-store";

/**
 * Hook for global notifications (toast + loading).
 * Works in React components.
 */
export function useNotification() {
  return {
    toast: (message: string, type: ToastType = "info") => {
      useNotificationStore.getState().showToast(message, type);
    },
    loading: {
      show: (message?: string) => {
        useNotificationStore.getState().showLoading(message);
      },
      hide: () => {
        useNotificationStore.getState().hideLoading();
      },
    },
  };
}

/**
 * Utility object for calling notifications outside React (e.g., in stores).
 * Uses .getState() so it can be safely called from non-React contexts.
 */
export const notify = {
  success: (message: string) =>
    useNotificationStore.getState().showToast(message, "success"),
  error: (message: string) =>
    useNotificationStore.getState().showToast(message, "error"),
  warning: (message: string) =>
    useNotificationStore.getState().showToast(message, "warning"),
  info: (message: string) =>
    useNotificationStore.getState().showToast(message, "info"),
};

/**
 * Utility object for controlling loading state outside React.
 */
export const loading = {
  show: (message?: string) =>
    useNotificationStore.getState().showLoading(message),
  hide: () => useNotificationStore.getState().hideLoading(),
};
