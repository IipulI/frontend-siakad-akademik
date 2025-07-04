import { Check } from "lucide-react";
import { BriefStudentData } from "./BriefStudentData";
import { useLocation } from "react-router-dom";
import { getFinalisasiMk } from "../../../../hooks/admin-akademik/useStudentDetail";

export default function FinalizationMK() {
  const { state } = useLocation();

  const { data: finalisasiMk } = getFinalisasiMk(state);

  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <BriefStudentData showLine={false} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="border border-gray-500 font-semibold p-2">No</th>
              <th className="border border-gray-500 font-semibold p-2">
                Periode
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Kurikulum
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Kode MK
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nama MK
              </th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">W/P</th>
              <th className="border border-gray-500 font-semibold p-2">
                Grade
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Status
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Dipakai
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Ada di Transkrip
              </th>
            </tr>
          </thead>
          <tbody>
            {!finalisasiMk || finalisasiMk.length === 0 ? (
              <tr>
                <td
                  className="border-1 text-center border-gray-500 font-semibold p-2"
                  colSpan={11}
                >
                  Data Finalisasi Mata Kuliah Tidak Tersedia
                </td>
              </tr>
            ) : (
              finalisasiMk?.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.periodeAkademik}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.kurikulum}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.kodeMataKuliah}
                  </td>
                  <td className="border border-gray-500 p-2 font-semibold">
                    {course.namaMatakuliah}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.sks}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.opsiMataKuliah === true ? "W" : "P"}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.grade}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.status === "Lulus" ? (
                      <span className="bg-green-700 text-white px-3 py-1 rounded text-xs">
                        Lulus
                      </span>
                    ) : (
                      <span className="bg-gray-400 text-black py-1 text-center block rounded text-xs">
                        Belum Dikonci
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.dipakai ? (
                      <Check className="mx-auto" size={20} color="green" />
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-semibold">
                    {course.transkip ? (
                      <Check className="mx-auto" size={20} color="green" />
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
}
