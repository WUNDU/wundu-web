"use client";

import { WeeklyReportModal } from "@/components/weekly-report-modal";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUserStore } from "@/store/user-store";
import { useTransactionStore } from "@/store/transaction-store";
import EmailVerificationBanner from "@/components/email-verification-banner";
import { useNotificationWs } from "@/hooks/use-notification-ws";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";

// ── Summary logic ─────────────────────────────────────────────────────────────

const WEEKLY_KEY = "@wundu:weeklyReportShown";
const MONTHLY_KEY = "@wundu:monthlyReportShown";

function isoWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const w = new Date(d.getFullYear(), 0, 4);
  return `${d.getFullYear()}-W${String(1 + Math.round(((d.getTime() - w.getTime()) / 86400000 - 3 + ((w.getDay() + 6) % 7)) / 7)).padStart(2, "0")}`;
}

function isoMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

type SummaryPeriod = "week" | "month" | null;

function checkSummaryDue(): SummaryPeriod {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();

  // Weekly: Saturday 20h+ and not yet seen this week
  if ((day === 6 && hour >= 20) || (day === 0 && hour < 20)) {
    const weekKey = isoWeek(now);
    if (localStorage.getItem(WEEKLY_KEY) !== weekKey) return "week";
  }

  // Monthly: last day of month 20h+ or after, not yet seen this month
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isLastDay = tomorrow.getDate() === 1;
  if (isLastDay && hour >= 20) {
    const monthKey = isoMonth(now);
    if (localStorage.getItem(MONTHLY_KEY) !== monthKey) return "month";
  }

  return null;
}

function markSummaryShown(period: SummaryPeriod) {
  const now = new Date();
  if (period === "week") localStorage.setItem(WEEKLY_KEY, isoWeek(now));
  if (period === "month") localStorage.setItem(MONTHLY_KEY, isoMonth(now));
}

function hasTransactionsInPeriod(
  transactions: { transactionDate: string; type: string }[],
  period: SummaryPeriod
): boolean {
  if (!period) return false;
  const now = new Date();
  const from =
    period === "week"
      ? (() => {
          const d = new Date(now);
          const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
          d.setDate(d.getDate() + diff);
          d.setHours(0, 0, 0, 0);
          return d;
        })()
      : new Date(now.getFullYear(), now.getMonth(), 1);

  return transactions.some((t) => {
    const d = new Date(t.transactionDate);
    return t.type === "EXPENSE" && d >= from && d <= now;
  });
}

// ── Sub-providers ─────────────────────────────────────────────────────────────

function WsProvider() {
  useNotificationWs();
  return null;
}

function PushProvider({ userId }: { userId: string }) {
  usePushNotifications(userId);
  return null;
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useUserStore();
  const { notPaginated, getAllNotPaginated } = useTransactionStore();
  const [checked, setChecked] = useState(false);
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else {
        getAllNotPaginated();
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router]);

  // Check summary on load (and when navigated with ?summary=week|month from push click)
  useEffect(() => {
    if (!isAuthenticated || !checked) return;

    const fromParam = searchParams.get("summary") as SummaryPeriod;
    if (fromParam === "week" || fromParam === "month") {
      setSummaryPeriod(fromParam);
      return;
    }

    const due = checkSummaryDue();
    if (!due) return;

    const transactions = notPaginated ?? [];
    if (hasTransactionsInPeriod(transactions, due)) {
      setSummaryPeriod(due);
    }
  }, [isAuthenticated, checked, notPaginated, searchParams]);

  const handleCloseSummary = () => {
    markSummaryShown(summaryPeriod);
    setSummaryPeriod(null);
  };

  if (isLoading || !checked) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      <WsProvider />
      {user?.id && <PushProvider userId={user.id} />}
      <EmailVerificationBanner />
      {children}
      {summaryPeriod && notPaginated && (
        <WeeklyReportModal
          period={summaryPeriod}
          transactions={notPaginated}
          onClose={handleCloseSummary}
        />
      )}
    </>
  );
}
