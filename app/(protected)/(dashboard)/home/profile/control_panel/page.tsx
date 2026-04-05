"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tab } from "@/components/ui/tab";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import type { ScriptableContext } from "chart.js";
import { Transaction } from "@/components/ui/transaction";
import { BarChartIcon, ChartDataIcon, DonutChartIcon } from "@/constants/icons";
import { tabRanges } from "@/constants/mock-data";
import { StatsSection } from "@/components/layout";
import { useTransaction } from "@/hooks/use-transaction";
import type { TransactionDTO } from "@/types/dtos/transaction.dto";
import type {
  TimeRange,
  TransactionProps,
  ViewMode,
  ChartDataPoint,
  ChartProps,
} from "@/types/ui";

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

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getCategoryIcon(category: string) {
  const index = Math.abs(hashString(category)) % CATEGORY_COLORS.length;
  const { bgColor, color, chartColor } = CATEGORY_COLORS[index];
  return {
    initials: category.slice(0, 2).toUpperCase(),
    color,
    bgColor,
    chartColor,
  };
}

function getCutoffDate(timeRange: TimeRange, refDate?: Date) {
  const now = refDate ?? new Date();
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
      const day = date.getDay();
      return { label: WEEK_LABELS[day], orderKey: day };
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
      return {
        label: date.toLocaleDateString("pt-AO"),
        orderKey: date.getTime(),
      };
  }
}

function buildChartData(
  transactions: NormalizedTransaction[],
  timeRange: TimeRange,
) {
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

// ── BarChart ──────────────────────────────────────────────────────────────────

interface BarChartProps {
  data: ChartDataPoint[];
  primaryColor: string;
  accentColor?: string;
  className?: string;
}

const BAR_EMPTY_STATE = (
  <div className="flex flex-1 items-center justify-center w-full h-48 sm:h-64 rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 bg-slate-50">
    Sem dados suficientes para este período
  </div>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value);

const formatTick = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  primaryColor,
  accentColor = "#0f172a",
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const gradientRef = useRef<CanvasGradient | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const labels = useMemo(() => data.map((d) => d.month), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);

  useEffect(() => {
    if (!data.length) {
      setSelectedIndex(-1);
      return;
    }
    setSelectedIndex(data.length - 1);
  }, [data.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      gradientRef.current = null;
      return;
    }
    if (!data.length) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      gradientRef.current = null;
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `${primaryColor}ee`);
    gradient.addColorStop(1, `${primaryColor}22`);
    gradientRef.current = gradient;
    const buildBackgroundColors = (count: number) => {
      const active = gradientRef.current ?? primaryColor;
      const inactive = `${primaryColor}25`;
      if (selectedIndex === -1) return Array(count).fill(active);
      return Array.from({ length: count }, (_, idx) =>
        idx === selectedIndex ? active : inactive,
      );
    };
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: buildBackgroundColors(values.length),
            hoverBackgroundColor: `${primaryColor}dd`,
            borderRadius: 14,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: "easeOutQuart" },
        onClick: (_, elements) => {
          if (elements.length) {
            const index = elements[0].index;
            setSelectedIndex((prev) => (prev === index ? -1 : index));
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: accentColor,
            callbacks: {
              title: () => "",
              label: (context) =>
                new Intl.NumberFormat("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                  maximumFractionDigits: 0,
                }).format(context.parsed.y ?? 0),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 11, family: "Inter" } },
          },
          y: {
            grid: { color: "rgba(148, 163, 184, 0.12)" },
            ticks: {
              color: "#94a3b8",
              font: { size: 11, family: "Inter" },
              padding: 10,
              callback: (value) => formatTick(Number(value)),
            },
          },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
    };
  }, [data, labels, values, primaryColor, accentColor]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const dataset = chart.data.datasets[0];
    if (!dataset) return;
    const active = gradientRef.current ?? primaryColor;
    const inactive = `${primaryColor}25`;
    const count = chart.data.labels?.length ?? 0;
    if (!count) return;
    dataset.backgroundColor =
      selectedIndex === -1
        ? Array(count).fill(active)
        : Array.from({ length: count }, (_, idx) =>
            idx === selectedIndex ? active : inactive,
          );
    chart.update();
  }, [selectedIndex, primaryColor]);

  if (!data.length) return BAR_EMPTY_STATE;

  const selectedPoint = selectedIndex >= 0 ? data[selectedIndex] : null;
  const formattedValue = selectedPoint
    ? formatCurrency(selectedPoint.value)
    : null;

  return (
    <div
      className={`relative w-full h-48 sm:h-64 rounded-xl bg-white border border-indigo-50 shadow-sm overflow-hidden ${className}`}
    >
      {selectedPoint && formattedValue && (
        <div className="absolute z-10 top-3 left-3 bg-white/95 text-slate-800 rounded-xl px-3 py-1.5 shadow-sm text-xs border border-slate-100">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {selectedPoint.month}
          </p>
          <p className="text-sm font-semibold">{formattedValue}</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-all duration-300 ease-out"
      />
    </div>
  );
};

// ── LineChart ─────────────────────────────────────────────────────────────────

Chart.register(annotationPlugin);

const LINE_EMPTY_STATE = (
  <div className="flex flex-1 items-center justify-center w-full h-48 sm:h-64 rounded-xl border border-dashed border-orange-200/80 text-sm text-orange-400 bg-orange-50/60">
    Sem dados suficientes para este período
  </div>
);

const LineChart: React.FC<Omit<ChartProps, "selectedMonth">> = ({
  data,
  lineColor,
  dotColor,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const gradientRef = useRef<CanvasGradient | null>(null);

  const labels = useMemo(() => data.map((d) => d.month), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);
  const maxValue = useMemo(
    () => (values.length ? Math.max(...values) : 0),
    [values],
  );
  const minValue = useMemo(
    () => (values.length ? Math.min(...values) : 0),
    [values],
  );

  const [selectedIndex, setSelectedIndex] = useState(() =>
    data.length ? Math.floor(data.length / 2) : 0,
  );

  const selectedPoint = data[selectedIndex];
  const formattedValue = selectedPoint
    ? new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
        maximumFractionDigits: 0,
      }).format(selectedPoint.value)
    : null;

  useEffect(() => {
    setSelectedIndex(data.length ? Math.floor(data.length / 2) : 0);
  }, [data.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `${lineColor}26`);
    gradient.addColorStop(1, `${lineColor}03`);
    gradientRef.current = gradient;
    if (selectedIndex < 0 || selectedIndex >= data.length) return;
    const selectedPt = data[selectedIndex];
    const pointRadii = data.map((_, i) => (i === selectedIndex ? 6 : 0));
    const selectedNumericValue = selectedIndex;
    const highlightPlugin = {
      id: "selectedBand",
      beforeDatasetsDraw(chart: Chart) {
        if (!selectedPt) return;
        const {
          ctx,
          chartArea,
          scales: { x },
        } = chart;
        const columnWidth = chartArea.width / Math.max(data.length, 1);
        const xPos = x.getPixelForValue(selectedNumericValue);
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(
          xPos - columnWidth / 2,
          chartArea.top,
          columnWidth,
          chartArea.bottom - chartArea.top,
        );
        ctx.restore();
      },
    };
    Chart.register(highlightPlugin);
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: lineColor,
            borderWidth: 2,
            backgroundColor: gradientRef.current ?? `${lineColor}18`,
            fill: true,
            tension: 0.35,
            pointRadius: pointRadii,
            pointHoverRadius: 6,
            pointBackgroundColor: "white",
            pointBorderColor: lineColor,
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 24, bottom: 12, left: 16, right: 16 } },
        animation: { duration: 400, easing: "easeOutQuart" },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        onClick: (_, elements) => {
          if (elements.length > 0) setSelectedIndex(elements[0].index);
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          annotation: {
            clip: false,
            annotations: {
              marker: {
                type: "line",
                xMin: selectedNumericValue,
                xMax: selectedNumericValue,
                yMin: 0,
                borderColor: `${lineColor}40`,
                borderWidth: 1,
                borderDash: [2, 6],
              },
              markerCircle: {
                type: "point",
                xValue: selectedNumericValue,
                yValue: selectedPt.value,
                radius: 8,
                backgroundColor: "#fff",
                borderColor: lineColor,
                borderWidth: 3,
              },
              label: {
                type: "label",
                xValue: selectedNumericValue,
                yValue: selectedPt.value,
                backgroundColor: "#ffede5",
                color: "#ff5c35",
                borderRadius: 10,
                padding: { top: 6, bottom: 6, left: 12, right: 12 },
                font: { family: "Inter", weight: 600, size: 12 },
                content: `${selectedPt.value.toLocaleString("pt-AO")} kz`,
                yAdjust: -28,
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(148, 163, 184, 0.15)", lineWidth: 1 },
            ticks: { color: "#94a3b8", font: { size: 11 }, padding: 8 },
            offset: true,
          },
          y: {
            display: false,
            suggestedMin: Math.min(0, minValue * 0.9),
            suggestedMax: maxValue > 0 ? maxValue * 1.15 : undefined,
          },
        },
        elements: {
          point: { hoverBorderWidth: 2, hoverBorderColor: dotColor },
        },
      },
    });
    return () => {
      chartRef.current?.destroy();
      Chart.unregister(highlightPlugin);
    };
  }, [data, labels, values, lineColor, dotColor, selectedIndex]);

  if (!data.length) return LINE_EMPTY_STATE;

  return (
    <div
      className={`relative w-full h-48 sm:h-64 overflow-hidden rounded-xl bg-white border border-orange-100 shadow-sm ${className}`}
    >
      {selectedPoint && formattedValue && (
        <div className="absolute z-10 top-3 left-3 bg-white text-[#ff5c35] rounded-xl px-3 py-1.5 shadow-sm text-xs border border-orange-100">
          <p className="text-[11px] uppercase tracking-[0.2em] text-orange-400">
            {selectedPoint.month}
          </p>
          <p className="text-sm font-semibold">{formattedValue}</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-transform duration-500 ease-out"
      />
    </div>
  );
};

// ── PieChart ──────────────────────────────────────────────────────────────────

const hexToRgba = (hexColor: string, alpha = 0.25) => {
  const hex = hexColor.replace("#", "");
  const bigint = parseInt(hex.length === 3 ? hex.repeat(2) : hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface PieChartProps {
  transactions: TransactionProps[];
  totalAmount: number;
  timeRangeText?: string;
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  transactions,
  className,
  totalAmount,
  timeRangeText = "Esse mês",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();
    if (transactions.length === 0) return;
    const centerText = {
      id: "centerText",
      afterDatasetsDraw(chart: Chart) {
        const { ctx, chartArea } = chart;
        ctx.save();
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const selected = (chart as any).$selectedIndex as number | null;
        const selectedTx =
          typeof selected === "number" ? transactions[selected] : null;
        ctx.fillStyle = "#0f172a";
        ctx.font = "12px 'Inter', sans-serif";
        const prefix = selectedTx
          ? selectedTx.title
          : timeRangeText.includes("Créditos")
            ? "Créditos"
            : "Gastos";
        ctx.fillText(prefix.toUpperCase(), x, y - 26);
        ctx.font = "600 22px 'Inter', sans-serif";
        const primaryValue = selectedTx
          ? `KZ ${Math.abs(selectedTx.amount).toLocaleString("pt-AO")}`
          : `KZ ${totalAmount.toLocaleString("pt-AO")}`;
        ctx.fillText(primaryValue, x, y - 2);
        ctx.font = "12px 'Inter', sans-serif";
        ctx.fillStyle = "#475569";
        const displayText = selectedTx
          ? `${selectedTx.percentage}% do total`
          : timeRangeText.replace("Gastos ", "").replace("Créditos ", "");
        ctx.fillText(displayText, x, y + 18);
        ctx.restore();
      },
    };
    Chart.register(centerText);
    const fallbackPalette = [
      "#1d4ed8",
      "#10b981",
      "#f59e0b",
      "#6366f1",
      "#f43f5e",
      "#a855f7",
      "#0f172a",
      "#06b6d4",
      "#84cc16",
      "#ec4899",
    ];
    const segmentColors = transactions.map(
      (tx, index) =>
        tx.icon?.chartColor ?? fallbackPalette[index % fallbackPalette.length],
    );
    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: transactions.map((tx) => tx.percentage + "%"),
        datasets: [
          {
            data: transactions.map((tx) => Math.abs(tx.amount)),
            backgroundColor: segmentColors,
            hoverOffset: 6,
            borderWidth: 1.5,
            borderColor: "#e2e8f0",
            hoverBorderWidth: 2,
            spacing: 10,
            borderRadius: 16,
            borderAlign: "inner",
            offset: ((context: ScriptableContext<"doughnut">) => {
              const selected = (context.chart as any).$selectedIndex;
              if (typeof selected !== "number") return 0;
              return context.dataIndex === selected ? 18 : 0;
            }) as unknown as number,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "82%",
        rotation: -90,
        layout: { padding: 32 },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: {
          duration: 600,
          easing: "easeOutQuart",
          animateRotate: true,
          animateScale: false,
        },
      },
    });
    (chartRef.current as any).$baseColors = segmentColors;
    (chartRef.current as any).$selectedIndex = selectedIndex;
    const clickHandler = (event: MouseEvent) => {
      if (!chartRef.current) return;
      const elements = chartRef.current.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        false,
      );
      if (!elements.length) {
        setSelectedIndex(null);
        return;
      }
      const index = elements[0].index;
      setSelectedIndex((prev) => (prev === index ? null : index));
    };
    canvas.addEventListener("click", clickHandler);
    return () => {
      if (chartRef.current) chartRef.current.destroy();
      canvas.removeEventListener("click", clickHandler);
      Chart.unregister(centerText);
    };
  }, [transactions, totalAmount, timeRangeText]);

  useEffect(() => {
    const chart = chartRef.current as
      | (Chart & { $baseColors?: string[]; $selectedIndex?: number | null })
      | null;
    if (!chart) return;
    chart.$selectedIndex = selectedIndex;
    const dataset = chart.data.datasets[0];
    const baseColors = chart.$baseColors ?? [];
    dataset.backgroundColor = baseColors.map((color, index) => {
      if (selectedIndex === null) return color;
      return index === selectedIndex ? color : hexToRgba(color as string, 0.22);
    });
    chart.update();
  }, [selectedIndex]);

  if (transactions.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-48 sm:h-64">
        <div className="text-center text-slate-500 p-5 rounded-xl bg-white border border-indigo-100">
          <p className="text-sm font-medium">Nenhuma transação</p>
          <p className="text-xs">encontrada para este período</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-48 sm:h-56 transition-all duration-300 ease-out rounded-xl bg-white border border-indigo-100 ${className}`}
    >
      <div className="relative w-full max-w-md h-full transition-all duration-300 ease-out">
        <canvas
          ref={canvasRef}
          className="transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
};

// ── HeaderSection ──────────────────────────────────────────────────────────────

const HeaderSection: React.FC<{
  isCredit: boolean;
  headerText: string;
  headerAmount: number;
  viewMode: ViewMode;
}> = ({ isCredit, headerText, headerAmount, viewMode }) => (
  <div
    className={`p-3 sm:p-4 bg-[#003cc3] text-white rounded-xl shadow-sm ${
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

// ── TransactionsList ───────────────────────────────────────────────────────────

const TransactionsList: React.FC<{ transactions: TransactionProps[] }> = ({
  transactions,
}) => {
  const router = useRouter();
  const maxAmount = transactions.reduce(
    (max, tx) => Math.max(max, Math.abs(tx.amount)),
    0,
  );

  return (
    <div className="mt-2 sm:mt-3 px-3 sm:px-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800">Categorias</h2>
        <button onClick={() => router.push('/home/transactions')} className="bg-[#003cc3]/8 rounded-xl px-3 py-1.5 text-xs font-bold text-[#003cc3]">
          Ver todos
        </button>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {transactions.map((tx, index) => {
          const progress = maxAmount > 0 ? (Math.abs(tx.amount) / maxAmount) * 100 : 0;
          return (
            <div key={index} className="flex flex-col gap-1 sm:gap-1.5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${tx.icon.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0`}
                >
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${tx.icon.color === "white" ? "text-white" : "text-black"}`}
                  >
                    {tx.icon.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {tx.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    {tx.transactions} transações
                  </p>
                </div>
                <div
                  className="rounded-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold"
                  style={{
                    backgroundColor: tx.icon.chartColor
                      ? `${tx.icon.chartColor}18`
                      : undefined,
                    color: tx.icon.chartColor,
                  }}
                >
                  KZ {tx.amount > 0 ? "+" : ""}
                  {Math.abs(tx.amount).toLocaleString("pt-AO")}
                </div>
              </div>
              <div className="h-1 sm:h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: tx.icon.chartColor ?? "#94a3b8",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ControlPanelDashboardScreen: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("line");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [isCredit] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const { transactions: rawTransactions, getTransactions: fetch } = useTransaction();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const normalizedTransactions = useMemo<NormalizedTransaction[]>(() => {
    return rawTransactions
      .map((tx: TransactionDTO) => {
        const rawAmount = typeof tx.amount === "number" ? tx.amount : 0;
        const timestamp = tx.transactionDate
          ? new Date(tx.transactionDate)
          : new Date();
        if (Number.isNaN(timestamp.getTime()) || rawAmount === 0) return null;
        const isIncome = tx.type === "income";
        const amount = isIncome ? Math.abs(rawAmount) : -Math.abs(rawAmount);
        return {
          amount,
          category: tx.category?.name ?? (isIncome ? "Receitas" : "Outros"),
          isIncome,
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

  const chevronSvg = (color: string) => (
    <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );

  const chartSwitcher = (
    <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-xl">
      <button
        onClick={() => setViewMode("line")}
        className={`p-1.5 rounded-[10px] transition-colors duration-200 ${
          viewMode === "line"
            ? "bg-[#003cc3] text-white shadow-sm"
            : "text-slate-950 hover:bg-slate-200/50"
        }`}
      >
        <ChartDataIcon />
      </button>
      <button
        onClick={() => setViewMode("bar")}
        className={`p-1.5 rounded-[10px] transition-colors duration-200 ${
          viewMode === "bar"
            ? "bg-[#003cc3] text-white shadow-sm"
            : "text-slate-900 hover:bg-slate-200/50"
        }`}
      >
        <BarChartIcon />
      </button>
      <button
        onClick={() => setViewMode("pie")}
        className={`p-1.5 rounded-[10px] transition-colors duration-200 ${
          viewMode === "pie"
            ? "bg-[#003cc3] text-white shadow-sm"
            : "text-slate-950 hover:bg-slate-200/50"
        }`}
      >
        <DonutChartIcon />
      </button>
    </div>
  );

  const yearSelector = (
    <div className="flex items-center gap-1.5 rounded-full bg-[rgba(0,33,107,0.06)] px-2.5 py-1.5">
      <button
        onClick={() => canGoPrev && setSelectedYear(availableYears[yearIndex - 1])}
        disabled={!canGoPrev}
        className="w-7 h-7 flex items-center justify-center rotate-180 disabled:opacity-40"
      >
        {chevronSvg(canGoPrev ? "#00216b" : "#c0c0c0")}
      </button>
      <span className="w-11 text-center text-[15px] font-extrabold text-[#00216b] select-none">
        {selectedYear}
      </span>
      <button
        onClick={() => canGoNext && setSelectedYear(availableYears[yearIndex + 1])}
        disabled={!canGoNext}
        className="w-7 h-7 flex items-center justify-center disabled:opacity-40"
      >
        {chevronSvg(canGoNext ? "#00216b" : "#c0c0c0")}
      </button>
    </div>
  );

  const chartArea = (
    <div className="w-full h-48 sm:h-64 px-2">
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
    <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
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
  );

  const categoryItems = (gridCols?: boolean) => (
    <div className={gridCols ? "grid grid-cols-2 gap-3" : "space-y-1.5 sm:space-y-2"}>
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => {
          const maxAmt = transactions.reduce(
            (max, tx) => Math.max(max, Math.abs(tx.amount)),
            0,
          );
          const progress =
            maxAmt > 0
              ? (Math.abs(transaction.amount) / maxAmt) * 100
              : 0;
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
                    backgroundColor:
                      transaction.icon.chartColor ?? "#94a3b8",
                  }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className={`text-slate-400 text-center text-sm py-6 ${gridCols ? "col-span-2" : ""}`}>
          Nenhuma transação encontrada para este período
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden bg-[#F1F5FA] p-3 sm:p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Header: Year selector + Chart type switcher */}
          <div className="flex items-center justify-between px-3 sm:px-5 pt-3 sm:pt-5 pb-2 sm:pb-3">
            {yearSelector}
            {chartSwitcher}
          </div>

          {/* Chart */}
          {chartArea}

          {/* Filter pills */}
          <div className="px-3 sm:px-5 py-2 sm:py-4">
            {filterPills}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#F1F5F9] mx-5" />

          {/* Categories section */}
          <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-4 sm:pb-7">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800">
                  Gastos por categoria
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                  Distribuição do período
                </p>
              </div>
              <button onClick={() => router.push('/home/transactions')} className="flex items-center gap-1 bg-[rgba(0,33,107,0.06)] rounded-xl px-3 py-1.5 text-xs font-bold text-[#00216b]">
                Ver todos
                {chevronSvg("#00216b")}
              </button>
            </div>
            {categoryItems(false)}
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block bg-[#F1F5FA] font-sans antialiased text-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" as const }}
          className="p-4 space-y-4"
        >
          {/* Stats Row */}
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

          {/* Full-width Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header: Year selector + Chart type switcher */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              {yearSelector}
              {chartSwitcher}
            </div>

            {/* Chart — full width */}
            {chartArea}

            {/* Filter pills */}
            <div className="flex justify-center py-4">
              {filterPills}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F1F5F9] mx-5" />

            {/* Categories section */}
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Gastos por categoria
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Distribuição do período
                  </p>
                </div>
                <button onClick={() => router.push('/home/transactions')} className="flex items-center gap-1 bg-[rgba(0,33,107,0.06)] rounded-xl px-3 py-1.5 text-xs font-bold text-[#00216b]">
                  Ver todos
                  {chevronSvg("#00216b")}
                </button>
              </div>
              {categoryItems(true)}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
  };

export default ControlPanelDashboardScreen;
