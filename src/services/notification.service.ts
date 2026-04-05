import { apiClient } from "@/api/api";
import type { NotificationResponse } from "@/types/dtos/notification.dto";

class NotificationService {
  async getAll(): Promise<NotificationResponse[]> {
    const { data } = await apiClient.get<NotificationResponse[]>("/notifications");
    return data;
  }

  async getUnread(): Promise<NotificationResponse[]> {
    const { data } = await apiClient.get<NotificationResponse[]>("/notifications/unread");
    return data;
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const { data } = await apiClient.get<{ unreadCount: number }>("/notifications/unread-count");
    return data;
  }

  async markAsRead(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>(`/notifications/${id}/read`, null);
    return data;
  }
}

export const notificationService = new NotificationService();
