import { create } from "zustand";
import type { ChatConversationSummary, ChatMessage } from "@/types/dtos/chat.dto";
import { chatService } from "@/services/chat.service";

interface ChatStore {
  conversationId: string | null;
  messages: ChatMessage[];
  history: ChatConversationSummary[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage(message: string): Promise<void>;
  fetchHistory(): Promise<void>;
  setConversationId(id: string | null): void;
  clearConversation(): void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversationId: null,
  messages: [],
  history: [],
  isLoading: false,
  isSending: false,
  error: null,

  sendMessage: async (message: string) => {
    const optimisticUserMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    const prevMessages = get().messages;
    set({ isSending: true, error: null, messages: [...prevMessages, optimisticUserMsg] });
    try {
      const response = await chatService.sendMessage({
        conversationId: get().conversationId ?? undefined,
        message,
      });
      set({
        conversationId: response.conversationId,
        messages: response.messages,
        isSending: false,
      });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao enviar mensagem";
      set({ messages: prevMessages, error: err, isSending: false });
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const history = await chatService.getHistory();
      set({ history, isLoading: false });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao carregar histórico";
      set({ error: err, isLoading: false });
    }
  },

  setConversationId: (id: string | null) => set({ conversationId: id }),

  clearConversation: () => set({ conversationId: null, messages: [], error: null }),
}));
