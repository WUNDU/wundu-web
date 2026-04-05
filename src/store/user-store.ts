import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userService } from "@/services/user.service";
import type { User } from "@/types/dtos/auth.dto";
import type { RegisterData } from "@/types/dtos/auth.dto";

/** Limpa todos os dados de utilizador em cache nos stores */
function clearUserStores() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useTransactionStore } = require("./transaction-store") as typeof import("./transaction-store");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useGoalStore } = require("./goal-store") as typeof import("./goal-store");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useCategoryStore } = require("./category-store") as typeof import("./category-store");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useApiNotificationStore } = require("./api-notification-store") as typeof import("./api-notification-store");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useLimitStore } = require("./limit-store") as typeof import("./limit-store");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useDocumentStore } = require("./document-store") as typeof import("./document-store");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useChatStore } = require("./chat-store") as typeof import("./chat-store");

  useTransactionStore.getState().clearAll();
  useGoalStore.getState().clearAll();
  useCategoryStore.getState().clearAll();
  useApiNotificationStore.getState().clearAll();
  useLimitStore.getState().clearAll();
  useDocumentStore.getState().clearAll();
  useChatStore.getState().clearConversation();
}

interface AuthState {
  // Auth state
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;

  // Registration multi-step state
  currentStep: number;
  data: RegisterData;

  checkAuthStatus(): Promise<void>;
  initializeAuth(): Promise<void>;
  setToken(newToken: string | null): void;
  login(email: string, password: string): Promise<boolean>;
  register(payload: RegisterData): Promise<boolean>;
  logout(): void;
  logoutUser(): void;
  clearError(): void;

  // Registration methods
  setRegisterData(newData: Partial<RegisterData>): void;
  nextStep(): void;
  prevStep(): void;
  loginUser(email: string, password: string): Promise<boolean>;
  registerUser(payload?: RegisterData): Promise<boolean>;
}

export const useUserStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Auth state
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      user: null,

      // Registration multi-step state
      currentStep: 1,
      data: {},

      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          const { token } = get();
          if (!token) {
            set({ isLoading: false });
            return;
          }
          const user = await userService.getUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          get().setToken(null);
          set({ isAuthenticated: false, isLoading: false, user: null });
        }
      },

      initializeAuth: async () => {
        await get().checkAuthStatus();
      },

      setToken: (newToken) => {
        if (typeof window !== "undefined") {
          if (newToken) {
            localStorage.setItem("token", newToken);
          } else {
            localStorage.removeItem("token");
          }
        }
        set({ token: newToken });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userService.login(email, password);
          clearUserStores();
          // setToken persists to localStorage["token"] so the API interceptor can read it
          get().setToken(response.token);
          set({ isAuthenticated: true, isLoading: false });
          await get().checkAuthStatus();
          return true;
        } catch (error: any) {
          const err =
            error?.response?.status === 500
              ? "Não foi possível acessar o sistema. Tente mais tarde!"
              : error?.message || "Credenciais erradas";
          set({ error: err, isLoading: false });
          return false;
        }
      },

      register: async (payload: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          await userService.register(payload);
          // Após registro, fazer login automático
          return await get().login(payload.email ?? "", payload.password ?? "");
        } catch (error: any) {
          const err =
            error?.response?.status === 500
              ? "Não foi possível acessar o sistema. Tente mais tarde!"
              : error?.response?.data?.message || "Erro ao criar conta";
          set({ error: err, isLoading: false });
          return false;
        }
      },

      logout: () => {
        clearUserStores();
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        set({ token: null, isAuthenticated: false, isLoading: false, error: null, user: null });
      },

      logoutUser: () => {
        get().logout();
      },

      clearError: () => set({ error: null }),

      // Registration methods
      setRegisterData: (newData) => {
        set((state) => ({ data: { ...state.data, ...newData } }));
      },

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      loginUser: async (email: string, password: string) => {
        return await get().login(email, password);
      },

      registerUser: async (payload?: RegisterData) => {
        const data = payload || get().data;
        set({ isLoading: true, error: null });
        try {
          await userService.register(data);
          const success = await get().login(data.email ?? "", data.password ?? "");
          if (success) {
            set({ currentStep: 3 });
          }
          return success;
        } catch (error: any) {
          const err =
            error?.response?.status === 500
              ? "Não foi possível acessar o sistema. Tente mais tarde!"
              : error?.response?.data?.message || "Erro ao criar conta";
          set({ error: err, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "wundu-user-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        currentStep: state.currentStep,
        data: state.data,
      }),
    },
  ),
);
