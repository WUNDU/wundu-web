"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { BellIcon } from "@/constants/icons";
import { avatar } from "@/constants/images";
import Icon, { type MenuIconName } from "../layout/Icon";
import NotificationPanel from "../layout/Notification";
import { useUserStore } from "@/store/user-store";
import { useApiNotification } from "@/hooks/use-api-notification";
import { mockAccounts } from "../mock/account";

type MoreItem = {
  key: string;
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
};

function ItemIcon({
  children,
  danger = false,
}: {
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
        danger ? "bg-danger-300/10" : "bg-primary-300/10"
      }`}
    >
      {children}
    </span>
  );
}

function RowChevron() {
  return (
    <ChevronRight
      className="size-5 shrink-0 text-(--menu-icon-cinza)"
      aria-hidden="true"
    />
  );
}

export default function MoreScreen() {
  const user = useUserStore((s) => s.user);
  const logoutUser = useUserStore((s) => s.logoutUser);
  const { unreadCount, fetchUnreadCount } = useApiNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const displayName = user?.name?.trim() || "Utilizador";
  const planLabel =
    user?.planType === "PREMIUM"
      ? "Plano Premium"
      : user?.planType === "FREE"
        ? "Plano gratuito"
        : "A carregar plano…";

  function openNotifications() {
    setIsNotificationOpen(true);
  }

  function closeNotifications() {
    setIsNotificationOpen(false);
    void fetchUnreadCount();
  }

  const menuIcon = (name: MenuIconName) => (
    <Icon name={name} className="size-5 text-(--menu-icon-cinza)" />
  );

  const sections: { label: string; items: MoreItem[] }[] = [
    {
      label: "CONFIGURAÇÕES",
      items: [
        {
          key: "contas",
          title: "Contas",
          description: `${mockAccounts.length} contas · Bancos, carteiras e dinheiro`,
          icon: menuIcon("accounts"),
          href: "/home/accounts",
        },
        {
          key: "categorias",
          title: "Categorias",
          description: "22 categorias",
          icon: menuIcon("categories"),
          href: "/home/categories",
        },
      ],
    },
    {
      label: "UTILIZADOR",
      items: [
        {
          key: "definicoes",
          title: "Definições",
          description: "Perfil, segurança, notificações",
          icon: menuIcon("settings"),
          href: "/home/profile/settings",
        },
        {
          key: "notificacoes",
          title: "Notificações",
          description:
            unreadCount > 0
              ? `${unreadCount} por ler`
              : "Sem notificações por ler",
          icon: (
            <span className="relative size-5 text-(--menu-icon-cinza)">
              <BellIcon
                className="absolute inset-0 size-5"
                aria-hidden="true"
              />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-3 min-w-3 items-center justify-center rounded-full bg-danger-300 px-0.5 text-[8px] font-extrabold leading-none text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </span>
          ),
          onClick: openNotifications,
        },
        {
          key: "suporte",
          title: "Suporte",
          description: "Ajuda e contacto",
          icon: menuIcon("support"),
          href: "/home/profile/support",
        },
      ],
    },
    {
      label: "SESSÃO",
      items: [
        {
          key: "sair",
          title: "Terminar sessão",
          description: "Sair desta conta neste dispositivo",
          icon: (
            <LogOut
              className="size-5 text-(--menu-icon-cinza)"
              aria-hidden="true"
            />
          ),
          danger: true,
          onClick: () => {
            void logoutUser();
          },
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col bg-(--background-variant) lg:bg-transparent">
      <div className="flex items-center justify-between self-stretch bg-(--background) px-6 py-4 lg:hidden">
        <h1 className="font-manrope text-2xl font-bold text-(--text-title)">
          Mais
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-start justify-start gap-4 self-stretch overflow-y-auto px-6 pb-8 pt-2 lg:mx-auto lg:w-full lg:max-w-3xl">
        <Link
          href="/home/profile/settings"
          className="flex items-center gap-3 self-stretch rounded-2xl bg-(--bg-card) p-4"
          aria-label={`Abrir perfil de ${displayName}`}
        >
          <Image
            src={user?.profilePhotoUrl || avatar}
            alt={`Foto de perfil de ${displayName}`}
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-full object-cover"
            unoptimized={Boolean(user?.profilePhotoUrl)}
          />
          <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden">
            <span className="truncate font-manrope text-base font-bold text-(--text-title)">
              {displayName}
            </span>
            <span className="truncate font-manrope text-xs font-medium text-(--text-description)">
              {user?.email ?? ""}
            </span>
            <span className="font-manrope text-xs font-bold text-primary-300">
              {planLabel}
            </span>
          </span>
          <RowChevron />
        </Link>

        {sections.map((section) => (
          <div key={section.label} className="flex flex-col self-stretch">
            <p className="px-0 pb-1 pt-3 font-manrope text-xs font-bold text-(--text-description)">
              {section.label}
            </p>
            <div className="flex flex-col items-start justify-start self-stretch rounded-2xl bg-(--bg-card) px-4 py-1">
              {section.items.map((item, index) => {
                const content = (
                  <>
                    <ItemIcon danger={item.danger}>{item.icon}</ItemIcon>
                    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden">
                      <span
                        className={`line-clamp-1 self-stretch font-manrope text-sm font-bold ${
                          item.danger ? "text-danger-text" : "text-(--text-title)"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="line-clamp-1 self-stretch font-manrope text-xs font-medium text-(--text-description)">
                        {item.description}
                      </span>
                    </span>
                    <RowChevron />
                  </>
                );
                return (
                  <div key={item.key} className="self-stretch">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex w-full items-center gap-3 py-3.5 text-left"
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="flex w-full items-center gap-3 py-3.5 text-left"
                      >
                        {content}
                      </button>
                    )}
                    {index < section.items.length - 1 ? (
                      <div
                        aria-hidden="true"
                        className="h-px self-stretch bg-(--card-barras)"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="font-manrope text-xs font-medium text-(--text-description)">
          © {new Date().getFullYear()} Wundu · Versão 2.0
        </p>
      </div>

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
      />
    </div>
  );
}
