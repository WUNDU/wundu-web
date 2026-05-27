"use client";

import { WeeklyReportModal } from "@/components/weekly-report-modal";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUserStore } from "@/store/user-store";
import { useTransactionStore } from "@/store/transaction-store";
import EmailVerificationBanner from "@/components/email-verification-banner";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import type { SummaryTransaction } from "@/components/weekly-report-modal";
import { isExpense } from "@/utils/transaction-type";

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

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getSummaryQueryRange(period: Exclude<SummaryPeriod, null>) {
  const now = new Date();
  if (period === "week") {
    const start = new Date(now);
    const diff = start.getDay() === 0 ? -6 : 1 - start.getDay();
    start.setDate(start.getDate() + diff - 7);
    start.setHours(0, 0, 0, 0);
    return { startDate: toIsoDate(start), endDate: toIsoDate(now) };
  }

  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  start.setHours(0, 0, 0, 0);
  return { startDate: toIsoDate(start), endDate: toIsoDate(now) };
}

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
  transactions: SummaryTransaction[],
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
    if (!t.transactionDate) return false;
    const d = new Date(t.transactionDate);
    return t.type && isExpense(t.type) && d >= from && d <= now;
  });
}

// ── Sub-providers ─────────────────────────────────────────────────────────────

function PushProvider({ userId }: { userId: string }) {
  usePushNotifications(userId);
  return null;
}

function ProtectedLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#F1F5FA] p-4 animate-pulse">
      <div className="mx-auto max-w-[1360px] space-y-3">
        <div className="h-12 rounded-xl bg-white" />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="h-36 rounded-xl bg-white lg:col-span-4" />
          <div className="h-36 rounded-xl bg-white lg:col-span-8" />
        </div>
        <div className="h-80 rounded-xl bg-white" />
      </div>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useUserStore();
  const notPaginated = useTransactionStore((s) => s.notPaginated);
  const getAllNotPaginated = useTransactionStore((s) => s.getAllNotPaginated);
  const [checked, setChecked] = useState(false);
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>(null);
  // Pending period: set when we triggered the fetch, cleared once data arrives
  const [pendingSummaryPeriod, setPendingSummaryPeriod] = useState<SummaryPeriod>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router]);

  // Effect 1: decide if summary is due and trigger data fetch.
  // Does NOT include `notPaginated` in deps — avoids re-running when data arrives.
  useEffect(() => {
    if (!isAuthenticated || !checked) return;

    const fromParam = searchParams.get("summary") as SummaryPeriod;
    if (fromParam === "week" || fromParam === "month") {
      getAllNotPaginated(getSummaryQueryRange(fromParam));
      setSummaryPeriod(fromParam);
      return;
    }

    const due = checkSummaryDue();
    if (!due) return;

    getAllNotPaginated(getSummaryQueryRange(due));
    setPendingSummaryPeriod(due);
  }, [isAuthenticated, checked, getAllNotPaginated, searchParams]);

  // Effect 2: once data lands, decide whether to show the modal.
  useEffect(() => {
    if (!pendingSummaryPeriod || !notPaginated) return;
    if (hasTransactionsInPeriod(notPaginated, pendingSummaryPeriod)) {
      setSummaryPeriod(pendingSummaryPeriod);
    }
    setPendingSummaryPeriod(null);
  }, [notPaginated, pendingSummaryPeriod]);

  const handleCloseSummary = () => {
    markSummaryShown(summaryPeriod);
    setSummaryPeriod(null);
  };

  if (isLoading || !checked) return <ProtectedLoadingSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <>
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
