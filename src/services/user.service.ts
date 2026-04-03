import { api } from "@/api/api";
import { AxiosError } from "axios";
import type { RegisterData } from "@/types/dtos/auth.dto";
import type { ApiErrorResponse } from "@/types/dtos/common.dto";

export const UserService = {
  register: async (data: RegisterData) => {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phone?.replace(/\s+/g, ""),
      password: data.password,
      planType: "FREE",
    };
    try {
      const response = await api.post("/users", payload, { skipAuth: true });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to register user",
      );
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post(
        "/auth",
        { email, password },
        { skipAuth: true },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to login",
      );
    }
  },

  getUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");
    try {
      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to get user",
      );
    }
  },
};
