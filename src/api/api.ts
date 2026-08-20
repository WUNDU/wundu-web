import axios from "axios";

const API_BASE_URL = "/api/proxy";

export type ApiError = Error & {
  errorCode?: string;
  status?: number;
  retryAfterSeconds?: number;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Request interceptor - lê token em memória a partir do store (nunca do localStorage)
// Aguarda refresh inicial se estiver em curso, garantindo que /auth/refresh é a primeira requisição
function waitForAuthReady(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useUserStore } = require("@/store/user-store") as typeof import("@/store/user-store");
  const state = useUserStore.getState();
  if (!state.isLoading) return Promise.resolve();
  return new Promise((resolve) => {
    const unsub = useUserStore.subscribe((s) => {
      if (!s.isLoading) {
        unsub();
        resolve();
      }
    });
    setTimeout(() => {
      try { unsub(); } catch {}
      resolve();
    }, 10000);
  });
}

api.interceptors.request.use(async (config) => {
  const isRefresh = config.url?.includes("/auth/refresh");
  const isAuthFree = (config as any).skipAuth === true;
  if (typeof window !== "undefined" && !isRefresh && !isAuthFree) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useUserStore } = require("@/store/user-store") as typeof import("@/store/user-store");
    if (useUserStore.getState().isLoading) {
      await waitForAuthReady();
    }
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useUserStore } = require("@/store/user-store") as typeof import("@/store/user-store");
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Fila de pedidos que aguardam refresh silencioso
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

// Response interceptor - trata erros globais
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Pass through cancelled/aborted requests without processing them as errors
    if (axios.isCancel(error) || error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Tenta refresh silencioso antes de redirecionar para login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { useUserStore } = require("@/store/user-store") as typeof import("@/store/user-store");
        const newToken = await useUserStore.getState().refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== "undefined") {
          const publicPaths = [
            "/",
            "/about",
            "/features",
            "/contacts",
            "/legal",
            "/login",
            "/register",
            "/verify-pending",
            "/verify-email",
          ];
          const isPublicPath = publicPaths.some(
            (p) => window.location.pathname === p || window.location.pathname.startsWith(p + "/")
          );
          if (!isPublicPath) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { useUserStore } = require("@/store/user-store") as typeof import("@/store/user-store");
            useUserStore.getState().logout();
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Novo paradigma: não redirecionamos contas não verificadas. O erro
    // EMAIL_NOT_VERIFIED é apenas propagado para quem chamou; o aviso e a acção
    // de verificação vivem exclusivamente no perfil do utilizador.

    const fallbackMessage =
      "Não foi possível conectar ao serviço agora. Tente novamente em instantes.";
    const rawMessage =
      error.response?.data?.message || error.message || error.response?.statusText;
    const message =
      rawMessage && rawMessage !== "Internal Server Error"
        ? rawMessage
        : fallbackMessage;

    // Attach errorCode so callers can react to specific backend error codes
    const err = new Error(message) as ApiError;
    err.errorCode = error.response?.data?.errorCode;
    err.status = error.response?.status;
    err.retryAfterSeconds = error.response?.data?.retryAfterSeconds;

    return Promise.reject(err);
  }
);

type ApiConfig = {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  params?: Record<string, unknown>;
  withCredentials?: boolean;
};

// Wrapper para manter compatibilidade com código existente
class Api {
  get<T = any>(path: string, config?: ApiConfig) {
    return api.get<T>(path, config);
  }

  post<T = any>(path: string, body?: any, config?: ApiConfig) {
    return api.post<T>(path, body, config);
  }

  put<T = any>(path: string, body?: any, config?: ApiConfig) {
    return api.put<T>(path, body, config);
  }

  patch<T = any>(path: string, body?: any, config?: ApiConfig) {
    return api.patch<T>(path, body, config);
  }

  delete<T = any>(path: string, config?: ApiConfig) {
    return api.delete<T>(path, config);
  }
}

export const apiClient = new Api();
