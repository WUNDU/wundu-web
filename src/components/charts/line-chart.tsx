"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import type { ChartProps } from "@/types/ui";

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
        className="w-full h-full transition-transform duration-200 ease-out"
      />
    </div>
  );
};

export default LineChart;
