import { BriefStudentData } from "./BriefStudentData";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useFilter";
import { getKhs } from "../../../../hooks/admin-akademik/useStudentDetail";

export default function StudyResultCard() {
  const [filters, setFilters] = useState({
    idPeriode: "",
  });
  const { state } = useLocation();
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const { data: Khs } = getKhs(state, filters.idPeriode);

  console.log("Khs", Khs);

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    console.log(`Filter changed: ${field} = ${value}`);

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: value,
      };
      console.log("New filters:", newFilters);
      return newFilters;
    });
  };

  const reversedDataPeriodeAkademik = periodeAkademikDropdown
    ?.slice()
    .reverse();

  const totalSKS =
    Khs?.rincianKrsDto.reduce((total, course) => {
      return total + (Number(course.sks) || 0);
    }, 0) || 0;

  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <BriefStudentData showLine={false} />

      <div className="flex items-center space-x-2 mt-4">
        <label htmlFor="" className="text-sm font-medium">
          Periode
        </label>
        <select
          name=""
          id=""
          className="border-2 rounded p-1 text-sm w-40"
          onChange={(e) => handleFilterChange("idPeriode", e.target.value)}
          value={filters.idPeriode}
        >
          {reversedDataPeriodeAkademik?.map((periode) => (
            <option key={periode.id} value={periode.id}>
              {periode.namaPeriode}
            </option>
          ))}
        </select>
      </div>

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
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">
                Nilai Mutu
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Bobot
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nilai
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Keterangan
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Transkrip
              </th>
            </tr>
          </thead>
          <tbody>
            {!Khs?.rincianKrsDto || Khs.rincianKrsDto.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="border border-gray-500 p-8 text-center text-gray-500"
                >
                  {!filters.idPeriode
                    ? "Pilih periode untuk melihat data KHS"
                    : "Tidak ada data KHS untuk periode yang dipilih"}
                </td>
              </tr>
            ) : (
              Khs.rincianKrsDto.map((course, index) => (
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
                    {course.sks}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.angkaMutu}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.jumlahAngkaMutu}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.hurufMutu}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2"></td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.jumlahAngkaMutu ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                className="border border-gray-500 p-2 font-bold text-center"
              >
                Total SKS
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {totalSKS}
              </td>
              <td
                colSpan={5}
                className="border border-gray-500 font-semibold"
              ></td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border border-gray-500 font-bold p-2 text-center"
              >
                Indeks Prestasi Semester
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {Khs?.ips}
              </td>
              <td
                colSpan={5}
                className="border border-gray-500 font-semibold"
              ></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
