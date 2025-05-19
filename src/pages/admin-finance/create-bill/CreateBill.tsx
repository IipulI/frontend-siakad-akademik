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
import Table from "../../../components/admin-finance/Tabel";

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

  const headers: string[] = [
    "NPM",
    "Nama",
    "Fakultas",
    "Program Studi",
    "Semester",
  ];

  const studentData = [
    {
      id: "1",
      npm: "221106043035",
      nama: "Maulana Ikhsan",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
    {
      id: "2",
      npm: "221106042918",
      nama: "Maraginda Pangabean",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
    },
    {
      id: "3",
      npm: "221106043035",
      nama: "Alexander",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
    {
      id: "4",
      npm: "221106042918",
      nama: "Gabriella",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
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

          <Table headers={headers} data={studentData} showCheckbox={true} />

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
