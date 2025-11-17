import { TransactionProps } from "@/types/panel";
import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

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
        ctx.fillStyle = "#0f172a";
        ctx.font = "12px 'Inter', sans-serif";
        const prefix = timeRangeText.includes("Créditos") ? "Créditos" : "Gastos";
        ctx.fillText(prefix.toUpperCase(), x, y - 26);
        ctx.font = "600 22px 'Inter', sans-serif";
        ctx.fillText(
          `KZ ${totalAmount.toLocaleString("pt-AO")}`,
          x,
          y - 2
        );
        ctx.font = "12px 'Inter', sans-serif";
        ctx.fillStyle = "#475569";
        const displayText = timeRangeText
          .replace("Gastos ", "")
          .replace("Créditos ", "");
        ctx.fillText(displayText, x, y + 18);
        ctx.restore();
      },
    };

    Chart.register(centerText);

    const palette = ["#7C96FF", "#22D3B6", "#A855F7", "#2B50CF", "#F97316"];

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: transactions.map((tx) => tx.percentage + "%"),
        datasets: [
          {
            data: transactions.map((tx) => Math.abs(tx.amount)),
            backgroundColor: palette.slice(0, transactions.length),
            hoverOffset: 6,
            borderWidth: 2,
            borderColor: "#e2e8f0",
            hoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        rotation: -90,
        layout: {
          padding: 32,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#0f172a",
            padding: 12,
            titleFont: { size: 12, family: "Inter" },
            bodyFont: { size: 12, family: "Inter" },
            callbacks: {
              label: function (context) {
                const transaction = transactions[context.dataIndex];
                return `${transaction.title}: KZ ${Math.abs(
                  transaction.amount
                ).toLocaleString("pt-AO")} (${transaction.percentage}%)`;
              },
            },
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      Chart.unregister(centerText);
    };
  }, [transactions, totalAmount, timeRangeText]);

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
