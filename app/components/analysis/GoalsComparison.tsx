"use client";

import { useEffect, useState } from "react";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";
import type { GoalShare } from "../mock/analysis";
import { readCssVar, useChartTheme } from "../../utils/use-chart-theme";

const SIZE = 348;
const CENTER = SIZE / 2;
/* 1:1 com o SVG até 4 metas; acima disso os anéis distribuem-se */
const BASE_RINGS = [
  { radius: 158.5, track: 10.42, progress: 17.04 },
  { radius: 129.6, track: 8.52, progress: 17.04 },
  { radius: 97, track: 8.52, progress: 28.4 },
  { radius: 63.8, track: 8.52, progress: 28.4 },
];

function ringFor(index: number, count: number) {
  if (count <= BASE_RINGS.length)
    return BASE_RINGS[index] ?? BASE_RINGS[BASE_RINGS.length - 1];
  const step = (158.5 - 40) / Math.max(1, count - 1);
  return {
    radius: 158.5 - index * step,
    track: index === 0 ? 10.42 : 8.52,
    progress: [17.04, 17.04, 28.4, 28.4][index % 4],
  };
}
const TRACK_FALLBACK = "rgba(98, 116, 142, 0.3)";

export default function GoalsComparison({
  shares = [],
}: {
  shares?: GoalShare[];
}) {
  const goalShares = shares;
  const theme = useChartTheme();
  const [track, setTrack] = useState(TRACK_FALLBACK);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setTrack(readCssVar("--card-barras") || TRACK_FALLBACK);
  }, [theme]);
  const average =
    goalShares.length === 0
      ? 0
      : Math.round(
          goalShares.reduce((sum, goal) => sum + goal.progress, 0) /
            goalShares.length,
        );

  if (goalShares.length === 0) {
    return (
      <ChartCard
        title="Comparativo de metas"
        description="Comparação entre metas"
      >
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center">
          <p className="font-manrope text-base font-semibold text-(--text-title)">
            Sem metas no período
          </p>
          <p className="font-manrope text-sm text-(--text-description)">
            Cria uma meta para acompanhares o progresso aqui.
          </p>
        </div>
      </ChartCard>
    );
  }

  /* Tooltip no arco da meta em hover */
  const tipGoal = hovered === null ? null : goalShares[hovered];
  const tipRing =
    hovered === null ? null : ringFor(hovered, goalShares.length);
  let tipBox: {
    x: number;
    y: number;
    w: number;
    side: "top" | "bottom";
    pos: number;
  } | null = null;
  if (tipGoal && tipRing) {
    const midAngle =
      ((-90 + (tipGoal.progress / 100) * 180) * Math.PI) / 180;
    const px = CENTER + tipRing.radius * Math.cos(midAngle);
    const py = CENTER + tipRing.radius * Math.sin(midAngle);
    const w = Math.max(120, Math.min(250, tipGoal.name.length * 7.6 + 28));
    const h = 64;
    const above = py - h - 20 >= 4;
    tipBox = {
      x: Math.max(4, Math.min(SIZE - 4 - w, px - w / 2)),
      y: above ? py - h - 12 : py + 12,
      w,
      side: above ? "bottom" : "top",
      pos: px,
    };
  }

  return (
    <ChartCard
      title="Comparativo de metas"
      description="Comparação entre metas"
    >
      <div className="flex flex-col items-center justify-center gap-8 px-4 sm:flex-row">
        <ul className="flex w-full min-w-0 flex-1 flex-col gap-6">
          {goalShares.map((goal, index) => (
            <li
              key={goal.name}
              className="flex cursor-default items-center gap-2"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                aria-hidden="true"
                className="size-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(${goal.colorVar})` }}
              />
              <span className="truncate font-manrope text-base font-bold text-(--text-title)">
                {goal.name}
              </span>
            </li>
          ))}
        </ul>
        <div
          className="relative aspect-square w-full max-w-80 shrink-0"
          role="img"
          aria-label={`Progresso médio das metas: ${average} por cento`}
        >
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="block h-full w-full">
            <title>{`Comparativo de metas, média ${average}%`}</title>
            {goalShares.map((goal, index) => {
              const ring = ringFor(index, goalShares.length);
              const circumference = 2 * Math.PI * ring.radius;
              const offset =
                circumference - (circumference * goal.progress) / 100;
              const isActive = hovered === index;
              return (
                <g
                  key={goal.name}
                  tabIndex={0}
                  role="img"
                  aria-label={`${goal.name}: ${goal.progress}%`}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  style={{ outline: "none", cursor: "default" }}
                >
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ring.radius}
                    fill="none"
                    stroke={track}
                    strokeWidth={ring.track}
                  />
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ring.radius}
                    fill="none"
                    strokeWidth={isActive ? ring.progress : ring.track}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                    style={{
                      stroke: `var(${goal.colorVar})`,
                      transition: "stroke-width 200ms ease",
                    }}
                  >
                    <title>{`${goal.name}: ${goal.progress}%`}</title>
                  </circle>
                </g>
              );
            })}
            {tipGoal && tipBox && (
              <g pointerEvents="none">
                <ChartTooltip
                  x={tipBox.x}
                  y={tipBox.y}
                  w={tipBox.w}
                  h={64}
                  rx={8}
                  tail={tipBox.side}
                  tailPos={tipBox.pos}
                />
                <text
                  x={tipBox.x + tipBox.w / 2}
                  y={tipBox.y + 26}
                  textAnchor="middle"
                  fontFamily="Manrope, sans-serif"
                  fontSize={12}
                  fontWeight={700}
                  style={{ fill: "var(--text-title)" }}
                >
                  {tipGoal.name.length > 28
                    ? `${tipGoal.name.slice(0, 28)}…`
                    : tipGoal.name}
                </text>
                <text
                  x={tipBox.x + tipBox.w / 2}
                  y={tipBox.y + 48}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize={12}
                  fontWeight={700}
                  style={{ fill: `var(${tipGoal.colorVar})` }}
                >
                  {tipGoal.progress}%
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </ChartCard>
  );
}
