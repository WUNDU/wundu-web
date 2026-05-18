"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IAIcon,
  CoinIcon,
  MoneyBagIcon,
  MoneyManagerIcon,
  MoneyPotIcon,
  MoneySignIcon,
  SendIcon,
} from "@/constants/icons";
import { Message } from "@/components/ui";
import { useChat } from "@/hooks/use-chat";
import { Loader2, Plus } from "lucide-react";
import posthog from "posthog-js";

type LocalMessage = { text: string; isUser: boolean };

const INITIAL_MESSAGES: LocalMessage[] = [
  { text: "Olá! Sou a Wundu AI.\nEm que posso ajudar hoje?", isUser: false },
];

const CHAT_OPTIONS = [
  { label: "Investimentos", message: "Como posso começar a investir o meu dinheiro de forma segura?", bg: "bg-[#003cc3]/5", text: "text-[#003cc3]", icon: <MoneyBagIcon /> },
  { label: "Finanças", message: "Como posso melhorar a gestão das minhas finanças pessoais?", bg: "bg-[#ffd400]/15", text: "text-amber-700", icon: <CoinIcon /> },
  { label: "Poupanças", message: "Quais as melhores estratégias de poupança para o meu perfil?", bg: "bg-emerald-50", text: "text-emerald-700", icon: <MoneyManagerIcon /> },
  { label: "Gestão", message: "Como posso organizar melhor o meu orçamento mensal?", bg: "bg-violet-50", text: "text-violet-700", icon: <MoneyPotIcon /> },
  { label: "Dinheiro", message: "Dá-me dicas práticas para controlar melhor o meu dinheiro.", bg: "bg-rose-50", text: "text-rose-600", icon: <MoneySignIcon /> },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const Chat: React.FC = () => {
  const {
    messages: apiMessages,
    isSending,
    isLoadingConversation,
    error,
    rateLimitSeconds,
    sendMessage,
    clearConversation,
    clearRateLimit,
    fetchHistory,
  } = useChat();

  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(() => apiMessages.length === 0);
  const [typingIdx, setTypingIdx] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const prevCountRef = useRef(apiMessages.length);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isNearBottomRef = useRef(true);
  // Track if the next message batch comes from history load (not a live AI response)
  const wasLoadingConversationRef = useRef(false);

  // Rate-limit countdown: tick every second
  useEffect(() => {
    if (rateLimitSeconds != null) {
      setCountdown(rateLimitSeconds);
    }
  }, [rateLimitSeconds]);

  useEffect(() => {
    if (countdown == null || countdown <= 0) {
      if (countdown === 0) clearRateLimit();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c != null ? c - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [countdown, clearRateLimit]);

  // Fetch history on mount (defense in depth for mobile where sidebar may not run effects)
  useEffect(() => {
    fetchHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Textarea auto-grow: JS fallback for Safari/Firefox (fieldSizing:content not supported)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input]);

  useEffect(() => {
    if (isLoadingConversation) wasLoadingConversationRef.current = true;
  }, [isLoadingConversation]);

  // Reset wasLoadingConversationRef if loading ended but messages didn't change (error case)
  useEffect(() => {
    if (!isLoadingConversation && wasLoadingConversationRef.current) {
      const t = setTimeout(() => { wasLoadingConversationRef.current = false; }, 50);
      return () => clearTimeout(t);
    }
  }, [isLoadingConversation]);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = apiMessages.length;
    if (apiMessages.length > prev) {
      // Skip typing animation if messages came from loading a past conversation
      if (wasLoadingConversationRef.current) {
        wasLoadingConversationRef.current = false;
        return;
      }
      const last = apiMessages[apiMessages.length - 1];
      if (last.role !== "user") setTypingIdx(apiMessages.length - 1);
    }
  }, [apiMessages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Welcome bubble only on new/empty conversations — never on loaded history
  const isNewConversation = apiMessages.length === 0;
  const displayMessages: LocalMessage[] = [
    ...(isNewConversation ? INITIAL_MESSAGES : []),
    ...apiMessages.map((m) => ({ text: m.content, isUser: m.role === "user" })),
  ];

  // Track if user is near bottom to decide whether to autoscroll
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  // Smart autoscroll: only when user is near bottom (don't interrupt manual reading)
  useEffect(() => {
    if (isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages.length, isSending]);

  // On history load complete: instant jump to bottom regardless of scroll position
  useEffect(() => {
    if (!isLoadingConversation && apiMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [isLoadingConversation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync welcome state: hide during load, show only when truly no messages
  useEffect(() => {
    if (isLoadingConversation) { setShowWelcome(false); return; }
    setShowWelcome(apiMessages.length === 0);
  }, [apiMessages.length, isLoadingConversation]);

  const handleSend = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || countdown != null && countdown > 0) return;
    if (text !== undefined) posthog.capture("ai_topic_selected", { topic: text });
    else posthog.capture("ai_message_sent", { message_length: msg.length });
    sendMessage(msg);
    setInput("");
    setShowWelcome(false);
    isNearBottomRef.current = true;
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTypingComplete = useCallback(() => setTypingIdx(null), []);

  const handleNewConversation = () => {
    clearConversation();
    setShowWelcome(true);
    prevCountRef.current = 0;
    isNearBottomRef.current = true;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] px-5 py-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm">
            <IAIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#1e293b]">Wundu AI</h1>
            <p className="text-xs text-slate-400">Assistente financeiro</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova conversa
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0"
      >
        {isLoadingConversation ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#003cc3]/40" />
            <p className="text-xs text-slate-400">A carregar conversa…</p>
          </div>
        ) : (
          <div className="flex flex-col px-4 py-4">

            {/* Inline error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {displayMessages.map((msg, i) => {
                const isInitMsg = isNewConversation && i < INITIAL_MESSAGES.length;
                const apiIdx = isInitMsg ? -1 : i - (isNewConversation ? INITIAL_MESSAGES.length : 0);
                const key = isInitMsg
                  ? `init-${i}`
                  : `api-${apiIdx}-${apiMessages[apiIdx]?.timestamp ?? i}`;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                  >
                    <Message
                      isUser={msg.isUser}
                      text={msg.text}
                      isTyping={!msg.isUser && !isInitMsg && typingIdx === apiIdx}
                      onTypingComplete={handleTypingComplete}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isSending && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 sm:ml-[42px] my-2"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">A pensar…</span>
              </motion.div>
            )}

            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="mt-3 sm:ml-[42px]"
                >
                  <p className="text-xs text-slate-400 font-medium mb-3">
                    Escolha um tema ou escreva a sua pergunta:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CHAT_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.label}
                        onClick={() => handleSend(opt.message)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2.5 px-3 py-3 bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,60,195,0.06)] border border-slate-100 text-left hover:border-[#003cc3]/20 hover:shadow-[0_4px_12px_rgba(0,60,195,0.1)] transition-all duration-200"
                      >
                        <div className={`w-8 h-8 rounded-[10px] ${opt.bg} flex items-center justify-center flex-shrink-0`}>
                          <span className={`w-4 h-4 ${opt.text}`}>{opt.icon}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] px-4 py-3 mt-3">
        <AnimatePresence>
          {countdown != null && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mb-2 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              Limite de mensagens atingido. Podes enviar em <span className="font-bold">{countdown}s</span>.
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={countdown != null && countdown > 0 ? `Aguarda ${countdown}s…` : "Escreva a sua pergunta…"}
            rows={1}
            disabled={isSending || isLoadingConversation || (countdown != null && countdown > 0)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#003cc3]/40 focus:bg-white resize-none overflow-y-auto leading-relaxed transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending || isLoadingConversation || (countdown != null && countdown > 0)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center bg-gradient-to-br from-[#003cc3] to-[#001a66] text-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            <SendIcon className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2.5">
          Wundu AI pode cometer erros — verifique informações importantes.
        </p>
      </div>
    </div>
  );
};

export default Chat;
