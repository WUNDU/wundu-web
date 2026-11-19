"use client";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, X, BarChart2, Calendar, ArrowRightLeft, AlertTriangle } from "lucide-react";
import UserAvatar from "@/components/ui/user-avatar";
import { AnimatePresence, motion } from "framer-motion";
import { HelpIcon } from "@/constants/icons";
import { useUserStore } from "@/store/user-store";
import { useUiStore } from "@/store/ui-store";
import { useApiNotification } from "@/hooks/use-api-notification";
import type { NotificationResponse } from "@/types/dtos/notification.dto";
import { ROUTES } from "@/constants/routes";

const routeLabels: Record<string, string> = {
  [ROUTES.HOME]: "Início",
  [ROUTES.FINANCIAL]: "Objetivos Financeiros",
  [ROUTES.FINANCIAL_NEW_OBJECTIVE]: "Nova Meta",
  [ROUTES.FINANCIAL_OBJECTIVE]: "Detalhe da Meta",
  [ROUTES.SCAN]: "Scan de Documentos",
  [ROUTES.CHAT_IA]: "Wundu AI",
  [ROUTES.CONTROL_PANEL]: "Análises",
  [ROUTES.CATEGORIES]: "Categorias",
  [ROUTES.LIBRARY]: "Biblioteca",
  [ROUTES.ARTICLE]: "Artigo",
  [ROUTES.PROFILE]: "Perfil",
  [ROUTES.SUPPORT]: "Suporte",
};

function getPageTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname];
  for (const [route, label] of Object.entries(routeLabels)) {
    if (pathname.startsWith(route + "/")) return label;
  }
  return "Wundu";
}

const NOTIF_ENTER: [number, number, number, number] = [0, 0, 0.2, 1];
const NOTIF_EXIT:  [number, number, number, number] = [0.4, 0, 1, 1];

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function NotifTypeIcon({ type }: { type: string }) {
  if (type === "WEEKLY_REPORT" || type === "BIWEEKLY_REPORT")
    return <BarChart2 className="h-4 w-4 text-secondary" />;
  if (type === "MONTHLY_REPORT")
    return <Calendar className="h-4 w-4 text-secondary" />;
  if (type === "TRANSFER_RECEIVED")
    return <ArrowRightLeft className="h-4 w-4 text-emerald-500" />;
  if (type === "SPENDING_ALERT")
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  return <Bell className="h-4 w-4 text-slate-400" />;
}

interface NotifItemProps {
  notification: NotificationResponse;
  onMarkRead: () => void;
}

const NotifItem: FC<NotifItemProps> = ({ notification, onMarkRead }) => (
  <button
    onClick={() => { if (!notification.isRead) onMarkRead(); }}
    className={`w-full text-left rounded-[14px] border p-3.5 transition-colors ${
      notification.isRead
        ? "border-slate-100 bg-white hover:bg-slate-50"
        : "border-secondary/10 bg-secondary/[0.03] hover:bg-secondary/[0.06]"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] bg-slate-100">
        <NotifTypeIcon type={notification.type} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-xs font-semibold ${notification.isRead ? "text-slate-600" : "text-slate-900"}`}>
            {notification.title}
          </p>
          <span className="flex-shrink-0 text-[10px] text-slate-400">{timeAgo(notification.createdAt)}</span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
          {notification.message}
        </p>
      </div>
      {!notification.isRead && (
        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-secondary" />
      )}
    </div>
  </button>
);

// ── NotifContent ──────────────────────────────────────────────────────────────

interface NotifContentProps {
  onClose: () => void;
  onSupport: () => void;
}

const NotifContent: FC<NotifContentProps> = ({ onClose, onSupport }) => {
  const { notifications, isLoading, fetchAll, markAsRead } = useApiNotification();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const sorted = useMemo(
    () =>
      [...(notifications ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notifications]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-secondary to-secondary-dark">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Notificações</p>
            <p className="text-xs text-slate-400">Actualizações recentes</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Fechar notificações"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {isLoading && !notifications ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-[14px] bg-slate-100" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-br from-secondary/10 to-secondary-dark/10">
              <Bell className="h-5 w-5 text-secondary" />
            </div>
            <p className="mb-1 text-sm font-semibold text-slate-700">Sem notificações</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Novidades sobre os seus comprovativos aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((n) => (
              <NotifItem key={n.id} notification={n} onMarkRead={() => markAsRead(n.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-slate-100 px-5 py-4">
        <button
          onClick={onSupport}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-secondary/20 hover:bg-secondary/5 hover:text-secondary"
        >
          <HelpIcon className="h-4 w-4" />
          Falar com suporte
        </button>
      </div>
    </div>
  );
};

const NotificationModal: FC = () => {
  const { isNotificationCenterOpen, closeNotificationCenter } = useUiStore();
  const handleSupportClick = () =>
    window.open("mailto:Support@wundu.tech?subject=Ajuda%20com%20notificações", "_blank");

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/30"
            onClick={closeNotificationCenter}
          />

          {/* Desktop — right side panel (lg+) */}
          <motion.div
            key="notif-desktop"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.18, ease: NOTIF_EXIT } }}
            transition={{ duration: 0.22, ease: NOTIF_ENTER }}
            className="fixed bottom-0 right-0 top-0 z-[201] hidden w-[400px] flex-col overflow-hidden bg-white shadow-[0_4px_16px_rgba(0,60,195,0.08)] lg:flex"
          >
            <NotifContent onClose={closeNotificationCenter} onSupport={handleSupportClick} />
          </motion.div>

          {/* Mobile — full-screen slide up (<lg) */}
          <motion.div
            key="notif-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.18, ease: NOTIF_EXIT } }}
            transition={{ duration: 0.25, ease: NOTIF_ENTER }}
            className="fixed inset-0 z-[201] flex flex-col overflow-hidden bg-white lg:hidden"
          >
            <NotifContent onClose={closeNotificationCenter} onSupport={handleSupportClick} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
}

const TopBar: FC<TopBarProps> = ({ onToggleSidebar, onOpenProfile }) => {
  const pathname = usePathname() || "";
  const { user } = useUserStore();
  const { openNotificationCenter } = useUiStore();
  const { unreadCount } = useApiNotification();
  const pageTitle = getPageTitle(pathname);

  return (
    <>
      <motion.header
        className="z-30 h-12 flex-shrink-0 bg-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] lg:h-14"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-secondary"
              aria-label="Toggle sidebar"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
            <div className="mx-1 hidden h-6 w-px bg-slate-100 md:block" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <h1 className="text-sm font-bold text-slate-900">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              onClick={openNotificationCenter}
              className="relative rounded-lg p-2 text-slate-400 transition-all duration-150 hover:bg-slate-50 hover:text-secondary"
              aria-label="Notificações"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
              )}
            </motion.button>

            <motion.button
              onClick={onOpenProfile}
              className="flex items-center gap-2 rounded-xl border border-transparent py-1 pl-2 pr-1 transition-all duration-150 hover:border-slate-200 hover:bg-slate-50"
              aria-label="Perfil"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <span className="hidden text-sm font-semibold text-slate-700 md:block">
                {user?.name
                  ? user.name.split(" ")[0]
                  : <span className="inline-block h-3.5 w-14 rounded bg-slate-100 animate-pulse align-middle" />
                }
              </span>
              <div className="flex-shrink-0 ring-2 ring-primary/40 rounded-full">
                <UserAvatar src={user?.profilePhotoUrl} name={user?.name} size="sm" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>
      {/* Brand accent line — subtle indicator instead of fixed heavy bar */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60" />

      <NotificationModal />
    </>
  );
};

export default TopBar;
