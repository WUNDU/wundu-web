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
        "relative flex h-69 min-h-55 w-full min-w-0 max-w-98 flex-col items-center justify-between overflow-hidden rounded-3xl border border-(--card-barras) bg-(--bg-card) shadow-[0_4px_6px_rgba(0,0,0,0.04)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="box-border flex w-full flex-1 flex-col items-center"
        style={{
          paddingInline: "var(--spacing-2xl)",
          paddingBlock: "var(--spacing-xl)",
        }}
      >
        <div className="flex w-full flex-1 flex-col items-start justify-center">
          <div className="flex w-full items-start gap-3">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-(--border-button)"
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
              <p
                className="w-full truncate text-[18px] font-semibold leading-[1.56] tracking-[-0.54px]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                {title}
              </p>
              <p
                className="w-full truncate text-[20px] font-extrabold leading-[1.56] tracking-[-0.6px]"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {value}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative h-15.75 w-full shrink-0 overflow-hidden"
        role="img"
        aria-label={`Evolução de ${title.toLowerCase()}`}
      >
        <MiniChart color={color} data={chartData} />
      </div>
    </article>
  );
}
