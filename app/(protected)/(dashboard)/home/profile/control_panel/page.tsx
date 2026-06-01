"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tab } from "@/components/ui/tab";
import { BarChartIcon, ChartDataIcon, DonutChartIcon } from "@/constants/icons";
import { tabRanges } from "@/constants/mock-data";
import { StatsSection } from "@/components/layout";
import { useTransactionStore } from "@/store/transaction-store";
import type { TransactionResponse } from "@/types/dtos/transaction.dto";
import type { TimeRange, TransactionProps, ViewMode } from "@/types/ui";
import { isIncome } from "@/utils/transaction-type";
import {
  BarChart,
  LineChart,
  PieChart,
  getCategoryIcon,
  getCutoffDate,
  buildChartData,
  type NormalizedTransaction,
} from "@/components/charts";
import { BRAND_COLORS } from "@/constants/brand-colors";

const EMPTY_TRANSACTIONS: TransactionResponse[] = [];

const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-3 p-4 animate-pulse">
    <div className="h-20 rounded-xl border border-slate-100 bg-white" />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      <div className="h-36 rounded-xl bg-white lg:col-span-4" />
      <div className="h-36 rounded-xl bg-white lg:col-span-8" />
    </div>
    <div className="h-96 rounded-xl border border-slate-100 bg-white" />
  </div>
);

// ── HeaderSection ─────────────────────────────────────────────────────────────

const HeaderSection: React.FC<{
  isCredit: boolean;
  headerText: string;
  headerAmount: number;
  viewMode: ViewMode;
}> = ({ isCredit, headerText, headerAmount, viewMode }) => (
  <div
    className={`p-3 sm:p-4 bg-secondary text-white rounded-xl shadow-sm ${
      viewMode === "pie" ? "hidden lg:block" : ""
    } lg:col-span-4`}
  >
    <div className="flex justify-center items-center mb-2">
      <div className="flex bg-white/15 px-3 py-1 rounded-xl border border-white/20">
        <span className="text-sm font-bold">
          {isCredit ? "IMG" : "Todos"}
        </span>
      </div>
    </div>
    <p className="text-xs text-white/60 text-center">{headerText}</p>
    <h1 className="text-base font-bold text-center">
      {headerAmount.toLocaleString("pt-AO")},00KZ
    </h1>
  </div>
);

// ── CategoryItems ─────────────────────────────────────────────────────────────

const CategoryItems: React.FC<{
  transactions: TransactionProps[];
  gridCols?: boolean;
}> = ({ transactions, gridCols }) => (
  <div className={gridCols ? "grid grid-cols-2 gap-3" : "space-y-1.5 sm:space-y-2"}>
    {transactions.length > 0 ? (
      transactions.map((transaction, index) => {
        const maxAmt = transactions.reduce(
          (max, tx) => Math.max(max, Math.abs(tx.amount)),
          0,
        );
        const progress =
          maxAmt > 0 ? (Math.abs(transaction.amount) / maxAmt) * 100 : 0;
        return (
          <div
            key={index}
            className="flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${transaction.icon.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`}
              >
                <span
                  className={`text-[10px] sm:text-xs font-bold ${transaction.icon.color === "white" ? "text-white" : "text-black"}`}
                >
                  {transaction.icon.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                  {transaction.title}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  {transaction.transactions} transações
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  KZ {transaction.amount > 0 ? "+" : ""}
                  {Math.abs(transaction.amount).toLocaleString("pt-AO")}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  {transaction.percentage}%
                </p>
              </div>
            </div>
            <div className="h-1 sm:h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  backgroundColor: transaction.icon.chartColor ?? "#94a3b8",
                }}
              />
            </div>
          </div>
        );
      })
    ) : (
      <p
        className={`text-slate-400 text-center text-sm py-6 ${gridCols ? "col-span-2" : ""}`}
      >
        Nenhuma transação encontrada para este período
      </p>
    )}
  </div>
);

// ── ControlPanelDashboardScreen ───────────────────────────────────────────────

const ControlPanelDashboardScreen: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("line");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [isCredit] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const rawTransactions = useTransactionStore((s) => s.notPaginated ?? EMPTY_TRANSACTIONS);
  const getAllNotPaginated = useTransactionStore((s) => s.getAllNotPaginated);
  const isTransactionsLoading = useTransactionStore((s) => s.isLoading);
  const hasFetchedAll = useTransactionStore((s) => s.hasFetchedAll);

  useEffect(() => {
    // Re-run when hasFetchedAll is invalidated by mutations
    if (!hasFetchedAll) getAllNotPaginated();
  }, [getAllNotPaginated, hasFetchedAll]);

  const isAnalyticsLoading = isTransactionsLoading || !hasFetchedAll;

  const normalizedTransactions = useMemo<NormalizedTransaction[]>(() => {
    return rawTransactions
      .map((tx: TransactionResponse) => {
        const rawAmount = typeof tx.amount === "number" ? tx.amount : 0;
        const timestamp = tx.transactionDate
          ? new Date(tx.transactionDate)
          : new Date();
        if (Number.isNaN(timestamp.getTime()) || rawAmount === 0) return null;
        const isIncomeTx = isIncome(tx.type);
        const amount = isIncomeTx ? Math.abs(rawAmount) : -Math.abs(rawAmount);
        return {
          amount,
          category: tx.category?.name ?? (isIncomeTx ? "Receitas" : "Outros"),
          isIncome: isIncomeTx,
          timestamp,
        };
      })
      .filter((tx): tx is NormalizedTransaction => Boolean(tx));
  }, [rawTransactions]);

  const availableYears = useMemo(() => {
    if (normalizedTransactions.length === 0) return [new Date().getFullYear()];
    const years = [
      ...new Set(normalizedTransactions.map((tx) => tx.timestamp.getFullYear())),
    ].sort((a, b) => a - b);
    return years;
  }, [normalizedTransactions]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[availableYears.length - 1]);
    }
  }, [availableYears]);

  const yearIndex = availableYears.indexOf(selectedYear);
  const canGoPrev = yearIndex > 0;
  const canGoNext = yearIndex < availableYears.length - 1;

  const filteredTransactionsRaw = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const refDate =
      selectedYear < currentYear
        ? new Date(selectedYear, 11, 31)
        : new Date();
    const cutoffDate = getCutoffDate(timeRange, refDate);
    return normalizedTransactions.filter((tx) => {
      if (tx.timestamp.getFullYear() !== selectedYear) return false;
      if (tx.timestamp < cutoffDate) return false;
      return isCredit ? tx.isIncome : !tx.isIncome;
    });
  }, [normalizedTransactions, timeRange, isCredit, selectedYear]);

  const transactions = useMemo<TransactionProps[]>(() => {
    if (!filteredTransactionsRaw.length) return [];
    const groupMap = new Map<string, TransactionProps & { rawAmount: number }>();
    filteredTransactionsRaw.forEach((tx) => {
      const key = tx.category || (tx.isIncome ? "Receitas" : "Outros");
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          icon: getCategoryIcon(key),
          title: key,
          transactions: 0,
          amount: 0,
          percentage: 0,
          rawAmount: 0,
        });
      }
      const bucket = groupMap.get(key)!;
      bucket.transactions += 1;
      bucket.amount += tx.amount;
      bucket.rawAmount += Math.abs(tx.amount);
    });
    const total = Array.from(groupMap.values()).reduce(
      (sum, item) => sum + item.rawAmount,
      0,
    );
    return Array.from(groupMap.values()).map(({ rawAmount, ...item }) => ({
      ...item,
      percentage: total ? Math.round((rawAmount / total) * 100) : 0,
    }));
  }, [filteredTransactionsRaw]);

  const chartData = useMemo(() => {
    if (!filteredTransactionsRaw.length) return [];
    return buildChartData(filteredTransactionsRaw, timeRange);
  }, [filteredTransactionsRaw, timeRange]);

  const totalExpenses = filteredTransactionsRaw.reduce(
    (sum, tx) => sum + (!tx.isIncome ? Math.abs(tx.amount) : 0),
    0,
  );
  const totalIncome = filteredTransactionsRaw.reduce(
    (sum, tx) => sum + (tx.isIncome ? Math.abs(tx.amount) : 0),
    0,
  );
  const headerAmount = isCredit ? totalIncome : totalExpenses;

  const headerText = (() => {
    const prefix = isCredit ? "Créditos" : "Gastos";
    switch (timeRange) {
      case "1D": return `${prefix} hoje`;
      case "1S": return `${prefix} nesta semana`;
      case "1M": return `${prefix} neste mês`;
      case "6M": return `${prefix} nos últimos 6 meses`;
      case "1A": return `${prefix} neste ano`;
      default:   return `${prefix} neste período`;
    }
  })();

  const chevronSvg = (color: string) => (
    <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );

  const yearSelector = (
    <div className="flex items-center gap-1.5 rounded-full bg-[rgba(0,33,107,0.06)] px-2.5 py-1.5">
      <button
        onClick={() => canGoPrev && setSelectedYear(availableYears[yearIndex - 1])}
        disabled={!canGoPrev}
        className="w-7 h-7 flex items-center justify-center rotate-180 disabled:opacity-40"
      >
        {chevronSvg(canGoPrev ? BRAND_COLORS.blueDark : "#c0c0c0")}
      </button>
      <span className="w-11 text-center text-[15px] font-extrabold text-secondary-dark select-none">
        {selectedYear}
      </span>
      <button
        onClick={() => canGoNext && setSelectedYear(availableYears[yearIndex + 1])}
        disabled={!canGoNext}
        className="w-7 h-7 flex items-center justify-center disabled:opacity-40"
      >
        {chevronSvg(canGoNext ? BRAND_COLORS.blueDark : "#c0c0c0")}
      </button>
    </div>
  );

  const chartSwitcher = (
    <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-xl">
      {(["line", "bar", "pie"] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`p-1.5 rounded-[10px] transition-colors duration-200 ${
            viewMode === mode
              ? "bg-secondary text-white shadow-sm"
              : "text-slate-950 hover:bg-slate-200/50"
          }`}
        >
          {mode === "line" && <ChartDataIcon />}
          {mode === "bar" && <BarChartIcon />}
          {mode === "pie" && <DonutChartIcon />}
        </button>
      ))}
    </div>
  );

  const chartArea = (
    <div className="w-full h-56 sm:h-72 px-2">
      {viewMode === "line" && (
        <LineChart
          className="w-full h-full"
          data={chartData}
          lineColor={isCredit ? "#10B981" : "#E05445"}
          dotColor={isCredit ? "#10B981" : "#E05445"}
        />
      )}
      {viewMode === "pie" && (
        <PieChart
          className="w-full h-full"
          transactions={transactions}
          totalAmount={totalExpenses}
          timeRangeText={headerText}
        />
      )}
      {viewMode === "bar" && (
        <BarChart
          className="w-full h-full"
          data={chartData}
          primaryColor={isCredit ? "#1D4ED8" : "#F97316"}
          accentColor={isCredit ? "#0f172a" : "#7c2d12"}
        />
      )}
    </div>
  );

  const filterPills = (
    <div className="overflow-x-auto flex justify-center">
      <div className="flex min-w-max bg-slate-100 p-1 rounded-xl">
        {tabRanges.map((range) => (
          <Tab
            key={range}
            label={range}
            value={range}
            isActive={timeRange === range}
            onClick={() => setTimeRange(range)}
          />
        ))}
      </div>
    </div>
  );

  const categoriesHeader = (onDesktop?: boolean) => (
    <div className={`flex items-center justify-between ${onDesktop ? "mb-4" : "mb-3 sm:mb-4"}`}>
      <div>
        <h3 className={`${onDesktop ? "text-base" : "text-sm sm:text-base"} font-bold text-slate-800`}>
          Gastos por categoria
        </h3>
        <p className={`${onDesktop ? "text-xs" : "text-[10px] sm:text-xs"} text-slate-400 mt-0.5`}>
          Distribuição do período
        </p>
      </div>
      <button
        onClick={() => router.push("/home/transactions")}
        className="flex items-center gap-1 bg-[rgba(0,33,107,0.06)] rounded-xl px-3 py-1.5 text-xs font-bold text-secondary-dark"
      >
        Ver todos
        {chevronSvg(BRAND_COLORS.blueDark)}
      </button>
    </div>
  );

  if (isAnalyticsLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden font-sans space-y-3">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const }}
          className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-3 sm:px-4 sm:py-4"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Análise</p>
          <h1 className="mt-1 text-sm font-bold text-slate-900 tracking-tight">Controlo Financeiro</h1>
          <p className="mt-0.5 text-sm text-slate-500">Acompanhe os seus gastos por período</p>
        </motion.div>

        {/* Stats row */}
        <StatsSection />

        {/* Summary + Chart card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const, delay: 0.06 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Period summary */}
          <div className="bg-secondary text-white px-4 py-3">
            <p className="text-xs text-white/60 text-center">{headerText}</p>
            <p className="text-base font-bold text-center mt-0.5">
              {headerAmount.toLocaleString("pt-AO")},00KZ
            </p>
          </div>

          <div className="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3">
            {yearSelector}
            {chartSwitcher}
          </div>
          {chartArea}
          <div className="px-3 sm:px-5 py-3 sm:py-4">{filterPills}</div>
          <div className="h-px bg-slate-100 mx-4" />
          <div className="px-3 sm:px-5 pt-4 sm:pt-5 pb-4 sm:pb-6">
            {categoriesHeader()}
            <div className="relative">
              <div className="max-h-[300px] overflow-y-auto pr-0.5">
                <CategoryItems transactions={transactions} gridCols={false} />
              </div>
              {transactions.length > 5 && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block font-sans antialiased">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const }}
          className="p-4 space-y-4"
        >
          <div className="max-w-[1360px] mx-auto space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <HeaderSection
              isCredit={isCredit}
              headerText={headerText}
              headerAmount={headerAmount}
              viewMode={viewMode}
            />
            <div className="flex col-span-8">
              <StatsSection />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              {yearSelector}
              {chartSwitcher}
            </div>
            {chartArea}
            <div className="flex justify-center py-4">{filterPills}</div>
            <div className="h-px bg-slate-100 mx-5" />
            <div className="px-5 pt-5 pb-6">
              {categoriesHeader(true)}
              <div className="relative">
                <div className="max-h-[360px] overflow-y-auto pr-0.5">
                  <CategoryItems transactions={transactions} gridCols={true} />
                </div>
                {transactions.length > 8 && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ControlPanelDashboardScreen;
