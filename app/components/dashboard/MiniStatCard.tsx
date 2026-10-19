"use client";

import { ArrowDown, ArrowUp, Equal, type LucideIcon } from "lucide-react";
import {
  MiniChart,
  getTrendBadgeTone,
  type CardColor,
  type CardTrend,
  type TrendPolarity,
} from "./CardViews";
import { useValuesVisibility } from "./values-visibility";

export type MiniStatTone = {
  background: string;
  text: string;
};

type MiniStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  trend?: CardTrend;
  /** Determina se subir ou descer representa uma variação favorável. */
  trendPolarity?: TrendPolarity;
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
  trendPolarity = "higher-is-better",
  tone,
  chartColor,
  chartData,
  chartLabels,
  chartLabel,
  className,
}: MiniStatCardProps) {
  const { mask } = useValuesVisibility();
  const TrendIcon =
    trend === "down" ? ArrowDown : trend === "flat" ? Equal : ArrowUp;
  // Igual ao desktop: a cor do badge segue a tendência + polaridade,
  // não a cor fixa do ícone (antes ficava sempre verde/vermelho).
  const badgeTone = getTrendBadgeTone(trend, trendPolarity, change !== "");
  const displayValue = mask(value);

  return (
    <article
      className={[
        "flex h-full w-full min-w-0 flex-col items-start overflow-hidden rounded-xl border border-(--border-card) bg-(--bg-card)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={`${label}: ${displayValue}`}
    >
      <div className="flex flex-col items-start justify-start gap-1 self-stretch px-4 pt-4">
        <span
          className={`flex size-9 items-center justify-center rounded-xl ${tone.background}`}
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
          className="self-stretch truncate font-manrope text-base font-bold leading-6 text-(--text-title)"
          title={displayValue}
        >
          {displayValue}
        </p>
        <div className="self-stretch pt-1.5">
          {change ? (
            <span
              className="inline-flex h-6 items-center gap-1 rounded-md px-2"
              style={badgeTone}
            >
              <TrendIcon
                className="size-3"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span className="font-manrope text-xs font-bold leading-4">
                {change}
              </span>
            </span>
          ) : null}
        </div>
      </div>
      <div
        className="relative h-11 w-full"
        aria-label={chartLabel}
      >
        <MiniChart color={chartColor} data={chartData} labels={chartLabels} />
      </div>
    </article>
  );
}
