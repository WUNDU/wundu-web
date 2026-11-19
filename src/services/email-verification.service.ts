import { apiClient } from "@/api/api";

export interface EmailVerificationStatus {
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  verificationDeadline?: string;
  secondsUntilDeadline?: number;
  deadlineExpired?: boolean;
}

class EmailVerificationService {
  async verifyEmail(token: string) {
    return await apiClient.get("/auth/verify-email", { params: { token } });
  }

  async getEmailVerificationStatus(): Promise<EmailVerificationStatus> {
    const { data } = await apiClient.get<EmailVerificationStatus>(
      "/auth/email-verification-status"
    );
    return data;
  }

  async resendVerification(email: string) {
    return await apiClient.post("/auth/verify-email/resend", { email });
  }

  async changeEmail(email: string) {
    return await apiClient.post("/users/me/email", { email });
  }
}

export const emailVerificationService = new EmailVerificationService();
