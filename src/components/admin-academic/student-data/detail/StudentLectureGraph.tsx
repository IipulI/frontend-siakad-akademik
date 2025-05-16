import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export default function StudenLectureGraph() {
  const data = [
    { semester: 0, sks: 0 },
    { semester: 1, sks: 18 },
    { semester: 2, sks: 21 },
    { semester: 3, sks: 22 },
    { semester: 4, sks: 21 },
    { semester: 5, sks: 23 },
    { semester: 6, sks: 21 },
    { semester: 7, sks: null },
    { semester: 8, sks: null },
    { semester: 9, sks: null },
    { semester: 10, sks: null },
    { semester: 11, sks: null },
    { semester: 12, sks: null },
    { semester: 13, sks: null },
    { semester: 14, sks: null },
    { semester: 15, sks: null },
  ];

  const renderCustomDot = (props: {
    cx?: number;
    cy?: number;
    payload?: { semester: number; sks: number | null };
  }) => {
    const { cx = 0, cy = 0, payload } = props;
    if (!payload?.sks) return <></>;

    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill="#4572A7" />
        <text
          x={cx}
          y={cy}
          dy={-10}
          textAnchor="middle"
          fontSize={12}
          fill="gray"
          fontWeight={500}
        >
          {payload.sks}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full mt-4 bg-white p-2 md:p-4 border-2">
      <h2 className="text-center text-base md:text-lg font-medium text-[#4572A7] mb-2 md:mb-4">
        Perkuliahan Mahasiswa
      </h2>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="semester"
              type="number"
              domain={[0, 15]}
              allowDecimals={false}
              ticks={[...Array(15)].map((_, i) => i + 1)}
              label={{
                value: "Semester",
                position: "insideBottom",
                offset: -10,
                style: { fill: "#4572A7", fontWeight: "bold" },
              }}
            />
            <YAxis
              dataKey="sks"
              domain={[0, 30]}
              ticks={[0, 10, 20, 30]}
              label={{
                value: "SKS Ambil",
                angle: -90,
                position: "insideLeft",
                offset: 20,
                style: { fill: "#4572A7", fontWeight: "bold" },
              }}
            />
            <Tooltip filterNull />

            {/* Seri utama: SKS Mahasiswa */}
            <Area
              dataKey="sks"
              stroke="#4572A7"
              strokeWidth={4}
              fill="#7395BD"
              fillOpacity={0.8}
              dot={renderCustomDot}
              activeDot={{ r: 6, fill: "#4572A7", strokeWidth: 2 }}
              isAnimationActive
            />

            {/* Shading untuk "Semester Peringatan" dan "DO" */}
            <ReferenceArea
              x1={8}
              x2={14}
              y1={0}
              y2={30}
              fill="yellow"
              fillOpacity={0.3}
            />
            <ReferenceArea
              x1={14}
              x2={15}
              y1={0}
              y2={30}
              fill="red"
              fillOpacity={0.3}
            />

            {/* Labels desktop */}
            <text
              x="77%"
              y="10%"
              textAnchor="middle"
              fontSize={15}
              fontWeight="bold"
              className="hidden md:block"
            >
              Semester Peringatan
            </text>
            <text
              x="97%"
              y="10%"
              textAnchor="middle"
              fontSize={15}
              fontWeight="bold"
              className="hidden md:block"
            >
              DO
            </text>

            {/* Labels mobile */}
            <text
              x="77%"
              y="10%"
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              className="block md:hidden"
            >
              Peringatan
            </text>
            <text
              x="97%"
              y="10%"
              textAnchor="middle"
              fontSize={8}
              fontWeight="bold"
              className="block md:hidden"
            >
              DO
            </text>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
