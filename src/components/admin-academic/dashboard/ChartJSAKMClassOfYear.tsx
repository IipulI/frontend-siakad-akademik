import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

import React from "react";

export default function ChartJSAKMClassOfYear() {
  const labels = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const barColors = [
    "#4F46E5", // Indigo 600
    "#10B981", // Emerald 500
    "#F59E0B", // Amber 500
    "#3B82F6", // Blue 500
    "#EF4444", // Red 500
    "#8B5CF6", // Violet 500
    "#14B8A6", // Teal 500
    "#EC4899", // Pink 500
    "#22C55E", // Green 500
    "#6366F1", // Indigo 500
  ];

  // Jumlah mahasiswa per jurusan
  const values = [800, 2000, 850, 2550, 2700, 2700, 2700, 2700, 2700, 2700];

  // ✅ Hanya satu dataset
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Jumlah Mahasiswa",
        data: values,
        backgroundColor: barColors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah Mahasiswa",
          color: "#475569",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Angkatan",
          color: "#475569",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[260px] relative my-2">
      <Bar data={data} options={options} />
    </div>
  );
}
