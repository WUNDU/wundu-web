"use client";

import { useState } from "react";
import ChartCard from "./ChartCard";
import { formatAOACompact } from "../../utils/format-AOA";

/* Escala só com variações do primary (1:1 da base):
   0 → Colors/Primary/50, 1 → Colors/Primary/100, 2 → Colors/Primary/200,
   3 → Colors/Base/Primary, 4 → Colors/Primary/300 */
const INTENSITY_BG = [
  "bg-primary-50",
  "bg-primary-100",
  "bg-primary-200",
  "bg-(--color-primary)",
  "bg-primary-300",
] as const;

export const HEATMAP_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;
export const HEATMAP_PERIODS = ["Manhã", "Tarde", "Noite"] as const;

export type SpendingHeatData = {
  /** Intensidade 0–4 por [período][dia]. */
  heat: number[][];
  /** Valores em Kz por [período][dia]. */
  values: number[][];
};

const emptyGrid = () =>
  HEATMAP_PERIODS.map(() => HEATMAP_DAYS.map(() => 0));

export default function SpendingHeatmap({
  heat = emptyGrid(),
  values = emptyGrid(),
}: Partial<SpendingHeatData>) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  );
  return (
    <ChartCard
      title="Mapeamento de gastos"
      description="Em que dia da semana gastas mais?"
    >
      <div className="flex flex-col gap-4">
        <table className="w-full table-fixed border-separate border-spacing-x-3.5 border-spacing-y-[15px]">
          <caption className="sr-only">
            Intensidade dos gastos por período do dia e dia da semana
          </caption>
          <thead>
            <tr>
              <th scope="col" aria-label="Período do dia" className="w-20" />
              {HEATMAP_DAYS.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="pb-3 text-center font-manrope text-base font-bold text-(--text-title)"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_PERIODS.map((period, row) => (
              <tr key={period}>
                <th
                  scope="row"
                  className="py-2 pr-2 text-center font-manrope text-base font-bold text-(--text-title)"
                >
                  {period}
                </th>
                {HEATMAP_DAYS.map((day, col) => {
                  const intensity = Math.max(
                    0,
                    Math.min(4, heat[row]?.[col] ?? 0),
                  );
                  const value = values[row]?.[col] ?? 0;
                  const isActive =
                    hovered?.row === row && hovered?.col === col;
                  return (
                    <td key={day} className="p-0">
                      <span
                        role="img"
                        aria-label={`${period} de ${day}: ${formatAOACompact(value)}`}
                        tabIndex={0}
                        onMouseEnter={() => setHovered({ row, col })}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered({ row, col })}
                        onBlur={() => setHovered(null)}
                        className={`relative block h-8 rounded-lg outline-none ${INTENSITY_BG[intensity]} ${isActive ? "ring-2 ring-primary-300" : ""}`}
                      >
                        {isActive && (
                          <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-(--border-card) bg-(--background) px-3 py-2 text-center shadow-lg">
                            <span className="block font-inter text-sm font-bold leading-5 text-(--text-title)">
                              {formatAOACompact(value)}
                            </span>
                            <span className="block font-manrope text-xs font-normal leading-5 text-(--text-description-60)">
                              {day} · {period}
                            </span>
                            <span
                              aria-hidden="true"
                              className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-(--border-card) bg-(--background)"
                            />
                          </span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between gap-4 px-6">
          <p className="font-manrope text-base font-bold text-(--text-title)">
            Menos gastos
          </p>
          <span
            aria-hidden="true"
            className="h-3.5 flex-1 rounded-md bg-gradient-to-r from-primary-50 to-primary-300"
          />
          <p className="font-manrope text-base font-bold text-(--text-title)">
            Mais gastos
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
