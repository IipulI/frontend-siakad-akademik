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

interface IPSChartProps {
  ipsData: number[];
}

export default function IPSChart({ ipsData = [] }: IPSChartProps) {
  // 1. Define the minimum number of semesters to display.
  const MIN_SEMESTERS = 8;

  // 2. Create a new "padded" data array.
  let processedIpsData = [...ipsData];

  // 3. Check if the incoming data is less than the minimum.
  if (processedIpsData.length < MIN_SEMESTERS) {
    // 4. If so, calculate how many zeros to add.
    const paddingCount = MIN_SEMESTERS - processedIpsData.length;
    const padding = Array(paddingCount).fill(0);

    // Add the zeros to the end of the array.
    processedIpsData.push(...padding);
  }

  const data = {
    // 5. Use the new processedData for the chart's labels and data.
    labels: processedIpsData.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: "IPS",
        data: processedIpsData,
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
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-center mb-2 font-semibold text-[#939393]">
          Grafik IPS (Semester)
        </h2>
        <Line data={data} options={options} />
      </div>
  );
}