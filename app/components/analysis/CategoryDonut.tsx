"use client";

import { useState } from "react";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import type { CategorySlice } from "../mock/analysis";
import { formatAOACompact } from "../../utils/format-AOA";

const SIZE = 272;
const CENTER = SIZE / 2;
const RING_WIDTH = 32;
const RADIUS = 115;
const CIRC = 2 * Math.PI * RADIUS;
const SEG_GAP = 4;
const TIP_W = 160;
const TIP_H = 32;

export default function CategoryDonut({
  data = [],
}: {
  data?: CategorySlice[];
}) {
  const expenseCategories = data;
  const [hovered, setHovered] = useState<number | null>(null);
  const total = expenseCategories.reduce((sum, item) => sum + item.value, 0);

  if (expenseCategories.length === 0) {
    return (
      <ChartCard
        title="Gastos por categoria"
        description="Onde o teu dinheiro foi gasto."
      >
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="font-manrope text-base font-semibold text-(--text-title)">
            Sem gastos no período
          </p>
          <p className="font-manrope text-sm text-(--text-description)">
            Regista despesas para veres a distribuição por categoria.
          </p>
        </div>
      </ChartCard>
    );
  }

  let acc = 0;
  const segments = expenseCategories.map((item, index) => {
    const frac = item.value / total;
    const len = Math.max(0, frac * CIRC - SEG_GAP);
    const seg = {
      ...item,
      index,
      frac,
      pct: Math.round(frac * 100),
      dash: `${len} ${CIRC - len}`,
      rotate: acc * 360 - 90,
      midAngle: ((acc + frac / 2) * 360 - 90) * (Math.PI / 180),
    };
    acc += frac;
    return seg;
  });

  const tip = hovered === null ? null : segments[hovered];
  /* Caixa fora do anel, com a seta a apontar ao segmento */
  const tipDirX = tip ? Math.cos(tip.midAngle) : 0;
  const tipDirY = tip ? Math.sin(tip.midAngle) : 0;
  const tipRingX = CENTER + tipDirX * RADIUS;
  const tipRingY = CENTER + tipDirY * RADIUS;
  const tipDist = RADIUS + 62;
  const tipX = tip
    ? Math.max(4, Math.min(SIZE - 4 - TIP_W, CENTER + tipDirX * tipDist - TIP_W / 2))
    : 0;
  const tipY = tip
    ? Math.max(4, Math.min(SIZE - 4 - TIP_H, CENTER + tipDirY * tipDist - TIP_H / 2))
    : 0;
  const tipSide =
    Math.abs(tipDirY) > Math.abs(tipDirX)
      ? tipDirY < 0
        ? ("bottom" as const)
        : ("top" as const)
      : tipDirX < 0
        ? ("right" as const)
        : ("left" as const);
  const tipTailPos =
    tipSide === "bottom" || tipSide === "top" ? tipRingX : tipRingY;

  return (
    <ChartCard
      title="Gastos por categoria"
      description="Onde o teu dinheiro foi gasto."
    >
      <div className="flex flex-col items-center justify-center gap-8 px-4 sm:flex-row">
        <div
          className="relative aspect-square w-full max-w-72 shrink-0"
          role="img"
          aria-label={`Distribuição dos gastos por categoria, total ${formatAOACompact(total)}`}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-full w-full">
            {segments.map((seg) => (
              <g
                key={seg.name}
                tabIndex={0}
                role="img"
                aria-label={`${seg.name}: ${seg.pct}% (${formatAOACompact(seg.value)})`}
                onMouseEnter={() => setHovered(seg.index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(seg.index)}
                onBlur={() => setHovered(null)}
                style={{ outline: "none", cursor: "default" }}
              >
                <title>{`${seg.name}: ${seg.pct}%`}</title>
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  strokeWidth={hovered === seg.index ? RING_WIDTH + 4 : RING_WIDTH}
                  strokeDasharray={seg.dash}
                  transform={`rotate(${seg.rotate} ${CENTER} ${CENTER})`}
                  style={{ stroke: `var(${seg.colorVar})` }}
                />
              </g>
            ))}
            {tip && (
              <g pointerEvents="none">
                <ChartTooltip
                  x={tipX}
                  y={tipY}
                  w={TIP_W}
                  h={TIP_H}
                  rx={8}
                  tail={tipSide}
                  tailPos={tipTailPos}
                  stroke="var(--border-card)"
                />
                <text
                  x={tipX + TIP_W / 2}
                  y={tipY + 21}
                  textAnchor="middle"
                  fontFamily="Manrope, sans-serif"
                  fontSize={12}
                  fontWeight={700}
                  style={{ fill: "var(--text-title)" }}
                >
                  {`${tip.name}: ${tip.pct}%`}
                </text>
              </g>
            )}
          </svg>
          <p className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="font-inter text-2xl font-bold leading-9 text-(--text-title)">
              {formatAOACompact(total)}
            </span>
            <span className="font-manrope text-base font-medium leading-6 text-(--text-description)">
              Total
            </span>
          </p>
        </div>
        <ul className="flex max-h-64 w-full min-w-0 flex-1 flex-col items-end gap-4 overflow-y-auto pr-1 overscroll-contain">
          {expenseCategories.map((item) => (
            <li
              key={item.name}
              className="flex w-full items-center justify-between gap-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${item.colorVar})` }}
                />
                <span className="truncate font-manrope text-base font-bold text-(--text-title)">
                  {item.name}
                </span>
              </span>
              <span className="shrink-0 font-inter text-base font-bold text-(--text-description)">
                {formatAOACompact(item.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
