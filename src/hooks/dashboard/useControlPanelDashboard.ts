"use client";

import { useMemo, useState } from "react";
import { TimeRange, ViewMode } from "@/types/panel";
import {
  baseCreditTransactions,
  baseTransactions,
  mockDataByTimeRange,
} from "@/constants/mockData";

export const useControlPanelDashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("line");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [isCredit, setIsCredit] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const sourceTransactions = isCredit ? baseCreditTransactions : baseTransactions;

    let cutoffDate: Date;

    switch (timeRange) {
      case "1D":
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "1S":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "1M":
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "6M":
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case "1A":
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filtered = sourceTransactions.filter((tx) => tx.timestamp >= cutoffDate);

    const totalFiltered = filtered.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return filtered.map((tx) => ({
      ...tx,
      percentage: totalFiltered > 0 ? Math.round((Math.abs(tx.amount) / totalFiltered) * 100) : 0,
    }));
  }, [timeRange, isCredit]);

  const chartData = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return mockDataByTimeRange[timeRange];
    }

    // ... same logic as before (omitted for brevity)
    return mockDataByTimeRange[timeRange];
  }, [filteredTransactions, timeRange]);

  const transactions = filteredTransactions;
  const totalExpenses = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? 0 : Math.abs(tx.amount)), 0);
  const totalIncome = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
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
    transactions,
    chartData,
    headerAmount,
    headerText,
    totalExpenses,
  };
};
