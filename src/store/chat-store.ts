import { create } from "zustand";
import type { ChatConversationSummary, ChatMessage } from "@/types/dtos/chat.dto";
import { chatService } from "@/services/chat.service";

interface ChatStore {
  conversationId: string | null;
  lastConversationId: string | null;
  messages: ChatMessage[];
  history: ChatConversationSummary[];
  isLoading: boolean;
  isSending: boolean;
  isLoadingConversation: boolean;
  error: string | null;
  rateLimitSeconds: number | null;
  sendMessage(message: string): Promise<void>;
  fetchHistory(options?: { silent?: boolean }): Promise<void>;
  loadConversation(id: string): Promise<void>;
  deleteConversation(id: string): Promise<void>;
  setConversationId(id: string | null): void;
  clearConversation(): void;
  clearRateLimit(): void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversationId: null,
  lastConversationId: null,
  messages: [],
  history: [],
  isLoading: false,
  isSending: false,
  isLoadingConversation: false,
  error: null,
  rateLimitSeconds: null,

  sendMessage: async (message: string) => {
    const activeConversationId = get().conversationId ?? get().lastConversationId ?? undefined;
    const optimisticUserMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    const prevMessages = get().messages;
    set({ isSending: true, error: null, messages: [...prevMessages, optimisticUserMsg] });
    try {
      const response = await chatService.sendMessage({
        conversationId: activeConversationId,
        message,
      });
      set({
        conversationId: response.conversationId,
        lastConversationId: response.conversationId,
        messages: response.messages,
        isSending: false,
      });
      // Refresh history without sidebar loading flicker.
      get().fetchHistory({ silent: true });
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

  fetchHistory: async (options) => {
    const silent = options?.silent ?? false;
    if (!silent) set({ isLoading: true });
    try {
      const history = await chatService.getHistory();
      set({ history, ...(silent ? {} : { isLoading: false }) });
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao carregar histórico";
      set({ error: err, ...(silent ? {} : { isLoading: false }) });
    }
  },

  loadConversation: async (id: string) => {
    set({ isLoadingConversation: true, error: null, conversationId: id, lastConversationId: id });
    try {
      const response = await chatService.getConversation(id);
      const resolvedConversationId = response.conversationId ?? id;
      set({
        conversationId: resolvedConversationId,
        lastConversationId: resolvedConversationId,
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
        ...(current === id ? { conversationId: null, lastConversationId: null, messages: [] } : {}),
      }));
    } catch (error: any) {
      const err = error?.response?.data?.message || "Erro ao apagar conversa";
      import("@/hooks/use-notification").then(({ notify }) => notify.error(err));
    }
  },

  setConversationId: (id: string | null) =>
    set((s) => ({
      conversationId: id,
      lastConversationId: id ?? s.lastConversationId,
    })),

  clearConversation: () =>
    set({ conversationId: null, lastConversationId: null, messages: [], error: null }),

  clearRateLimit: () => set({ rateLimitSeconds: null }),
}));
