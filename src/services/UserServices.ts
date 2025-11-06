import api from "@/src/lib/api";
import { RegisterData } from "@/src/types/register";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/api";

export const UserService = {
  register: async (data: RegisterData) => {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phone,
      password: data.password,
      planType: "FREE",
    };
    try {
      console.log("Payload enviado:", payload);
      const response = await api.post("/users", payload);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to register user";
      console.log("Erro no UserService.register:", message);
      throw new Error(message);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth", { email, password });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to login";
      console.log("Erro no UserService.login:", message);
      throw new Error(message);
    }
  },

  getUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await api.get("/users/me", config);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to get user";
      console.log("Error no UserService.getUser:", message);
      throw new Error(message);
    }
  },
};
