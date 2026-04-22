import { useChatStore } from "@/store/chat-store";

export function useChat() {
  const conversationId = useChatStore((s) => s.conversationId);
  const messages = useChatStore((s) => s.messages);
  const history = useChatStore((s) => s.history);
  const isLoading = useChatStore((s) => s.isLoading);
  const isSending = useChatStore((s) => s.isSending);
  const isLoadingConversation = useChatStore((s) => s.isLoadingConversation);
  const error = useChatStore((s) => s.error);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const fetchHistory = useChatStore((s) => s.fetchHistory);
  const loadConversation = useChatStore((s) => s.loadConversation);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const setConversationId = useChatStore((s) => s.setConversationId);
  const clearConversation = useChatStore((s) => s.clearConversation);

  return {
    conversationId,
    messages,
    history,
    isLoading,
    isSending,
    isLoadingConversation,
    error,
    sendMessage,
    fetchHistory,
    loadConversation,
    deleteConversation,
    setConversationId,
    clearConversation,
  };
}
