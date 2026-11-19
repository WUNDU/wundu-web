"use client";

import { useState } from "react";
import ChartCard from "./ChartCard";
import { accountShares } from "../mock/analysis";
import { formatAOACompact } from "../../utils/format-AOA";

const PERIODS = ["Mensal", "Anual"] as const;
/* Larguras 1:1 com o SVG (track 745px: 710 / 391 / 209 / 46) */
const BAR_WIDTH_PCT = [95.3, 52.48, 28.05, 6.17];
const SCALE_LABELS = ["0", "25k", "50k", "75k", "150k"];
/* Gridlines do SVG: x 212.541 / 398.082 / 583.625 da track 25–770 */
const GRID_LINES_PCT = [25.18, 50.08, 74.99];

export default function AccountsBars() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Anual");
  // Mock temporário: a série anual é a base; a mensal mostra 1/12.
  const factor = period === "Anual" ? 1 : 1 / 12;

  return (
    <ChartCard
      title="Distribuição das contas"
      description="De onde vem o teu dinheiro."
      actions={
        <div
          role="group"
          aria-label="Período da distribuição"
          className="flex h-12 w-48 items-center rounded-2xl border border-(--card-barras) bg-(--background-variant) p-1"
        >
          {PERIODS.map((option) => {
            const isActive = option === period;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                aria-pressed={isActive}
                className={`flex-1 rounded-xl px-3.5 py-2.5 text-center font-manrope text-sm leading-5 text-(--text-title) ${
                  isActive
                    ? "self-stretch border border-(--card-barras) bg-(--background) font-semibold"
                    : "border border-transparent font-normal"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 right-0"
        >
          {GRID_LINES_PCT.map((left) => (
            <span
              key={left}
              className="absolute inset-y-0 w-[1.5px]"
              style={{
                left: `${left}%`,
                background:
                  "repeating-linear-gradient(to bottom, var(--card-barras) 0 4px, transparent 4px 11px)",
              }}
            />
          ))}
        </span>
        <ul className="relative flex flex-col gap-[43px]">
          {accountShares.map((account, index) => {
          const value = Math.round(account.value * factor);
          const width = BAR_WIDTH_PCT[index] ?? 0;
          return (
            <li key={account.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <p className="min-w-0 flex-1 truncate font-manrope text-base font-bold text-(--text-title)">
                  {account.name}
                </p>
                <p
                  className={`shrink-0 font-inter text-base font-bold ${
                    account.name === "Banco Angolano de Investimento"
                      ? "text-primary-300"
                      : "text-(--text-description)"
                  }`}
                >
                  {formatAOACompact(value)}
                </p>
              </div>
              <div
                className="h-5 w-full overflow-hidden rounded-md bg-(--menu-bg-active)"
                role="img"
                aria-label={`${account.name}: ${formatAOACompact(value)}`}
              >
                <div
                  className="h-full rounded-md"
                  style={{
                    width: `${width}%`,
                    backgroundColor: `var(${account.colorVar})`,
                  }}
                />
              </div>
            </li>
          );
        })}
        </ul>
      </div>
      <div
        aria-hidden="true"
        className="flex items-center justify-between text-center font-manrope text-sm font-bold leading-5 text-(--text-title)"
      >
        {SCALE_LABELS.map((label) => (
          <span key={label} className="w-14 first:w-4 first:text-left last:w-14 last:text-right">
            {label}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}
