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
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

const routeLabels: Record<string, string> = {
  [ROUTES.HOME]: "Início",
  [ROUTES.FINANCIAL]: "Objetivos Financeiros",
  [ROUTES.FINANCIAL_NEW_OBJECTIVE]: "Nova Meta",
  [ROUTES.FINANCIAL_OBJECTIVE]: "Detalhe da Meta",
  [ROUTES.SCAN]: "Scan de Documentos",
  [ROUTES.CHAT_IA]: "Wundu AI",
  [ROUTES.CONTROL_PANEL]: "Análises",
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

const NotificationModal: FC = () => {
  const { isNotificationCenterOpen, closeNotificationCenter } = useUiStore();
  const handleSupportClick = () =>
    window.open("mailto:Support@wundu.tech?subject=Ajuda%20com%20notificações", "_blank");

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/20"
          onClick={closeNotificationCenter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <motion.div
            className="mr-3 mt-14 w-full max-w-sm overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_4px_16px_rgba(0,60,195,0.08)] sm:mr-4 sm:mt-16"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -8, x: 6 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8, x: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="rounded-lg bg-[#ffd400]/20 p-1.5 text-[#003cc3]">
                  <Bell className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-gray-900">Notificações</span>
              </div>
                <button
                  onClick={closeNotificationCenter}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            <div className="px-4 py-5">
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
                <p className="mb-1 text-sm font-medium text-gray-700">Sem notificações</p>
                <p className="text-xs text-gray-500">
                  Novidades sobre os seus comprovativos aparecerão aqui.
                </p>
              </div>
              <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-4 text-center">
                <p className="mb-2 text-xs text-gray-500">Precisa de ajuda?</p>
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={handleSupportClick}
                  leftIcon={<HelpIcon className="h-3.5 w-3.5" />}
                >
                  Falar com suporte
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
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
        className="z-30 h-12 flex-shrink-0 border-b border-white/40 bg-white/90 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] lg:h-14"
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
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ffd400]" />
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
              <div className="h-8 w-8 overflow-hidden rounded-lg ring-2 ring-[#003cc3]/15 shadow-sm">
                <Image
                  src={avatar}
                  alt={user?.name || "Usuário"}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <NotificationModal />
    </>
  );
};

export default TopBar;
