import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function FacultyBill() {
  const [activeIndex, setActiveIndex] = useState(null);

  const data = [
    { name: "Fakultas Teknik dan Sains", value: 41.35, color: "#9E77ED" },
    { name: "Fakultas Ekonomi dan Bisnis", value: 21.51, color: "#F04438" },
    { name: "Fakultas Hukum", value: 13.47, color: "#4E5BA6" },
    { name: "Fakultas Agama Islam", value: 9.97, color: "#17B26A" },
    { name: "Fakultas Kesehatan", value: 3.35, color: "#0BA5EC" },
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-700">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full border-1 rounded-lg p-4 mx-auto col-span-7 lg:col-span-2">
      <h2 className="text-md text-gray-800 mb-6">Tagihan Per Fakultas</h2>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={99}
              paddingAngle={0}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.7
                  }
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip active={undefined} payload={undefined} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b-1 pb-2">
            <span className="text-sm">{item.name}</span>
            <span className="text-sm text-black/50">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
