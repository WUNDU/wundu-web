import { ChartProps } from "@/types/panel";
import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

const LineChart: React.FC<Omit<ChartProps, "selectedMonth">> = ({
  data,
  lineColor,
  dotColor,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.floor(data.length / 2)
  );

  useEffect(() => {
    setSelectedIndex(Math.floor(data.length / 2));
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const values = data.map((d) => d.value);
    const maxVal = Math.max(...values);
    const minVal = 0;

    if (selectedIndex < 0 || selectedIndex >= data.length) return;

    const selectedMonth = data[selectedIndex].month;
    const selectedValue = data[selectedIndex].value;
    const selectedLabel = `${selectedValue}K`;

    const pointRadii = data.map((_, i) => (i === selectedIndex ? 6 : 0));
    const pointBackgroundColors = data.map((_, i) =>
      i === selectedIndex ? "white" : "transparent"
    );
    const pointBorderColors = data.map((_, i) =>
      i === selectedIndex ? lineColor : "transparent"
    );
    const pointBorderWidths = data.map((_, i) => (i === selectedIndex ? 2 : 0));

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: values,
            borderColor: lineColor,
            borderWidth: 2,
            backgroundColor: `${lineColor}22`,
            fill: true,
            tension: 0.3,
            pointRadius: pointRadii,
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBorderColors,
            pointBorderWidth: pointBorderWidths,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            setSelectedIndex(index);
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          annotation: {
            clip: false,
            annotations: {
              verticalLine: {
                type: "line",
                xMin: selectedMonth,
                xMax: selectedMonth,
                yMin: minVal,
                borderColor: lineColor,
                borderWidth: 1,
                borderDash: [5, 5],
              },
              valueLabel: {
                type: "label",
                xValue: selectedMonth,
                yValue: selectedValue,
                xAdjust: 30,
                yAdjust: -25,
                backgroundColor: dotColor,
                borderWidth: 0,
                borderRadius: 3,
                content: selectedLabel,
                color: "white",
                font: {
                  size: 14,
                },
                padding: {
                  top: 5,
                  bottom: 5,
                  left: 10,
                  right: 10,
                },
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
              color: "#6b7280",
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
          },
        },
        elements: {
          point: {
            hitRadius: 10,
          },
        },
      },
    });

    if (chartRef.current) {
      const chart = chartRef.current;
      const yScale = chart.scales["y"];
      const xScale = chart.scales["x"];
      const pixelY = yScale.getPixelForValue(selectedValue);
      const pixelX = xScale.getPixelForValue(selectedIndex);
      const labelHeightApprox = 30; 
      const labelWidthApprox = 60; 

      let yAdj = -35; 
      if (pixelY + yAdj < yScale.top + labelHeightApprox / 2) {
        yAdj = 35; 
      }

      let xAdj = 30;
      if (pixelX + xAdj + labelWidthApprox > xScale.right) {
        xAdj = -30 - labelWidthApprox; 
      } else if (pixelX + xAdj < xScale.left) {
        xAdj = 0; 
      }

      const annotationPluginOptions = chart.options.plugins?.annotation;
      if (annotationPluginOptions) {
        const annotations = annotationPluginOptions.annotations as Record<
          string,
          any
        >;
        if (
          annotations &&
          !Array.isArray(annotations) &&
          "valueLabel" in annotations
        ) {
          annotations["valueLabel"].yAdjust = yAdj;
          annotations["valueLabel"].xAdjust = xAdj;
          chart.update();
        }
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, lineColor, dotColor, selectedIndex]);

  return (
    <div className={`relative w-full h-48 overflow-visible transition-all duration-500 ease-out ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="transition-all duration-500 ease-out hover:scale-[1.02]"
      />
    </div>
  );
};

export default LineChart;
