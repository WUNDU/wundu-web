"use client";

import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUserStore } from "@/store/user-store";
import { useApiNotification } from "@/hooks/use-api-notification";
import { useCategory } from "@/hooks/use-category";
import { useGoal } from "@/hooks/use-goal";
import { useShallow } from "zustand/shallow";
import { LoadingProvider } from "@/contexts/loading-context";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Layout from "app/components/layout/Layout";

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

  const { getCategories: prefetchCategories } = useCategory();
  const { getGoals: prefetchGoals } = useGoal();
  const { fetchUnreadCount } = useApiNotification();

  // initializeAuth() runs the refresh/validate in background; redirects to login if it fails.
  const [checked, setChecked] = useState(false); // only becomes true after initializeAuth resolves
  const router = useRouter();
  const pathname = usePathname();

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
  if (isLoading || !checked) return <LoadingProvider><ProtectedLoadingSkeleton /></LoadingProvider>;
  // After auth resolves: redirect if not authenticated (covers both optimistic + first-visit paths).
  if (!isAuthenticated && checked) return null;

  return (
    <LoadingProvider>
      {user?.id && <PushProvider userId={user.id} />}
      {children}
    </LoadingProvider>
  );
}
