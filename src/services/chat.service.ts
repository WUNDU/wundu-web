import { apiClient } from "@/api/api";
import type {
  ChatConversationSummary,
  ChatMessageRequest,
  ChatMessageResponse,
} from "@/types/dtos/chat.dto";

class ChatService {
  async sendMessage(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    const { data } = await apiClient.post<ChatMessageResponse>("/chat/send", payload);
    return data;
  }

  async getHistory(): Promise<ChatConversationSummary[]> {
    const { data } = await apiClient.get<ChatConversationSummary[]>("/chat/history");
    return data;
  }

  async getConversation(conversationId: string): Promise<ChatMessageResponse> {
    const { data } = await apiClient.get<ChatMessageResponse>(`/chat/${conversationId}`);
    return data;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await apiClient.delete(`/chat/${conversationId}`);
  }
}

export const chatService = new ChatService();
