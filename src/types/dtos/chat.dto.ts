// Java LocalDateTime can be serialized as array [year, month(1-based), day, hour, min, sec, nanos]
// or as ISO string, or null.
export type JavaDate = string | number[] | null;

export interface ChatMessageRequest {
  conversationId?: string;
  message: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface ChatMessageResponse {
  conversationId: string;
  messages: ChatMessage[];
}

export interface ChatConversationSummary {
  id: string;
  userId: string;
  createdAt: JavaDate;
  updatedAt: JavaDate;
}

export function parseJavaDate(d: JavaDate): Date | null {
  if (!d) return null;
  if (typeof d === "string") return new Date(d);
  if (Array.isArray(d) && d.length >= 3) {
    const [year, month, day, hour = 0, min = 0, sec = 0] = d;
    return new Date(year, month - 1, day, hour, min, sec);
  }
  return null;
}

export function formatConvoDate(d: JavaDate): string {
  const date = parseJavaDate(d);
  if (!date) return "—";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86_400_000);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const time = date.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" });
  if (dateOnly.getTime() === today.getTime()) return `Hoje, ${time}`;
  if (dateOnly.getTime() === yesterday.getTime()) return `Ontem, ${time}`;
  return date.toLocaleDateString("pt-AO", { day: "2-digit", month: "short" });
}
