import { apiClient } from "@/api/api";
import type {
  ChatConversationSummary,
  ChatMessageRequest,
  ChatMessageResponse,
} from "@/types/dtos/chat.dto";

class ChatService {
  // AI responses can take 30-60s — override timeout for this endpoint
  async sendMessage(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    const { data } = await apiClient.post<ChatMessageResponse>("/chat/send", payload);
    return data;
  }

  async getHistory(): Promise<ChatConversationSummary[]> {
    const { data } = await apiClient.get<ChatConversationSummary[]>("/chat/history");
    return data;
  }
}

export const chatService = new ChatService();
