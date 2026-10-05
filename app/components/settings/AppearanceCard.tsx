"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import Toggle from "./Toggle";
import { useThemeStore } from "../../store/theme-store";

function AppearanceCard() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [compact, setCompact] = useState(false);

  const rows = [
    {
      id: "dark",
      title: "Modo escuro",
      description: "Use o tema escuro em todo o aplicativo",
      checked: theme === "dark",
      onToggle: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
    {
      id: "compact",
      title: "Visão compacta",
      description: "Exibir mais conteúdo em menos espaço",
      checked: compact,
      onToggle: () => setCompact((value) => !value),
    },
  ];

  return (
    <section
      aria-labelledby="appearance-title"
      className="flex flex-col items-start justify-start gap-2 self-stretch rounded-2xl border border-(--card-barras) bg-(--bg-card) p-6"
    >
      <div className="flex items-center justify-start gap-3">
        <Palette
          width={16}
          height={16}
          aria-hidden="true"
          className="text-(--icon-hover-2)"
        />
        <h2
          id="appearance-title"
          className="font-manrope text-lg font-bold leading-7 text-(--text)"
        >
          Aparência
        </h2>
      </div>
      {rows.map((row, index) => (
        <div
          key={row.id}
          className={`flex min-h-20 items-center justify-between gap-4 self-stretch py-4 ${
            index < rows.length - 1 ? "border-b border-(--card-barras)" : ""
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
            checked={row.checked}
            onToggle={row.onToggle}
            label={row.title}
          />
        </div>
      ))}
    </section>
  );
}

export default AppearanceCard;
