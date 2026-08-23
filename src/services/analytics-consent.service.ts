import { apiClient } from "@/api/api";
import type { User } from "@/types/dtos/auth.dto";

class AnalyticsConsentService {
  async updateConsent(granted: boolean): Promise<User> {
    const { data } = await apiClient.patch<User>("/users/me/consent/analytics", { granted });
    return data;
  }
}

export const analyticsConsentService = new AnalyticsConsentService();
