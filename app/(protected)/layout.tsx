"use client";

import { WeeklyReportModal } from "@/components/weekly-report-modal";
import { ReportNotificationModal } from "@/components/report-notification-modal";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useReportNotifications } from "@/hooks/use-report-notifications";
import { useUserStore } from "@/store/user-store";
import { useTransaction } from "@/hooks/use-transaction";
import { useApiNotification } from "@/hooks/use-api-notification";
import { useCategory } from "@/hooks/use-category";
import { useGoal } from "@/hooks/use-goal";
import { useShallow } from "zustand/shallow";
import { LoadingProvider } from "@/contexts/loading-context";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import type { SummaryTransaction } from "@/components/weekly-report-modal";
import { isExpense } from "@/utils/transaction-type";
import Layout from "app/components/layout/Layout";

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
    <Layout>
      <div
        role="status"
        aria-label="A carregar a aplicação"
        className="flex h-full min-h-full flex-col bg-(--bg-card)"
      >
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-(--card-barras) bg-(--bg-card) px-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-(--bg-filter)" />
          <div className="flex gap-3">
            <div className="h-12 w-36 animate-pulse rounded-xl bg-(--bg-filter)" />
            <div className="h-12 w-28 animate-pulse rounded-xl bg-(--bg-filter)" />
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex h-36 animate-pulse flex-col justify-between rounded-2xl border border-(--card-barras) bg-(--background) p-5 shadow-[0_2px_4px_rgba(0,60,195,0.04)]"
              >
                <div className="h-4 w-2/3 rounded bg-(--bg-filter)" />
                <div className="h-8 w-3/4 rounded-lg bg-(--bg-filter)" />
              </div>
            ))}
          </div>
          <div className="grid min-h-105 grid-cols-1 gap-6 xl:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex animate-pulse flex-col gap-6 rounded-2xl border border-(--card-barras) bg-(--background) p-6 shadow-[0_2px_4px_rgba(0,60,195,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-40 rounded bg-(--bg-filter)" />
                  <div className="h-5 w-20 rounded bg-(--bg-filter)" />
                </div>
                <div className="flex flex-1 flex-col justify-end gap-3">
                  <div className="h-px w-full bg-(--card-barras)" />
                  <div className="h-32 w-full rounded-xl bg-(--bg-filter)" />
                </div>
                <div className="flex gap-3">
                  <div className="h-4 w-1/3 rounded bg-(--bg-filter)" />
                  <div className="h-4 w-1/4 rounded bg-(--bg-filter)" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, initializeAuth } = useUserStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      isLoading: s.isLoading,
      user: s.user,
      initializeAuth: s.initializeAuth,
    })),
  );

  const { notPaginated, getAllNotPaginated } = useTransaction();

  const { getCategories: prefetchCategories } = useCategory();
  const { getGoals: prefetchGoals } = useGoal();
  const { fetchUnreadCount } = useApiNotification();

  // initializeAuth() runs the refresh/validate in background; redirects to login if it fails.
  const [checked, setChecked] = useState(false); // only becomes true after initializeAuth resolves
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>(null);
  // Pending period: set when we triggered the fetch, cleared once data arrives
  const [pendingSummaryPeriod, setPendingSummaryPeriod] = useState<SummaryPeriod>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Report notifications from API (WEEKLY_REPORT | BIWEEKLY_REPORT | MONTHLY_REPORT)
  const { current: reportNotification, dismiss: dismissReport } = useReportNotifications(
    isAuthenticated && checked
  );

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router]);

  // Prefetch all stores in parallel — only after auth is confirmed (token is valid in memory)
  useEffect(() => {
    if (!isAuthenticated || !checked) return;
    prefetchCategories();
    prefetchGoals();
  }, [isAuthenticated, checked, prefetchCategories, prefetchGoals]);

  // Re-fetch unread count when user returns to tab (foreground)
  useEffect(() => {
    if (!isAuthenticated || !checked) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchUnreadCount();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isAuthenticated, checked, fetchUnreadCount]);

  // Re-fetch unread count when user navigates to the main screen
  useEffect(() => {
    if (isAuthenticated && checked && pathname === ROUTES.HOME) fetchUnreadCount();
  }, [pathname, isAuthenticated, checked, fetchUnreadCount]);


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

  if (isLoading || !checked) return <LoadingProvider><ProtectedLoadingSkeleton /></LoadingProvider>;
  // After auth resolves: redirect if not authenticated (covers both optimistic + first-visit paths).
  if (!isAuthenticated && checked) return null;

  return (
    <LoadingProvider>
      {user?.id && <PushProvider userId={user.id} />}
      {children}
      {/* API-driven report popup — takes priority over local summary modal */}
      {reportNotification && (
        <ReportNotificationModal
          notification={reportNotification}
          onClose={dismissReport}
        />
      )}
      {!reportNotification && summaryPeriod && notPaginated && (
        <WeeklyReportModal
          period={summaryPeriod}
          transactions={notPaginated}
          onClose={handleCloseSummary}
        />
      )}
    </LoadingProvider>
  );
}
