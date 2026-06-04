export interface UserLogin {
  email: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface UserRegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  planType?: "FREE" | "PREMIUM";
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  planType: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  planStart: string | null;
  planEnd: string | null;
  isTrial: boolean;
}

export type User = UserResponse;

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthToken {
  accessToken: string;
}
