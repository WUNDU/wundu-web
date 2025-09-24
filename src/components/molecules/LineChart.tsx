import { ChartProps } from '@/src/types/panel';
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);

const LineChart: React.FC<ChartProps> = ({ data, lineColor, dotColor, selectedMonth }) => {
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

    const values = data.map(d => d.value);
    const maxVal = Math.max(...values);
    const minVal = 0; // Set min to 0 to match the image starting at 0

    const selectedIndex = data.findIndex(d => d.month === selectedMonth);
    if (selectedIndex === -1) return; // Handle error if needed

    const selectedValue = data[selectedIndex].value;
    const selectedLabel = `${selectedValue}K`;

    const pointRadii = data.map((_, i) => (i === selectedIndex ? 6 : 0));
    const pointBackgroundColors = data.map((_, i) => (i === selectedIndex ? 'white' : 'transparent'));
    const pointBorderColors = data.map((_, i) => (i === selectedIndex ? lineColor : 'transparent'));
    const pointBorderWidths = data.map((_, i) => (i === selectedIndex ? 2 : 0));

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.month),
        datasets: [{
          data: values,
          borderColor: lineColor,
          borderWidth: 2,
          backgroundColor: `${lineColor}22`,
          fill: true,
          tension: 0.3, // Slight curve to match wavy appearance in image
          pointRadius: pointRadii,
          pointBackgroundColor: pointBackgroundColors,
          pointBorderColor: pointBorderColors,
          pointBorderWidth: pointBorderWidths,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          annotation: {
            annotations: {
              verticalLine: {
                type: 'line',
                xMin: selectedMonth,
                xMax: selectedMonth,
                yMin: minVal,
                borderColor: lineColor,
                borderWidth: 1,
                borderDash: [5, 5],
              },
              valueLabel: {
                type: 'label',
                xValue: selectedMonth,
                yValue: selectedValue,
                xAdjust: 30,
                yAdjust: -50,
                backgroundColor: dotColor,
                borderWidth: 0,
                borderRadius: 3,
                content: selectedLabel,
                color: 'white',
                font: {
                  size: 14,
                },
                padding: {
                  top: 5,
                  bottom: 5,
                  left: 10,
                  right: 10,
                },
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
              },
            },
            offset: true,
          },
          y: {
            display: false,
            min: minVal,
            max: maxVal,
          }
        },
        elements: {
          point: {
            hitRadius: 0,
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, lineColor, dotColor, selectedMonth]);

  return (
    <div className="relative w-full h-48">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;