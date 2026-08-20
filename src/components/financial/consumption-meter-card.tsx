"use client";

import type { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CoinIcon } from "@/constants/icons";
import { formatAOA } from "@/lib/currency";
import { useBalance } from "@/hooks/use-balance";

const LEVEL_TONE: Record<"GREEN" | "YELLOW" | "RED", { bar: string; text: string; chip: string }> = {
  GREEN: { bar: "bg-emerald-500", text: "text-emerald-600", chip: "bg-emerald-50" },
  YELLOW: { bar: "bg-amber-500", text: "text-amber-600", chip: "bg-amber-50" },
  RED: { bar: "bg-red-500", text: "text-red-600", chip: "bg-red-50" },
};

function monthLabel(dateStr: string): string {
  const label = new Date(`${dateStr}T00:00:00`).toLocaleDateString("pt-PT", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const ConsumptionMeterCard: FC = () => {
  const { data: balance, isLoading } = useBalance();

  if (isLoading || !balance) {
    return (
      <div className="flex w-full animate-pulse items-center gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:p-4">
        <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded bg-slate-100" />
          <div className="h-2 w-full max-w-xs rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const isDeclared = balance.referenceSource === "DECLARED";
  const level = balance.level ?? "GREEN";
  const tone = LEVEL_TONE[level];
  const rawPercent = balance.consumptionPercent ?? 0;
  const percent = Math.min(Math.max(rawPercent, 0), 100);
  const overLimit = rawPercent > 100;

  return (
    <motion.div
      className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-white/60 bg-white/80 p-3 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 hover:border-secondary/20 hover:shadow-[0_4px_14px_rgba(0,60,195,0.08)] sm:flex-row sm:items-center sm:p-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-1 items-center gap-3 min-w-0">
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
            isDeclared ? tone.chip : "bg-secondary/10"
          }`}
        >
          <CoinIcon className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${isDeclared ? tone.text : "text-secondary"}`} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold leading-tight tracking-tight tabular-nums text-slate-900 transition-colors duration-150 group-hover:text-secondary sm:text-lg">
            {formatAOA(balance.balance)} Kz
          </h3>
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[11px]">
            Saldo · {monthLabel(balance.periodStart)}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0 sm:w-[220px] lg:w-[260px]">
        {isDeclared ? (
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={`h-full rounded-full ${tone.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              />
            </div>
            <span className={`w-11 flex-shrink-0 text-right text-xs font-bold tabular-nums ${tone.text}`}>
              {overLimit ? ">100%" : `${Math.round(percent)}%`}
            </span>
          </div>
        ) : (
          <Link
            href="/home/profile"
            className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-secondary/10 px-3 py-1.5 text-[11px] font-semibold text-secondary transition-colors hover:bg-secondary/15 sm:w-auto"
          >
            Definir receita mensal
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ConsumptionMeterCard;
