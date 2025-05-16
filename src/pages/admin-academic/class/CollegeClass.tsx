import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Eye, Link2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/admin-academic/student-data/Pagination";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";

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

  const refresh = () => {
    alert("refresh");
  };
  const searchSubmit = () => {
    alert("Search");
  };

  const Create = () => {
    location(AdminAcademicRoute.collegeClass.createClass);
  };

  const Delete = () => {
    alert("Delete");
  };
  return (
    <MainLayout isGreeting={false} titlePage="Kelas Kuliah">
      <div className="space-y-4">
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
          <InputFilter
            select={true}
            options={periodOptions}
            label="Periode Akademik"
          />
          <InputFilter
            select={true}
            options={prodiOptions}
            label="Prodi Pengampu"
          />
          <InputFilter
            select={true}
            options={systemOptions}
            label="Sistem Kuliah"
          />
          <InputFilter
            select={true}
            options={curiculumOptions}
            label="Tahun Kurikulum"
          />
        </div>
        <BorderedGreenContainer>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-50  "
                placeholder="Cari Kelas Kuliah"
              />
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
            <div className="flex space-x-3">
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
          <div className="px-6">
            <CollegeClassTable data={sampleData} />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={1000}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            totalRows={65}
            onRowsPerPageChange={setRowsPerPage}
          />
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

  // Update selectAll state based on selectedItems changes
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="py-2 px-4 border font-semibold border-gray-300">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Thn. Kur.
            </th>
            <th className="p-2 border font-semibold border-gray-300">Kode</th>
            <th className="p-2 border font-semibold border-gray-300">
              Mata Kuliah
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Prodi Pengampu
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Nama Kelas
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Pengajar
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Jadwal Mingguan
            </th>
            <th className="p-2 border font-semibold border-gray-300">Kap</th>
            <th className="p-2 border font-semibold border-gray-300">Pst.</th>
            <th className="p-2 border font-semibold border-gray-300">
              Status Penilaian
            </th>
            <th className="p-2 border font-semibold border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 text-center border border-gray-300 font-semibold">
                <input
                  type="checkbox"
                  checked={!!selectedItems[student.id]}
                  onChange={() => handleSelectOne(student.id)}
                />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                {student.year}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.code}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.subject}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.program}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.class}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.lecturer}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.weeklySchedule}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.kap}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.pst}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.status}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <div className="flex justify-center space-x-2">
                  <ButtonClick
                    icon={<Link2 size={15} />}
                    color={"bg-primary-yellow"}
                    onClick={Link}
                  />
                  <ButtonClick
                    icon={<Eye size={15} />}
                    color={"bg-primary-blueSoft"}
                    onClick={Detail}
                  />
                  <ButtonClick
                    icon={<Trash2 size={15} />}
                    color={"bg-red-400"}
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
