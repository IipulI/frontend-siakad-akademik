import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Check, Eye, Pen, RefreshCw, Search, Settings, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import React from "react";
import DetailAdvisorLecturer from "./DetailAdvisorLecturer";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../hooks/useDebounce";
import { Api } from "../../../api/Index";
import SelectOption from "../../../components/lecturer/SelectOption";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";

export default function AdvisorLecturer() {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedKRS, setSelectedKRS] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const debouncedSearch = useDebounce(search, 1000);
  
  const { data: periodeAkademikDropdown } = useQuery({
    queryKey: ["/periode-akademik/dropdown"],
    queryFn: () => Api.get(`/periode-akademik/dropdown`),
  });

  useEffect(() => {
    if (periodeAkademikDropdown?.data?.data?.length > 0 && !selectedPeriode) {
      setSelectedPeriode(periodeAkademikDropdown?.data.data[0].namaPeriode);
    }
  }, [periodeAkademikDropdown, selectedPeriode]);



  const { data: studentData, isPending } = useQuery({
    queryKey: [
      "dosen/pembimbing-akademik/all",
      currentPage,
      debouncedSearch,
      selectedPeriode,
    ],
    queryFn: () =>
      Api.get(
        `/dosen/pembimbing-akademik/all?page=${currentPage}&keyword=${debouncedSearch}&periodeAkademik=${selectedPeriode}`
      ),
    enabled: !!selectedPeriode,
  });

  const periodeOptions = periodeAkademikDropdown?.data?.data?.map((item: any) => ({
    value: item.namaPeriode,
    label: item.namaPeriode,
  })) || [];

  const krsOptions = [{value: "Disetujui", label: "Disetujui"}, {value: "Tidak Disetujui", label: "Tidak Disetujui"}]
  const mahasiswaOptions = [{value: "Aktif", label: "Aktif"}, {value: "Tidak Aktif", label: "Tidak Aktif"}]
  const semesterOptions = [{value: "1", label: "1"}, {value: "2", label: "2"}, {value: "3", label: "3"}, {value: "4", label: "4"}, {value: "5", label: "5"}, {value: "6", label: "6"}, {value: "7", label: "7"}, {value: "8", label: "8"}, {value: "9", label: "9"}, {value: "10", label: "10"}, {value: "11", label: "11"}, {value: "12", label: "12"}, {value: "13", label: "13"}, {value: "14", label: "14"}]
  const options = [{value: "Semua", label: "Semua"}]

  return (
    <MainLayout isGreeting={false} titlePage="Pembimbing Akademik">
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
          <SelectOption
            label="Periode Akademik"
            options={periodeOptions}
            value={selectedPeriode}
            onChange={setSelectedPeriode}
          />
          <SelectOption
            label="Status Pembimbing"
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
          />
          <SelectOption
            label="Semester"
            options={semesterOptions}
            value={selectedSemester}
            onChange={setSelectedSemester}
          />
          <SelectOption
            label="Unit Kerja"
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
          />
          <SelectOption
            label="Status KRS"
            options={krsOptions}
            value={selectedKRS}
            onChange={setSelectedKRS}
          />
          <SelectOption
            label="Status Mahasiswa"
            options={mahasiswaOptions}
            value={selectedMahasiswa}
            onChange={setSelectedMahasiswa}
          />
          <SelectOption
            label="Angkatan"
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
          />
          </div>

          <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
            <div className="flex justify-between">
              <div className="flex gap-8">
                <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-primary-brown border p-1">
                  <option value={"Semua"}>Semua</option>
                </select>
                <div className="flex">
                  <input
                    type="search"
                    placeholder="Cari Mahasiswa"
                    className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded shadow-md border border-black/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                    <Search color="white" size={20} />
                  </button>
                  <button
                    className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center"
                  >
                    <RefreshCw
                      color="white"
                      size={20}
                      className={isPending ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>

            </div>

            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center w-6">
                      <input type="checkbox" className="w-4 h-4" />
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Nama Mahasiswa
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Angkatan
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Status Smt
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Smt
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Batas SKS
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Total SKS
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      IPS
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      IPK
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      KRS Diajukan
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      KRS Disahkan
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Pembimbing Akademik
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    <tr>
                      <td colSpan={13} className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    studentData?.data.data.map((record: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <input type="checkbox" className="w-4 h-4" />
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-sm">
                          {record.mahasiswa}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.angkatan}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.statusMahasiswa}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.semester}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.batasSks}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.totalSks}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.ips}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.ipk}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center">
                            {record.statusDiajukan ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center">
                            {record.statusDisetujui ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-sm">
                          {record.pembimbingAkademik}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <ButtonClick
                              icon={<Pen size={16} />}
                              color="bg-primary-yellow"
                              onClick={() => navigate(LecturerRoute.guidance.detailAdvisor)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {isPending ? (
              <div className="flex px-4 w-full items-center justify-between">
                <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
                <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (
              <Pagination
                currentPage={currentPage}
                totalPages={studentData?.data.pagination.totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                totalRows={studentData?.data.pagination.totalItems}
                onRowsPerPageChange={setRowsPerPage}
              />
            )}
          </div>
    </MainLayout>
  );
}
