import { apiClient } from "@/api/api";

class EmailVerificationService {
  async verifyEmail(token: string) {
    return await apiClient.get("/auth/verify-email", { params: { token } });
  }

  async resendVerification(email: string) {
    return await apiClient.post("/auth/resend-verification", { email });
  }

  async changeEmail(email: string) {
    return await apiClient.post("/users/me/email", { email });
  }
}

export const emailVerificationService = new EmailVerificationService();
