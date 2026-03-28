"use client";

import { useMemo, useState } from "react";
import { TimeRange, TransactionProps, ViewMode } from "@/shared/types/panel";
import { useTransactions as useTransactionDocuments } from "@/hooks/transaction/use-transactions";

type NormalizedTransaction = {
  amount: number;
  category: string;
  isIncome: boolean;
  timestamp: Date;
};

const CATEGORY_COLORS = [
  { bgColor: "bg-blue-950", color: "white", chartColor: "#1d4ed8" },
  { bgColor: "bg-emerald-500", color: "white", chartColor: "#10b981" },
  { bgColor: "bg-amber-500", color: "black", chartColor: "#f59e0b" },
  { bgColor: "bg-indigo-500", color: "white", chartColor: "#6366f1" },
  { bgColor: "bg-rose-500", color: "white", chartColor: "#f43f5e" },
  { bgColor: "bg-purple-500", color: "white", chartColor: "#a855f7" },
  { bgColor: "bg-slate-900", color: "white", chartColor: "#0f172a" },
  { bgColor: "bg-cyan-500", color: "black", chartColor: "#06b6d4" },
  { bgColor: "bg-lime-500", color: "black", chartColor: "#84cc16" },
  { bgColor: "bg-pink-500", color: "white", chartColor: "#ec4899" },
];

const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const useControlPanelDashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("line");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [isCredit, setIsCredit] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);

  const {
    transactions: transactionDocuments,
    isLoading: isTransactionsLoading,
  } = useTransactionDocuments();

  const normalizedTransactions = useMemo<NormalizedTransaction[]>(() => {
    return transactionDocuments
      .map((doc) => {
        const rawAmount = typeof doc.amount === "number" ? doc.amount : 0;
        const timestamp = doc.timestamp ? new Date(doc.timestamp) : new Date();
        if (Number.isNaN(timestamp.getTime()) || rawAmount === 0) {
          return null;
        }
        const isIncome = doc.isIncome ?? rawAmount > 0;
        const amount = isIncome ? Math.abs(rawAmount) : -Math.abs(rawAmount);
        return {
          amount,
          category: doc.category ?? (isIncome ? "Receitas" : "Outros"),
          isIncome,
          timestamp,
        } satisfies NormalizedTransaction;
      })
      .filter((tx): tx is NormalizedTransaction => Boolean(tx));
  }, [transactionDocuments]);

  const filteredTransactionsRaw = useMemo(() => {
    const cutoffDate = getCutoffDate(timeRange);
    return normalizedTransactions.filter((tx) => {
      if (tx.timestamp < cutoffDate) {
        return false;
      }
      return isCredit ? tx.isIncome : !tx.isIncome;
    });
  }, [normalizedTransactions, timeRange, isCredit]);

  const groupedTransactions = useMemo<TransactionProps[]>(() => {
    if (!filteredTransactionsRaw.length) {
      return [];
    }

    const groupMap = new Map<
      string,
      TransactionProps & { rawAmount: number }
    >();

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
      icon: {
        ...item.icon,
        chartColor: item.icon.chartColor,
      },
    }));
  }, [filteredTransactionsRaw]);

  const chartData = useMemo(() => {
    if (!filteredTransactionsRaw.length) {
      return [];
    }
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
      case "1D":
        return `${prefix} hoje`;
      case "1S":
        return `${prefix} nesta semana`;
      case "1M":
        return `${prefix} neste mês`;
      case "6M":
        return `${prefix} nos últimos 6 meses`;
      case "1A":
        return `${prefix} neste ano`;
      default:
        return `${prefix} neste período`;
    }
  })();

  const totalEntries = filteredTransactionsRaw.length;
  const incomeEntries = filteredTransactionsRaw.filter(
    (tx) => tx.isIncome,
  ).length;
  const expenseEntries = filteredTransactionsRaw.filter(
    (tx) => !tx.isIncome,
  ).length;

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const toggleSidebarRight = () => setIsSidebarRightOpen((v) => !v);

  return {
    viewMode,
    setViewMode,
    timeRange,
    setTimeRange,
    isCredit,
    setIsCredit,
    isSidebarOpen,
    toggleSidebar,
    isSidebarRightOpen,
    toggleSidebarRight,
    transactions: groupedTransactions,
    chartData,
    headerAmount,
    headerText,
    totalExpenses,
    totalEntries,
    incomeEntries,
    expenseEntries,
    isTransactionsLoading,
  };
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getCategoryIcon(category: string) {
  const palette = CATEGORY_COLORS;
  const index = Math.abs(hashString(category)) % palette.length;
  const { bgColor, color, chartColor } = palette[index];
  return {
    initials: category.slice(0, 2).toUpperCase(),
    color,
    bgColor,
    chartColor,
  };
}

function getCutoffDate(timeRange: TimeRange) {
  const now = new Date();
  switch (timeRange) {
    case "1D":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "1S":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "1M":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "6M":
      return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case "1A":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

function buildChartData(
  transactions: NormalizedTransaction[],
  timeRange: TimeRange,
) {
  const bucketMap = new Map<
    string,
    {
      value: number;
      orderKey: number;
    }
  >();

  transactions.forEach((tx) => {
    const { label, orderKey } = getChartLabel(tx.timestamp, timeRange);
    const key = label;
    if (!bucketMap.has(key)) {
      bucketMap.set(key, { value: 0, orderKey });
    }
    const bucket = bucketMap.get(key)!;
    bucket.value += Math.abs(tx.amount);
  });

  return Array.from(bucketMap.entries())
    .sort((a, b) => a[1].orderKey - b[1].orderKey)
    .map(([label, info]) => ({ month: label, value: Math.round(info.value) }));
}

function getChartLabel(date: Date, range: TimeRange) {
  switch (range) {
    case "1D": {
      const hour = date.getHours().toString().padStart(2, "0");
      return { label: `${hour}h`, orderKey: date.getHours() };
    }
    case "1S": {
      const day = date.getDay();
      return { label: WEEK_LABELS[day], orderKey: day };
    }
    case "1M": {
      const day = date.getDate();
      const label = `${day.toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      return { label, orderKey: date.getTime() };
    }
    case "6M":
    case "1A": {
      const orderKey = date.getFullYear() * 12 + date.getMonth();
      const label = date.toLocaleString("pt-AO", { month: "short" });
      return { label, orderKey };
    }
    default:
      return {
        label: date.toLocaleDateString("pt-AO"),
        orderKey: date.getTime(),
      };
  }
}
