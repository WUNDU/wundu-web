import { ChartDataPoint } from "@/shared/types/panel";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";

interface BarChartProps {
  data: ChartDataPoint[];
  primaryColor: string;
  accentColor?: string;
  className?: string;
}

const EMPTY_STATE = (
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
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
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

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `${primaryColor}ee`);
    gradient.addColorStop(1, `${primaryColor}22`);
    gradientRef.current = gradient;

    const buildBackgroundColors = (count: number) => {
      const active = gradientRef.current ?? primaryColor;
      const inactive = `${primaryColor}25`;
      if (selectedIndex === -1) {
        return Array(count).fill(active);
      }
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
        animation: {
          duration: 900,
          easing: "easeOutQuart",
        },
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
              label: (context) => {
                const value = context.parsed.y ?? 0;
                return new Intl.NumberFormat("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                  maximumFractionDigits: 0,
                }).format(value);
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#94a3b8",
              font: { size: 11, family: "Inter" },
            },
          },
          y: {
            grid: {
              color: "rgba(148, 163, 184, 0.12)",
            },
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
    if (!dataset) {
      return;
    }

    const active = gradientRef.current ?? primaryColor;
    const inactive = `${primaryColor}25`;
    const count = chart.data.labels?.length ?? 0;
    if (!count) {
      return;
    }

    dataset.backgroundColor =
      selectedIndex === -1
        ? Array(count).fill(active)
        : Array.from({ length: count }, (_, idx) =>
            idx === selectedIndex ? active : inactive,
          );

    chart.update();
  }, [selectedIndex, primaryColor]);

  if (!data.length) {
    return EMPTY_STATE;
  }

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

export default BarChart;
