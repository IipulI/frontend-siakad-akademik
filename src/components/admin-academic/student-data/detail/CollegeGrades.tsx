import { useLocation } from "react-router-dom";
import { BriefStudentData } from "./BriefStudentData";
import {
  getAcademicPeriodeDropdown,
  getPeriodeAcademicActive,
} from "../../../../hooks/useGeneral";
import { getNilaiKuliah } from "../../../../hooks/admin-akademik/useStudentDetail";
import { useState } from "react";

export default function CollegeGrades() {
  const staticCompositions = [
    {
      id: 1,
      name: "Kehadiran",
      value: 15,
    },
    {
      id: 2,
      name: "Tugas",
      value: 20,
    },
    {
      id: 3,
      name: "UTS",
      value: 25,
    },
    {
      id: 4,
      name: "UAS",
      value: 40,
    },
  ];
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });
  const { state } = useLocation();
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const { data: nilaiKuliah } = getNilaiKuliah(state, filters.namaPeriode);

  const composition = nilaiKuliah?.flatMap(
    (item) => item.komposisiNilaiMataKuliahResDto
  );
  console.log("komposisi", nilaiKuliah);

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
                colSpan={4}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center"
              >
                Nilai Komponen
              </th>
              <th
                colSpan={2}
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nilai Akhir
              </th>
            </tr>
            <tr>
              {staticCompositions.map((composition) => (
                <th
                  key={composition.id}
                  className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center"
                >
                  {composition.name} ({composition.value}%)
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!nilaiKuliah || nilaiKuliah.length === 0 ? (
              <tr>
                <td
                  className="border-1 text-center border-gray-500 font-semibold p-2"
                  colSpan={8}
                >
                  Data Nilai Kuliah Tidak Tersedia
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

                    {course.komposisiNilaiMataKuliahResDto.map((test) => (
                      <td className="border border-gray-500 font-semibold p-2 text-center">
                        {test.nilai}
                      </td>
                    ))}
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.nilai}
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
