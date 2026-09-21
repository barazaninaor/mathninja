import { useEffect, useRef } from "react";
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import "./ScoreChart.css";

interface ScoreItem {
  DATE: string;
  SCORE: number;
}

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ScoreChartProps {
  data: ScoreItem[];
}

export default function ScoreChart({ data }: ScoreChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstanceRef.current?.destroy();

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    const chartData = [...data].reverse();

    const labels = chartData.map((d) => {
      const parts = d.DATE.split("/");
      return parts.length >= 2 ? [`${parts[0]}/${parts[1]}`, parts[2]] : d.DATE;
    });

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Score",
            data: chartData.map((d) => d.SCORE),
            borderColor: "#00f2ff",
            backgroundColor: "rgba(0, 242, 255, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#bc13fe",
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 110,
            ticks: {
              color: "#fff",
              stepSize: 10,
              callback: (value: number | string) => {
                if (value === 110) return "";
                return value;
              },
            },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
          x: {
            ticks: { color: "#fff" },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (context: TooltipItem<"line">[]) =>
                chartData[context[0].dataIndex].DATE,
            },
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [data]);

  return (
    <div className="chart-container stats-box">
      <h3>SCORES CHART</h3>
      <div className="chart-area">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
