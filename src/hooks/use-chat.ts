import { useChatStore } from "@/store/chat-store";

export function useChat() {
  const conversationId = useChatStore((s) => s.conversationId);
  const messages = useChatStore((s) => s.messages);
  const history = useChatStore((s) => s.history);
  const isLoading = useChatStore((s) => s.isLoading);
  const isSending = useChatStore((s) => s.isSending);
  const error = useChatStore((s) => s.error);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const fetchHistory = useChatStore((s) => s.fetchHistory);
  const setConversationId = useChatStore((s) => s.setConversationId);
  const clearConversation = useChatStore((s) => s.clearConversation);

  return {
    conversationId,
    messages,
    history,
    isLoading,
    isSending,
    error,
    sendMessage,
    fetchHistory,
    setConversationId,
    clearConversation,
  };
}
