import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Eye, Link2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { getCollegeClasses } from "../../../hooks/useKelasKuliah";
import LoadingSpinner from "../../../components/LoadingSpinner";

const sampleData = [
  {
    id: "22110804305",
    year: "2024",
    code: "TIF302",
    subject: "Kapita Selekta",
    program: "S1 - Teknik Informatika",
    class: "REG_B",
    lecturer: "Maulana Ikhsan",
    weeklySchedule: "",
    kap: 40,
    pst: 0,
    status: "Sudah",
  },
  {
    id: "22110804306",
    year: "2024",
    code: "TIF302",
    subject: "Kapita Selekta",
    program: "S1 - Teknik Informatika",
    class: "REG_B",
    lecturer: "Maulana Ikhsan",
    weeklySchedule: "",
    kap: 40,
    pst: 0,
    status: "Sudah",
  },
  {
    id: "22110804307",
    year: "2024",
    code: "TIF302",
    subject: "Kapita Selekta",
    program: "S1 - Teknik Informatika",
    class: "REG_B",
    lecturer: "Maulana Ikhsan",
    weeklySchedule: "",
    kap: 40,
    pst: 0,
    status: "Sudah",
  },
  {
    id: "22110804308",
    year: "2024",
    code: "TIF302",
    subject: "Kapita Selekta",
    program: "S1 - Teknik Informatika",
    class: "REG_B",
    lecturer: "Maulana Ikhsan",
    weeklySchedule: "",
    kap: 40,
    pst: 0,
    status: "Sudah",
  },
  {
    id: "22110804309",
    year: "2024",
    code: "TIF302",
    subject: "Kapita Selekta",
    program: "S1 - Teknik Informatika",
    class: "REG_B",
    lecturer: "Maulana Ikhsan",
    weeklySchedule: "",
    kap: 40,
    pst: 0,
    status: "Sudah",
  },
];

interface Classes {
  id: string;
  year: string;
  code: string;
  subject: string;
  program: string;
  class: string;
  lecturer: string;
  weeklySchedule: string;
  kap: number;
  pst: number;
  status: string;
}

interface CollegeClassTableProps {
  data: Classes[];
}

const CollegeClass = () => {
  const systemOptions = [{ value: "", label: "Semua Sistem Kuliah" }];
  const periodOptions = [{ value: "", label: "2025 Ganjil" }];
  const prodiOptions = [{ value: "", label: "Universitas Ibnu Khaldun" }];
  const curiculumOptions = [{ value: "", label: "Semua Kurikulum" }];

  const location = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const refresh = () => alert("refresh");
  const searchSubmit = () => alert("Search");
  const Create = () => location(AdminAcademicRoute.collegeClass.createClass);
  const Delete = () => alert("Delete");

  const { data, isLoading, error } = getCollegeClasses();

  if (isLoading) {
    return <LoadingSpinner title="Kelas Kuliah" />;
  }

  if (error) {
    return <div>Terjadi Kesalahan Dalam Mengambil Data</div>;
  }

  return (
    <MainLayout isGreeting={false} titlePage="Kelas Kuliah">
      <div className="space-y-4">
        {/* FILTER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-white border-t-2 border-primary-yellow p-3 rounded shadow-sm">
          <InputFilter
            select
            options={periodOptions}
            label="Periode Akademik"
          />
          <InputFilter select options={prodiOptions} label="Prodi Pengampu" />
          <InputFilter select options={systemOptions} label="Sistem Kuliah" />
          <InputFilter
            select
            options={curiculumOptions}
            label="Tahun Kurikulum"
          />
        </div>

        {/* ACTIONS & TABLE */}
        <BorderedGreenContainer>
          <div className="flex flex-col lg:flex-row justify-between gap-2 items-start lg:items-center">
            {/* SEARCH + REFRESH */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                className="border-2 p-2 rounded text-sm w-full sm:w-[240px]"
                placeholder="Cari Kelas Kuliah"
              />
              <div className="flex gap-1">
                <ButtonClick
                  icon={<Search size={16} strokeWidth={3} />}
                  color="bg-primary-yellow"
                  onClick={searchSubmit}
                />
                <ButtonClick
                  icon={<RefreshCw size={16} strokeWidth={3} />}
                  color="bg-blue-900"
                  onClick={refresh}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2">
              <ButtonClick
                icon={<Plus size={15} strokeWidth={3} />}
                color="bg-primary-green"
                text="Tambah"
                onClick={Create}
              />
              <ButtonClick
                icon={<Trash2 size={15} />}
                color="bg-red-400"
                text="Hapus"
                onClick={Delete}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto mt-4">
            <CollegeClassTable data={data} />
          </div>

          {/* PAGINATION */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={1000}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalRows={65}
              onRowsPerPageChange={setRowsPerPage}
            />
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const CollegeClassTable = ({ data }: CollegeClassTableProps) => {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const allChecked =
      data.length > 0 && data.every((item) => selectedItems[item.id]);
    setSelectAll(allChecked);
  }, [selectedItems, data]);

  const handleSelectAll = () => {
    const newChecked = !selectAll;
    const updated: { [key: string]: boolean } = {};
    data.forEach((item) => {
      updated[item.id] = newChecked;
    });
    setSelectedItems(updated);
  };

  const handleSelectOne = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function Link() {
    alert("link");
  }

  function Detail() {
    navigate(AdminAcademicRoute.collegeClass.detailClass);
  }

  function Remove() {
    alert("remove");
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1000px] w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white text-sm">
            <th className="py-2 px-4 border font-semibold border-gray-300">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Thn. Kur.
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Kode
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Mata Kuliah
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Prodi Pengampu
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Nama Kelas
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Pengajar
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Jadwal Mingguan
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Kap
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Pst.
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Status Penilaian
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50 text-sm">
              <td className="py-2 px-4 text-center border border-gray-300 font-semibold">
                <input
                  type="checkbox"
                  checked={!!selectedItems[student.id]}
                  onChange={() => handleSelectOne(student.id)}
                />
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                {student.periodeAkademik}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                {student.mataKuliah.kodeMataKuliah}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-left break-words">
                {student.mataKuliah.namaMataKuliah}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-left break-words">
                {`${student.programStudi.jenjang.jenjang} - ${student.programStudi.namaProgramStudi}`}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                {student.nama}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-left break-words">
                {student.dosen.map((dosen, i) => (
                  <span key={i} className="block">
                    {dosen}
                  </span>
                ))}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center break-words">
                {student.jadwalMingguan.map((jadwal, i) => (
                  <span key={i} className="block">
                    {jadwal}
                  </span>
                ))}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                {student.kapasitas}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                {student.peserta}
              </td>
              <td className="p-2 border border-gray-300 font-medium text-center break-words">
                {student.statusPenilaian}
              </td>
              <td className="p-2 border border-gray-300 font-medium">
                <div className="flex justify-center flex-wrap gap-1">
                  <ButtonClick
                    icon={<Link2 size={15} />}
                    color="bg-primary-yellow"
                    onClick={Link}
                  />
                  <ButtonClick
                    icon={<Eye size={15} />}
                    color="bg-primary-blueSoft"
                    onClick={Detail}
                  />
                  <ButtonClick
                    icon={<Trash2 size={15} />}
                    color="bg-red-400"
                    onClick={Remove}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeClass;
