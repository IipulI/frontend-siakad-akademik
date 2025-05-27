// IPSChart.js
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

export default function IPSChart() {
  const data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
    datasets: [
      {
        label: "IPS",
        data: [3.1, 3.4, 3.6, 3.3, 3.2, 0.0, 0.0, 0.0],
        fill: true,
        backgroundColor: "rgba(0, 200, 83, 0.2)",
        borderColor: "green",
        tension: 0.3,
        pointBackgroundColor: "green",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 4.0,
      },
    },
  };

  return (
<<<<<<< HEAD
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-center mb-2 font-semibold text-[#939393]">
        Grafik IPS (Semester)
      </h2>
      <Line data={data} options={options} />
=======
    <div className="bg-white rounded-lg shadow p-4" data-testid="academic-chart">
      <h2 className="text-center mb-2 font-semibold text-[#939393]">
        Grafik IPS (Semester)
      </h2>
      <Line data-testid="mock-line-chart" data={data} options={options} />
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    </div>
  );
}
