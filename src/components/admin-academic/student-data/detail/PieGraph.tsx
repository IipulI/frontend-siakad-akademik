import { useLocation } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLearningProgres } from "../../../../hooks/admin-akademik/useStudentDetail";

// Component for SKS Tempuh chart
export function SKSCourseGraph() {

  const { state } = useLocation();

  const { data: studenLectureGraph } = getLearningProgres(state);

  const data = studenLectureGraph?.sksTempuh;

  const sksTempuhData = [
    { name: "Belum Lulus", value: data?.belumLulus, color: "#AA4643" }, // Red
    { name: "Lulus", value: data?.lulus, color: "#4572A7" }, // Blue
  ];

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

  const { state } = useLocation();

  const { data: studenLectureGraph } = getLearningProgres(state);

  const data = studenLectureGraph?.distribusiNilai;

  const perbandinganNilaiData = [
    {
      name: data?.detail[0].grade,
      value: data?.detail[0].sks,
      color: "#4572A7",
    }, // Blue
    {
      name: data?.detail[1].grade,
      value: data?.detail[1].sks,
      color: "#AA4643",
    }, // Red
    {
      name: data?.detail[2].grade,
      value: data?.detail[2].sks,
      color: "#89A54E",
    }, // Green
    {
      name: data?.detail[3].grade,
      value: data?.detail[3].sks,
      color: "#80699B",
    }, // Purple
    {
      name: data?.detail[4].grade,
      value: data?.detail[4].sks,
      color: "#F28E2B",
    }, // Orange
    {
      name: data?.detail[5].grade,
      value: data?.detail[5].sks,
      color: "#76B7B2",
    }, // Teal
    {
      name: data?.detail[6].grade,
      value: data?.detail[6].sks,
      color: "#E15759",
    }, // Coral Red
  ];

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
