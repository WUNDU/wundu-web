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
        ctx.fillStyle = "#000000";
        ctx.font = "16px sans-serif";
        ctx.fillText("Gastos", x, y - 25);
        ctx.font = "24px sans-serif";
        ctx.fillText(`KZ ${totalAmount.toLocaleString("pt-AO")}`, x, y);
        ctx.font = "14px sans-serif";
        const displayText = timeRangeText
          .replace("Gastos ", "")
          .replace("Créditos ", "");
        ctx.fillText(displayText, x, y + 25);
        ctx.restore();
      },
    };

    Chart.register(centerText);

    const colors = [
      "#60A5FA",
      "#2DD4BF",
      "#A78BFA",
      "#F87171",
      "#FBBF24",
      "#8B5CF6",
      "#F97316",
    ];

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: transactions.map((tx) => tx.percentage + "%"),
        datasets: [
          {
            data: transactions.map((tx) => Math.abs(tx.amount)),
            backgroundColor: colors.slice(0, transactions.length),
            hoverOffset: 15,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        rotation: -135,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
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
        <div className="text-center text-gray-500 p-8 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 transition-all duration-300 ease-out hover:shadow-lg">
          <p className="text-lg font-medium">Nenhuma transação</p>
          <p className="text-sm">encontrada para este período</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center w-full h-64 transition-all duration-500 ease-out ${className}`}
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
