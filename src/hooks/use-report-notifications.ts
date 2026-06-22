"use client";

import { useEffect, useRef, useState } from "react";
import { useApiNotification } from "@/hooks/use-api-notification";
import type { NotificationResponse } from "@/types/dtos/notification.dto";

export const REPORT_NOTIFICATION_TYPES = new Set([
  "WEEKLY_REPORT",
  "BIWEEKLY_REPORT",
  "MONTHLY_REPORT",
]);

export function useReportNotifications(enabled: boolean) {
  const { unreadNotifications: notifications, fetchUnread, markAsRead } = useApiNotification();

  const [queue,   setQueue]   = useState<NotificationResponse[]>([]);
  const [current, setCurrent] = useState<NotificationResponse | null>(null);
  const initializedRef = useRef(false);

  // Fetch unread once auth is ready
  useEffect(() => {
    if (enabled) fetchUnread();
  }, [enabled, fetchUnread]);

  // Build queue once notifications arrive (only on first load)
  useEffect(() => {
    if (initializedRef.current || !notifications) return;

    const reports = notifications
      .filter((n) => !n.isRead && REPORT_NOTIFICATION_TYPES.has(n.type))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (reports.length === 0) return;

    initializedRef.current = true;
    const [first, ...rest] = reports;
    setCurrent(first);
    setQueue(rest);
  }, [notifications]);

  const dismiss = async () => {
    if (!current) return;
    await markAsRead(current.id);
    const [next, ...rest] = queue;
    setCurrent(next ?? null);
    setQueue(rest);
  };

  return { current, dismiss };
}
