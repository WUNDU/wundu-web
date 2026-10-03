"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ChevronRightIcon } from "@/constants/icons";
import { logo, logotype } from "@/constants/images";
import Icon, { type MenuIconName } from "./Icon";
import { useTransaction } from "@/hooks/use-transaction";

type MenuItemKey =
  | "Principal"
  | "Default"
  | "transacoes"
  | "metas"
  | "analises"
  | "Contas"
  | "categorias"
  | "definicoes"
  | "suporte";

type MenuProps = {
  className?: string;
  property1?: MenuItemKey;
  collapsed?: boolean;
  onToggle?: () => void;
};

type MenuItem = {
  key: MenuItemKey;
  label: string;
  description?: string;
  href: string;
  icon: MenuIconName;
  chevron?: boolean;
};

const menuItems: MenuItem[] = [
  { key: "Default", label: "Dashboard", href: "/home", icon: "dashboard" },
  {
    key: "transacoes",
    label: "Transações",
    description: "Entradas, gastos e transferências",
    href: "/home/transactions",
    icon: "transactions",
  },
  {
    key: "metas",
    label: "Metas",
    description: "Acompanhe seus objectivos",
    href: "/home/goals",
    icon: "goals",
  },
  {
    key: "analises",
    label: "Análises",
    description: "Evolução e insights financeiros",
    href: "/home/analytics",
    icon: "analytics",
  },
  {
    key: "Contas",
    label: "Contas",
    href: "/home/accounts",
    icon: "accounts",
    chevron: true,
  },
  {
    key: "categorias",
    label: "Categorias",
    description: "Agrupe os gastos",
    href: "/home/categories",
    icon: "categories",
  },
  {
    key: "definicoes",
    label: "Definições",
    href: "/home/profile/settings",
    icon: "settings",
    chevron: true,
  },
  {
    key: "suporte",
    label: "Suporte",
    href: "/home/profile/support",
    icon: "support",
    chevron: true,
  },
];

const principalSections: { label: string; items: MenuItem[] }[] = [
  { label: "Geral", items: menuItems.slice(0, 4) },
  { label: "Configurações", items: menuItems.slice(4, 6) },
  { label: "Utilizador", items: menuItems.slice(6) },
];

const isMenuItemActive = (pathname: string, item: MenuItem) => {
  if (item.key === "Default") return pathname === "/home";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};

export default function Menu({
  className,
  property1 = "Principal",
  collapsed = false,
  onToggle,
}: MenuProps) {
  const pathname = usePathname() ?? "";
  const { totalElements: transactionTotal, isLoading: isTxLoading } =
    useTransaction();
  const isPrincipal = property1 === "Principal";
  const activeKey = ["Principal", "Default"].includes(property1)
    ? "Default"
    : property1;

  return (
    <aside
      className={[
        "flex h-screen shrink-0 flex-col border-r border-(--card-barras) bg-(--bg-card) text-(--text-title) transition-[width] duration-200",
        collapsed ? "w-12" : "w-64",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-node-id="2166:12056"
      data-property={property1}
    >
      <div className="flex h-22.5 shrink-0 items-center justify-center border-b border-(--card-barras) px-3 py-2">
        {collapsed ? (
          <Image
            src={logo}
            alt="Wundu"
            width={32}
            height={32}
            className="size-8"
            priority
          />
        ) : (
          <Image
            src={logotype}
            alt="Wundu"
            width={234}
            height={65}
            className="h-16.25 w-58.5 object-contain"
            priority
          />
        )}
      </div>

      <nav
        className={[
          "flex flex-1 flex-col overflow-y-auto",
          collapsed ? "items-center gap-4 px-2 py-2" : "gap-2 px-3 py-2",
        ].join(" ")}
        aria-label="Menu principal"
      >
        {(isPrincipal
          ? principalSections
          : [{ label: "Geral", items: menuItems }]
        ).map((section) => (
          <div
            key={section.label}
            className={[
              "flex flex-col gap-2",
              collapsed ? "items-center px-0 py-0" : "px-2 py-2",
              collapsed && section !== principalSections[0]
                ? "border-t border-(--card-barras) pt-4"
                : "",
            ].join(" ")}
          >
            {!collapsed && (
              <p
                className="h-8 text-[12px] font-medium uppercase leading-none tracking-normal text-(--text-description-60)"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const active = isPrincipal
                  ? isMenuItemActive(pathname, item)
                  : item.key === activeKey;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "group flex min-h-10 items-center gap-1 px-0.5 py-1 transition-[background-color,color] duration-200 ease-out",
                      active && item.key === "Default"
                        ? "rounded-xl"
                        : "rounded-md",
                      active
                        ? "bg-(--menu-bg-active) text-(--text-link)"
                        : "bg-(--menu-bg) text-(--menu-text) hover:bg-(--menu-bg-hover) hover:text-(--menu-hover)",
                    ].join(" ")}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg">
                      <Icon
                        name={item.icon}
                        className="size-4"
                        strokeWidth={active ? 1.75 : 1.5}
                      />
                    </span>
                    {!collapsed && (
                      <span className="flex min-w-0 flex-1 flex-col justify-center">
                        <span
                          className="truncate text-base font-medium leading-none"
                          style={{
                            fontFamily: "var(--font-manrope)",
                            fontSize: "16px",
                            fontWeight: isPrincipal && active ? 700 : 500,
                            lineHeight: 1,
                          }}
                        >
                          {item.label}
                        </span>
                        {!isPrincipal && item.description && (
                          <span
                            className="truncate text-[14px] leading-[1.56] tracking-[-0.42px] text-(--text-description-60)"
                            style={{ fontFamily: "var(--font-manrope)" }}
                          >
                            {item.description}
                          </span>
                        )}
                      </span>
                    )}
                    {isPrincipal && item.key === "transacoes" && !collapsed && (
                      <span
                        className="px-2 text-xs text-(--menu-text)"
                        title="Total de transações"
                      >
                        {isTxLoading && transactionTotal === 0
                          ? "…"
                          : transactionTotal}
                      </span>
                    )}
                    {isPrincipal && item.key === "Contas" && !collapsed && (
                      <span className="px-2 text-xs text-(--menu-text)">3</span>
                    )}
                    {isPrincipal && item.chevron && !collapsed && (
                      <ChevronRightIcon
                        className="mr-1 size-4 text-(--menu-text)"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        className={[
          "border-t border-(--card-barras)",
          collapsed ? "px-2 py-2" : "px-6 py-2",
        ].join(" ")}
      >
        {isPrincipal && !collapsed && (
          <div className="flex h-15 flex-col justify-center gap-0 px-2 text-(--menu-text)">
            <p
              className="text-[14px] font-semibold leading-[1.56]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              © 2026 Wundu
            </p>
            <p
              className="text-[12px] leading-none"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Versão 2.0
            </p>
          </div>
        )}
        {!isPrincipal && (
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-xl p-2 text-(--menu-text) transition-colors hover:bg-(--menu-bg-hover)"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronLeft
              className={collapsed ? "size-5 rotate-180" : "size-5"}
            />
          </button>
        )}
      </div>
    </aside>
  );
}
