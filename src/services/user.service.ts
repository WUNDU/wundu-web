import { api, apiClient } from "@/api/api";
import type { RegisterData, User } from "@/types/dtos/auth.dto";
import type { UserRequest } from "@/types/dtos/user.dto";

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface SessionInfo {
  id: string;
  userAgent: string;
  ipAddress: string;
  issuedAt: string;
  expiresAt: string;
}

export interface EmailVerificationStatus {
  emailVerified: boolean;
  email: string;
  isActive: boolean;
}

class UserService {
  async register(data: RegisterData): Promise<User> {
    const payload = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phone?.replace(/\s+/g, ""),
      password: data.password,
    };
    const { data: response } = await apiClient.post<User>("/users", payload, { skipAuth: true });
    return response;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth",
      { email, password },
      { skipAuth: true, withCredentials: true },
    );
    return data;
  }

  async refresh(): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>("/auth/refresh", undefined, {
      withCredentials: true,
    });
    return data;
  }

  async logoutApi(): Promise<void> {
    await api.post("/auth/logout", undefined, { withCredentials: true });
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
  async logoutAll(): Promise<void> {
    await apiClient.post("/auth/logout-all", undefined, { withCredentials: true });
  }

  async getSessions(): Promise<SessionInfo[]> {
    const { data } = await apiClient.get<SessionInfo[]>("/auth/sessions");
    return data;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  }

  async getEmailVerificationStatus(): Promise<EmailVerificationStatus> {
    const { data } = await apiClient.get<EmailVerificationStatus>("/auth/email-verification-status");
    return data;
  }
}

export const userService = new UserService();
