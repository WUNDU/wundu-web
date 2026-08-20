"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Chart from "chart.js/auto";
import type { ChartDataPoint } from "@/types/ui";

const EXPENSE_COLOR = "#EF4444";
const INCOME_COLOR = "#10B981";

interface BarChartProps {
  data: ChartDataPoint[];
  showExpense?: boolean;
  showIncome?: boolean;
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
  showExpense = true,
  showIncome = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const labels = useMemo(() => data.map((d) => d.month), [data]);

  useEffect(() => {
    setSelectedIndex(data.length ? data.length - 1 : -1);
  }, [data.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) {
      chartRef.current?.destroy();
      chartRef.current = null;
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    const buildColors = (color: string, count: number) => {
      const active = color;
      const inactive = `${color}25`;
      if (selectedIndex === -1) return Array(count).fill(active);
      return Array.from({ length: count }, (_, idx) =>
        idx === selectedIndex ? active : inactive,
      );
    };

    const datasets = [];
    if (showExpense) {
      datasets.push({
        label: "Despesas",
        data: data.map((d) => d.expense),
        backgroundColor: buildColors(EXPENSE_COLOR, data.length),
        hoverBackgroundColor: `${EXPENSE_COLOR}dd`,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      });
    }
    if (showIncome) {
      datasets.push({
        label: "Receitas",
        data: data.map((d) => d.income),
        backgroundColor: buildColors(INCOME_COLOR, data.length),
        hoverBackgroundColor: `${INCOME_COLOR}dd`,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      });
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets },
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
            displayColors: true,
            backgroundColor: "#0f172a",
            callbacks: {
              title: (items) => items[0]?.label ?? "",
              label: (context) =>
                `${context.dataset.label}: ${formatCurrency(context.parsed.y ?? 0)}`,
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
  }, [data, labels, showExpense, showIncome, selectedIndex]);

  if (!data.length || (!showExpense && !showIncome)) return BAR_EMPTY_STATE;

  const selectedPoint = selectedIndex >= 0 ? data[selectedIndex] : null;

  return (
    <div
      className={`relative w-full h-48 sm:h-64 rounded-xl bg-white border border-indigo-50 shadow-sm overflow-hidden ${className}`}
    >
      {selectedPoint && (
        <div className="absolute z-10 top-3 left-3 bg-white/95 text-slate-800 rounded-xl px-3 py-1.5 shadow-sm text-xs border border-slate-100 space-y-0.5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {selectedPoint.month}
          </p>
          {showIncome && (
            <p className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {formatCurrency(selectedPoint.income)}
            </p>
          )}
          {showExpense && (
            <p className="flex items-center gap-1.5 font-semibold text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {formatCurrency(selectedPoint.expense)}
            </p>
          )}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-all duration-300 ease-out"
      />
    </div>
  );
};

export default BarChart;
