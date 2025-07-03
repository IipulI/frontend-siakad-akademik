import { useLocation } from "react-router-dom";
import { BriefStudentData } from "./BriefStudentData";
import {
  getAcademicPeriodeDropdown,
  getPeriodeAcademicActive,
} from "../../../../hooks/useFilter";
import { getNilaiKuliah } from "../../../../hooks/admin-akademik/useStudentDetail";
import { useState } from "react";

export default function CollegeGrades() {
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });
  const { state } = useLocation();
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const { data: nilaiKuliah } = getNilaiKuliah(state, filters.namaPeriode);

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
          onChange={(e) => handleFilterChange("namaPeriode", e.target.value)}
          value={filters.namaPeriode}
        >
          {reversedDataPeriodeAkademik?.map((periode) => (
            <option key={periode.id} value={periode.namaPeriode}>
              {periode.namaPeriode}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Kurikulum
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Kode MK
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nama Mata Kuliah
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nama Kelas
              </th>
              <th
                colSpan={3}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center"
              >
                Nilai Komponen
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nilai Akhir
              </th>
            </tr>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Komponen
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                %
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai
              </th>
            </tr>
          </thead>
          <tbody>
            {!nilaiKuliah || nilaiKuliah.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border border-gray-500 p-8 text-center text-gray-500"
                >
                  {!filters.namaPeriode
                    ? "Pilih periode untuk melihat data Nilai Kuliah"
                    : "Tidak ada data Nilai Kuliah untuk periode yang dipilih"}
                </td>
              </tr>
            ) : (
              <>
                {nilaiKuliah?.map((course, index) => (
                  <tr key={index + 1} className="hover:bg-gray-100">
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.tahunKurikulum}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.kodeMataKuliah}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2">
                      {course.namaMataKuliah}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.namaKelas}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.komposisiNilaiMataKuliahResDto.map((komponen) => (
                        <p>{komponen.namaKomposisi}</p>
                      ))}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.komposisiNilaiMataKuliahResDto.map((komponen) => (
                        <p>{komponen.persentase}</p>
                      ))}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.komposisiNilaiMataKuliahResDto.map((komponen) => (
                        <p>{komponen.nilai}</p>
                      ))}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.nilaiAkhir}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
