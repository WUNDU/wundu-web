"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type MenuIconName } from "./Icon";

type BottomNavItem = {
  key: string;
  label: string;
  href: string;
  icon: MenuIconName;
};

const PRIMARY_ITEMS: BottomNavItem[] = [
  { key: "Default", label: "Início", href: "/home", icon: "dashboard" },
  {
    key: "transacoes",
    label: "Transações",
    href: "/home/transactions",
    icon: "transactions",
  },
  { key: "metas", label: "Metas", href: "/home/goals", icon: "goals" },
  {
    key: "analises",
    label: "Análises",
    href: "/home/analytics",
    icon: "analytics",
  },
];

/** Rotas que mantêm a tab "Menu" ativa, incluindo os destinos de "Mais". */
const MENU_HREFS = [
  "/home/more",
  "/home/accounts",
  "/home/categories",
  "/home/profile/settings",
  "/home/profile/support",
];

function isActive(pathname: string, item: BottomNavItem) {
  if (item.key === "Default") return pathname === "/home";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function TabLink({
  href,
  active,
  label,
  ariaLabel,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  ariaLabel?: string;
  icon: MenuIconName;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
      className={[
        "flex min-w-0 flex-1 flex-col items-center gap-1 overflow-hidden py-1.5",
        "transition-colors duration-300 ease-out motion-reduce:transition-none",
        active ? "text-(--text-link)" : "text-(--menu-icon)",
      ].join(" ")}
    >
      <span
        className={[
          "flex min-w-14 items-center justify-center overflow-hidden rounded-2xl px-4 py-1",
          "transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
          active
            ? "scale-100 bg-primary-300/10 opacity-100"
            : "scale-95 bg-transparent opacity-70",
        ].join(" ")}
      >
        <Icon
          name={icon}
          className={[
            "size-5 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
            active ? "scale-110" : "scale-100",
          ].join(" ")}
          strokeWidth={active ? 1.75 : 1.5}
        />
      </span>
      <span
        className={[
          "truncate font-manrope text-xs leading-none",
          "transition-colors duration-300 ease-out motion-reduce:transition-none",
          active
            ? "font-bold text-(--text-link)"
            : "font-semibold text-(--text-title)",
        ].join(" ")}
      >
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname() ?? "";
  const menuActive = MENU_HREFS.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );

  return (
    <nav
      aria-label="Navegação principal"
      className="z-40 flex w-full shrink-0 items-start border-t border-(--card-barras) bg-(--bg-card) px-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      {PRIMARY_ITEMS.map((item) => (
        <TabLink
          key={item.key}
          href={item.href}
          active={isActive(pathname, item)}
          label={item.label}
          icon={item.icon}
        />
      ))}

      <TabLink
        href="/home/more"
        active={menuActive}
        label="Menu"
        ariaLabel="Menu"
        icon="menu"
      />
    </nav>
  );
}
