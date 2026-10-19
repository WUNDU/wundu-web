"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ArrowDown, ArrowUp, Equal, Wallet } from "lucide-react";
import { formatAOACompact } from "app/utils/format-AOA";
import { useThemeStore } from "app/store/theme-store";
import { useValuesVisibility } from "./values-visibility";

export type CardTrend = "up" | "down" | "flat";
export type TrendPolarity = "higher-is-better" | "lower-is-better";

type CardVariant =
  | "Default"
  | "gastos"
  | "metas"
  | "transacoes"
  | "Variant5"
  | "Variant6"
  | "Variant7"
  | "Variant8";

export function getTrendBadgeTone(
  trend: CardTrend | undefined,
  polarity: TrendPolarity,
  hasComparableValue: boolean,
) {
  if (!hasComparableValue || !trend) {
    return {
      backgroundColor:
        "color-mix(in srgb, var(--text-description-60) 15%, transparent)",
      color: "var(--text-description-60)",
    };
  }
  if (trend === "flat") {
    return {
      backgroundColor: "var(--color-warning-10)",
      color: "var(--color-warning)",
    };
  }
  return (trend === "up") === (polarity === "higher-is-better")
    ? {
        backgroundColor: "var(--color-success-10)",
        color: "var(--color-success)",
      }
    : {
        backgroundColor:
          "color-mix(in srgb, var(--color-danger-300) 10%, transparent)",
        color: "var(--color-danger-300)",
      };
}

type CardViewsProps = {
  className?: string;
  property1?: CardVariant;
  chartData?: number[];
  /** Overrides opcionais — permitem reutilizar o card com outros dados */
  title?: string;
  value?: string;
  change?: string;
  comparison?: string;
  color?: CardColor;
  chartLabel?: string;
  /** Rótulos por ponto do gráfico (ex. datas) para o tooltip. */
  chartLabels?: string[];
  /** Direção da variação — controla a seta do badge e do ícone */
  trend?: CardTrend;
  /** Determina se subir ou descer representa uma variação favorável. */
  trendPolarity?: TrendPolarity;
};

export type CardColor = "blue" | "green" | "red" | "yellow";

const COLORS: Record<CardColor, { accent: string; soft: string }> = {
  blue: {
    accent: "var(--color-primary-300)",
    soft: "color-mix(in srgb, var(--color-primary-300) 10%, transparent)",
  },
  green: { accent: "var(--color-success)", soft: "var(--color-success-10)" },
  red: {
    accent: "var(--color-danger-300)",
    soft: "color-mix(in srgb, var(--color-danger-300) 10%, transparent)",
  },
  yellow: { accent: "var(--color-warning)", soft: "var(--color-warning-10)" },
};

const LARGE_CARDS: Record<
  "Default" | "Variant6" | "Variant7" | "Variant8",
  {
    title: string;
    value: string;
    change: string;
    comparison: string;
    color: CardColor;
    trend: CardTrend;
    data: number[];
  }
> = {
  Default: {
    title: "Entradas",
    value: "3.120.000,00 Kz",
    change: "18%",
    comparison: "vs Mês anterior",
    color: "green",
    trend: "up",
    data: [
      2_100_000, 2_300_000, 2_180_000, 2_420_000, 2_300_000, 2_760_000,
      3_120_000,
    ],
  },
  Variant6: {
    title: "Gastos",
    value: "3.120.000,00 Kz",
    change: "5%",
    comparison: "vs Mês anterior",
    color: "red",
    trend: "down",
    data: [
      2_560_000, 2_700_000, 2_590_000, 2_820_000, 2_740_000, 2_940_000,
      3_120_000,
    ],
  },
  Variant7: {
    title: "Património",
    value: "3.120.000,00 Kz",
    change: "12,4%",
    comparison: "vs Abril",
    color: "blue",
    trend: "up",
    data: [
      2_480_000, 2_560_000, 2_470_000, 2_720_000, 2_680_000, 2_940_000,
      3_120_000,
    ],
  },
  Variant8: {
    title: "Saldo do mês",
    value: "-4.320.000,00 Kz",
    change: "22,1%",
    comparison: "vs Abril",
    color: "yellow",
    trend: "down",
    data: [
      3_400_000, 3_280_000, 3_600_000, 3_920_000, 3_640_000, 4_000_000,
      4_320_000,
    ],
  },
};

const SMALL_CARDS: Record<
  "Variant5" | "gastos" | "metas" | "transacoes",
  {
    title: string;
    value: string;
    change: string;
    comparison: string;
    color: CardColor;
    icon: string;
  }
> = {
  Variant5: {
    title: "Gasto",
    value: "33 120 000 Kz",
    change: "+12,4%",
    comparison: "vs Mês anterior",
    color: "green",
    icon: "↓",
  },
  gastos: {
    title: "Total de gastos",
    value: "120 000 Kz",
    change: "+12,4%",
    comparison: "vs Mês anterior",
    color: "red",
    icon: "↑",
  },
  metas: {
    title: "Total de metas",
    value: "3",
    change: "59%",
    comparison: "Progresso médio",
    color: "blue",
    icon: "◎",
  },
  transacoes: {
    title: "Total de transações",
    value: "14",
    change: "+9%",
    comparison: "vs Junho",
    color: "yellow",
    icon: "⇄",
  },
};

export function MiniChart({
  color,
  data,
  labels,
}: {
  color: CardColor;
  data: number[];
  /** Rótulos do eixo X (ex. datas curtas) — usados no título do tooltip. */
  labels?: string[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tipTitleRef = useRef<HTMLSpanElement>(null);
  const tipBodyRef = useRef<HTMLSpanElement>(null);
  const tipCaretRef = useRef<HTMLSpanElement>(null);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { accent: accentToken } = COLORS[color];
    // Lê o valor atual do token CSS — chamado no render do tooltip,
    // por isso acompanha sempre o tema ativo sem precisar de refresh.
    const getTokenLive = (token: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    const accent = getTokenLive(accentToken.slice(4, -1));
    if (!accent) return;
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `${accent}2e`);
    gradient.addColorStop(1, `${accent}00`);

    // Tooltip externo em HTML — igual ao mobile: caixa flutuante ACIMA do
    // ponto (com 10px de respiro + caret a apontar ao ponto), em vez do
    // tooltip do canvas que, num gráfico de 44–60px, acaba centrado em cima
    // do ponto por falta de espaço.
    const TIP_W = 132;
    const TIP_GAP = 10;
    const renderExternalTip = (tip: {
      opacity: number;
      caretX?: number;
      caretY?: number;
      dataPoints?: readonly { label?: unknown; raw?: unknown }[];
    }) => {
      const el = tipRef.current;
      if (!el) return;
      if (tip.opacity === 0 || !tip.dataPoints?.length) {
        el.style.opacity = "0";
        return;
      }
      const point = tip.dataPoints[0];
      const title =
        labels?.length && point.label !== undefined
          ? String(point.label ?? "").trim() || "Valor"
          : "Valor";
      const body =
        typeof point.raw === "number"
          ? formatAOACompact(point.raw)
          : String(point.raw);
      if (tipTitleRef.current) tipTitleRef.current.textContent = title;
      if (tipBodyRef.current) tipBodyRef.current.textContent = body;
      const wrapW = canvas.clientWidth || canvas.width || TIP_W;
      const canvasH = canvas.clientHeight || canvas.height || 0;
      const caretX = tip.caretX ?? 0;
      const caretY = tip.caretY ?? 0;
      const left = Math.max(
        4,
        Math.min(wrapW - TIP_W - 4, caretX - TIP_W / 2),
      );
      el.style.width = `${TIP_W}px`;
      el.style.left = `${left}px`;
      el.style.bottom = `${canvasH - caretY + TIP_GAP}px`;
      if (tipCaretRef.current) {
        const caretLeft = Math.min(
          Math.max(caretX - left - 6, 8),
          TIP_W - 20,
        );
        tipCaretRef.current.style.left = `${caretLeft}px`;
      }
      el.style.opacity = "1";
    };

    const chart = new Chart(context, {
      type: "line",
      data: {
        labels: labels?.length ? labels : data.map((_, index) => String(index + 1)),
        datasets: [
          {
            data,
            borderColor: accent,
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHitRadius: 8,
            pointBackgroundColor: accent,
            pointBorderColor: () => getTokenLive("--background") || "#ffffff",
            pointBorderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 450, easing: "easeOutQuart" },
        // Igual ao mobile: qualquer posição ao longo do X mostra o ponto
        // mais próximo (lá é o toque; aqui é o hover).
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: (context) => renderExternalTip(context.tooltip),
          },
        },
        layout: { padding: { top: 4, right: 0, bottom: 0, left: 0 } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });

    return () => chart.destroy();
  }, [color, data, labels, theme]);

  return (
    <div ref={wrapRef} className="relative block h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Tooltip flutuante — mesmo visual do mobile */}
      <div
        ref={tipRef}
        className="pointer-events-none absolute z-10 opacity-0 transition-opacity duration-150"
      >
        <div
          className="flex flex-col gap-0.5 rounded-lg border p-2"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border-card)",
            boxShadow: "0 4px 8px rgba(15, 23, 42, 0.08)",
          }}
        >
          <span
            ref={tipTitleRef}
            className="block truncate font-manrope text-xs font-bold leading-4"
            style={{ color: "var(--text-title)" }}
          />
          <span
            ref={tipBodyRef}
            className="block truncate font-inter text-xs leading-4"
            style={{ color: "var(--text-description-60)" }}
          />
        </div>
        <span
          ref={tipCaretRef}
          aria-hidden="true"
          className="absolute -bottom-[5px] size-3 rotate-45 border-b border-r"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border-card)",
          }}
        />
      </div>
    </div>
  );
}

function LargeCard({
  config,
  chartData,
  chartLabels,
  property1,
  className,
  chartLabel,
  trendPolarity = "higher-is-better",
}: {
  config: (typeof LARGE_CARDS)["Variant7"];
  chartData: number[];
  chartLabels?: string[];
  property1: CardVariant;
  className?: string;
  chartLabel?: string;
  trendPolarity?: TrendPolarity;
}) {
  const colors = COLORS[config.color];
  const trend: CardTrend = config.trend ?? "up";
  const BadgeIcon = trend === "down" ? ArrowDown : trend === "flat" ? Equal : ArrowUp;
  // Seta do quadrado é estática por métrica: Entradas ↓, Gastos ↑,
  // Saldo =, Património Wallet. Só a seta do badge varia com os dados.
  const MetricIcon =
    property1 === "Variant6"
      ? ArrowUp
      : property1 === "Variant8"
        ? Equal
        : ArrowDown;
  // "—" = sem base de comparação: badge neutro, sem seta, para não se
  // confundir com uma percentagem e para não deixar buraco no layout.
  const isNeutralChange = config.change === "—";
  const badgeTone = getTrendBadgeTone(
    trend,
    trendPolarity,
    Boolean(config.change) && !isNeutralChange,
  );

  return (
    <article
      className={[
        "relative flex w-full min-w-0 flex-col items-center justify-between overflow-hidden rounded-xl border border-(--card-barras) bg-(--bg-card)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-node-id="2234:20387"
      data-property={property1}
    >
      <div
        className="box-border flex w-full flex-1 flex-col items-center p-6"
      >
        <div className="flex w-full flex-1 flex-col items-start justify-center">
          <div className="flex w-full items-start gap-3">
            <div
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                config.color === "blue"
                  ? "border border-(--border-button)"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ backgroundColor: colors.soft, color: colors.accent }}
            >
              {property1 === "Variant7" ? (
                <Wallet size={20} strokeWidth={2} aria-hidden />
              ) : (
                <MetricIcon size={20} strokeWidth={2.5} aria-hidden />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
              <div className="flex w-full min-w-0 flex-col items-start gap-1 text-(--text-title)">
                <p className="w-full truncate font-manrope text-sm font-medium leading-5">
                  {config.title}
                </p>
                <p className="w-full truncate font-inter text-xl font-extrabold leading-8">
                  {config.value}
                </p>
              </div>
              <div className="flex w-full min-w-0 items-center justify-start gap-2">
                {config.change && (
                  <div
                    className="flex min-w-20 shrink-0 items-center justify-center gap-1 rounded-full px-2 py-1"
                    style={badgeTone}
                  >
                    {isNeutralChange ? null : (
                      <BadgeIcon size={20} strokeWidth={2.5} aria-hidden />
                    )}
                    <span className="font-inter text-sm font-bold leading-none whitespace-nowrap">
                      {config.change}
                    </span>
                  </div>
                )}
                <p className="min-w-0 shrink truncate font-manrope text-xs font-semibold leading-none text-(--text-description-60)">
                  {config.comparison}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative h-15 w-full shrink-0"
        role="img"
        aria-label={chartLabel ?? `Evolução de ${config.title.toLowerCase()}`}
      >
        <MiniChart color={config.color} data={chartData} labels={chartLabels} />
      </div>
    </article>
  );
}

function SmallCard({
  config,
  property1,
  className,
  change,
  comparison,
  trend,
  trendPolarity = "higher-is-better",
}: {
  config: (typeof SMALL_CARDS)["Variant5"];
  property1: CardVariant;
  className?: string;
  change?: string;
  comparison?: string;
  trend?: CardTrend;
  trendPolarity?: TrendPolarity;
}) {
  const colors = COLORS[config.color];
  const changeValue = change ?? config.change;
  const numericChange = Number(
    changeValue.replace("%", "").replace(/\s/g, "").replace(",", "."),
  );
  const activeTrend =
    trend ??
    (Number.isFinite(numericChange)
      ? numericChange > 0
        ? "up"
        : numericChange < 0
          ? "down"
          : "flat"
      : undefined);
  const isNeutralChange = changeValue === "—";
  const badgeTone = getTrendBadgeTone(
    activeTrend,
    trendPolarity,
    !isNeutralChange && Number.isFinite(numericChange),
  );
  const BadgeIcon =
    activeTrend === "down"
      ? ArrowDown
      : activeTrend === "flat"
        ? Equal
        : ArrowUp;

  return (
    <article
      className={[
        "relative flex w-full min-w-0 flex-col gap-3 rounded-xl border border-(--card-barras) bg-(--bg-card) p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-node-id="2234:20387"
      data-property={property1}
    >
      <div className="flex h-full items-start justify-between gap-6">
        <div className="flex h-full min-w-0 flex-1 flex-col items-start justify-between">
          <p className="w-full truncate font-manrope text-base font-semibold leading-none text-(--text-title)">
            {config.title}
          </p>
          <p className="w-full truncate font-inter text-3xl font-bold leading-none text-(--text-title)">
            {config.value}
          </p>
          <div className="flex w-full min-w-0 items-center gap-2">
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-xl px-2 py-1 text-sm font-semibold leading-none"
              style={badgeTone}
            >
              {activeTrend && !isNeutralChange && (
                <BadgeIcon size={16} strokeWidth={2.5} aria-hidden />
              )}
              {change ?? config.change}
            </span>
            <span className="min-w-0 flex-1 truncate font-manrope text-sm font-medium leading-none text-(--text-title)">
              {comparison ?? config.comparison}
            </span>
          </div>
        </div>
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
          style={{ backgroundColor: colors.soft, color: colors.accent }}
        >
          {config.icon}
        </div>
      </div>
    </article>
  );
}

export default function CardViews({
  className,
  property1 = "metas",
  chartData,
  title,
  value,
  change,
  trend,
  trendPolarity,
  comparison,
  color,
  chartLabel,
  chartLabels,
}: CardViewsProps) {
  const { mask } = useValuesVisibility();
  const effectiveTrendPolarity =
    trendPolarity ??
    (property1 === "Variant6" ||
    property1 === "gastos" ||
    property1 === "transacoes"
      ? "lower-is-better"
      : "higher-is-better");
  if (property1 in SMALL_CARDS) {
    return (
      <SmallCard
        config={SMALL_CARDS[property1 as keyof typeof SMALL_CARDS]}
        property1={property1}
        className={className}
        change={change}
        comparison={comparison}
        trend={trend}
        trendPolarity={effectiveTrendPolarity}
      />
    );
  }

  const base =
    LARGE_CARDS[property1 as keyof typeof LARGE_CARDS] ?? LARGE_CARDS.Variant7;
  const config = {
    ...base,
    ...(title !== undefined ? { title } : null),
    ...(value !== undefined ? { value: mask(value) } : null),
    ...(change !== undefined ? { change } : null),
    ...(comparison !== undefined ? { comparison } : null),
    ...(color !== undefined ? { color } : null),
    ...(trend !== undefined ? { trend } : null),
  };

  return (
    <LargeCard
      config={config}
      chartData={chartData ?? config.data}
      chartLabels={chartLabels}
      property1={property1}
      className={className}
      chartLabel={chartLabel}
      trendPolarity={effectiveTrendPolarity}
    />
  );
}
