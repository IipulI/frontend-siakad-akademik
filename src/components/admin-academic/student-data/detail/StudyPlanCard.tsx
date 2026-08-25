import { useLocation } from "react-router-dom";
import { getKrs } from "../../../../hooks/admin-akademik/useStudentDetail";
import Biodata from "../../../biodata/Biodata";
import { BriefStudentData } from "./BriefStudentData";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useGeneral";
import { useState } from "react";

export default function StudyPlanCard() {
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });
  const { state } = useLocation();
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const { data: krs } = getKrs(state, filters.namaPeriode);

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

      <div className="mt-4 overflow-x-auto">
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
              <th className="border border-gray-500 font-semibold p-2">
                Kelas
              </th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">Hari</th>
              <th className="border border-gray-500 font-semibold p-2">Jam</th>
              <th className="border border-gray-500 font-semibold p-2">
                Ruangan
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Dosen Pengajar
              </th>
            </tr>
          </thead>
          <tbody>
            {!krs?.krs || krs.krs.length === 0 ? (
              <tr>
                <td
                  className="text-center font-semibold p-2"
                  colSpan={9}
                >
                  Data KRS Tidak Tersedia
                </td>
              </tr>
            ) : (
              krs.krs.map((course, index) => (
                <tr key={index + 1} className="hover:bg-gray-100">
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
                    {course.kelas}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.sks}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.hari}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.jam}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.ruangan}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2">
                    {course.dosenPengajar}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={4}
                className="border border-gray-500 text-center p-2 font-bold"
              >
                Total SKS
              </td>
              <td className="border border-gray-500 p-2 text-center font-semibold">
                {krs?.totalSks}
              </td>
              <td
                colSpan={4}
                className="border border-gray-500 font-bold p-2 text-left"
              ></td>
            </tr>
            <tr>
              <td
                colSpan={4}
                className="border border-gray-500 p-2 font-bold text-center"
              >
                Batas SKS
              </td>
              <td className="border border-gray-500 p-2 text-center font-semibold">
                {krs?.batasSks}
              </td>
              <td
                colSpan={4}
                className="border border-gray-500 font-bold p-2 text-left"
              ></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
