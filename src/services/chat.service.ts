import { apiClient } from "@/api/api";
import type {
  ChatConversationSummary,
  ChatMessage,
  ChatMessageResponse,
} from "@/types/dtos/chat.dto";

class ChatService {
  async sendMessage(conversationId: string, messages: ChatMessage[]): Promise<ChatMessageResponse> {
    const { data } = await apiClient.post<ChatMessageResponse>(
      `/chat/${conversationId}/messages`,
      { conversationId, messages },
    );
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
