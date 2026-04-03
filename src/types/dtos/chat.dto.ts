export interface ChatMessageRequest {
  conversationId?: string;
  message: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface ChatMessageResponse {
  conversationId: string;
  messages: ChatMessage[];
}

export interface ChatConversationSummary {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
