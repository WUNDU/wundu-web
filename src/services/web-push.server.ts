/**
 * Server-side Web Push service.
 * Runs only in Node.js (Next.js API routes / Server Components).
 */
import "server-only";
import webPush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:wundu@wundu.ao";

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// In-memory subscription store.
// Production: replace with Redis/DB — the interface stays the same.
export interface PushSubscriptionRecord {
  userId: string;
  subscription: webPush.PushSubscription;
  subscribedAt: number;
  lastActivityAt: number;
}

const subscriptions = new Map<string, PushSubscriptionRecord>();

export function saveSubscription(userId: string, sub: webPush.PushSubscription): void {
  subscriptions.set(userId, {
    userId,
    subscription: sub,
    subscribedAt: Date.now(),
    lastActivityAt: Date.now(),
  });
}

export function removeSubscription(userId: string): void {
  subscriptions.delete(userId);
}

export function touchActivity(userId: string): void {
  const rec = subscriptions.get(userId);
  if (rec) rec.lastActivityAt = Date.now();
}

export function getAllSubscriptions(): PushSubscriptionRecord[] {
  return [...subscriptions.values()];
}

const INACTIVITY_LIMIT_MS = 4 * 24 * 60 * 60 * 1000; // 4 days

export async function sendPushToAll(
  payload: { title: string; body: string; url?: string }
): Promise<void> {
  const now = Date.now();
  const toRemove: string[] = [];

  for (const rec of subscriptions.values()) {
    if (now - rec.lastActivityAt > INACTIVITY_LIMIT_MS) {
      toRemove.push(rec.userId);
      continue;
    }
    try {
      await webPush.sendNotification(
        rec.subscription,
        JSON.stringify({ title: payload.title, body: payload.body, url: payload.url || "/home" })
      );
    } catch {
      // Expired / invalid subscription — remove it
      toRemove.push(rec.userId);
    }
  }

  toRemove.forEach((id) => subscriptions.delete(id));
}

// ── Message pools ─────────────────────────────────────────────────────────────

export const WEEKLY_SUMMARY_MESSAGES = [
  { title: "📊 O teu resumo semanal está pronto!", body: "Vê como foram as tuas finanças esta semana no Wundu." },
  { title: "💡 Resumo da semana — Wundu", body: "Tens transacções esta semana. Vê a análise completa agora!" },
  { title: "📋 Como foi a semana financeiramente?", body: "O teu relatório semanal está disponível no Wundu." },
];

export const MONTHLY_SUMMARY_MESSAGES = [
  { title: "📅 Resumo mensal disponível!", body: "Vê onde gastaste mais este mês e como podes poupar." },
  { title: "💰 Fim do mês — relatório Wundu", body: "O teu resumo financeiro mensal está pronto para consultar." },
  { title: "📊 Como foi o mês?", body: "Analisa as tuas finanças do mês no Wundu." },
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
