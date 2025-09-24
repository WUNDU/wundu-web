import { TransactionProps } from '@/src/types/panel';
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface PieChartProps {
  transactions: TransactionProps[];
  totalAmount: number;
}

const PieChart: React.FC<PieChartProps> = ({ transactions, totalAmount }) => {
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
        ctx.fillText('Esse mês', x, y + 25);
        ctx.restore();
      },
    };

    Chart.register(centerText);

    const colors = ['#60A5FA', '#2DD4BF', '#A78BFA'];

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: transactions.map((tx) => tx.percentage + '%'),
        datasets: [
          {
            data: transactions.map((tx) => Math.abs(tx.amount)),
            backgroundColor: colors,
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
  }, [transactions, totalAmount]);

  // Ensure the container is centered and responsive
  return (
    <div className="flex justify-center items-center w-full h-64">
      <div className="relative w-full max-w-md h-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PieChart;