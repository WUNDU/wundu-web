"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu as MenuIcon, Moon, PanelLeftClose, PanelLeftOpen, Search, Settings, Sparkles } from "lucide-react";
import { avatar, logo } from "@/constants/images";
import { BellIcon, SunIcon } from "@/constants/icons";
import { useUserStore } from "@/store/user-store";
import { useApiNotification } from "@/hooks/use-api-notification";
import FloatingMenu from "../ui/FloatingMenu";
import { useThemeStore } from "../../store/theme-store";
import NotificationPanel from "./Notification";
import { menuItems } from "./Menu";
import Icon, { type MenuIconName } from "./Icon";

type SearchEntry = {
  key: string;
  label: string;
  description?: string;
  href: string;
  icon: MenuIconName;
};

/**
 * Secções escondidas que o menu lateral não alcança: abas das Definições
 * (inclui abrir direto a palavra-passe) e das Análises. Entram na pesquisa
 * via `?tab=` / `?acao=` — é isto que torna a pesquisa útil além do sidebar.
 */
const sectionEntries: SearchEntry[] = [
  { key: "set-perfil", label: "Perfil", description: "Definições › Perfil", href: "/home/profile/settings?tab=perfil", icon: "settings" },
  { key: "set-seguranca", label: "Segurança", description: "Definições › Segurança", href: "/home/profile/settings?tab=seguranca", icon: "settings" },
  { key: "set-password", label: "Alterar palavra-passe", description: "Definições › Segurança", href: "/home/profile/settings?tab=seguranca&acao=palavra-passe", icon: "settings" },
  { key: "set-privacidade", label: "Privacidade", description: "Definições › Privacidade", href: "/home/profile/settings?tab=privacidade", icon: "settings" },
  { key: "set-notificacoes", label: "Notificações", description: "Definições › Notificações", href: "/home/profile/settings?tab=notificacoes", icon: "settings" },
  { key: "set-planos", label: "Planos", description: "Definições › Planos", href: "/home/profile/settings?tab=planos", icon: "settings" },
  { key: "set-aparencia", label: "Aparência", description: "Definições › Aparência", href: "/home/profile/settings?tab=aparencia", icon: "settings" },
  { key: "set-sessoes", label: "Sessões", description: "Definições › Sessões", href: "/home/profile/settings?tab=sessoes", icon: "settings" },
  { key: "an-visao", label: "Visão geral", description: "Análises", href: "/home/analytics?tab=visao-geral", icon: "analytics" },
  { key: "an-fluxo", label: "Fluxo Financeiro", description: "Análises", href: "/home/analytics?tab=fluxo-financeiro", icon: "analytics" },
  { key: "an-patrimonio", label: "Património", description: "Análises", href: "/home/analytics?tab=patrimonio", icon: "analytics" },
  { key: "an-categorias", label: "Categorias", description: "Análises › Categorias", href: "/home/analytics?tab=categorias", icon: "analytics" },
  { key: "an-contas", label: "Contas", description: "Análises", href: "/home/analytics?tab=contas", icon: "analytics" },
  { key: "an-mapa", label: "Mapa", description: "Análises", href: "/home/analytics?tab=mapa", icon: "analytics" },
  { key: "an-metas", label: "Metas", description: "Análises", href: "/home/analytics?tab=metas", icon: "analytics" },
];

const searchIndex: SearchEntry[] = [...menuItems, ...sectionEntries];

type TopBarProps = {
  collapsed?: boolean;
  onToggleMenu?: () => void;
  className?: string;
  /** Título exibido só no mobile (base Figma: "Dashboard") */
  title?: string;
};

export default function TopBar({
  collapsed = false,
  onToggleMenu,
  className,
  title = "Dashboard",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const searchAnchorRef = useRef<HTMLLabelElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const mobileTitle =
    pathname === "/home"
      ? "Dashboard"
      : pathname.startsWith("/home/transactions")
        ? "Transações"
        : pathname.startsWith("/home/goals")
          ? "Metas"
          : pathname.startsWith("/home/analytics")
            ? "Análises"
            : pathname.startsWith("/home/ai")
              ? "Wundu IA"
            : pathname.startsWith("/home/accounts")
              ? "Contas"
              : pathname.startsWith("/home/categories")
                ? "Categorias"
                : pathname.startsWith("/home/more")
                  ? "Menu"
                  : pathname.startsWith("/home/profile/settings")
                    ? "Definições"
                    : pathname.startsWith("/home/profile/support")
                    ? "Suporte"
                    : title;
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

  // ── Pesquisa / navegação rápida ────────────────────────────────────────
  const normalize = (value: string): string =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const searchResults = searchIndex.filter((item) => {
    const q = normalize(searchQuery.trim());
    if (!q) return true;
    return (
      normalize(item.label).includes(q) ||
      (item.description ? normalize(item.description).includes(q) : false)
    );
  });

  const goToPage = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setActiveResult(0);
    searchInputRef.current?.blur();
    router.push(href);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setActiveResult(0);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && searchResults.length > 0) {
      event.preventDefault();
      setActiveResult((prev) => (prev + 1) % searchResults.length);
    } else if (event.key === "ArrowUp" && searchResults.length > 0) {
      event.preventDefault();
      setActiveResult(
        (prev) => (prev - 1 + searchResults.length) % searchResults.length,
      );
    } else if (event.key === "Enter" && searchResults.length > 0) {
      event.preventDefault();
      const target =
        searchResults[Math.min(activeResult, searchResults.length - 1)];
      if (target) goToPage(target.href);
    }
  };

  // ⌘K / Ctrl+K foca a pesquisa (⌘F foi evitado de propósito: é o "procurar" do browser).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div>
      <header
        className={[
          "flex h-19 min-h-19 shrink-0 items-center justify-between gap-3 border-b border-(--card-barras) bg-(--bg-card) px-5",
          "lg:h-22.5 lg:justify-between lg:gap-0 lg:bg-(--bg-card) lg:px-6 lg:py-6",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-node-id="2177:15094"
      >
        <button
          type="button"
          onClick={onToggleMenu}
          className="hidden size-10 items-center justify-center rounded-xl text-(--menu-icon) transition-colors hover:bg-(--background-variant) hover:text-(--menu-hover) lg:flex"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-8" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-8" strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
          <Image
            src={logo}
            alt="Wundu"
            width={44}
            height={44}
            className="size-10 shrink-0"
            priority
          />
          <span className="min-w-0 flex-1 truncate font-manrope text-xl font-semibold leading-7 text-(--text-title)">
            {mobileTitle}
          </span>
        </div>

        <div className="flex h-full items-center gap-2 lg:gap-6">
          <label
            ref={searchAnchorRef}
            className="hidden h-12 w-78.75 items-center gap-2 rounded-xl border-[1.5px] border-(--card-barras) bg-(--background-variant) px-3.5 py-2 text-(--text-description) transition-colors duration-200 hover:border-primary-300 hover:bg-(--bg-body) focus-within:border-primary-300 focus-within:bg-(--bg-body) lg:flex"
          >
            <Search className="size-4 shrink-0" strokeWidth={1.5} />
            <input
              ref={searchInputRef}
              type="search"
              role="combobox"
              aria-expanded={isSearchOpen}
              aria-controls="topbar-search-listbox"
              aria-label="Pesquisar páginas"
              aria-activedescendant={
                searchResults.length > 0
                  ? `topbar-search-option-${Math.min(activeResult, searchResults.length - 1)}`
                  : undefined
              }
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setActiveResult(0);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                setActiveResult(0);
                setIsSearchOpen(true);
              }}
              onKeyDown={onSearchKeyDown}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[1.56] tracking-[-0.42px] outline-none placeholder:text-(--text-description)"
              style={{ fontFamily: "var(--font-manrope)" }}
            />
            <span className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-(--bg-card) px-3 py-1 text-(--text-title) shadow-[inset_0_-1px_2px_rgba(0,0,0,0.05)]">
              <span className="text-xs">⌘</span>
              <span className="text-[16px] font-semibold tracking-[0.3px]">
                K
              </span>
            </span>
          </label>
          <FloatingMenu
            isOpen={isSearchOpen}
            anchorRef={searchAnchorRef}
            onClose={closeSearch}
          >
            <div
              role="listbox"
              id="topbar-search-listbox"
              aria-label="Navegação rápida"
              className="flex max-h-80 flex-col overflow-y-auto rounded-2xl border border-(--card-barras) bg-(--background) p-2 shadow-[0px_8px_30px_rgba(2,21,69,0.12)]"
            >
              {searchResults.length === 0 ? (
                <p className="px-3 py-2.5 font-manrope text-sm font-medium text-(--text-description)">
                  Nenhuma página encontrada{searchQuery.trim() ? ` para “${searchQuery.trim()}”` : ""}.
                </p>
              ) : (
                searchResults.map((item, index) => {
                  const isActive =
                    index ===
                    Math.min(activeResult, searchResults.length - 1);
                  const isCurrent =
                    !item.href.includes("?") && pathname === item.href;
                  return (
                    <button
                      key={item.key}
                      id={`topbar-search-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      aria-current={isCurrent ? "page" : undefined}
                      onMouseEnter={() => setActiveResult(index)}
                      onClick={() => goToPage(item.href)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        isActive ? "bg-(--menu-bg-hover)" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-300/10"
                      >
                        <Icon name={item.icon} width={18} height={18} className="text-(--icon)" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="flex items-center gap-2 font-manrope text-sm font-semibold text-(--text-title)">
                          <span className="truncate">{item.label}</span>
                          {isCurrent ? (
                            <span className="size-1.5 shrink-0 rounded-full bg-primary-300" aria-hidden="true" />
                          ) : null}
                        </span>
                        {item.description ? (
                          <span className="truncate font-manrope text-xs font-normal text-(--text-description-60)">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </FloatingMenu>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Wundu IA temporariamente oculto — TopBar muito cheio
            <button
              type="button"
              onClick={() => router.push("/home/ai")}
              aria-label="Abrir Wundu IA"
              title="Wundu IA"
              className="flex size-11 items-center justify-center rounded-xl bg-(--background-variant) text-(--menu-icon) transition-colors hover:text-primary-300 lg:size-10 lg:bg-transparent lg:hover:bg-(--background-variant)"
            >
              <Sparkles className="size-5" aria-hidden="true" />
            </button>
            */}
            <button
              type="button"
              onClick={toggleTheme}
              className="group flex size-11 items-center justify-center rounded-xl bg-(--background-variant) text-(--menu-icon) transition-colors hover:text-(--menu-hover) lg:size-10 lg:bg-transparent lg:hover:bg-(--background-variant)"
              aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
              title={isDark ? "Tema claro" : "Tema escuro"}
              aria-pressed={isDark}
            >
              {isDark ? (
                <SunIcon className="size-8" aria-hidden="true" />
              ) : (
                <Moon className="size-8" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
            <span className="hidden h-5 w-px bg-(--menu-divider) lg:block" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              className="group relative flex size-11 items-center justify-center rounded-xl bg-(--background-variant) text-(--menu-icon) transition-colors hover:text-(--menu-hover) lg:size-10 lg:bg-transparent lg:hover:bg-(--background-variant)"
              aria-label={unreadCount > 0 ? `${unreadCount} notificações por ler` : "Sem notificações por ler"}
              title="Notificações"
            >
              <span className="relative size-10">
                <BellIcon
                  className="absolute left-2 top-2 size-6"
                  aria-hidden="true"
                />
                {unreadCount > 0 ? (
                  <span className="absolute right-1.5 top-0.75 flex size-3.5 min-w-3.5 items-center justify-center rounded-full border-2 border-(--bg-card) bg-danger-300 px-0.5 text-[9px] font-extrabold leading-none text-white">
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
            className="hidden h-12 w-60 items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-(--menu-bg-hover) lg:flex"
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
