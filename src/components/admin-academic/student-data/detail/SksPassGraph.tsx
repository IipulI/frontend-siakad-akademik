import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function SksPassGraph() {
  const data = [
    { semester: 1, sks: 18 },
    { semester: 2, sks: 39 },
    { semester: 3, sks: 61 },
    { semester: 4, sks: 82 },
    { semester: 5, sks: 105 },
    { semester: 6, sks: 105 },
  ];

  // Custom dot component to display SKS values
  const CustomizedDot = (props) => {
    const { cx, cy, value } = props;

    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill="#4682B4" />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#000" fontSize={12}>
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center w-full border-2 col-span-5 lg:col-span-3">
      <h2 className="text-xl text-center font-semibold text-[#4572A7] mt-3">
        SKS Lulus
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="semester"
              label={{
                value: "Semester",
                position: "bottom",
                offset: 0,
                style: { fill: "#4572A7", fontWeight: "bold" },
              }}
            />
            <YAxis
              domain={[0, 160]}
              ticks={[0, 50, 100, 150]}
              label={{
                value: "SKS",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#4572A7", fontWeight: "bold" },
              }}
            />
            <Tooltip formatter={(value) => [`${value} SKS`, "SKS"]} />
            <ReferenceLine
              y={144}
              label={{ value: "Batas Lulus: 144", position: "top" }}
              stroke="green"
              strokeDasharray="5 5"
            />
            <Line
              dataKey="sks"
              stroke="#4682B4"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
