"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Toggle from "./Toggle";

const STORAGE_KEY = "wundu-notify-prefs";

const INITIAL_STATE = {
  email: true,
  usage: true,
  monthly: false,
  security: true,
} as const;

type NotificationKey = keyof typeof INITIAL_STATE;

function readStored(): Record<NotificationKey, boolean> {
  if (typeof window === "undefined") return { ...INITIAL_STATE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_STATE };
    const parsed = JSON.parse(raw) as Partial<Record<NotificationKey, boolean>>;
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return { ...INITIAL_STATE };
  }
}

const ROWS: { id: NotificationKey; title: string; description: string }[] = [
  {
    id: "email",
    title: "Notificações por e-mail",
    description: "Receba atualizações por e-mail",
  },
  {
    id: "usage",
    title: "Alertas de uso",
    description: "Receba notificações quando estiver se aproximando dos limites",
  },
  {
    id: "monthly",
    title: "Relatórios Mensais",
    description: "Receba um resumo mensal do desempenho financeiro por email",
  },
  {
    id: "security",
    title: "Alertas de segurança",
    description: "Avisos de segurança importantes",
  },
];

function NotificationsCard() {
  const [state, setState] = useState<Record<NotificationKey, boolean>>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // armazenamento indisponível — mantém só em memória
    }
  }, [state]);

  const toggle = (key: NotificationKey) =>
    setState((current) => ({ ...current, [key]: !current[key] }));

  return (
    <section
      aria-labelledby="notifications-title"
      className="flex flex-col items-start justify-start gap-2 self-stretch rounded-2xl border border-(--card-barras) bg-(--bg-card) p-6"
    >
      <div className="flex items-center justify-start gap-3">
        <Bell
          width={16}
          height={16}
          aria-hidden="true"
          className="text-(--icon-hover-2)"
        />
        <h2
          id="notifications-title"
          className="font-manrope text-lg font-bold leading-7 text-(--text)"
        >
          Notificações
        </h2>
      </div>
      {ROWS.map((row, index) => (
        <div
          key={row.id}
          className={`flex min-h-20 items-center justify-between gap-4 self-stretch py-4 ${
            index < ROWS.length - 1 ? "border-b border-(--card-barras)" : ""
          }`}
        >
          <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
            <p className="font-manrope text-base font-semibold text-(--text)">
              {row.title}
            </p>
            <p className="font-manrope text-sm font-normal leading-5 text-(--text-description)">
              {row.description}
            </p>
          </div>
          <Toggle
            checked={state[row.id]}
            onToggle={() => toggle(row.id)}
            label={row.title}
          />
        </div>
      ))}
    </section>
  );
}

export default NotificationsCard;
