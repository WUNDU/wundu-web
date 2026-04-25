import axios from "axios";

const API_BASE_URL = "/api/proxy";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// Request interceptor - adiciona token de autenticação
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - trata erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pass through cancelled/aborted requests without processing them as errors
    if (axios.isCancel(error) || error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const hadToken = !!localStorage.getItem("token");
        localStorage.removeItem("token");
        // Only redirect on session expiry (had a token). Login attempts (no token)
        // return 401 for wrong credentials — let the error propagate to the caller.
        // Never redirect away from public pages (landing, about, legal, etc.).
        if (hadToken) {
          const publicPaths = ["/", "/about", "/features", "/contacts", "/legal"];
          const isPublicPath = publicPaths.some(
            (p) => window.location.pathname === p || window.location.pathname.startsWith(p + "/")
          );
          if (!isPublicPath) {
            window.location.href = "/login";
          }
        }
      }
    }

    // Redirect to email verification pending page when backend blocks unverified users
    if (error.response?.data?.errorCode === "EMAIL_NOT_VERIFIED") {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/verify-pending" && currentPath !== "/verify-email") {
          window.location.href = "/verify-pending";
        }
      }
    }

    const fallbackMessage =
      "Não foi possível conectar ao serviço agora. Tente novamente em instantes.";
    const rawMessage =
      error.response?.data?.message || error.message || error.response?.statusText;
    const message =
      rawMessage && rawMessage !== "Internal Server Error"
        ? rawMessage
        : fallbackMessage;

    // Attach errorCode so callers can react to specific backend error codes
    const err = new Error(message) as Error & { errorCode?: string };
    err.errorCode = error.response?.data?.errorCode;

    return Promise.reject(err);
  }
);

type ApiConfig = {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  params?: Record<string, unknown>;
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
