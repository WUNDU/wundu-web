import { apiClient } from "@/api/api";
import type {
  ChatConversationSummary,
  ChatMessage,
  ChatMessageRequest,
  ChatMessageResponse,
} from "@/types/dtos/chat.dto";

export type SSEStartEvent  = { type: "start";  conversationId: string };
export type SSETokenEvent  = { type: "token";  content: string };
export type SSEDoneEvent   = { type: "done";   conversationId: string };
export type SSEErrorEvent  = { type: "error";  message: string };
export type SSEEvent = SSEStartEvent | SSETokenEvent | SSEDoneEvent | SSEErrorEvent;

async function* parseSSEStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  // Declared outside while loop so they persist across chunk boundaries
  let eventName = "";
  let eventData = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          eventData = line.slice(5).trim();
        } else if (line === "") {
          if (eventName && eventData) {
            try {
              yield { type: eventName, ...JSON.parse(eventData) } as SSEEvent;
            } catch {
              // malformed JSON — skip
            }
            eventName = "";
            eventData = "";
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

class ChatService {
  async sendMessage(payload: ChatMessageRequest): Promise<ChatMessageResponse> {
    const { data } = await apiClient.post<ChatMessageResponse>("/chat/send", payload);
    return data;
  }

  async *streamMessage(payload: ChatMessageRequest): AsyncGenerator<SSEEvent> {
    const { useUserStore } = await import("@/store/user-store");
    const token = useUserStore.getState().token;

    const response = await fetch("/api/proxy/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      let message = "Erro ao conectar ao assistente.";
      try {
        const err = await response.json();
        if (err?.message) message = err.message;
      } catch {}
      yield { type: "error", message } as SSEErrorEvent;
      return;
    }

    yield* parseSSEStream(response.body);
  }

  async getHistory(): Promise<ChatConversationSummary[]> {
    const { data } = await apiClient.get<ChatConversationSummary[]>("/chat/history");
    return data;
  }

  async getConversation(conversationId: string): Promise<ChatMessageResponse> {
    const { data } = await apiClient.get<ChatMessageResponse>(`/chat/${conversationId}/messages`);
    return data;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await apiClient.delete(`/chat/${conversationId}`);
  }
}

export const chatService = new ChatService();
