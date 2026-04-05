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

type LocalMessage = { text: string; isUser: boolean };

const INITIAL_MESSAGES: LocalMessage[] = [
  { text: "Olá! Sou a Wundu AI.\nEm que posso ajudar hoje?", isUser: false },
];

const CHAT_OPTIONS = [
  { label: "Investimentos", bg: "bg-[#003cc3]/5", text: "text-[#003cc3]", icon: <MoneyBagIcon /> },
  { label: "Finanças", bg: "bg-[#ffd400]/15", text: "text-amber-700", icon: <CoinIcon /> },
  { label: "Poupanças", bg: "bg-emerald-50", text: "text-emerald-700", icon: <MoneyManagerIcon /> },
  { label: "Gestão", bg: "bg-violet-50", text: "text-violet-700", icon: <MoneyPotIcon /> },
  { label: "Dinheiro", bg: "bg-rose-50", text: "text-rose-600", icon: <MoneySignIcon /> },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TYPING_SPEED_MS = 14;

// ─── Typing animation component ──────────────────────────────────────────────
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [charCount, setCharCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setCharCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setCharCount(i);
      if (i >= text.length) {
        clearInterval(timer);
        onCompleteRef.current?.();
      }
    }, TYPING_SPEED_MS);
    return () => clearInterval(timer);
  }, [text]);

  const done = charCount >= text.length;
  return (
    <>
      {text.slice(0, charCount)}
      {!done && (
        <span className="inline-block w-[2px] h-[14px] bg-slate-400 ml-0.5 align-middle animate-pulse" />
      )}
    </>
  );
}

const Chat: React.FC = () => {
  const { messages: apiMessages, isSending, sendMessage, fetchHistory } = useChat();
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [typingIdx, setTypingIdx] = useState<number | null>(null);
  const prevCountRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Detect new AI message and trigger typing
  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = apiMessages.length;
    if (apiMessages.length > prev) {
      const last = apiMessages[apiMessages.length - 1];
      if (last.role !== "user") {
        setTypingIdx(apiMessages.length - 1);
      }
    }
  }, [apiMessages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayMessages: LocalMessage[] = [
    ...INITIAL_MESSAGES,
    ...apiMessages.map((m) => ({ text: m.content, isUser: m.role === "user" })),
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages.length, isSending]);

  const handleSend = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    sendMessage(msg);
    setInput("");
    setShowWelcome(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTypingComplete = useCallback(() => setTypingIdx(null), []);

  return (
    <div className="flex flex-col h-full overflow-hidden gap-3">

      {/* ── Header card ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66] flex items-center justify-center shadow-sm">
            <IAIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#1e293b]">Wundu AI</h1>
            <p className="text-xs text-slate-400">Assistente financeiro</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Online</span>
        </div>
      </div>

      {/* ── Messages area ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col px-1 py-2">
          <AnimatePresence initial={false}>
            {displayMessages.map((msg, i) => {
              const apiIdx = i - INITIAL_MESSAGES.length;
              const isTyping = !msg.isUser && typingIdx === apiIdx;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                >
                  <Message
                    isUser={msg.isUser}
                    text={
                      isTyping ? (
                        <TypingText text={msg.text} onComplete={handleTypingComplete} />
                      ) : (
                        msg.text
                      )
                    }
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 ml-[42px] my-2"
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

          {/* Welcome topic cards */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="mt-3 ml-[42px]"
              >
                <p className="text-xs text-slate-400 font-medium mb-3">
                  Escolha um tema ou escreva a sua pergunta:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHAT_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.label}
                      onClick={() => handleSend(opt.label)}
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
      </div>

      {/* ── Input card ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white rounded-[20px] shadow-[0_4px_16px_rgba(0,60,195,0.08)] px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva a sua pergunta…"
            rows={1}
            disabled={isSending}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#003cc3]/40 focus:bg-white resize-none max-h-32 leading-relaxed transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <motion.button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
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
