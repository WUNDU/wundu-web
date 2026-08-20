"use client";
import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import type { TransactionProps } from "@/types/ui";
import { hexToRgba } from "./chart-utils";

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
        ctx.font = "11px 'Inter', sans-serif";
        const prefix = selectedTx
          ? selectedTx.title
          : timeRangeText.includes("Créditos")
            ? "Créditos"
            : "Gastos";
        ctx.fillText(prefix.toUpperCase(), x, y - 22);
        ctx.font = "600 20px 'Inter', sans-serif";
        const primaryValue = selectedTx
          ? `KZ ${Math.abs(selectedTx.amount).toLocaleString("pt-AO")}`
          : `KZ ${totalAmount.toLocaleString("pt-AO")}`;
        ctx.fillText(primaryValue, x, y + 2);
        ctx.font = "11px 'Inter', sans-serif";
        ctx.fillStyle = "#475569";
        const displayText = selectedTx
          ? `${selectedTx.percentage}% do total`
          : timeRangeText.replace("Gastos ", "").replace("Créditos ", "");
        ctx.fillText(displayText, x, y + 26);
        ctx.restore();
      },
    };

    Chart.register(centerText);

    const fallbackPalette = [
      "#1d4ed8", "#10b981", "#f59e0b", "#6366f1", "#f43f5e",
      "#a855f7", "#0f172a", "#06b6d4", "#84cc16", "#ec4899",
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
            hoverOffset: 20,
            borderWidth: 1.5,
            borderColor: "#e2e8f0",
            hoverBorderWidth: 2,
            spacing: 6,
            borderRadius: 16,
            borderAlign: "inner",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "85%",
        rotation: -90,
        layout: { padding: 16 },
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
    if (selectedIndex !== null) {
      chart.setActiveElements([{ datasetIndex: 0, index: selectedIndex }]);
    } else {
      chart.setActiveElements([]);
    }
    chart.update();
  }, [selectedIndex]);

  if (transactions.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="text-center text-slate-500 p-5 rounded-xl bg-white border border-indigo-100">
          <p className="text-sm font-medium">Nenhuma transação</p>
          <p className="text-xs">encontrada para este período</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-full transition-all duration-300 ease-out rounded-xl bg-white border border-indigo-100 touch-pan-y ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative w-full max-w-xl h-full transition-all duration-300 ease-out">
        <canvas
          ref={canvasRef}
          className="transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
};

export default PieChart;
