import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Component for SKS Tempuh chart
export function SKSCourseGraph() {
  const sksTempuhData = [
    { name: "Belum Lulus", value: 34, color: "#AA4643" }, // Red
    { name: "Lulus", value: 105, color: "#4572A7" }, // Blue
  ];

  const renderCustomizedLabel = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index,
      name,
      value,
    } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    let x, y, textAnchor;

    if (name === "Lulus") {
      // Position "Lulus" in the blue segment (bottom right)
      x = cx + 50;
      y = cy + 50;
      textAnchor = "start";
    } else {
      // Position "Belum Lulus" in the red segment (left)
      x = cx - 20;
      y = cy - 70;
      textAnchor = "end";
    }

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${name}: ${value} sks`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center w-full border-2 p-4 bg-white col-span-5 lg:col-span-2">
      <h2 className="text-xl text-center font-semibold text-[#4572A7] mb-2">
        SKS Tempuh
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sksTempuhData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              startAngle={180} // Mulai dari kiri (180 derajat)
              endAngle={-180} // Berakhir di kiri juga (full circle)
            >
              {sksTempuhData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} SKS`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Component for Perbandingan Nilai chart (tetap sama seperti sebelumnya)
export function ComparisonOfValues() {
  const perbandinganNilaiData = [
    { name: "A", value: 68, color: "#4572A7" }, // Blue
    { name: "AB", value: 25, color: "#AA4643" }, // Red
    { name: "B", value: 9, color: "#89A54E" }, // Green
    { name: "BC", value: 3, color: "#80699B" }, // Purple
  ];

  const renderCustomizedLabel = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index,
      name,
      value,
    } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    let x, y, textAnchor;

    if (name === "A") {
      x = cx + 100;
      y = cy + 60;
      textAnchor = "start";
    } else if (name === "AB") {
      x = cx - 90;
      y = cy;
      textAnchor = "end";
    } else if (name === "B") {
      x = cx - 110;
      y = cy - 80;
      textAnchor = "middle";
    } else {
      x = cx - 20;
      y = cy - 120;
      textAnchor = "middle";
    }

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${name}: ${value} SKS`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center w-full border-2 p-4 bg-white col-span-5 lg:col-span-2">
      <h2 className="text-xl text-center font-semibold text-[#4572A7] mb-2">
        Perbandingan Nilai
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={perbandinganNilaiData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              startAngle={460} // Mulai dari kiri (180 derajat)
              endAngle={-180} // Berakhir di kiri juga (full circle)
            >
              {perbandinganNilaiData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} SKS`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
