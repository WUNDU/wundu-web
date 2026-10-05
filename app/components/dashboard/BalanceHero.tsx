"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Equal, Eye, EyeOff } from "lucide-react";
import type { CardTrend } from "./CardViews";

type BalanceHeroProps = {
  value: string;
  change: string;
  trend?: CardTrend;
  comparison: string;
  loading: boolean;
  className?: string;
};

export default function BalanceHero({
  value,
  change,
  trend,
  comparison,
  loading,
  className,
}: BalanceHeroProps) {
  const [masked, setMasked] = useState(false);
  const TrendIcon =
    trend === "down" ? ArrowDown : trend === "flat" ? Equal : ArrowUp;

  return (
    <section
      aria-label="Saldo disponível"
      className={[
        "flex w-full min-w-0 flex-col items-start gap-[5px] rounded-2xl bg-blue-800 p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-5 items-center gap-2 self-stretch opacity-90">
        <p className="font-manrope text-sm font-normal leading-5 text-white">
          Saldo disponivel
        </p>
        <button
          type="button"
          onClick={() => setMasked((value) => !value)}
          aria-label={masked ? "Mostrar saldo" : "Ocultar saldo"}
          aria-pressed={masked}
          className="flex size-4 items-center justify-center text-white"
        >
          {masked ? (
            <EyeOff className="size-4" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Eye className="size-4" strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="self-stretch pb-1.5 font-manrope text-4xl font-bold leading-[49.30px] text-white">
        {loading ? "A carregar…" : masked ? "••••••" : value}
      </p>
      {!loading && change ? (
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/[0.16] px-2.5 py-1">
          <TrendIcon
            className="size-3 text-white"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <span className="font-manrope text-xs font-bold leading-4 text-white">
            {change} {comparison}
          </span>
        </span>
      ) : null}
    </section>
  );
}
