"use client";

import type { AIConversation } from "./wundu-ai";

type RawMessage = {
  id: unknown;
  role: unknown;
  text: unknown;
  created: unknown;
  engine?: unknown;
};

type RawConversation = {
  id: unknown;
  title: unknown;
  created: unknown;
  updated: unknown;
  messages: unknown;
};

function isMessage(m: RawMessage): m is AIConversation["messages"][number] {
  return (
    typeof m.id === "string" &&
    m.id.length <= 100 &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.text === "string" &&
    m.text.length <= 6000 &&
    typeof m.created === "number" &&
    Number.isFinite(m.created) &&
    (m.engine === undefined || m.engine === "local" || m.engine === "openai")
  );
}

function isConversation(c: RawConversation): c is AIConversation {
  return (
    typeof c.id === "string" &&
    c.id.length <= 100 &&
    typeof c.title === "string" &&
    c.title.length <= 100 &&
    typeof c.created === "number" &&
    Number.isFinite(c.created) &&
    typeof c.updated === "number" &&
    Number.isFinite(c.updated) &&
    Array.isArray(c.messages) &&
    c.messages.length <= 40 &&
    (c.messages as RawMessage[]).every(isMessage)
  );
}

export function parseAIHistory(raw: string | null): AIConversation[] {
  if (!raw || raw.length > 1_000_000) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as RawConversation[]).filter(isConversation).slice(0, 20);
  } catch {
    return [];
  }
}

export function serializeAIHistory(conversations: AIConversation[]) {
  const bounded = conversations
    .slice(0, 20)
    .map((c) => ({ ...c, messages: c.messages.slice(-40) }));
  const text = JSON.stringify(bounded);
  if (text.length > 1_000_000)
    throw Error("O histórico está cheio. Elimina uma conversa para continuar.");
  return text;
}

export function conversationGroup(updated: number, now: number) {
  const day = (t: number) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Luanda",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(t);
  if (day(updated) === day(now)) return "Hoje";
  if (day(updated) === day(now - 86_400_000)) return "Ontem";
  return now - updated < 7 * 86_400_000 ? "Últimos 7 dias" : "Mais antigas";
}

export function aiId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
