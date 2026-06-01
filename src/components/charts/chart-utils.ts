import type { TimeRange, ChartDataPoint } from "@/types/ui";

export const CATEGORY_COLORS = [
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

export const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export type NormalizedTransaction = {
  amount: number;
  category: string;
  isIncome: boolean;
  timestamp: Date;
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function getCategoryIcon(category: string) {
  const index = Math.abs(hashString(category)) % CATEGORY_COLORS.length;
  const { bgColor, color, chartColor } = CATEGORY_COLORS[index];
  return {
    initials: category.slice(0, 2).toUpperCase(),
    color,
    bgColor,
    chartColor,
  };
}

export function getCutoffDate(timeRange: TimeRange, refDate?: Date): Date {
  const now = refDate ?? new Date();
  switch (timeRange) {
    case "1D":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "1S": {
      // Start of current calendar week (Monday), same as how 1M starts on day 1
      const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday);
    }
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

function getChartLabel(
  date: Date,
  range: TimeRange,
): { label: string; orderKey: number } {
  switch (range) {
    case "1D": {
      const hour = date.getHours().toString().padStart(2, "0");
      return { label: `${hour}h`, orderKey: date.getHours() };
    }
    case "1S": {
      const day = date.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
      // Monday-based order: Mon=0, Tue=1, …, Sat=5, Sun=6
      const mondayBased = day === 0 ? 6 : day - 1;
      return { label: WEEK_LABELS[day], orderKey: mondayBased };
    }
    case "1M": {
      const day = date.getDate();
      const label = `${day.toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      return { label, orderKey: date.getTime() };
    }
    case "6M":
    case "1A": {
      const orderKey = date.getFullYear() * 12 + date.getMonth();
      const label = date.toLocaleString("pt-AO", { month: "short" });
      return { label, orderKey };
    }
    default:
      return { label: date.toLocaleDateString("pt-AO"), orderKey: date.getTime() };
  }
}

export function buildChartData(
  transactions: NormalizedTransaction[],
  timeRange: TimeRange,
): ChartDataPoint[] {
  const bucketMap = new Map<string, { value: number; orderKey: number }>();
  transactions.forEach((tx) => {
    const { label, orderKey } = getChartLabel(tx.timestamp, timeRange);
    if (!bucketMap.has(label)) bucketMap.set(label, { value: 0, orderKey });
    bucketMap.get(label)!.value += Math.abs(tx.amount);
  });
  return Array.from(bucketMap.entries())
    .sort((a, b) => a[1].orderKey - b[1].orderKey)
    .map(([label, info]) => ({ month: label, value: Math.round(info.value) }));
}

export function hexToRgba(hexColor: string, alpha = 0.25): string {
  const hex = hexColor.replace("#", "");
  const bigint = parseInt(hex.length === 3 ? hex.repeat(2) : hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
