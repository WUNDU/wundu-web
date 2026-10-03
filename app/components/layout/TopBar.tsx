"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu as MenuIcon, Moon, Search, Settings } from "lucide-react";
import { avatar } from "@/constants/images";
import { BellIcon, ExpandIcon, SunIcon } from "@/constants/icons";
import { useUserStore } from "@/store/user-store";
import { useApiNotification } from "@/hooks/use-api-notification";
import FloatingMenu from "../ui/FloatingMenu";
import { useThemeStore } from "../../store/theme-store";
import NotificationPanel from "./Notification";

type TopBarProps = {
  collapsed?: boolean;
  onToggleMenu?: () => void;
  className?: string;
};

export default function TopBar({
  collapsed = false,
  onToggleMenu,
  className,
}: TopBarProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const user = useUserStore((s) => s.user);
  const displayName = user?.name?.trim() || "Utilizador";
  const planLabel =
    user?.planType === "PREMIUM"
      ? "Plano Premium"
      : user?.planType === "FREE"
        ? "Plano gratuito"
        : "A carregar plano…";
  const isDark = theme === "dark";
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const profileAnchorRef = useRef<HTMLButtonElement>(null);
  const logoutUser = useUserStore((s) => s.logoutUser);
  const { unreadCount, fetchUnreadCount } = useApiNotification();

  useEffect(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  function closeNotifications() {
    setIsNotificationOpen(false);
    void fetchUnreadCount();
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <header
        className={[
          "flex h-22.5 shrink-0 items-center justify-between border-b border-(--card-barras) bg-(--bg-card) px-6 py-6",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-node-id="2177:15094"
      >
        <button
          type="button"
          onClick={onToggleMenu}
          className="flex size-10 items-center justify-center rounded-xl text-(--menu-icon) transition-colors hover:bg-(--background-variant) hover:text-(--menu-hover)"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ExpandIcon className="size-8" aria-hidden="true" />
        </button>

        <div className="flex h-full items-center gap-6">
          <label className="flex h-12 w-78.75 items-center gap-2 rounded-xl border-[1.5px] border-(--card-barras) bg-(--background-variant) px-3.5 py-2 text-(--text-description) transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-300">
            <Search className="size-4 shrink-0" strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Pesquisar..."
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[1.56] tracking-[-0.42px] outline-none placeholder:text-(--text-description)"
              style={{ fontFamily: "var(--font-manrope)" }}
            />
            <span className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-(--bg-card) px-3 py-1 text-(--text-title) shadow-[inset_0_-1px_2px_rgba(0,0,0,0.05)]">
              <span className="text-xs">⌘</span>
              <span className="text-[16px] font-semibold tracking-[0.3px]">
                F
              </span>
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="group flex size-10 items-center justify-center rounded-xl text-(--menu-icon) transition-colors hover:bg-(--background-variant) hover:text-(--menu-hover)"
              aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
              title={isDark ? "Tema claro" : "Tema escuro"}
              aria-pressed={isDark}
            >
              {isDark ? (
                <SunIcon
                  className="size-8 [--sun-opacity:0.5] group-hover:[--sun-opacity:1]"
                  aria-hidden="true"
                />
              ) : (
                <Moon className="size-8" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
            <span className="h-5 w-px bg-(--menu-divider)" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              className="group relative flex size-10 items-center justify-center rounded-xl text-(--menu-icon) transition-colors hover:bg-(--background-variant) hover:text-(--menu-hover)"
              aria-label={unreadCount > 0 ? `${unreadCount} notificações por ler` : "Sem notificações por ler"}
              title="Notificações"
            >
              <span className="relative size-10">
                <BellIcon
                  className="absolute left-2 top-2 size-6"
                  aria-hidden="true"
                />
                {unreadCount > 0 ? (
                  <span className="absolute right-1.5 p-1.5 top-0.75 flex size-3.5 min-w-3.5 items-center justify-center rounded-full border-2 border-(--bg-card) bg-danger-300 px-0.5 text-[9px] font-extrabold leading-none text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </span>
            </button>
          </div>

          <button
            type="button"
            ref={profileAnchorRef}
            onClick={() => setIsProfileMenuOpen((value) => !value)}
            aria-expanded={isProfileMenuOpen}
            aria-label={`Abrir perfil de ${displayName}`}
            className="flex h-12 w-60 items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-(--menu-bg-hover)"
          >
            <Image
              src={user?.profilePhotoUrl || avatar}
              alt={`Foto de perfil de ${displayName}`}
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-lg object-cover"
              unoptimized={Boolean(user?.profilePhotoUrl)}
            />
            <span
              className="flex min-w-0 flex-1 flex-col"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              <span className="truncate text-[16px] font-medium leading-none text-(--text-title)">
                {displayName}
              </span>
              <span className="mt-1 flex items-center gap-1.5 truncate text-[14px] leading-[1.3] tracking-[-0.42px] text-(--text-description-60)">
                <span>{planLabel}</span>
              </span>
            </span>
            <ChevronDown
              className={`size-4 shrink-0 text-(--menu-text) transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""}`}
              strokeWidth={1.5}
            />
          </button>
          <FloatingMenu
            isOpen={isProfileMenuOpen}
            anchorRef={profileAnchorRef}
            align="right"
            matchWidth={false}
            pointer
            onClose={() => setIsProfileMenuOpen(false)}
          >
            <div
              role="menu"
              aria-label="Menu do perfil"
              className="flex w-64 flex-col items-start rounded-2xl border border-(--card-barras) bg-(--background) p-2 shadow-[0px_8px_30px_rgba(2,21,69,0.12)]"
            >
              <div className="flex w-full flex-col gap-0.5 border-b border-(--card-barras) px-3 py-3">
                <p className="truncate font-manrope text-[16px] font-semibold leading-none text-(--text-title)">
                  {displayName}
                </p>
                <p className="truncate font-manrope text-[13px] leading-[1.3] text-(--text-description-60)">
                  {planLabel}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  router.push("/home/profile/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-(--menu-bg-hover)"
              >
                <Settings width={16} height={16} className="shrink-0 text-(--menu-icon)" aria-hidden="true" />
                <span className="font-manrope text-sm font-medium text-(--text-title)">
                  Definições
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  void logoutUser();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-danger-300/10"
              >
                <LogOut width={16} height={16} className="shrink-0 text-danger-300" aria-hidden="true" />
                <span className="font-manrope text-sm font-semibold text-danger-300">
                  Terminar sessão
                </span>
              </button>
            </div>
          </FloatingMenu>
        </div>
      </header>
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
      />
    </div>
  );
}
