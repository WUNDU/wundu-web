"use client";

import type { ElementType, FC } from "react";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useShallow } from "zustand/shallow";
import { FileIcon, MoneyIcon, PaymentIcon } from "@/constants/icons";
import { documentService } from "@/services/document.service";
import { useTransactionStore } from "@/store/transaction-store";
import { isExpense } from "@/utils/transaction-type";

// Session-level cache: avoids redundant API call on every home mount
let _docCountCache: { value: number; at: number } | null = null;
const DOC_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

async function getCachedDocCount(): Promise<number> {
  if (_docCountCache && Date.now() - _docCountCache.at < DOC_CACHE_TTL_MS) {
    return _docCountCache.value;
  }
  const value = await documentService.getTotalDocuments();
  _docCountCache = { value, at: Date.now() };
  return value;
}

interface StatsCardProps {
  icon: ElementType;
  value: string | number;
  label: string;
  color: string;
  iconColor: string;
  isPrimary?: boolean;
}

import { formatAOA } from "@/lib/currency";

function valueFontClass(val: string | number): string {
  const len = String(val).length;
  if (len <= 5) return "text-xl lg:text-2xl";
  if (len <= 8) return "text-lg lg:text-xl";
  if (len <= 11) return "text-base lg:text-lg";
  if (len <= 13) return "text-sm lg:text-base";
  return "text-xs lg:text-sm";
}

const StatsCard: FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
  iconColor,
  isPrimary,
}) => (
  <motion.div
    className={`group relative flex h-full min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-xl border p-3 shadow-sm transition-all duration-300 sm:min-h-[96px] sm:p-3 lg:p-4 ${
      isPrimary
        ? "border-secondary bg-secondary text-white sm:col-span-2 md:col-span-1"
        : "border-white/60 bg-white/80 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-secondary/20 hover:shadow-[0_4px_14px_rgba(0,60,195,0.08)]"
    }`}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
    whileHover={{ y: -1 }}
  >
    {/* Glass shimmer overlay for non-primary cards */}
    {!isPrimary && (
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent" />
    )}

    {isPrimary && (
      <div className="absolute right-0 top-0 p-2.5 opacity-10">
        <Icon className="h-16 w-16 -translate-y-3 translate-x-6 rotate-12 text-white" />
      </div>
    )}

    <div className="relative z-10 flex items-center justify-between">
      <div
        className={`rounded-lg p-1.5 transition-colors duration-150 sm:p-2 ${isPrimary ? "bg-white/10" : color}`}
      >
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isPrimary ? "text-primary" : iconColor}`} />
      </div>
      {!isPrimary && <span className="h-2 w-2 rounded-full bg-primary" />}
    </div>

    <div className="relative z-10">
      <h3
        className={`mb-0.5 font-bold tracking-tight transition-all duration-150 sm:mb-1 leading-tight tabular-nums ${valueFontClass(value)} ${
          isPrimary ? "text-white" : "text-slate-900 group-hover:text-secondary"
        }`}
      >
        {value}
      </h3>
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-[11px] ${
          isPrimary ? "text-white/70" : "text-slate-500"
        }`}
      >
        {label}
      </p>
    </div>
  </motion.div>
);

const StatsSection: FC = () => {
  const [totalDocuments, setTotalDocuments] = useState<number | null>(null);

  const {
    notPaginated,
    hasFetchedAll,
    getAllNotPaginated,
    transactions,
    hasFetched,
    fetchTransactions,
  } = useTransactionStore(
    useShallow((s) => ({
      notPaginated: s.notPaginated,
      hasFetchedAll: s.hasFetchedAll,
      getAllNotPaginated: s.getAllNotPaginated,
      transactions: s.transactions,
      hasFetched: s.hasFetched,
      fetchTransactions: s.fetch,
    })),
  );

  // Only show skeleton if store is truly empty — cached data shows immediately
  const hasAnyData = transactions.length > 0 || notPaginated !== null;
  const [isLoading, setIsLoading] = useState(!hasAnyData);

  useEffect(() => {
    const fetchData = async () => {
      // Only block UI if we have no data at all — otherwise refresh silently
      if (!hasAnyData) setIsLoading(true);
      await Promise.allSettled([
        getCachedDocCount().then(setTotalDocuments).catch(() => {}),
        hasFetched ? Promise.resolve() : fetchTransactions(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTransactions, hasFetched]);

  const stats = useMemo(() => {
    // Prefer the full dataset (notPaginated) for accurate all-time totals.
    // Fall back to the paginated list while the full fetch is in progress.
    const source = notPaginated ?? transactions;
    const totalSpent = source
      .filter((t) => isExpense(t.type))
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const count = notPaginated?.length ?? transactions.length;

    return [
      {
        icon: FileIcon,
        value: isLoading ? "—" : (totalDocuments ?? 0),
        label: "Documentos",
        color: "bg-secondary/10",
        iconColor: "text-secondary",
      },
      {
        icon: PaymentIcon,
        value: isLoading ? "—" : count,
        label: "Transações",
        color: "bg-primary/25",
        iconColor: "text-secondary",
      },
      {
        icon: MoneyIcon,
        value: isLoading
          ? "—"
          : formatAOA(totalSpent),
        label: "Total Gasto",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
        isPrimary: true,
      },
    ];
  }, [isLoading, totalDocuments, transactions, notPaginated]);

  if (isLoading) {
    return (
      <motion.div
        className="grid h-full w-full grid-cols-3 items-stretch gap-2 sm:gap-2.5 lg:gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-100 bg-white p-3 sm:min-h-[96px] sm:p-3 lg:p-4"
          >
            <div className="mb-3 h-8 w-8 rounded-lg bg-slate-200" />
            <div className="h-6 w-20 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid h-full w-full grid-cols-3 items-stretch gap-2 sm:gap-2.5 lg:gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} />
      ))}
    </motion.div>
  );
};

export default StatsSection;
