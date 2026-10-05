"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ellipsis } from "lucide-react";
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

/** Rotas que mantêm a tab "Mais" ativa. */
const MORE_HREFS = [
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

export default function BottomNav() {
  const pathname = usePathname() ?? "";
  const moreActive = MORE_HREFS.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );

  return (
    <nav
      aria-label="Navegação principal"
      className="z-40 flex w-full shrink-0 items-start border-t border-(--card-barras) bg-(--bg-card) px-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      {PRIMARY_ITEMS.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex min-w-0 flex-1 flex-col items-center gap-1 overflow-hidden py-1.5",
              active ? "text-(--text-link)" : "text-(--menu-icon)",
            ].join(" ")}
          >
            <span
              className={[
                "flex items-center justify-center overflow-hidden rounded-2xl px-4 py-1",
                active ? "bg-primary-300/10" : "",
              ].join(" ")}
            >
              <Icon
                name={item.icon}
                className="size-5"
                strokeWidth={active ? 1.75 : 1.5}
              />
            </span>
            <span
              className={[
                "truncate font-manrope text-xs leading-none",
                active
                  ? "font-bold text-(--text-link)"
                  : "font-semibold text-(--text-title)",
              ].join(" ")}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <Link
        href="/home/more"
        aria-current={moreActive ? "page" : undefined}
        aria-label="Mais opções"
        className={[
          "flex min-w-0 flex-1 flex-col items-center gap-1 overflow-hidden py-1.5",
          moreActive ? "text-(--text-link)" : "text-(--menu-icon)",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-7 items-center justify-center overflow-hidden rounded-2xl px-4 py-1",
            moreActive ? "bg-primary-300/10" : "",
          ].join(" ")}
        >
          <Ellipsis
            className="size-6"
            strokeWidth={moreActive ? 2 : 1.5}
            aria-hidden="true"
          />
        </span>
        <span
          className={[
            "truncate font-manrope text-xs leading-none",
            moreActive
              ? "font-bold text-(--text-link)"
              : "font-semibold text-(--text-title)",
          ].join(" ")}
        >
          Mais
        </span>
      </Link>
    </nav>
  );
}
