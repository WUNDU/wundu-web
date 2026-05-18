/**
 * Cron endpoint — call externally every hour (e.g. Vercel Cron, cron-job.org).
 * Sends weekly summary push on Saturdays at 20h.
 * Sends monthly summary push on the last day of each month at 20h.
 *
 * Secure this with a CRON_SECRET env var in production.
 */
import {
  MONTHLY_SUMMARY_MESSAGES,
  WEEKLY_SUMMARY_MESSAGES,
  pickRandom,
  sendPushToAll,
} from "@/services/web-push.server";
import { NextRequest, NextResponse } from "next/server";

function isLastDayOfMonth(date: Date): boolean {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getDate() === 1;
}

export async function GET(req: NextRequest) {
  // Optional CRON_SECRET guard
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=Sun, 6=Sat

  let sent = false;

  // Saturday 20h — weekly summary
  if (day === 6 && hour === 20) {
    const msg = pickRandom(WEEKLY_SUMMARY_MESSAGES);
    await sendPushToAll({ ...msg, url: "/home?summary=week" });
    sent = true;
  }

  // Last day of month 20h — monthly summary
  if (isLastDayOfMonth(now) && hour === 20) {
    const msg = pickRandom(MONTHLY_SUMMARY_MESSAGES);
    await sendPushToAll({ ...msg, url: "/home?summary=month" });
    sent = true;
  }

  return NextResponse.json({
    ok: true,
    sent,
    time: now.toISOString(),
    day,
    hour,
  });
}
