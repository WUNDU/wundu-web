"use client";
import type { FC } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Bell, X } from "lucide-react";
import { user as avatar } from "@/constants/images";
import { AnimatePresence, motion } from "framer-motion";
import { HelpIcon } from "@/constants/icons";
import { useUserStore } from "@/store/user-store";
import { useUiStore } from "@/store/ui-store";
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

interface NotifContentProps {
  onClose: () => void;
  onSupport: () => void;
}

const NotifContent: FC<NotifContentProps> = ({ onClose, onSupport }) => (
  <div className="flex h-full flex-col">
    {/* Header */}
    <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#003cc3] to-[#001a66]">
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
      <div className="rounded-[16px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#003cc3]/10 to-[#001a66]/10">
          <Bell className="h-5 w-5 text-[#003cc3]" />
        </div>
        <p className="mb-1 text-sm font-semibold text-slate-700">Sem notificações</p>
        <p className="text-xs leading-relaxed text-slate-400">
          Novidades sobre os seus comprovativos aparecerão aqui.
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="flex-shrink-0 border-t border-slate-100 px-5 py-4">
      <button
        onClick={onSupport}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-[#003cc3]/20 hover:bg-[#003cc3]/5 hover:text-[#003cc3]"
      >
        <HelpIcon className="h-4 w-4" />
        Falar com suporte
      </button>
    </div>
  </div>
);

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
              className="rounded-lg p-2 text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-[#003cc3]"
              aria-label="Toggle sidebar"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
            <div className="mx-1 hidden h-6 w-px bg-slate-100 md:block" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ffd400]" />
              <h1 className="text-sm font-bold text-slate-900">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <motion.button
              onClick={openNotificationCenter}
              className="relative rounded-lg p-2 text-slate-400 transition-all duration-150 hover:bg-slate-50 hover:text-[#003cc3]"
              aria-label="Notificações"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#EF4444]" />
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
                {user?.name?.split(" ")[0] || "Usuário"}
              </span>
              <div
                className="h-8 w-8 overflow-hidden rounded-lg shadow-sm"
                style={{ padding: 2, backgroundColor: "#ffd400", borderRadius: 10 }}
              >
                <div className="h-full w-full overflow-hidden rounded-[6px]">
                  <Image
                    src={avatar}
                    alt={user?.name || "Usuário"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>
      {/* Brand accent line — subtle indicator instead of fixed heavy bar */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#ffd400]/40 to-transparent opacity-60" />

      <NotificationModal />
    </>
  );
};

export default TopBar;
