import { data, useLocation } from "react-router-dom";
import { BriefStudentData } from "./BriefStudentData";
import { getStatusSemester } from "../../../../hooks/admin-akademik/useStudentDetail";
import LoadingSpinner from "../../../LoadingSpinner";

export default function () {
  const { state } = useLocation();

  const mahasiswaId = state;

  const { data: dataSemesterStatus, isLoading } =
    getStatusSemester(mahasiswaId);

  console.log("data semester", dataSemesterStatus);

  // Jika data adalah array, map through it. Jika single object, wrap dalam array
  const semesterData = Array.isArray(dataSemesterStatus)
    ? dataSemesterStatus
    : dataSemesterStatus
    ? [dataSemesterStatus]
    : [];


  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <BriefStudentData showLine={false} />
      <div className="mt-4 overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                No
              </th>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                Periode
              </th>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                Semester
              </th>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                Status
              </th>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                SKS
              </th>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                IPS
              </th>
              <th
                colSpan={3}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                Total SKS
              </th>
              <th
                colSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                IPK
              </th>
              <th
                rowSpan={2}
                className="border-1 border-gray-500 font-semibold p-2"
              >
                Keterangan
              </th>
            </tr>
            <tr>
              <th className="border-1 border-gray-500 font-semibold p-2 text-sm">
                Tempuh
              </th>
              <th className="border-1 border-gray-500 font-semibold p-2">
                Total
              </th>
              <th className="border-1 border-gray-500 font-semibold p-2">
                Lulus
              </th>
              <th className="border-1 border-gray-500 font-semibold p-2">
                Total
              </th>
              <th className="border-1 border-gray-500 font-semibold p-2">
                Lulus
              </th>
            </tr>
          </thead>
          <tbody>
            {semesterData.length > 0 ? (
              semesterData.map((item, index) => (
                <tr
                  key={`${item.kodePeriode}-${index}`}
                  className="hover:bg-gray-100"
                >
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.kodePeriode}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.semester}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.status}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.sks}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.ips}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.sksTempuh}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.sksTotal}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.sksLulus}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.ipk}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                    {item.ipk}
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2">
                    {item.dosen}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border-1 text-center border-gray-500 font-semibold p-2"
                  colSpan={12}
                >
                  Data Semester Tidak Tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
