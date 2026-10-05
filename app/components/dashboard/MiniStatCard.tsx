"use client";

import { ArrowDown, ArrowUp, Equal, type LucideIcon } from "lucide-react";
import { MiniChart, type CardColor, type CardTrend } from "./CardViews";

export type MiniStatTone = {
  background: string;
  text: string;
  /** Cor do texto do badge (por omissão, igual à do ícone). */
  badgeText?: string;
};

type MiniStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  trend?: CardTrend;
  tone: MiniStatTone;
  chartColor: CardColor;
  chartData: number[];
  chartLabels?: string[];
  chartLabel: string;
  className?: string;
};

export default function MiniStatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  tone,
  chartColor,
  chartData,
  chartLabels,
  chartLabel,
  className,
}: MiniStatCardProps) {
  const TrendIcon =
    trend === "down" ? ArrowDown : trend === "flat" ? Equal : ArrowUp;

  return (
    <article
      className={[
        "flex h-full w-full min-w-0 flex-col items-start overflow-hidden rounded-2xl border border-(--border-card) bg-(--bg-card)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={`${label}: ${value}`}
    >
      <div className="flex flex-col items-start justify-start gap-px self-stretch px-3.5 pt-3.5">
        <span
          className={`flex w-8 items-center justify-center rounded-xl py-2 ${tone.background}`}
        >
          <Icon
            className={`size-4 ${tone.text}`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
        <p className="self-stretch pt-2 font-manrope text-xs font-normal leading-5 text-(--text-description)">
          {label}
        </p>
        <p
          className="self-stretch truncate pb-[0.64px] font-manrope text-base font-bold leading-6 text-(--text-title)"
          title={value}
        >
          {value}
        </p>
        <div className="self-stretch pt-1.5">
          {change ? (
            <span
              className={`inline-flex h-6 items-center gap-1 rounded-lg px-2 ${tone.background}`}
            >
              <TrendIcon
                className={`size-3 ${tone.text}`}
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span
                className={`font-manrope text-xs font-bold leading-4 ${tone.badgeText ?? tone.text}`}
              >
                {change}
              </span>
            </span>
          ) : null}
        </div>
      </div>
      <div
        className="relative h-11 w-full overflow-hidden"
        aria-label={chartLabel}
      >
        <MiniChart color={chartColor} data={chartData} labels={chartLabels} />
      </div>
    </article>
  );
}
