"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, Bell, X } from "lucide-react";
import { user as avatar } from "@/constants/images";
import { HelpIcon, NotificationDeskIcon } from "@/constants/icons";
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

const NotificationModal: React.FC = () => {
  const { isNotificationCenterOpen, closeNotificationCenter } = useUiStore();
  const handleSupportClick = () =>
    window.open("mailto:Support@wundu.tech?subject=Ajuda%20com%20notificações", "_blank");

  if (!isNotificationCenterOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/20 backdrop-blur-[1px]"
      onClick={closeNotificationCenter}
    >
      <div
        className="mt-14 mr-4 w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200/70 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Bell className="w-4 h-4" />
            </span>
            <span className="font-semibold text-gray-900 text-sm">Notificações</span>
          </div>
          <button
            onClick={closeNotificationCenter}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 py-6">
          <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center">
            <p className="font-medium text-gray-700 text-sm mb-1">Sem notificações</p>
            <p className="text-gray-500 text-xs">
              Novidades sobre os seus comprovativos aparecerão aqui.
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Precisa de ajuda?</p>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={handleSupportClick}
              leftIcon={<HelpIcon className="w-3.5 h-3.5" />}
            >
              Falar com suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, onOpenProfile }) => {
  const pathname = usePathname() || "";
  const { user } = useUserStore();
  const { openNotificationCenter } = useUiStore();
  const pageTitle = getPageTitle(pathname);

  return (
    <>
      <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200/70 flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-gray-900 text-sm">{pageTitle}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={openNotificationCenter}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors relative"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 ml-1 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Perfil"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-amber-400/60">
              <Image
                src={avatar}
                alt={user?.name || "Usuário"}
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user?.name?.split(" ")[0] || "Usuário"}
            </span>
          </button>
        </div>
      </header>

      <NotificationModal />
    </>
  );
};

export default TopBar;
