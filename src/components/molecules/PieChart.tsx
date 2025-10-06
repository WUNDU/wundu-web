import { TransactionProps } from '@/src/types/panel';
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface PieChartProps {
  transactions: TransactionProps[];
  totalAmount: number;
  timeRangeText?: string;
  className?: string
}

const PieChart: React.FC<PieChartProps> = ({ transactions, className, totalAmount, timeRangeText = "Esse mês" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Only create chart if there are transactions
    if (transactions.length === 0) {
      return;
    }

    const centerText = {
      id: 'centerText',
      afterDatasetsDraw(chart: Chart) {
        const { ctx, chartArea } = chart;
        ctx.save();
        // Calculate the center using chartArea for accurate positioning
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000000';
        ctx.font = '16px sans-serif';
        ctx.fillText('Gastos', x, y - 25);
        ctx.font = '24px sans-serif';
        ctx.fillText(`KZ ${totalAmount.toLocaleString('pt-AO')}`, x, y);
        ctx.font = '14px sans-serif';
        // Use the dynamic time range text
        const displayText = timeRangeText.replace('Gastos ', '').replace('Créditos ', '');
        ctx.fillText(displayText, x, y + 25);
        ctx.restore();
      },
    };

    Chart.register(centerText);

    const colors = ['#60A5FA', '#2DD4BF', '#A78BFA', '#F87171', '#FBBF24', '#8B5CF6', '#F97316'];

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: transactions.map((tx) => tx.percentage + '%'),
        datasets: [
          {
            data: transactions.map((tx) => Math.abs(tx.amount)),
            backgroundColor: colors.slice(0, transactions.length),
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
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
                return `${transaction.title}: KZ ${Math.abs(transaction.amount).toLocaleString('pt-AO')} (${transaction.percentage}%)`;
              }
            }
          },
        },
        animation: {
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

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Nenhuma transação</p>
          <p className="text-sm">encontrada para este período</p>
        </div>
      </div>
    );
  }

  // Ensure the container is centered and responsive
  return (
    <div className={`flex justify-center items-center w-full h-64 ${className}`}>
      <div className="relative w-full max-w-md h-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PieChart;