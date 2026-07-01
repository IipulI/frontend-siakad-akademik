import { useLocation } from "react-router-dom";
import { BriefStudentData } from "./BriefStudentData";
import { getTranskip } from "../../../../hooks/admin-akademik/useStudentDetail";
import { useQuery } from "@tanstack/react-query";
import { transcriptService } from "../../../../api/mahasiswa/transcriptService";

export default function Transkrip() {
  const { state } = useLocation();
  const { data: transkip } = getTranskip(state);

  // const {data:transcript , isLoading} = useQuery({
  //   queryKey: ["transkip", state],
  //   queryFn: () => transcriptService.getTranscript(),
  // })

  // log



  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <BriefStudentData showLine={false} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="border border-gray-500 font-semibold p-2">No</th>
              <th className="border border-gray-500 font-semibold p-2">
                Kode MK
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nama Mata Kuliah
              </th>
              <th className="border border-gray-500 font-semibold p-2">Smt</th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">
                Grade
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nilai Mutu
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Bobot
              </th>
            </tr>
          </thead>
          <tbody>
            {!transkip?.rincianKrsDto || transkip.rincianKrsDto.length === 0 ? (
              <tr>
                <td
                  className="border-1 text-center border-gray-500 font-semibold p-2"
                  colSpan={8}
                >
                  Data Transkip Tidak Tersedia
                </td>
              </tr>
            ) : (
              transkip?.rincianKrsDto.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.kodeMataKuliah}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2">
                    {course.namaMataKuliah}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.semester}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.sks}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.hurufMutu}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.angkaMutu}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.jumlahAngkaMutu}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={4}
                className="border border-gray-500 p-2 font-bold text-left"
              >
                Total
              </td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                {transkip?.totalSks}
              </td>
              <td colSpan={2} className="border border-gray-500"></td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                {transkip?.totalAngkaMutu}
              </td>
            </tr>
            <tr>
              <td
                colSpan={7}
                className="border border-gray-500 p-2 font-bold text-left"
              >
                Indeks Prestasi Kumulatif
              </td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                {transkip?.ipk}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
