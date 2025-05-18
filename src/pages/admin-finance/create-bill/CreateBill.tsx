import {
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import MainLayout from "../../../components/layouts/MainLayout";
import { useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";

export default function CreateBill() {
  const angkatan = [{ value: "", label: "-- Pilih Angkatan --" }];
  const fakultas = [{ value: "", label: "-- Pilih Fakultas --" }];
  const semester = [{ value: "", label: "-- Pilih Semester --" }];
  const programStudi = [{ value: "", label: "-- Pilih Program Studi --" }];

  function SearchSubmit() {
    alert("oke search");
  }
  function Refres() {
    window.location.reload();
  }
  function Create() {
    alert("oke");
  }
  function Setting() {
    alert("oke");
  }

  const students = [
    {
      id: "1",
      npm: "221106043035",
      nama: "Maulana Ikhsan",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
      selected: false,
    },
    {
      id: "2",
      npm: "221106042918",
      nama: "Maraginda Pangabean",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
      selected: false,
    },
    {
      id: "3",
      npm: "221106043035",
      nama: "Alexander",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
      selected: false,
    },
    {
      id: "4",
      npm: "221106042918",
      nama: "Gabriella",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
      selected: false,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <MainLayout isGreeting={false} titlePage="Buat Tagihan">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:px-20 lg:px-40 md:gap-x-10 p-2 rounded-sm shadow-sm gap-2 bg-white">
          <InputFilter options={angkatan} label="Angkatan" />
          <InputFilter options={fakultas} label="Fakultas" />
          <InputFilter options={semester} label="Semester" />
          <InputFilter options={programStudi} label="Program Studi" />
        </div>
        <div className="mt-3 shadow-md bg-white p-2">
          <h1 className="text-lg sm:text-2xl font-semibold">
            Daftar Nama Mahasiswa
          </h1>
          <div className="my-3 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
              <select
                name=""
                id=""
                className="p-1 text-xs border-1 rounded w-30"
              >
                <option value="semua">-- Semua --</option>
              </select>

              <div className="flex items-center">
                <input
                  type="text"
                  className="border-2 p-1 rounded text-xs w-50  "
                  placeholder="Cari Kelas Kuliah"
                />
                <ButtonClick
                  icon={<Search size={16} strokeWidth={3} />}
                  color="bg-primary-yellow"
                  onClick={SearchSubmit}
                />
                <ButtonClick
                  icon={<RefreshCw size={16} strokeWidth={3} />}
                  color="bg-blue-900"
                  onClick={Refres}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <ButtonClick
                icon={<Plus size={15} strokeWidth={3} />}
                color="bg-primary-green"
                text="Tambah"
                onClick={Create}
                spacing="1"
              />
              <ButtonClick
                icon={<Settings size={15} strokeWidth={2.5} />}
                color="bg-primary-yellow"
                text="Aksi"
                onClick={Setting}
                spacing="1"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-primary-green text-white p-2 border border-gray-500 font-semibold">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="bg-primary-green text-white p-2 border border-gray-500 font-semibold">
                    NPM
                  </th>
                  <th className="bg-primary-green text-white p-2 border border-gray-500 font-semibold">
                    Nama
                  </th>
                  <th className="bg-primary-green text-white p-2 border border-gray-500 font-semibold">
                    Fakultas
                  </th>
                  <th className="bg-primary-green text-white p-2 border border-gray-500 font-semibold">
                    Program Studi
                  </th>
                  <th className="bg-primary-green text-white p-2 border border-gray-500 font-semibold">
                    Semester
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <input
                        type="checkbox"
                        checked={student.selected}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {student.npm}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {student.nama}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {student.fakultas}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {student.programStudi}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {student.semester}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={1000}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            totalRows={65}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>
      </div>
    </MainLayout>
  );
}
