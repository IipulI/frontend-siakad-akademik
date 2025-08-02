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
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah Mahasiswa",
          color: "#000",
        },
      },
      x: {
        title: {
          display: true,
          text: "Angkatan",
          color: "#000",
          font: {
            size: 18,
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 30,
          callback: function (val, index) {
            const label = labels[index];
            return label.length > 15 ? label.slice(0, 12) + "…" : label;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Karena hanya 1 dataset
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full relative">
      <Bar data={data} options={options} className="w-full relative" />
    </div>
  );
}
