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
  isStreaming: boolean;
  streamingContent: string | null;
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
  isStreaming: false,
  streamingContent: null,
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

    let conversationId = activeConversationId ?? null;
    let accumulatedContent = "";

    try {
      const { useUserStore } = await import("@/store/user-store");
      const token = useUserStore.getState().token;

      const response = await fetch("/api/proxy/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, conversationId: activeConversationId }),
      });

      if (!response.ok || !response.body) {
        let errMsg = "Erro ao conectar ao assistente.";
        try { const e = await response.json(); if (e?.message) errMsg = e.message; } catch {}
        if (response.status === 429) {
          set({ messages: prevMessages, error: null, isSending: false, rateLimitSeconds: 60 });
        } else {
          set({ messages: prevMessages, error: errMsg, isSending: false });
          import("@/hooks/use-notification").then(({ notify }) => notify.error(errMsg));
        }
        return;
      }

      // ── Direct reader loop (no async generators) ───────────────────────────
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventName = "";
      let eventData = "";

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
            if (!eventName || !eventData) { eventName = ""; eventData = ""; continue; }
            let parsed: Record<string, unknown>;
            try { parsed = JSON.parse(eventData); } catch { eventName = ""; eventData = ""; continue; }
            eventName = ""; eventData = "";

            const type = parsed.type as string;

            if (type === "start") {
              const cid = parsed.conversationId as string;
              conversationId = cid;
              set({ conversationId: cid, lastConversationId: cid });

            } else if (type === "token") {
              const chunk = (parsed.content as string) ?? "";
              accumulatedContent += chunk;
              if (get().isSending) {
                set({ isSending: false, isStreaming: true, streamingContent: accumulatedContent });
              } else {
                set({ streamingContent: accumulatedContent });
              }

            } else if (type === "done") {
              const finalMsg: ChatMessage = {
                role: "assistant",
                content: accumulatedContent,
                timestamp: new Date().toISOString(),
              };
              set((s) => ({
                messages: [...s.messages, finalMsg],
                streamingContent: null,
                isStreaming: false,
                isSending: false,
              }));
              get().fetchHistory({ silent: true });

            } else if (type === "error") {
              const msg = (parsed.message as string) || "Erro do assistente.";
              const isRateLimit = msg.toLowerCase().includes("limite");
              if (isRateLimit) {
                set({ messages: prevMessages, error: null, isSending: false, isStreaming: false, streamingContent: null, rateLimitSeconds: 60 });
              } else {
                set({ messages: prevMessages, error: msg, isSending: false, isStreaming: false, streamingContent: null });
                import("@/hooks/use-notification").then(({ notify }) => notify.error(msg));
              }
              reader.cancel();
              return;
            }
          }
        }
      }

      // Stream closed without done event — finalise if we have content
      if (accumulatedContent && (get().isStreaming || get().isSending)) {
        const finalMsg: ChatMessage = {
          role: "assistant",
          content: accumulatedContent,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          messages: [...s.messages, finalMsg],
          streamingContent: null,
          isStreaming: false,
          isSending: false,
        }));
        get().fetchHistory({ silent: true });
      } else if (get().isSending) {
        set({ messages: prevMessages, isSending: false });
      }

    } catch (error: any) {
      set({ messages: prevMessages, error: error?.message ?? "Erro ao enviar mensagem", isSending: false, isStreaming: false, streamingContent: null });
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
    set({ conversationId: null, lastConversationId: null, messages: [], error: null, streamingContent: null, isStreaming: false }),

  clearRateLimit: () => set({ rateLimitSeconds: null }),
}));
