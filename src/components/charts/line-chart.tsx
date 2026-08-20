"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Chart from "chart.js/auto";
import type { ChartProps } from "@/types/ui";

const EXPENSE_COLOR = "#EF4444";
const INCOME_COLOR = "#10B981";

const LINE_EMPTY_STATE = (
  <div className="flex flex-1 items-center justify-center w-full h-48 sm:h-64 rounded-xl border border-dashed border-orange-200/80 text-sm text-orange-400 bg-orange-50/60">
    Sem dados suficientes para este período
  </div>
);

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const currency = (value: number) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value);

const LineChart: React.FC<Omit<ChartProps, "selectedMonth">> = ({
  data,
  showExpense = true,
  showIncome = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const bothVisible = showExpense && showIncome;

  const labels = useMemo(() => data.map((d) => d.month), [data]);
  const maxValue = useMemo(() => {
    const values = [
      ...(showExpense ? data.map((d) => d.expense) : []),
      ...(showIncome ? data.map((d) => d.income) : []),
    ];
    return values.length ? Math.max(...values) : 0;
  }, [data, showExpense, showIncome]);

  const [selectedIndex, setSelectedIndex] = useState(() =>
    data.length ? Math.floor(data.length / 2) : 0,
  );

  useEffect(() => {
    setSelectedIndex(data.length ? Math.floor(data.length / 2) : 0);
  }, [data.length]);

  const selectedPoint = data[selectedIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    const pointRadii = data.map((_, i) => (i === selectedIndex ? 6 : 0));

    const datasets = [];
    if (showExpense) {
      let backgroundColor: string | CanvasGradient = `${EXPENSE_COLOR}18`;
      if (!bothVisible) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `${EXPENSE_COLOR}26`);
        gradient.addColorStop(1, `${EXPENSE_COLOR}03`);
        backgroundColor = gradient;
      }
      datasets.push({
        label: "Despesas",
        data: data.map((d) => d.expense),
        borderColor: EXPENSE_COLOR,
        borderWidth: 2,
        backgroundColor,
        fill: !bothVisible,
        tension: 0.35,
        pointRadius: pointRadii,
        pointHoverRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: EXPENSE_COLOR,
        pointBorderWidth: 2,
      });
    }
    if (showIncome) {
      let backgroundColor: string | CanvasGradient = `${INCOME_COLOR}18`;
      if (!bothVisible) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `${INCOME_COLOR}26`);
        gradient.addColorStop(1, `${INCOME_COLOR}03`);
        backgroundColor = gradient;
      }
      datasets.push({
        label: "Receitas",
        data: data.map((d) => d.income),
        borderColor: INCOME_COLOR,
        borderWidth: 2,
        backgroundColor,
        fill: !bothVisible,
        tension: 0.35,
        pointRadius: pointRadii,
        pointHoverRadius: 6,
        pointBackgroundColor: "white",
        pointBorderColor: INCOME_COLOR,
        pointBorderWidth: 2,
      });
    }

    const highlightPlugin = {
      id: "selectedBand",
      beforeDatasetsDraw(chart: Chart) {
        if (selectedIndex < 0 || selectedIndex >= data.length) return;
        const {
          ctx,
          chartArea,
          scales: { x },
        } = chart;
        const columnWidth = chartArea.width / Math.max(data.length, 1);
        const xPos = x.getPixelForValue(selectedIndex);
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
      data: { labels, datasets },
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
        },
        scales: {
          x: {
            grid: { color: "rgba(148, 163, 184, 0.15)", lineWidth: 1 },
            ticks: { color: "#94a3b8", font: { size: 11 }, padding: 8 },
            offset: true,
          },
          y: {
            display: false,
            suggestedMin: 0,
            suggestedMax: maxValue > 0 ? maxValue * 1.15 : undefined,
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      Chart.unregister(highlightPlugin);
    };
  }, [data, labels, maxValue, selectedIndex, showExpense, showIncome, bothVisible]);

  if (!data.length || (!showExpense && !showIncome)) return LINE_EMPTY_STATE;

  return (
    <div
      className={`relative w-full h-48 sm:h-64 overflow-hidden rounded-xl bg-white border border-orange-100 shadow-sm touch-pan-y ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {selectedPoint && (
        <div className="absolute z-10 top-3 left-3 bg-white rounded-xl px-3 py-1.5 shadow-sm text-xs border border-orange-100 space-y-0.5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-orange-400">
            {selectedPoint.month}
          </p>
          {showIncome && (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {currency(selectedPoint.income)}
            </p>
          )}
          {showExpense && (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {currency(selectedPoint.expense)}
            </p>
          )}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-transform duration-200 ease-out"
      />
    </div>
  );
};

export default LineChart;
