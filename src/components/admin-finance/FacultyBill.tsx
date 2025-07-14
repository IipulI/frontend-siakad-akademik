import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFacultyBill } from "../../hooks/admin-keuangan/useDashboardFinance";

export default function FacultyBill() {
  const [activeIndex, setActiveIndex] = useState(null);
  const { data } = useFacultyBill();

  const colors = [
    "#9E77ED",
    "#F04438",
    "#4E5BA6",
    "#17B26A",
    "#0BA5EC",
    "#FF8A00", // Tambahan warna jika data lebih dari 5
    "#6B7280",
    "#EC4899",
  ];

  // Function untuk parse percentage yang lebih robust
  const parsePercentage = (percentStr) => {
    if (!percentStr) return 0;

    // Remove semua karakter kecuali angka, titik, dan koma
    const cleaned = percentStr.toString().replace(/[^\d.,]/g, "");

    // Replace koma dengan titik untuk decimal
    const normalized = cleaned.replace(",", ".");

    // Parse ke float
    const parsed = parseFloat(normalized);

    return isNaN(parsed) ? 0 : parsed;
  };

  // Transform data dengan warna yang sesuai
  const transformedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => ({
      ...item,
      name: item.namaFakultas, // Pastikan ada property 'name' untuk tooltip
      value: parsePercentage(item.persentaseFormatted),
      color: colors[index % colors.length], // Assign warna berdasarkan index
    }));
  }, [data]);

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
          <p className="font-medium">{payload[0].payload.namaFakultas}</p>
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
              data={transformedData} // Gunakan transformedData yang sudah ada warna
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={99}
              paddingAngle={2} // Tambahkan sedikit padding untuk clarity
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color} // Gunakan warna dari data
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
        {transformedData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b-1 pb-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">{item.namaFakultas}</span>
            </div>
            <span className="text-sm text-black/50">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
