import { create } from "zustand";
import { UserService } from "@/services/user.service";
import type { User } from "@/types/dtos/auth.dto";
import type { RegisterData } from "@/types/dtos/auth.dto";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/dtos/common.dto";

interface UserStoreState {
  currentStep: number;
  data: RegisterData;
  error: string | null;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  initialized: boolean;
  isAuthenticated: boolean;
}

interface UserStoreActions {
  initializeAuth: () => Promise<void>;
  setToken: (newToken: string | null) => void;
  setRegisterData: (newData: Partial<RegisterData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  registerUser: (overrideData?: RegisterData) => Promise<unknown>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
  clearError: () => void;
}

type UserStore = UserStoreState & UserStoreActions;

const computeIsAuthenticated = (
  initialized: boolean,
  token: string | null,
  user: User | null,
) => initialized && !!token && !!user;

export const useUserStore = create<UserStore>((set, get) => ({
  currentStep: 1,
  data: {},
  error: null,
  isLoading: true,
  token: null,
  user: null,
  initialized: false,
  isAuthenticated: false,

  initializeAuth: async () => {
    if (typeof window === "undefined") {
      set({ isLoading: false, initialized: true, isAuthenticated: false });
      return;
    }

    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      set({ isLoading: false, initialized: true, isAuthenticated: false });
      return;
    }

    try {
      const userData = await UserService.getUser();
      set({
        token: storedToken,
        user: userData,
        isLoading: false,
        initialized: true,
        isAuthenticated: computeIsAuthenticated(true, storedToken, userData),
      });
    } catch {
      localStorage.removeItem("token");
      set({
        token: null,
        user: null,
        isLoading: false,
        initialized: true,
        isAuthenticated: false,
      });
    }
  },

  setToken: (newToken) => {
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("token", newToken);
      } else {
        localStorage.removeItem("token");
      }
    }
    const { user, initialized } = get();
    set({
      token: newToken,
      isAuthenticated: computeIsAuthenticated(initialized, newToken, user),
    });
  },

  setRegisterData: (newData) => {
    set((state) => ({ data: { ...state.data, ...newData } }));
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

  registerUser: async (overrideData) => {
    set({ error: null });
    try {
      const { data } = get();
      const result = await UserService.register(overrideData || data);
      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Falha no registro";
      set({ error: message });
      throw new Error(message);
    }
  },

  loginUser: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await UserService.login(email, password);
      const { setToken } = get();
      setToken(result.token);
      const userData = await UserService.getUser();
      set((state) => ({
        user: userData,
        error: null,
        isAuthenticated: computeIsAuthenticated(state.initialized, state.token, userData),
      }));
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Falha no login";
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  logoutUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
    set({
      token: null,
      user: null,
      data: {},
      error: null,
      currentStep: 1,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
