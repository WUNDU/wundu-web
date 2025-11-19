import { TransactionProps } from "@/types/panel";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import type { ScriptableContext } from "chart.js";

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

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (transactions.length === 0) {
      return;
    }

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
        const selectedTransaction =
          typeof selected === "number" ? transactions[selected] : null;
        ctx.fillStyle = "#0f172a";
        ctx.font = "12px 'Inter', sans-serif";
        const prefix = selectedTransaction
          ? selectedTransaction.title
          : timeRangeText.includes("Créditos")
          ? "Créditos"
          : "Gastos";
        ctx.fillText(prefix.toUpperCase(), x, y - 26);
        ctx.font = "600 22px 'Inter', sans-serif";
        const primaryValue = selectedTransaction
          ? `KZ ${Math.abs(selectedTransaction.amount).toLocaleString("pt-AO")}`
          : `KZ ${totalAmount.toLocaleString("pt-AO")}`;
        ctx.fillText(primaryValue, x, y - 2);
        ctx.font = "12px 'Inter', sans-serif";
        ctx.fillStyle = "#475569";
        const displayText = selectedTransaction
          ? `${selectedTransaction.percentage}% do total`
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

    const segmentColors = transactions.map((tx, index) => {
      const providedColor = tx.icon?.chartColor;
      if (providedColor) {
        return providedColor;
      }
      return fallbackPalette[index % fallbackPalette.length];
    });

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
              if (typeof selected !== "number") {
                return 0;
              }
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
        layout: {
          padding: 32,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart',
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
        false
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
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      canvas.removeEventListener("click", clickHandler);
      Chart.unregister(centerText);
    };
  }, [transactions, totalAmount, timeRangeText]);

  useEffect(() => {
    const chart = chartRef.current as (Chart & { $baseColors?: string[]; $selectedIndex?: number | null }) | null;
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

export default PieChart;
