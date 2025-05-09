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
  // Data dummy (anda bisa mengganti dengan data aktual)
  const data = {
    labels: [
      2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
    ],
    datasets: [
      {
        label: "Jumlah Mahasiswa",
        data: [0, 1000, 900, 450, 1800, 700, 750, 1800, 2500, 2600, 2700, 1750], // Contoh data
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
      <Bar data={data} options={options} className="w-full relative" />
    </div>
  );
}
