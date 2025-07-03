import { data, useLocation } from "react-router-dom";
import { BriefStudentData } from "./BriefStudentData";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useFilter";
import { getMengulang } from "../../../../hooks/admin-akademik/useStudentDetail";
import { useState } from "react";

export default function Repeat() {
  const [filters, setFilters] = useState({
    idPeriode: "",
  });
  const { state } = useLocation();
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const { data: mengulang } = getMengulang(state, filters.idPeriode);

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
        <table className="w-full border-collapse border border-gray-500 font-semibold">
          <thead>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                No
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kode MK
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nama Mata Kuliah
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Periode
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                SKS
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                SMT
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai
              </th>
            </tr>
          </thead>
          <tbody>
            {mengulang && mengulang.length > 0 ? (
              mengulang.map((course, index) => (
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
                    {course.periode.map((periode) => periode.periodeAkademik)}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.periode.map((periode) => periode.sks)}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.periode.map((periode) => periode.semester)}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {course.periode.map((periode) => periode.nilai)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  <h3 className="font-semibold text-lg">
                    Mahasiswa Tidak Pernah Mengulang Mata Kuliah
                  </h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
