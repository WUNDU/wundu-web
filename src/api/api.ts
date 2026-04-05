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
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const hadToken = !!localStorage.getItem("token");
        localStorage.removeItem("token");
        // Only redirect on session expiry (had a token). Login attempts (no token)
        // return 401 for wrong credentials — let the error propagate to the caller.
        if (hadToken) {
          window.location.href = "/login";
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

    return Promise.reject(new Error(message));
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
