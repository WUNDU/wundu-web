"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Tab } from "@/components/ui/tab";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import type { ScriptableContext } from "chart.js";
import { Transaction } from "@/components/ui/transaction";
import { BarChartIcon, ChartDataIcon, DonutChartIcon } from "@/constants/icons";
import { tabRanges } from "@/constants/mock-data";
import { StatsSection } from "@/components/layout";
import { useTransactionStore } from "@/store/transaction-store";
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
  <div className="flex flex-1 items-center justify-center w-full h-48 rounded-3xl border border-dashed border-slate-200 text-sm text-slate-400 bg-slate-50">
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
        animation: { duration: 900, easing: "easeOutQuart" },
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
      className={`relative w-full h-48 rounded-[32px] bg-white border border-indigo-50 shadow-[0_15px_40px_rgba(15,23,42,0.08)] overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(124,150,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,150,255,0.08) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {selectedPoint && formattedValue && (
        <div className="absolute z-10 top-4 left-4 bg-white/95 text-slate-800 rounded-2xl px-4 py-2 shadow-lg text-xs border border-slate-100">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {selectedPoint.month}
          </p>
          <p className="text-base font-semibold">{formattedValue}</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-all duration-500 ease-out hover:scale-[1.01]"
      />
    </div>
  );
};

// ── LineChart ─────────────────────────────────────────────────────────────────

Chart.register(annotationPlugin);

const LINE_EMPTY_STATE = (
  <div className="flex flex-1 items-center justify-center w-full h-48 rounded-3xl border border-dashed border-orange-200/80 text-sm text-orange-400 bg-orange-50/60">
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
        animation: { duration: 900, easing: "easeOutQuart" },
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
      className={`relative w-full h-48 overflow-hidden rounded-[32px] bg-white border border-orange-100 shadow-[0_15px_45px_rgba(15,23,42,0.08)] ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.02) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {selectedPoint && formattedValue && (
        <div className="absolute z-10 top-4 left-4 bg-white text-[#ff5c35] rounded-2xl px-4 py-2 shadow-lg text-xs border border-orange-100">
          <p className="text-[11px] uppercase tracking-[0.2em] text-orange-400">
            {selectedPoint.month}
          </p>
          <p className="text-base font-semibold">{formattedValue}</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-transform duration-700 ease-out hover:scale-[1.01]"
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
          duration: 2000,
          easing: "easeOutQuart",
          animateRotate: true,
          animateScale: true,
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
      <div className="flex justify-center items-center w-full h-64 animate-fade-in">
        <div className="text-center text-slate-500 p-8 rounded-[32px] bg-white border border-indigo-100">
          <p className="text-lg font-medium">Nenhuma transação</p>
          <p className="text-sm">encontrada para este período</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-64 transition-all duration-500 ease-out rounded-[32px] bg-white border border-indigo-100 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(124,150,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,150,255,0.12) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div className="relative w-full max-w-md h-full transition-all duration-500 ease-out hover:scale-[1.02]">
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
    className={`mx-4 p-6 bg-blue-950 text-white rounded-3xl shadow-lg ${
      viewMode === "pie" ? "hidden md:block" : ""
    }`}
  >
    <div className="flex justify-center items-center mb-4">
      <div className="flex bg-gray-500/45 px-4 py-2 rounded-2xl">
        <span className="font-semibold text-lg">
          {isCredit ? "IMG" : "Todos"}
        </span>
      </div>
    </div>
    <p className="text-sm text-center">{headerText}</p>
    <h1 className="text-3xl font-bold text-center">
      {headerAmount.toLocaleString("pt-AO")},00KZ
    </h1>
  </div>
);

// ── TransactionsList ───────────────────────────────────────────────────────────

const TransactionsList: React.FC<{ transactions: TransactionProps[] }> = ({
  transactions,
}) => {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Categorias</h2>
        <span className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </div>
      <div className="mt-4">
        {transactions.map((tx, index) => (
          <Transaction key={index} {...tx} />
        ))}
      </div>
    </div>
  );
};

const ControlPanelDashboardScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("line");
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [isCredit] = useState(false);

  const { transactions: rawTransactions, fetch } = useTransactionStore();

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

  const filteredTransactionsRaw = useMemo(() => {
    const cutoffDate = getCutoffDate(timeRange);
    return normalizedTransactions.filter((tx) => {
      if (tx.timestamp < cutoffDate) return false;
      return isCredit ? tx.isIncome : !tx.isIncome;
    });
  }, [normalizedTransactions, timeRange, isCredit]);

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

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 p-3 font-sans">
        <div className="mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden pb-6 transition-all duration-500 ease-out animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 transition-all duration-300 ease-out">
            <div className="flex bg-blue-950 text-white px-4 py-1 rounded-2xl shadow-lg border border-blue-800/20">
              <span className="font-semibold text-lg">
                {isCredit ? "IMG" : "Todos"}
              </span>
            </div>
            <div className="flex space-x-1 bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200/50">
              <button
                onClick={() => setViewMode("line")}
                className={`p-2 text-slate-950 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                  viewMode === "line"
                    ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-lg"
                    : "hover:bg-gray-200/50"
                }`}
              >
                <ChartDataIcon />
              </button>
              <button
                onClick={() => setViewMode("pie")}
                className={`p-2 text-slate-950 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                  viewMode === "pie"
                    ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-lg"
                    : "hover:bg-gray-200/50"
                }`}
              >
                <DonutChartIcon />
              </button>
              <button
                onClick={() => setViewMode("bar")}
                className={`p-2 text-slate-900 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                  viewMode === "bar"
                    ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-lg"
                    : "hover:bg-gray-200/50"
                }`}
              >
                <BarChartIcon />
              </button>
            </div>
          </div>

          {/* Chart Section */}
          <div className="px-4 pb-4 transition-all duration-500 ease-out">
            <h2 className="text-xl font-bold text-gray-800 mb-4 animate-slide-up">
              {viewMode === "pie"
                ? "Distribuição por Categoria"
                : `Despesas ${timeRange === "1D" ? "Diárias" : timeRange === "1S" ? "Semanais" : "Mensais"}`}
            </h2>
            <div className="w-full h-90 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100/50 transition-all duration-500 ease-out hover:shadow-xl">
              {viewMode === "line" && (
                <LineChart
                  className="w-full h-full transition-all duration-500 ease-out"
                  data={chartData}
                  lineColor={isCredit ? "#10B981" : "#E05445"}
                  dotColor={isCredit ? "#10B981" : "#E05445"}
                />
              )}
              {viewMode === "pie" && (
                <PieChart
                  className="w-full h-full transition-all duration-500 ease-out"
                  transactions={transactions}
                  totalAmount={totalExpenses}
                  timeRangeText={headerText}
                />
              )}
              {viewMode === "bar" && (
                <BarChart
                  className="w-full h-full transition-all duration-500 ease-out"
                  data={chartData}
                  primaryColor={isCredit ? "#1D4ED8" : "#F97316"}
                  accentColor={isCredit ? "#0f172a" : "#7c2d12"}
                />
              )}
            </div>
          </div>

          {/* Time Range Tabs */}
          <div className="flex justify-center p-2 bg-gray-100/80 backdrop-blur-sm rounded-2xl mx-4 shadow-lg border border-gray-200/50 transition-all duration-300 ease-out">
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

          {/* Transactions List */}
          <TransactionsList transactions={transactions} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 relative overflow-hidden font-sans antialiased text-gray-800">
          <main className="p-6 space-y-6 flex-1 flex flex-col overflow-y-auto animate-fade-in">
            <div className="grid grid-cols-3 gap-6 animate-slide-up">
              <HeaderSection
                isCredit={isCredit}
                headerText={headerText}
                headerAmount={headerAmount}
                viewMode={viewMode}
              />
              <div className="flex col-span-2">
                <StatsSection />
              </div>
            </div>

            <div
              className="flex flex-1 flex-row gap-6 items-start animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Categories Section */}
              <div className="bg-white/95 backdrop-blur-xl basis-2/5 shrink-0 rounded-2xl p-6 shadow-lg border border-white/20 overflow-y-auto max-h-full transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Categorias ({headerText.toLowerCase()})
                  </h3>
                </div>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 ${transaction.icon.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <span
                              className={`text-sm font-semibold ${transaction.icon.color === "white" ? "text-white" : "text-black"}`}
                            >
                              {transaction.icon.initials}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {transaction.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.transactions} transações
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            KZ {transaction.amount > 0 ? "+" : ""}
                            {Math.abs(transaction.amount).toLocaleString(
                              "pt-AO",
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.percentage}%
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma transação encontrada para este período
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Chart and Controls */}
              <div className="flex-1 h-full">
                <div className="bg-white/95 backdrop-blur-xl flex flex-col h-full rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center justify-end">
                    <div className="flex space-x-1 bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg border border-gray-200/50">
                      <button
                        onClick={() => setViewMode("line")}
                        className={`p-2 text-slate-950 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                          viewMode === "line"
                            ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-lg"
                            : "hover:bg-gray-200/50"
                        }`}
                      >
                        <ChartDataIcon />
                      </button>
                      <button
                        onClick={() => setViewMode("pie")}
                        className={`p-2 text-slate-950 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                          viewMode === "pie"
                            ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-lg"
                            : "hover:bg-gray-200/50"
                        }`}
                      >
                        <DonutChartIcon />
                      </button>
                      <button
                        onClick={() => setViewMode("bar")}
                        className={`p-2 text-slate-900 rounded-xl transition-all duration-300 ease-out hover:scale-105 ${
                          viewMode === "bar"
                            ? "bg-linear-to-r from-slate-600 to-slate-700 text-white shadow-lg"
                            : "hover:bg-gray-200/50"
                        }`}
                      >
                        <BarChartIcon />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {viewMode === "pie"
                        ? "Distribuição por Categoria"
                        : `Despesas ${timeRange === "1D" ? "Diárias" : timeRange === "1S" ? "Semanais" : "Mensais"}`}
                    </h3>
                    <div className="flex-1 w-full h-full">
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
                  </div>
                  <div className="flex justify-center pt-4">
                    <div className="flex bg-gray-100 p-1 rounded-full">
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
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  };

export default ControlPanelDashboardScreen;
