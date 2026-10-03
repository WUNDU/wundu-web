"use client";

import { useEffect, useState } from "react";
import { BellIcon, CheckmarkIcon, EyeOffIcon } from "@/constants/icons";
import { useApiNotification } from "@/hooks/use-api-notification";
import NotificationItem from "./NotificationItem";

/** Data relativa curta em pt-AO ("5 min", "2 horas", "3 dias"). */
function relativeDate(iso: string) {
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return "";
  const diffMs = Date.now() - time;
  if (diffMs < 0) return "agora";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hora" : `${hours} horas`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? "1 dia" : `${days} dias`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 mês" : `${months} meses`;
}

function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    fetchAll,
    markAsRead,
    markAllAsRead,
    isLoading,
    hasFetched,
    error,
  } = useApiNotification();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAttempted(false);
      void fetchAll().finally(() => setAttempted(true));
    }
  }, [isOpen, fetchAll]);

  const items = (notifications ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    description: n.message,
    date: relativeDate(n.createdAt),
    lida: n.isRead,
  }));
  const unread = items.filter((n) => !n.lida).length;

  async function handleMarkRead(id: string) {
    setMarkingId(id);
    await markAsRead(id);
    setMarkingId(null);
  }

  async function handleMarkAllRead() {
    if (unread === 0 || markingAll) return;
    setMarkingAll(true);
    await markAllAsRead();
    setMarkingAll(false);
  }

  const isFetching = (!hasFetched && !attempted && !error) || isLoading;

  return (
    <div
      className={`fixed inset-0 z-40 backdrop-blur transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
    >
      <aside
        className={`flex fixed right-0 top-0 z-50 w-125 h-screen flex-col items-center border border-(--card-barras) rounded-l-[20px] bg-(--background) transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Notificações"
      >
        <header className="flex h-22.5 py-6 px-8 justify-between items-center shrink-0 self-stretch border-b border-(--card-barras)">
          <div className="flex items-center gap-2">
            <BellIcon className="text-primary-300" />
            <span className="font-manrope text-[18px] not-italic leading-[155.99%] text-(--text-title)">
              Notificações
              {unread > 0 ? ` (${unread} por ler)` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CheckmarkIcon
              width={18}
              height={18}
              className="w-4.5 h-4.5 shrink-0 text-primary-300"
            />
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unread === 0 || markingAll}
              className="font-manrope text-[14px] leading-[150%] not-italic text-(--text-description-button) transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {markingAll ? "A marcar…" : "Marcar lidas"}
            </button>
          </div>
        </header>
        <main className="flex min-h-0 flex-col justify-start gap-4 flex-1 self-stretch py-2 px-4 overflow-auto">
          {isFetching ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <p className="font-manrope text-sm text-(--text-description)">
                A carregar notificações…
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
              <p className="font-manrope text-sm font-semibold text-(--text-title)">
                Não foi possível carregar as notificações.
              </p>
              <button
                type="button"
                onClick={() => void fetchAll()}
                className="rounded-xl bg-primary-300 px-4 py-2 font-manrope text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Tentar novamente
              </button>
            </div>
          ) : items.length > 0 ? (
            items.map((n) => (
              <NotificationItem
                key={n.id}
                id={n.id}
                title={n.title}
                description={n.description}
                date={n.date}
                lida={n.lida}
                marking={markingId === n.id}
                onMarkRead={handleMarkRead}
              />
            ))
          ) : (
            <div className="flex flex-col gap-4 p-2 flex-1 justify-center items-center">
              <EyeOffIcon width={48} height={48} className="text-neutral-300" />
              <h1 className="text-[18px] font-bold leading-[155.99%] not-italic text-center text-neutral-300">
                Sem notificações
              </h1>
              <p className="text-neutral-300 text-[12px] font-normal not-italic text-center">
                As novas notificações irão aparecer aqui.
              </p>
            </div>
          )}
        </main>
      </aside>
    </div>
  );
}

export default NotificationPanel;
