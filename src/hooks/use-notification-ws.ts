"use client";

import { useEffect, useRef } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { useUserStore } from "@/store/user-store";
import { useApiNotificationStore } from "@/store/api-notification-store";
import type { NotificationResponse } from "@/types/dtos/notification.dto";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "";

/**
 * Subscribes to `/user/{userId}/queue/notifications` over STOMP.
 * Updates the api-notification-store with live pushes, bumping unreadCount and
 * prepending the new notification to the list.
 *
 * Mount once inside the protected layout so it stays active for the whole session.
 */
export function useNotificationWs() {
  const clientRef = useRef<Client | null>(null);
  const token = useUserStore((s) => s.token);
  const userId = useUserStore((s) => s.user?.id);

  useEffect(() => {
    if (!WS_URL || !token || !userId) return;

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/user/${userId}/queue/notifications`, (msg: IMessage) => {
          try {
            const notification: NotificationResponse = JSON.parse(msg.body);
            const store = useApiNotificationStore.getState();
            const current = store.notifications ?? [];
            useApiNotificationStore.setState({
              notifications: [notification, ...current],
              unreadCount: store.unreadCount + 1,
            });
          } catch {
            // Ignore malformed messages
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [token, userId]);
}
