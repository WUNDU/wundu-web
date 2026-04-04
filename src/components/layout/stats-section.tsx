"use client";

import type { ElementType, FC } from "react";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileIcon, MoneyIcon, PaymentIcon } from "@/constants/icons";
import { DocumentService } from "@/services/document.service";
import { useTransactionStore } from "@/store/transaction-store";

interface StatsCardProps {
  icon: ElementType;
  value: string | number;
  label: string;
  color: string;
  iconColor: string;
  isPrimary?: boolean;
}

import { formatAOA } from "@/lib/currency";

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
        ? "border-[#003cc3] bg-[#003cc3] text-white sm:col-span-2 md:col-span-1"
        : "border-white/60 bg-white/80 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-[#003cc3]/20 hover:shadow-[0_4px_14px_rgba(0,60,195,0.08)]"
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
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isPrimary ? "text-[#ffd400]" : iconColor}`} />
      </div>
      {!isPrimary && <span className="h-2 w-2 rounded-full bg-[#ffd400]" />}
    </div>

    <div className="relative z-10">
      <h3
        className={`mb-0.5 text-base font-bold tracking-tight transition-colors duration-150 sm:mb-1 sm:text-lg lg:text-xl ${
          isPrimary ? "text-white" : "text-[#1e293b] group-hover:text-[#003cc3]"
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
  const { transactions, fetch: fetchTransactions } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [docCount] = await Promise.all([
          DocumentService.getTotalDocuments(),
          fetchTransactions(),
        ]);
        setTotalDocuments(docCount);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchTransactions]);

  const stats = useMemo(() => {
    const totalSpent = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const count = transactions.length;

    return [
      {
        icon: FileIcon,
        value: isLoading ? "—" : (totalDocuments ?? 0),
        label: "Documentos",
        color: "bg-[#003cc3]/10",
        iconColor: "text-[#003cc3]",
      },
      {
        icon: PaymentIcon,
        value: isLoading ? "—" : count,
        label: "Transações",
        color: "bg-[#ffd400]/25",
        iconColor: "text-[#003cc3]",
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
  }, [isLoading, totalDocuments, transactions]);

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
