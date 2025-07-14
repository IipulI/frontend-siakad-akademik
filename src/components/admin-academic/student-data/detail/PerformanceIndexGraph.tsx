import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getLearningProgres } from "../../../../hooks/admin-akademik/useStudentDetail";
import { useLocation } from "react-router-dom";

export default function PerformanceIndexGraph() {
    const { state } = useLocation();
  
    const { data: studenLectureGraph } = getLearningProgres(state);
  
    const data = studenLectureGraph?.indeksPrestasi;
  
    console.log(data)
    

  return (
    <div className="flex flex-col items-center w-full border-2 col-span-5 lg:col-span-3">
      <h2 className="text-xl text-center font-semibold text-[#4572A7] mt-3">
        Indeks Prestasi
      </h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data?.riwayat}
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
              domain={[0, 4]}
              ticks={[0, 2, 4]}
              label={{
                value: "Nilai IP",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#4572A7", fontWeight: "bold" },
              }}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? [value.toFixed(2), ""] : [value, ""]
              }
            />
            <ReferenceLine
              y={2.5}
              label={{
                value: `IP Min: ${data?.ipMinimum}`,
                position: "insideLeft",
                fill: "black",
                fontSize: 12,
                fontWeight: "bold",
                dy: -10,
                offset: 10,
              }}
              stroke="red"
            />
            <Line
              dataKey="ips"
              name="IPS"
              stroke="#4572A7"
              strokeWidth={2}
              dot={{ r: 5, fill: "#4572A7" }}
              activeDot={{ r: 7 }}
            />
            <Line
              dataKey="ipk"
              name="IPK"
              stroke="#b91c1c"
              strokeWidth={2}
              dot={{ r: 5, fill: "#b91c1c" }}
              activeDot={{ r: 7 }}
            />
            <Line
              dataKey="IPKLulus"
              name="IPK Lulus"
              stroke="#89A54E"
              strokeWidth={2}
              dot={{ r: 5, fill: "#89A54E" }}
              activeDot={{ r: 7 }}
            />
            <Legend wrapperStyle={{ paddingTop: 20 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
