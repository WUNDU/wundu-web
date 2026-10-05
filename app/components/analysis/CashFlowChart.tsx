"use client";

import { useState } from "react";
import ChartCard from "./ChartCard";
import { formatAOACompact } from "../../utils/format-AOA";
import { useMeasure } from "../../utils/use-measure";

export type CashFlowData = {
  /** 12 rótulos de mês (ex. ["OUT", …, "SET"]). */
  months: string[];
  /** Totais de entradas por mês (12). */
  income: number[];
  /** Totais de gastos por mês (12). */
  expenses: number[];
};

/*
 * Geometria 1:1 com o Figma. Alturas, larguras, fontes e traços em px
 * exatos; só as posições-X espalham-se pela largura medida (sem distorção).
 */
const DESIGN_W = 794;
const PLOT_H = 384;
const BASELINE = 328;
const BAR_W = 10;
const BAR_X = [
  32.96, 96.55, 160.13, 223.72, 287.3, 350.88, 414.47, 478.06, 541.64,
  605.23, 668.81, 732.4,
];
const GRID_Y = [61.4, 112.08, 166.93, 221.11, 276.26, 336.84];
const GRID_X0 = 33.14;
const GRID_X1 = 737.85;
const Y_LABEL_X = 28;
const Y_LABEL_Y = [15.5, 65.3, 115, 169.8, 223.2, 278, 328.5];
const X_LABEL_Y = 371.4;
const MONTH_HALF = 32;
/* Afasta o plot dos rótulos do eixo Y (dots/linha tocavam nos valores) */
const PLOT_SHIFT = 12;

/** Rótulo compacto do eixo Y (ex. 6k, 500k, 2,5M). */
function axisLabel(value: number): string {
  if (value >= 1_000_000) {
    const trimmed = (value / 1_000_000).toFixed(1).replace(/,0$|\.0$/, "");
    return `${trimmed.replace(".", ",")}M`;
  }
  if (value >= 1000) {
    const trimmed = (value / 1000).toFixed(1).replace(/,0$|\.0$/, "");
    return `${trimmed.replace(".", ",")}k`;
  }
  return String(Math.round(value));
}

/** Teto "bonito" do eixo: 6 intervalos redondos sempre acima do máximo. */
function niceTop(maxValue: number): { top: number; step: number } {
  const max = Math.max(1, maxValue);
  if (max <= 6) return { top: 6, step: 1 };
  const power = 10 ** Math.floor(Math.log10(max / 6));
  for (const mult of [1, 2, 2.5, 5, 10]) {
    if (max <= 6 * mult * power) return { top: 6 * mult * power, step: mult * power };
  }
  return { top: 60 * power, step: 10 * power };
}

const pad12 = (values: number[]) =>
  Array.from({ length: 12 }, (_, i) => values[i] ?? 0);
const padMonths = (months: string[]) =>
  Array.from({ length: 12 }, (_, i) => months[i] ?? "");

function valueToY(value: number, top: number): number {
  const clamped = Math.max(0, Math.min(value, top));
  return BASELINE - (clamped / top) * BASELINE;
}

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function CashFlowChart({ months, income, expenses }: CashFlowData) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [wrapRef, measured] = useMeasure<HTMLDivElement>();
  const plotW = measured || DESIGN_W;
  const sx = (x: number) => (x / DESIGN_W) * plotW;

  const monthLabels = padMonths(months);
  const incomeValues = pad12(income);
  const expenseValues = pad12(expenses);
  const balanceValues = incomeValues.map((value, i) => value - expenseValues[i]);
  const { top, step } = niceTop(
    Math.max(...incomeValues, ...expenseValues, ...balanceValues),
  );
  const yLabels = Array.from({ length: 7 }, (_, i) =>
    axisLabel(step * (6 - i)),
  );

  const barX = BAR_X.map((x) => sx(x + PLOT_SHIFT));
  const gridX0 = sx(GRID_X0 + PLOT_SHIFT);
  const gridX1 = sx(GRID_X1 + PLOT_SHIFT);

  const incomeH = incomeValues.map((v) => (v / top) * BASELINE);
  const expenseH = expenseValues.map((v) => (v / top) * BASELINE);
  const balancePts = balanceValues.map((v, i) => ({
    x: barX[i] + BAR_W / 2,
    y: valueToY(v, top),
  }));

  const tip =
    hovered === null
      ? null
      : {
          cx: barX[hovered] + BAR_W / 2,
          cy: balancePts[hovered].y,
        };
  const tipW = 112;
  const tipH = 80;
  const tipX = tip
    ? Math.max(4, Math.min(plotW - tipW - 4, tip.cx - tipW / 2))
    : 0;
  const tipY = tip ? (tip.cy - tipH - 12 >= 0 ? tip.cy - tipH - 12 : tip.cy + 22) : 0;

  return (
    <ChartCard
      title="Fluxo financeiro"
      description="Gastos, entradas e saldo ao longo do tempo."
      contentGapClass="gap-8"
      actions={
        <div className="flex flex-wrap items-center gap-4">
          {[
            { swatch: "bg-primary-300", label: "Entradas" },
            { swatch: "bg-secondary-300", label: "Gastos" },
            { swatch: "bg-(--bg-chart-info)", label: "Saldo" },
          ].map((item) => (
            <span key={item.label} className="flex items-center justify-center gap-2.5">
              <span aria-hidden="true" className={`size-3 rounded-full ${item.swatch}`} />
              <span className="font-manrope text-sm font-semibold leading-5 text-(--text-title)">
                {item.label}
              </span>
            </span>
          ))}
        </div>
      }
    >
      <div className="w-full overflow-x-auto lg:overflow-visible">
        <div ref={wrapRef} className="w-full min-w-[560px] lg:min-w-0">
          <svg
          viewBox={`0 0 ${plotW} ${PLOT_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Gráfico de entradas e gastos por mês com linha do saldo"
        >
          {/* Grelha horizontal */}
          {GRID_Y.map((y, i) => (
            <line
              key={y}
              x1={gridX0}
              x2={gridX1}
              y1={y}
              y2={y}
              strokeWidth={1.28}
              style={{
                stroke:
                  i === GRID_Y.length - 1
                    ? "var(--card-bg-hover)"
                    : "var(--card-barras)",
              }}
            />
          ))}

          {/* Rótulos do eixo Y */}
          {yLabels.map((label, i) => (
            <text
              key={label}
              x={Y_LABEL_X}
              y={Y_LABEL_Y[i]}
              textAnchor="end"
              fontFamily="Manrope, sans-serif"
              fontSize={12}
              fontWeight={700}
              style={{ fill: "var(--text-title)" }}
            >
              {label}
            </text>
          ))}

          {/* Rótulos dos meses */}
          {monthLabels.map((month, i) => (
            <text
              key={`${month}-${i}`}
              x={barX[i] + BAR_W / 2}
              y={X_LABEL_Y}
              textAnchor="middle"
              fontFamily="Manrope, sans-serif"
              fontSize={12}
              fontWeight={700}
              style={{ fill: "var(--text-title)" }}
            >
              {month}
            </text>
          ))}

          {/* Barras de entradas (ancoradas ao topo) */}
          {incomeH.map((h, i) => (
            <rect
              key={`in-${i}`}
              x={barX[i]}
              y={0}
              width={BAR_W}
              height={h}
              rx={5}
              style={{ fill: "var(--color-primary-300)" }}
            />
          ))}

          {/* Barras de gastos (ancoradas à base) */}
          {expenseH.map((h, i) => (
            <rect
              key={`out-${i}`}
              x={barX[i]}
              y={BASELINE - h}
              width={BAR_W}
              height={h}
              rx={5}
              style={{ fill: "var(--color-secondary-300)" }}
            />
          ))}

          {/* Linha do saldo */}
          <path
            d={smoothPath(balancePts)}
            fill="none"
            strokeWidth={3.43}
            strokeLinecap="round"
            style={{ stroke: "var(--bg-chart-info)" }}
          />

          {/* Pontos do saldo */}
          {balancePts.map((pt, i) => (
            <circle
              key={`pt-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={10}
              style={{
                fill: "var(--bg-chart-info)",
                stroke: "var(--background)",
                strokeWidth: 1.71,
              }}
            />
          ))}

          {/* Zonas de hover por mês */}
          {monthLabels.map((month, i) => (
            <g
              key={`hit-${month}-${i}`}
              tabIndex={0}
              role="img"
              aria-label={`${month}: entradas ${formatAOACompact(incomeValues[i])}, gastos ${formatAOACompact(expenseValues[i])}, saldo ${formatAOACompact(balanceValues[i])}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              style={{ outline: "none", cursor: "default" }}
            >
              <title>
                {`${month}: ${formatAOACompact(incomeValues[i])} / ${formatAOACompact(expenseValues[i])} / ${formatAOACompact(balanceValues[i])}`}
              </title>
              <rect
                x={barX[i] + BAR_W / 2 - MONTH_HALF}
                y={0}
                width={MONTH_HALF * 2}
                height={344}
                fill="transparent"
              />
            </g>
          ))}

          {/* Tooltip */}
          {tip !== null && hovered !== null && (
            <g pointerEvents="none">
              <rect
                x={tipX}
                y={tipY}
                width={tipW}
                height={tipH}
                rx={12}
                style={{
                  fill: "var(--background)",
                  stroke: "var(--border-card)",
                  strokeWidth: 0.86,
                }}
              />
              {[
                { color: "var(--color-primary-300)", value: incomeValues[hovered] },
                { color: "var(--color-secondary-300)", value: expenseValues[hovered] },
                { color: "var(--foreground)", value: balanceValues[hovered] },
              ].map((row, r) => (
                <g key={r}>
                  <circle
                    cx={tipX + 14}
                    cy={tipY + 16 + r * 22}
                    r={4}
                    style={{ fill: row.color }}
                  />
                  <text
                    x={tipX + 26}
                    y={tipY + 21 + r * 22}
                    fontFamily="Inter, sans-serif"
                    fontSize={12}
                    fontWeight={700}
                    style={{ fill: "var(--text-title)" }}
                  >
                    {formatAOACompact(row.value)}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>
        </div>
      </div>
    </ChartCard>
  );
}
