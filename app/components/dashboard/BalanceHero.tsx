"use client";

import { ArrowDown, ArrowUp, Equal, Eye, EyeOff } from "lucide-react";
import type { CardTrend } from "./CardViews";
import { useValuesVisibility } from "./values-visibility";

type BalanceHeroProps = {
  amount: number;
  value: string;
  change: string;
  trend?: CardTrend;
  comparison: string;
  loading: boolean;
  className?: string;
};

export default function BalanceHero({
  amount,
  value,
  change,
  trend,
  comparison,
  loading,
  className,
}: BalanceHeroProps) {
  const { hidden: masked, toggle } = useValuesVisibility();
  const TrendIcon =
    trend === "down" ? ArrowDown : trend === "flat" ? Equal : ArrowUp;
  const negative = !loading && amount < 0;

  return (
    <section
      aria-label="Saldo disponível"
      className={[
        negative
          ? "flex w-full min-w-0 flex-col items-start gap-1 rounded-xl bg-[linear-gradient(90deg,var(--color-danger-500)_20%,var(--color-danger-300)_100%)] p-6"
          : "flex w-full min-w-0 flex-col items-start gap-1 rounded-xl bg-(--button-bg) p-6",
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
          onClick={toggle}
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
      {negative ? (
        <span className="font-manrope text-[11px] font-bold leading-4 text-white/85">
          Saldo negativo
        </span>
      ) : null}
      <p className="self-stretch pb-1.5 font-manrope text-3xl font-bold leading-9 text-white">
        {loading ? "A carregar…" : masked ? "••••••" : value}
      </p>
      {!loading && change ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-1">
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
