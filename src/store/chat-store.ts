import { create } from "zustand";
import type { ChatConversationSummary, ChatMessage } from "@/types/dtos/chat.dto";
import { chatService } from "@/services/chat.service";

interface ChatStore {
  conversationId: string | null;
  messages: ChatMessage[];
  history: ChatConversationSummary[];
  isLoading: boolean;
  isSending: boolean;
  isLoadingConversation: boolean;
  error: string | null;
  rateLimitSeconds: number | null;
  sendMessage(message: string): Promise<void>;
  fetchHistory(): Promise<void>;
  loadConversation(id: string): Promise<void>;
  deleteConversation(id: string): Promise<void>;
  setConversationId(id: string | null): void;
  clearConversation(): void;
  clearRateLimit(): void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversationId: null,
  messages: [],
  history: [],
  isLoading: false,
  isSending: false,
  isLoadingConversation: false,
  error: null,
  rateLimitSeconds: null,

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
      // Refresh history so the new/updated conversation appears
      get().fetchHistory();
    } catch (error: any) {
      if (error?.response?.status === 429) {
        const retryAfter = error?.response?.data?.retryAfterSeconds ?? 60;
        set({ messages: prevMessages, error: null, isSending: false, rateLimitSeconds: retryAfter });
      } else {
        const err = error?.response?.data?.message || "Erro ao enviar mensagem";
        set({ messages: prevMessages, error: err, isSending: false });
        import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
      }
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

  loadConversation: async (id: string) => {
    set({ isLoadingConversation: true, error: null, conversationId: id });
    try {
      const response = await chatService.getConversation(id);
      set({
        conversationId: response.conversationId ?? id,
        messages: response.messages,
        isLoadingConversation: false,
      });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao carregar conversa";
      set({ error: err, isLoadingConversation: false });
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  deleteConversation: async (id: string) => {
    try {
      await chatService.deleteConversation(id);
      const current = get().conversationId;
      set((s) => ({
        history: s.history.filter((h) => h.id !== id),
        ...(current === id ? { conversationId: null, messages: [] } : {}),
      }));
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao apagar conversa";
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  setConversationId: (id: string | null) => set({ conversationId: id }),

  clearConversation: () => set({ conversationId: null, messages: [], error: null }),

  clearRateLimit: () => set({ rateLimitSeconds: null }),
}));
