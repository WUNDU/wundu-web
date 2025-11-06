import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiErrorResponse } from "@/src/types/api";

const api: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {} as any;
    }
    // Não adicionar token para endpoints públicos
    const publicEndpoints = ["/users", "/auth/login"];
    if (!publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const token = localStorage.getItem("token") || ""; // Remova 'Bearer <your-token-here>' para evitar token estático
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.log("Request error:", error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message || error.message || "API error";
    console.log("Response error:", error);
    if (error.response?.status === 401) {
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
