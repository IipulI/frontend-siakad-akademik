import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { getAKMProdi } from "../../../hooks/admin-akademik/useChart";
import Status from "../student-data/Status";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function ChartJSAKMProdi() {
  const { data: chartData, isLoading } = getAKMProdi();
  console.log("data prodi akm", chartData);

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

  const labels = [
    "S1 - Akuntansi",
    "S1 - Bisnis Digital",
    "S1 - Gizi",
    "S1 - Ilmu Lingkungan",
    "S1 - Teknik Informatika",
    "S1 - Manajemen",
    "S1 - Teknik Mesin",
    "S1 - Teknik Sipil",
    "S1 - Hukum",
    "S1 - Sistem Informasi",
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
          text: "Program Studi",
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
      <Bar data={data} options={options} className="relative" />
      <Status />
    </div>
  );
}
