import { apiClient } from "@/api/api";
import type { RegisterData, User } from "@/types/dtos/auth.dto";
import type { UserRequest } from "@/types/dtos/user.dto";

interface LoginResponse {
  token: string;
}

class UserService {
  async register(data: RegisterData): Promise<User> {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phone?.replace(/\s+/g, ""),
      password: data.password,
      planType: "FREE",
    };
    const { data: response } = await apiClient.post<User>("/users", payload, { skipAuth: true });
    return response;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth",
      { email, password },
      { skipAuth: true },
    );
    return data;
  }

  async getUser(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/me");
    return data;
  }

  async getById(id: string): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  }

  async update(id: string, payload: Partial<UserRequest>): Promise<User> {
    const { data } = await apiClient.put<User>(`/users/${id}`, payload);
    return data;
  }
}

export const userService = new UserService();
