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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function ChartJSAKMProdi() {
    // Data dummy (anda bisa mengganti dengan data aktual)
  const data = {
    labels: [
      "S1 - Akuntansi",
      "S1 - Bisnis Digital",
      "S1 - Gizi",
      "S1 - Ilmu Lingkungan",
      "S1 - Teknik Informatika",
      "S1 - Manajemen",
      "S1 - Teknik Mesin",
      "S1 - Teknik SIpil",
      "S1 - Hukum",
      "S1 - Sistem Informasi ",
    ],
    datasets: [
      {
        label: "Jumlah Mahasiswa",
        data: [800, 2000, 850, 2550, 2700, 2700, 2700, 2700, 2700, 2700], // Contoh data
        backgroundColor: "#694BDB",
        hoverBackgroundColor: "#FF7777",
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
          text: "Tahun",
          color: "#000",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };
    return (
      <div className="w-full relative">
        <Bar data={data} options={options} className="relative" />
      </div>
    );
}