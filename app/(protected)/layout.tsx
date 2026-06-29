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

function SidebarSkeleton() {
  return (
    <div className="hidden lg:flex flex-col h-full w-[220px] bg-white border-r border-slate-100 flex-shrink-0 animate-pulse">
      {/* Logo area */}
      <div className="flex items-center justify-center h-14 border-b border-slate-100/60 px-3">
        <div className="h-6 w-24 rounded-lg bg-slate-100" />
      </div>
      {/* Nav items */}
      <nav className="flex-1 py-4 px-2.5 space-y-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex-shrink-0" />
            <div className="h-3.5 rounded bg-slate-100 flex-1" style={{ width: `${50 + i * 10}%` }} />
          </div>
        ))}
      </nav>
    </div>
  );
}

function TopBarSkeleton() {
  return (
    <div className="z-30 h-14 flex-shrink-0 bg-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] animate-pulse">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100" />
          <div className="h-4 w-28 rounded-lg bg-slate-100" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-100" />
          <div className="flex items-center gap-2 py-1 pl-2 pr-1">
            <div className="h-3.5 w-16 rounded bg-slate-100 hidden md:block" />
            <div className="w-8 h-8 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedLoadingSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <SidebarSkeleton />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBarSkeleton />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <main className="flex-1 overflow-hidden p-3 lg:p-4">
          <div className="mx-auto max-w-[1280px] space-y-3 animate-pulse">
            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-white" />
              ))}
            </div>
            {/* Main content area */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="h-72 rounded-2xl bg-white lg:col-span-8" />
              <div className="h-72 rounded-2xl bg-white lg:col-span-4" />
            </div>
            <div className="h-48 rounded-2xl bg-white" />
          </div>
        </main>
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

  // Optimistic auth: user is persisted in localStorage → show real layout immediately.
  // initializeAuth() runs the refresh/validate in background; redirects to login if it fails.
  // Only block with skeleton on first visit (no cached user) or after logout.
  const isOptimisticReady = !!user;
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

  // Optimistic auth: moved above effects — see declaration near top of component.

  // With cached user (isOptimisticReady): render layout immediately, wait for initializeAuth in background.
  // Without cached user: show skeleton until checked (initializeAuth resolved).
  if (!isOptimisticReady && (isLoading || !checked)) return <LoadingProvider><ProtectedLoadingSkeleton /></LoadingProvider>;
  // After auth resolves: redirect if not authenticated (covers both optimistic + first-visit paths).
  if (!isAuthenticated && checked) return null;

  return (
    <LoadingProvider>
      {user?.id && <PushProvider userId={user.id} />}
      {/* Defer page content until auth is confirmed (token in memory).
          Shell (sidebar/topbar) already rendered by dashboard layout — this only gates page children. */}
      {checked ? children : (
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 animate-pulse">
          <div className="mx-auto max-w-[1280px] space-y-3">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-white" />)}
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="h-72 rounded-2xl bg-white lg:col-span-8" />
              <div className="h-72 rounded-2xl bg-white lg:col-span-4" />
            </div>
            <div className="h-48 rounded-2xl bg-white" />
          </div>
        </div>
      )}
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
