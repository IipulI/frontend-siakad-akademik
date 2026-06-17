import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Check, Pen, Settings, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import React from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import SelectOption from "../../../components/lecturer/SelectOption";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import SearchBar from "../../../components/SearchBar";
import { useAcademicGuidanceList, useAcceptKRS, useRejectKRS } from "../../../hooks/lecturer/useFetchGuidance";
import { useAcademicPeriodDropdown, useStudyProgramDropdown } from "../../../hooks/lecturer/useFetchDropdown";
import { IAcademicPeriod, IStudyProgram } from "../../../types/dropdown";

export default function AdvisorLecturer() {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    periode: "",
    krs: "",
    semester: "",
    mahasiswa: "",
    angkatan: "",
    prodi: "",
  });
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  
  const { data: periodeAkademikDropdown } = useAcademicPeriodDropdown()
  const { data: programStudiDropdown } = useStudyProgramDropdown()
  
  const { data: studentData, isPending } = useAcademicGuidanceList(filters.periode, filters.prodi, filters.angkatan, filters.krs, debouncedSearch, filters.mahasiswa, filters.semester, currentPage, rowsPerPage)
  
  const periodeOptions = periodeAkademikDropdown?.data?.map((item: IAcademicPeriod) => ({
    value: item.id,
    label: item.nama,
  })) || [];

  const unitKerjaOptions = programStudiDropdown?.data?.map((item: IStudyProgram) => ({
    value: item.nama,
    label: item.nama,
  })) || [];

  unitKerjaOptions.unshift({
    value: "",
    label: "Semua"
  })
  
  useEffect(() => {
    if (periodeAkademikDropdown?.data?.length > 0) {
      setFilters(prev => ({
        ...prev,
        periode: periodeAkademikDropdown?.data[0].id
      }));
    }
  }, [periodeAkademikDropdown]);

  useEffect(() => {
    if(filters.periode !== "") {
      localStorage.setItem("id_periode_akademik", filters.periode)
    }
  }, [filters.periode])
  

  const krsOptions = [{value: "", label: "Semua"}, {value: "Disetujui", label: "Disetujui"}, {value: "Ditolak", label: "Ditolak"}, {value: "Diajukan", label: "Diajukan"},]
  const mahasiswaOptions = [{value: "", label: "Semua"}, {value: "Aktif", label: "Aktif"}, {value: "Tidak Aktif", label: "Tidak Aktif"}]
  const semesterOptions = [{value: "", label: "Semua"}, {value: "1", label: "1"}, {value: "2", label: "2"}, {value: "3", label: "3"}, {value: "4", label: "4"}, {value: "5", label: "5"}, {value: "6", label: "6"}, {value: "7", label: "7"}, {value: "8", label: "8"}, {value: "9", label: "9"}, {value: "10", label: "10"}, {value: "11", label: "11"}, {value: "12", label: "12"}, {value: "13", label: "13"}, {value: "14", label: "14"}]
  const options = [{value: "Semua", label: "Semua"}]

  const filterOptions = [
    { label: "Periode Akademik", key: "periode", options: periodeOptions },
    { label: "Semester", key: "semester", options: semesterOptions },
    { label: "Unit Kerja", key: "prodi", options: unitKerjaOptions },
    { label: "Status KRS", key: "krs", options: krsOptions },
    { label: "Status Mahasiswa", key: "mahasiswa", options: mahasiswaOptions },
    { label: "Angkatan", key: "angkatan", options },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { mutate: accept } = useAcceptKRS(
    (data) => {
      alert(data.message);
      setSelectedIds([]);
    },
    (error) => {
      alert(error);
    }
  );

  const { mutate: reject } = useRejectKRS(
    (data) => {
      alert(data.message);
      setSelectedIds([]);
    },
    (error) => {
      alert(error);
    }
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = studentData?.data.map((record: any) => record.id) || [];
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectOne = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "setujui") {
      if (selectedIds.length === 0) {
        alert("Pilih mahasiswa terlebih dahulu.");
        return;
      }
      accept({ krsIds: selectedIds });
    } else if (e.target.value === "tolak") {
      if (selectedIds.length === 0) {
        alert("Pilih mahasiswa terlebih dahulu.");
        return;
      }
      reject({ krsIds: selectedIds });
    }
    e.target.value = ""
  };

  return (
    <MainLayout isGreeting={false} titlePage="Pembimbing Akademik">
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
          {filterOptions.map(({label, key, options}) => (
            <SelectOption
              key={key}
              label={label}
              options={options}
              value={filters[key]}
              onChange={(val) => setFilters(prev => ({ ...prev, [key]: val }))}
            />
          ))}
        </div>
          <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
              <div className="flex-1 max-w-md">
                <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari Mahasiswa" />
              </div>
              <div className="flex bg-primary-yellow items-center justify-between rounded p-1 px-2 h-10 w-full sm:w-auto self-end sm:self-auto">
                <Settings color="white" size={17} />
                <select
                  name="aksi"
                  id="aksi"
                  className="text-white rounded font-semibold text-sm w-full sm:w-16 bg-transparent border-none outline-none cursor-pointer"
                  onChange={handleAction}
                >
                  <option value="" className="bg-white text-black">
                    Aksi
                  </option>
                  <option value="setujui" className="bg-white text-black">
                    Setujui KRS
                  </option>
                  <option value="tolak" className="bg-white text-black">
                    Tolak KRS
                  </option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center w-6">
                      <input type="checkbox" className="w-4 h-4" checked={selectedIds.length === (studentData?.data.length || 0) && studentData?.data.length > 0} onChange={handleSelectAll} />
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
                    studentData?.data.map((record: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record?.krsTerbaru?.id ? (
                            <input type="checkbox" className="w-4 h-4" checked={selectedIds.includes(record?.krsTerbaru?.id)} onChange={handleSelectOne(record?.krsTerbaru?.id)} />
                          ) : (
                            <input type="checkbox" className="w-4 h-4" disabled />
                          )}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-sm">
                          {record.nama}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.angkatan}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record?.statusMahasiswa.nama}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.semester}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.batasSks}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record?.krsTerbaru?.sksDiambil}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record?.hasilStudiTerbaru?.ips}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record?.hasilStudiTerbaru?.ipk}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center">
                            {(record?.krsTerbaru?.status === 'Diajukan' || record?.krsTerbaru?.status === 'Disetujui') ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center">
                            {record?.krsTerbaru?.status === 'Disetujui' ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-sm">
                          {record?.pembimbingDosen?.dosen?.nama}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <ButtonClick
                              icon={<Pen size={16} />}
                              color="bg-primary-yellow"
                              onClick={() => {
                                localStorage.setItem("id_mahasiswa", record.id);
                                localStorage.setItem("id_krs", record?.krsTerbaru?.id || "");
                                localStorage.setItem("mahasiswa_nama", record.nama || "");
                                localStorage.setItem("mahasiswa_nim", record.nim || record.username || "");
                                localStorage.setItem("mahasiswa_semester", record.semester || "");
                                localStorage.setItem("mahasiswa_batas_sks", record.batasSks || "");
                                localStorage.setItem("mahasiswa_status_krs", record?.krsTerbaru?.status || "");
                                localStorage.setItem("mahasiswa_pembimbing", record?.pembimbingDosen?.dosen?.nama || "");
                                navigate(LecturerRoute.guidance.detailAdvisor);
                              }}
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
                totalPages={studentData?.pagination.totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                totalRows={studentData?.pagination.totalItems}
                onRowsPerPageChange={setRowsPerPage}
              />
            )}
          </div>
    </MainLayout>
  );
}
