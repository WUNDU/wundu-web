import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userService } from "@/services/user.service";
import type { User } from "@/types/dtos/auth.dto";
import type { RegisterData } from "@/types/dtos/auth.dto";
import type { UserRequest } from "@/types/dtos/user.dto";
import { useUiStore } from "@/store/ui-store";
import { getApiErrorMessage } from "@/utils/api-error";
import { clearPendingVerificationContext } from "@/utils/pending-verification";

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
  retryAfterSeconds: number | null;
  user: User | null;

  // Registration multi-step state
  currentStep: number;
  data: RegisterData;

  checkAuthStatus(): Promise<void>;
  initializeAuth(): Promise<void>;
  refreshToken(): Promise<string>;
  setToken(newToken: string | null): void;
  setUser(user: User): void;
  updateProfile(payload: Partial<UserRequest>): Promise<boolean>;
  uploadAvatar(file: File): Promise<boolean>;
  removeAvatar(): Promise<boolean>;
  login(email: string, password: string): Promise<boolean>;
  loginWithGoogle(idToken: string): Promise<void>;
  registerWithGoogle(idToken: string): Promise<void>;
  applyGoogleSession(response: { accessToken: string }): Promise<void>;
  register(payload: RegisterData): Promise<boolean>;
  logout(): Promise<void>;
  logoutUser(): Promise<void>;
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
      retryAfterSeconds: null,
      user: null,

      // Registration multi-step state
      currentStep: 1,
      data: {},

      initializeAuth: async () => {
        if (get().isLoading && get().isAuthenticated) return;
        set({ isLoading: true });
        try {
          const { accessToken } = await userService.refresh();
          // Token ready → allow UI to proceed immediately
          set({ token: accessToken, isAuthenticated: true, isLoading: false });
          // Sync user profile in background
          get().checkAuthStatus().catch(() => {});
        } catch (error: any) {
          const status = error?.status || error?.response?.status;
          const isAuthError = status === 401 || status === 403;

          if (isAuthError) {
            // Session expired → full logout
            set({ token: null, isAuthenticated: false, isLoading: false, user: null });
            await userService.logoutApi().catch(() => {});
            if (typeof window !== "undefined" && window.location.pathname.startsWith("/home")) {
              window.location.href = "/login";
            }
          } else {
            // Network error or server error (5xx, timeout) → keep user state intact.
            // Don't log out — the backend may be momentarily unreachable.
            set({ isLoading: false });
          }
        }
      },

      checkAuthStatus: async () => {
        // Only show loading if we don't have a token/auth yet
        const shouldShowLoading = !get().isAuthenticated;
        if (shouldShowLoading) set({ isLoading: true });

        try {
          const { token } = get();
          if (!token) {
            if (shouldShowLoading) set({ isLoading: false });
            return;
          }
          const user = await userService.getUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          // Don't log out on aborted/cancelled requests (e.g. StrictMode double-mount, navigation)
          if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
            if (shouldShowLoading) set({ isLoading: false });
            return;
          }
          // Only log out on explicit auth rejection (401/403), not network errors
          const status = error?.status || error?.response?.status;
          if (status === 401 || status === 403) {
            get().setToken(null);
            set({ isAuthenticated: false, isLoading: false, user: null });
          } else {
            if (shouldShowLoading) set({ isLoading: false });
          }
        }
      },

      // Renova o accessToken usando o cookie HttpOnly de refresh (gerido pelo browser)
      refreshToken: async () => {
        const { accessToken } = await userService.refresh();
        set({ token: accessToken, isAuthenticated: true });
        return accessToken;
      },

      setToken: (newToken) => {
        set({ token: newToken });
      },

      setUser: (user) => {
        set({ user });
      },

      updateProfile: async (payload) => {
        const current = get().user;
        if (!current) return false;
        try {
          const updated = await userService.update(current.id, payload);
          set({ user: updated });
          useUiStore
            .getState()
            .showNotification("success", "Perfil actualizado", "Os seus dados foram guardados com sucesso.");
          return true;
        } catch (error: any) {
          useUiStore
            .getState()
            .showNotification("error", "Erro ao actualizar", getApiErrorMessage(error, "Não foi possível actualizar o perfil."));
          return false;
        }
      },

      uploadAvatar: async (file) => {
        try {
          const { profilePhotoUrl } = await userService.uploadPhoto(file);
          set((s) => (s.user ? { user: { ...s.user, profilePhotoUrl } } : {}));
          useUiStore
            .getState()
            .showNotification("success", "Foto actualizada", "A sua foto de perfil foi actualizada.");
          return true;
        } catch (error: any) {
          useUiStore
            .getState()
            .showNotification("error", "Erro no upload", getApiErrorMessage(error, "Não foi possível enviar a foto."));
          return false;
        }
      },

      removeAvatar: async () => {
        try {
          await userService.deletePhoto();
          set((s) => (s.user ? { user: { ...s.user, profilePhotoUrl: null } } : {}));
          useUiStore
            .getState()
            .showNotification("success", "Foto removida", "A sua foto de perfil foi removida.");
          return true;
        } catch (error: any) {
          useUiStore
            .getState()
            .showNotification("error", "Erro ao remover", getApiErrorMessage(error, "Não foi possível remover a foto."));
          return false;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null, retryAfterSeconds: null });
        try {
          const response = await userService.login(email, password);
          clearUserStores();
          // accessToken guardado apenas em memória — nunca em localStorage
          set({ token: response.accessToken, isAuthenticated: true, isLoading: false, currentStep: 1, data: {} });
          await get().checkAuthStatus();

          // Novo paradigma: contas não verificadas têm acesso total à aplicação.
          // O aviso e a acção de verificação vivem apenas no perfil — não bloqueamos
          // nem redirecionamos o utilizador para a página de verificação.
          clearPendingVerificationContext();

          return true;
        } catch (error: any) {
          const errorCode = error?.errorCode as string | undefined;
          let errMsg: string;

          if (errorCode === "TOO_MANY_ATTEMPTS") {
            errMsg = "Demasiadas tentativas. Aguarde antes de tentar novamente.";
            set({ error: errMsg, isLoading: false, retryAfterSeconds: error?.retryAfterSeconds ?? 900 });
          } else if (errorCode === "ACCOUNT_DISABLED") {
            errMsg = "A sua conta foi desactivada. Contacte o suporte.";
            set({ error: errMsg, isLoading: false });
          } else if (errorCode === "EMAIL_NOT_VERIFIED") {
            errMsg = "Por favor, verifique o seu email antes de entrar.";
            set({ error: errMsg, isLoading: false });
          } else {
            const status = error?.status || error?.response?.status;
            errMsg = getApiErrorMessage(
              error,
              status === 500
                ? "Não foi possível acessar o sistema. Tente mais tarde!"
                : "Credenciais erradas"
            );
            set({ error: errMsg, isLoading: false });
          }
          return false;
        }
      },

      // Aplica o resultado de um login/registo Google bem-sucedido (mesmo
      // tratamento do login normal: token em memória + carregar utilizador).
      applyGoogleSession: async (response: { accessToken: string }) => {
        clearUserStores();
        set({ token: response.accessToken, isAuthenticated: true, isLoading: false, currentStep: 1, data: {} });
        await get().checkAuthStatus();
        clearPendingVerificationContext();
      },

      // Login com Google. Lança o erro (com .status) para o chamador decidir o
      // fluxo — ex.: 404 → conta inexistente → seguir para registo Google.
      loginWithGoogle: async (idToken: string) => {
        set({ isLoading: true, error: null, retryAfterSeconds: null });
        try {
          const response = await userService.googleLogin(idToken);
          await get().applyGoogleSession(response);
        } catch (error: any) {
          const errMsg = getApiErrorMessage(error, "Não foi possível entrar com o Google.");
          set({ error: errMsg, isLoading: false });
          throw error;
        }
      },

      // Registo com Google — cria a conta a partir do idToken.
      registerWithGoogle: async (idToken: string) => {
        set({ isLoading: true, error: null, retryAfterSeconds: null });
        try {
          const response = await userService.googleRegister(idToken);
          await get().applyGoogleSession(response);
        } catch (error: any) {
          const errMsg = getApiErrorMessage(error, "Não foi possível criar a conta com o Google.");
          set({ error: errMsg, isLoading: false });
          throw error;
        }
      },

      register: async (payload: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          await userService.register(payload);
          // Após registro, fazer login automático
          return await get().login(payload.email ?? "", payload.password ?? "");
        } catch (error: any) {
          const status = error?.status || error?.response?.status;
          const err = getApiErrorMessage(
            error,
            status === 500
              ? "Não foi possível acessar o sistema. Tente mais tarde!"
              : "Erro ao criar conta"
          );
          set({ error: err, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        // Await cookie clearing so wundu_session is gone before the browser
        // makes the next request — prevents middleware from redirecting /login back to /home
        await userService.logoutApi().catch(() => {});
        clearUserStores();
        set({ token: null, isAuthenticated: false, isLoading: false, error: null, user: null, currentStep: 1, data: {} });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },

      logoutUser: async () => {
        await get().logout();
      },

      clearError: () => set({ error: null, retryAfterSeconds: null }),

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
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          const status = error?.status || error?.response?.status;
          const err = getApiErrorMessage(
            error,
            status === 500
              ? "Não foi possível acessar o sistema. Tente mais tarde!"
              : "Erro ao criar conta"
          );
          set({ error: err, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "wundu-user-cache",
      storage: createJSONStorage(() => localStorage),
      // O token NÃO é persistido — vive apenas em memória (segurança contra XSS).
      // O user é persistido para exibição imediata enquanto o refresh silencioso decorre.
      // O estado de registo (currentStep, data) é intencionalmente efémero.
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        // Sanitise any stale registration state left by older versions of the store
        if (state) {
          state.currentStep = 1;
          state.data = {};
        }
      },
    },
  ),
);
