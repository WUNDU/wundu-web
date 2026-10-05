"use client";

import { useState } from "react";
import ChartCard from "./ChartCard";
import {
  equityFullDay,
  equityLabels,
  equityPeriods,
  equitySeries,
  type EquityPeriod,
} from "../mock/analysis";
import { formatAOACompact } from "../../utils/format-AOA";
import { useMeasure } from "../../utils/use-measure";
import ChartTooltip from "./ChartTooltip";

/*
 * Geometria extraída do SVG do Figma (viewBox 802×545, card 796×537).
 * Y verbatim; X em espaço 796 escalado à largura medida (sem distorção:
 * alturas, traços e fontes ficam sempre 1:1).
 */
const DESIGN_W = 796;
const VIEW_Y = 120;
const VIEW_H = 380;
const GRID_Y = [142.633, 202.633, 262.633, 322.633, 382.633, 449.109];
const GRID_X0 = 25.5;
const GRID_X1 = 740.5;
const Y_TOP = 142.633;
const Y_BOT = 449.109;
const Y_LABELS = ["5k", "4k", "3k", "2k", "1k", "0"];
const LINE_X0 = 27.0898;
const LINE_X1 = 740.09;
const LINE_D =
  "M27.0898 298.265C35.5009 297.768 55.2906 290.783 67.1605 266.819C81.9979 236.864 119.604 239.497 132.139 278.34C144.674 317.183 161.046 349.113 188.163 312.903C215.28 276.694 217.751 281.299 241.118 272.086C264.711 262.783 265.252 231.488 282.043 209.883C291.764 197.374 315.05 192.425 338.586 230.61C362.122 268.794 384.634 255.956 406.378 227.647C428.123 199.338 458.566 222.38 468.799 232.256C479.032 242.131 491.267 245.196 510.242 241.472C533.882 236.834 543.754 249.702 552.708 270.111C561.662 290.52 580.592 286.899 592.616 285.253C604.64 283.607 624.082 286.899 635.082 297.432C646.082 307.966 673.455 342.858 691.619 287.886C706.149 243.908 729.987 224.119 740.09 219.722";
const AREA_D =
  "M66.2729 267.066C54.3697 291.042 34.5245 298.031 26.0898 298.528V448.758H741.09V219.945C730.959 224.345 707.054 244.144 692.483 288.144C674.268 343.144 646.819 308.234 635.788 297.695C624.756 287.156 605.26 283.862 593.202 285.509C581.145 287.156 562.161 290.779 553.182 270.359C544.203 249.94 535.139 236.662 510.597 241.706C488.791 242.694 479.299 242.365 469.038 232.485C458.776 222.604 428.248 199.55 406.442 227.874C384.637 256.198 362.061 269.042 338.46 230.838C314.858 192.634 289.717 197.245 279.969 209.76C270.221 222.275 263.801 260.424 240.31 271.637C220.346 276.731 208.683 285.107 187.615 313.174C160.422 349.402 144.004 317.455 131.433 278.593C118.863 239.73 81.1519 237.096 66.2729 267.066Z";
const VLINE = { x: 500.724, y1: 239.266, y2: 448.156 };
const DOT = { x: 500.332, y: 238.267 };
const X_LABEL_Y = 478;
const TIP_W = 112;
const TIP_H = 64;

function valueToY(value: number): number {
  return Y_BOT - (value / 5000) * (Y_BOT - Y_TOP);
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

export default function EquityChart() {
  const [period, setPeriod] = useState<EquityPeriod>("Semanal");
  const [hovered, setHovered] = useState<number | null>(null);
  const [wrapRef, measured] = useMeasure<HTMLDivElement>();

  const plotW = measured || DESIGN_W;
  const sx = plotW / DESIGN_W;
  const X = (x: number) => x * sx;

  const labels = equityLabels[period];
  const series = equitySeries[period];
  const isWeekly = period === "Semanal";
  /* Ponto inicial = período atual (hoje): dia da semana, semana do mês ou mês */
  const now = new Date();
  const currentIdx =
    period === "Semanal"
      ? (now.getDay() + 6) % 7
      : period === "Mensal"
        ? Math.min(labels.length - 1, Math.floor((now.getDate() - 1) / 7))
        : Math.min(labels.length - 1, now.getMonth());
  const activeIdx = hovered ?? currentIdx;

  const slotX = (i: number) =>
    LINE_X0 + (i * (LINE_X1 - LINE_X0)) / Math.max(1, labels.length - 1);
  const pts = series.map((v, i) => ({ x: slotX(i), y: valueToY(v) }));
  const active = { x: slotX(activeIdx), y: valueToY(series[activeIdx]) };
  /* Caixa à direita do ponto (como no Figma); inverte se estourar.
     Gap constante em px: divide pelo fator de escala horizontal. */
  const dotGap = 21 / sx;
  const tipRight = active.x + dotGap + TIP_W <= DESIGN_W;
  const tipBoxX = tipRight ? active.x + dotGap : active.x - dotGap - TIP_W;
  const tipBoxY = Math.max(VIEW_Y + 2, active.y - TIP_H / 2);
  /* Centro em px de ecrã: escala primeiro, soma metade da caixa depois */
  const tipCX = X(tipBoxX) + TIP_W / 2;
  const tipLabel =
    equityFullDay[labels[activeIdx]] ?? labels[activeIdx];

  return (
    <ChartCard
      title="Evolução do património"
      description="Acompanhamento do teu património líquido."
      contentGapClass="gap-6"
      actions={
        <div
          role="group"
          aria-label="Período do gráfico"
          className="flex h-12 w-60 items-center justify-between rounded-2xl border border-(--card-barras) bg-(--background-variant) p-1"
        >
          {equityPeriods.map((option) => {
            const isActive = option === period;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setPeriod(option);
                  setHovered(null);
                }}
                aria-pressed={isActive}
                className={`rounded-xl px-3.5 py-2.5 text-center font-manrope text-sm leading-5 text-(--text-title) ${
                  isActive
                    ? "w-20 border border-(--card-barras) bg-(--background) font-semibold"
                    : "flex-1 border border-transparent font-normal"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      }
    >
      <div ref={wrapRef} className="w-full">
        <svg
          viewBox={`0 ${VIEW_Y} ${plotW} ${VIEW_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Evolução do património no período ${period.toLowerCase()}`}
        >
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                style={{ stopColor: "var(--color-primary-300)" }}
                stopOpacity={0.4}
              />
              <stop
                offset="0.46679"
                style={{ stopColor: "var(--color-primary-300)" }}
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                style={{ stopColor: "var(--color-primary-300)" }}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* Grelha horizontal */}
          {GRID_Y.map((y) => (
            <line
              key={y}
              x1={X(GRID_X0)}
              x2={X(GRID_X1)}
              y1={y}
              y2={y}
              strokeWidth={1}
              style={{ stroke: "var(--card-barras)" }}
            />
          ))}

          {/* Rótulos do eixo Y (à direita) */}
          {GRID_Y.map((y, i) => (
            <text
              key={y}
              x={X(786)}
              y={y + 5}
              textAnchor="end"
              fontFamily="Manrope, sans-serif"
              fontSize={12}
              fontWeight={700}
              style={{ fill: "var(--text-title)" }}
            >
              {Y_LABELS[i]}
            </text>
          ))}

          {/* Área + linha (paths exatos do Figma no Semanal) */}
          {isWeekly ? (
            <g transform={`scale(${sx} 1)`}>
              <path d={AREA_D} fill="url(#equityFill)" />
              <path
                d={LINE_D}
                fill="none"
                stroke="#053DC4"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ) : (
            <>
              <path
                d={`${smoothPath(pts.map((p) => ({ x: X(p.x), y: p.y })))} L ${X(pts[pts.length - 1].x)} ${Y_BOT} L ${X(pts[0].x)} ${Y_BOT} Z`}
                fill="url(#equityFill)"
              />
              <path
                d={smoothPath(pts.map((p) => ({ x: X(p.x), y: p.y })))}
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                style={{ stroke: "var(--color-primary-300)" }}
              />
            </>
          )}

          {/* Marcador vertical + ponto ativo */}
          <line
            x1={X(active.x)}
            x2={X(active.x)}
            y1={isWeekly && activeIdx === 4 ? VLINE.y1 : active.y}
            y2={VLINE.y2}
            strokeWidth={2}
            style={{ stroke: "var(--color-primary-300)" }}
          />
          <circle
            cx={X(active.x)}
            cy={active.y}
            r={isWeekly && activeIdx === 4 ? 9.447 : 10}
            style={{ fill: "var(--color-primary-300)" }}
          />
          <circle
            cx={X(active.x)}
            cy={active.y}
            r={isWeekly && activeIdx === 4 ? 8.447 : 9}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
          />

          {/* Rótulos do eixo X */}
          {labels.map((label, i) => (
            <text
              key={`${label}-${i}`}
              x={X(pts[i].x)}
              y={X_LABEL_Y}
              textAnchor={
                i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"
              }
              fontFamily="Manrope, sans-serif"
              fontSize={12}
              fontWeight={700}
              style={{ fill: "var(--text-title)" }}
            >
              {label}
            </text>
          ))}

          {/* Tooltip w-28 h-16: dia em cima, valor em baixo */}
          <g pointerEvents="none">
            <ChartTooltip
              x={X(tipBoxX)}
              y={tipBoxY}
              w={TIP_W}
              h={TIP_H}
              rx={8}
              tail={tipRight ? "left" : "right"}
              tailPos={active.y}
              stroke="var(--border-card)"
            />
            <text
              x={tipCX}
              y={tipBoxY + 28}
              textAnchor="middle"
              fontFamily="Manrope, sans-serif"
              fontSize={12}
              fontWeight={400}
              style={{ fill: "var(--text-description-60)" }}
            >
              {tipLabel}
            </text>
            <text
              x={tipCX}
              y={tipBoxY + 48}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fontWeight={700}
              style={{ fill: "var(--text)" }}
            >
              {formatAOACompact(series[activeIdx])}
            </text>
          </g>

          {/* Zonas de hover */}
          {labels.map((label, i) => (
            <g
              key={`hit-${label}-${i}`}
              tabIndex={0}
              role="img"
              aria-label={`${label}: ${formatAOACompact(series[i])}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              style={{ outline: "none", cursor: "default" }}
            >
              <title>{`${label}: ${formatAOACompact(series[i])}`}</title>
              <rect
                x={X(pts[i].x) - (X(slotX(1)) - X(slotX(0))) / 2}
                y={VIEW_Y}
                width={X(slotX(1)) - X(slotX(0))}
                height={Y_BOT - VIEW_Y}
                fill="transparent"
              />
            </g>
          ))}
        </svg>
      </div>
    </ChartCard>
  );
}
