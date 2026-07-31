import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { userService } from "@/services/user.service";
import type { User } from "@/types/dtos/auth.dto";
import type { RegisterData } from "@/types/dtos/auth.dto";
import type { ProfileUpdateRequest, UserRequest } from "@/types/dtos/user.dto";
import { useUiStore } from "@/store/ui-store";
import { getApiErrorMessage } from "@/utils/api-error";
import {
  clearPendingVerificationContext,
  setPendingVerificationEmail,
} from "@/utils/pending-verification";
import { getQueryClient } from "@/lib/query-client";

// Dedup global de /auth/refresh: initializeAuth() (no mount) e o interceptor
// do axios (em qualquer 401) podiam chamar refresh em simultâneo. Com refresh
// token rotativo de uso único, a segunda chamada chegava ao backend já com o
// cookie invalidado pela primeira → falha → logout indevido no refresh da página.
// Esta promise partilhada garante que só existe um /auth/refresh em voo de cada vez.
let refreshPromise: Promise<string> | null = null;

/** Limpa todos os dados de utilizador em cache nos stores */
function clearUserStores() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useChatStore } = require("./chat-store") as typeof import("./chat-store");

  useChatStore.getState().clearConversation();
  const queryClient = getQueryClient();
  queryClient.removeQueries({ queryKey: ["categories"] });
  queryClient.removeQueries({ queryKey: ["limits"] });
  queryClient.removeQueries({ queryKey: ["goals"] });
  queryClient.removeQueries({ queryKey: ["notifications"] });
  queryClient.removeQueries({ queryKey: ["transactions"] });
  queryClient.removeQueries({ queryKey: ["sessions"] });
}

interface AuthState {
  // Auth state
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
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
  /** PATCH /users/me/profile — província/município/data nasc./género/estado civil/dependentes/situação laboral/receita. */
  updateDemographics(payload: ProfileUpdateRequest): Promise<boolean>;
  /** Vai buscar o user real ao backend e substitui a store — usado após uma falha de guardar para nunca ficar com dados divergentes da BD. */
  resyncAfterFailedSave(): Promise<void>;
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
      errorCode: null,
      retryAfterSeconds: null,
      user: null,

      // Registration multi-step state
      currentStep: 1,
      data: {},

      initializeAuth: async () => {
        if (get().isLoading && get().isAuthenticated) return;
        set({ isLoading: true });
        try {
          const accessToken = await get().refreshToken();
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

      // Renova o accessToken usando o cookie HttpOnly de refresh (gerido pelo browser).
      // Deduplicado globalmente: chamadas concorrentes (initializeAuth + interceptor
      // do axios) partilham a mesma chamada em voo em vez de disparar /auth/refresh duas vezes.
      refreshToken: async () => {
        if (refreshPromise) return refreshPromise;
        refreshPromise = (async () => {
          try {
            const { accessToken } = await userService.refresh();
            set({ token: accessToken, isAuthenticated: true });
            return accessToken;
          } finally {
            refreshPromise = null;
          }
        })();
        return refreshPromise;
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
          // Um erro no cliente (timeout, rede) não significa que o backend não
          // tenha aplicado o PUT/PATCH — só que não confirmámos. Vai buscar o
          // estado real em vez de deixar a UI com dados divergentes da BD.
          await get().resyncAfterFailedSave();
          return false;
        }
      },

      updateDemographics: async (payload) => {
        const current = get().user;
        if (!current) return false;
        try {
          const updated = await userService.updateProfile(payload);
          set({ user: updated });
          useUiStore
            .getState()
            .showNotification("success", "Perfil actualizado", "Os seus dados foram guardados com sucesso.");
          return true;
        } catch (error: any) {
          useUiStore
            .getState()
            .showNotification("error", "Erro ao actualizar", getApiErrorMessage(error, "Não foi possível actualizar o perfil."));
          // Mesmo em erro de validação (400) o backend pode ter persistido
          // campos válidos do mesmo pedido antes de rejeitar — ressincroniza
          // sempre para a UI nunca ficar a mostrar dados diferentes da BD.
          await get().resyncAfterFailedSave();
          return false;
        }
      },

      resyncAfterFailedSave: async () => {
        const current = get().user;
        if (!current) return;
        try {
          const fresh = await userService.getUser();
          set({ user: fresh });
        } catch {
          // Sem rede também para o resync — nada a fazer, o próximo load resolve.
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
        set({ isLoading: true, error: null, errorCode: null, retryAfterSeconds: null });
        try {
          const response = await userService.login(email, password);
          clearUserStores();
          // accessToken guardado apenas em memória — nunca em localStorage
          set({ token: response.accessToken, isAuthenticated: true, isLoading: false, currentStep: 1, data: {} });
          await get().checkAuthStatus();
          clearPendingVerificationContext();

          return true;
        } catch (error: any) {
          const errorCode = error?.errorCode as string | undefined;
          let errMsg: string;

          if (errorCode === "TOO_MANY_ATTEMPTS") {
            errMsg = "Demasiadas tentativas. Aguarde antes de tentar novamente.";
            set({ error: errMsg, errorCode, isLoading: false, retryAfterSeconds: error?.retryAfterSeconds ?? 900 });
          } else if (errorCode === "ACCOUNT_DISABLED") {
            errMsg = "A sua conta foi desactivada. Contacte o suporte.";
            set({ error: errMsg, errorCode, isLoading: false });
          } else if (errorCode === "EMAIL_NOT_VERIFIED") {
            errMsg = "Por favor, verifique o seu email antes de entrar.";
            setPendingVerificationEmail(email);
            set({ error: errMsg, errorCode, isLoading: false });
          } else {
            const status = error?.status || error?.response?.status;
            errMsg = getApiErrorMessage(
              error,
              status === 500
                ? "Não foi possível acessar o sistema. Tente mais tarde!"
                : "Credenciais erradas"
            );
            set({ error: errMsg, errorCode: errorCode ?? null, isLoading: false });
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

      clearError: () => set({ error: null, errorCode: null, retryAfterSeconds: null }),

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
