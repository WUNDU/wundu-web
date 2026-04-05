import { apiClient } from "@/api/api";
import type { VerifyOtpRequest, ResetPasswordRequest } from "@/types/dtos/auth.dto";

class PasswordRecoveryService {
  async requestPasswordRecoveryByEmail(email: string) {
    return await apiClient.post("/notification/otp/send", {
      email,
    });
  }

  async verifyOtp(data: VerifyOtpRequest) {
    console.log("PayLoad", data);
    return await apiClient.post("/notification/otp/verify", data);
  }

  async resetPassword(data: ResetPasswordRequest) {
    return await apiClient.post("/notification/otp/reset-password", data);
  }
}

export const passwordRecoveryService = new PasswordRecoveryService();
