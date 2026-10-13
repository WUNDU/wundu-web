"use client";

import { WalletIcon } from "@/constants/icons";
import { MiniChart, type CardColor } from "../dashboard/CardViews";

const SOFT_BG: Record<CardColor, string> = {
  blue: "color-mix(in srgb, var(--color-primary-300) 10%, transparent)",
  green: "var(--color-success-10)",
  red: "color-mix(in srgb, var(--color-danger-300) 10%, transparent)",
  yellow: "var(--color-warning-10)",
};

const ACCENT: Record<CardColor, string> = {
  blue: "var(--color-primary-300)",
  green: "var(--color-success)",
  red: "var(--color-danger-300)",
  yellow: "var(--color-warning)",
};

type AnalysisSummaryCardProps = {
  title: string;
  value: string;
  color: CardColor;
  icon: "down" | "equals" | "wallet";
  chartData: number[];
  className?: string;
};

/**
 * Card de resumo das análises (sem linha de variação — sem "%" nem
 * "vs ..."; essa é do CardViews do dashboard).
 */
export default function AnalysisSummaryCard({
  title,
  value,
  color,
  icon,
  chartData,
  className,
}: AnalysisSummaryCardProps) {
  return (
    <article
      className={[
        "relative flex w-full min-w-0 flex-col items-center justify-between overflow-hidden rounded-xl border border-(--card-barras) bg-(--bg-card)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="box-border flex w-full flex-1 flex-col items-center px-4 py-4 sm:px-8 sm:py-6">
        <div className="flex w-full flex-1 flex-col items-start justify-center">
          <div className="flex w-full items-start gap-2 sm:gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-(--border-button) sm:size-11"
              style={{ backgroundColor: SOFT_BG[color] }}
            >
              {icon === "wallet" ? (
                <WalletIcon className="text-primary-300 border-primary-300" />
              ) : (
                <span
                  className="text-base font-bold"
                  style={{ color: ACCENT[color] }}
                >
                  {icon === "equals" ? "=" : "↓"}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-(--text-title)">
              <p className="w-full truncate font-manrope text-xs font-medium leading-5 tracking-tight sm:text-sm">
                {title}
              </p>
              <p className="w-full truncate font-inter text-base font-extrabold leading-7 tracking-tight sm:text-xl sm:leading-8">
                {value}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative h-15 w-full shrink-0 overflow-hidden"
        role="img"
        aria-label={`Evolução de ${title.toLowerCase()}`}
      >
        <MiniChart color={color} data={chartData} />
      </div>
    </article>
  );
}
