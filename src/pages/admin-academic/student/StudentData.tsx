import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import TableStudent from "../../../components/admin-academic/student-data/TableStudent";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import {
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useState } from "react";
import Status from "../../../components/admin-academic/student-data/Status";
import { useNavigate } from "react-router-dom";

export default function StudentData() {
  const categoryOptions = [{ value: "", label: "Semua Kategori" }];

  const sampleData = [
    {
      id: "22110804305",
      name: "Maulana Ikhsan",
      level: "S1",
      program: "TI",
      entryYear: "20242",
      status: "A",
      semester: 7,
      credits: 40,
      gpa: 3.73,
    },
    {
      id: "22110804291",
      name: "Moraginda Pangabean",
      level: "S1",
      program: "MNJ",
      entryYear: "20242",
      status: "A",
      semester: 7,
      credits: 96,
      gpa: 3.53,
    },
    {
      id: "22110804201",
      name: "Muhammad Virzha",
      level: "S1",
      program: "AK",
      entryYear: "20242",
      status: "A",
      semester: 7,
      credits: 36,
      gpa: 3.78,
    },
    {
      id: "22110804908",
      name: "Muhammad Zikri",
      level: "S1",
      program: "TM",
      entryYear: "20242",
      status: "A",
      semester: 7,
      credits: 32,
      gpa: 3.9,
    },
    {
      id: "22110804032",
      name: "Arka Fadilah Rahman",
      level: "S1",
      program: "SI",
      entryYear: "20242",
      status: "A",
      semester: 7,
      credits: 12,
      gpa: 4,
    },
    {
      id: "22110804018",
      name: "Aufa Akhdan",
      level: "S1",
      program: "HKM",
      entryYear: "20242",
      status: "A",
      semester: 7,
      credits: 29,
      gpa: 3.92,
    },
  ];

  // function buat search
  function SearchSubmit() {
    alert("submit");
  }
  function Refres() {
    window.location.reload();
  }

  // function buat tambah, hapus, cetak dan aksi
  const navigate = useNavigate();
  function Create() {
    navigate("/portal/mahasiswa/data-mahasiswa");
  }
  function Delete() {
    alert("delete");
  }
  function Print() {
    alert("print");
  }
  function Setting() {
    alert("aksi");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <MainLayout titlePage="Mahasiswa" isGreeting={false}>
      {/* filter */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter options={categoryOptions} label="Unit / Program Studi" />
        <InputFilter options={categoryOptions} label="Angkatan" />
        <InputFilter options={categoryOptions} label="Status Mahasiswa" />
        <InputFilter options={categoryOptions} label="Sistem Kuliah" />
        <InputFilter options={categoryOptions} label="Jenis Pendaftaran" />
        <InputFilter options={categoryOptions} label="Jalur Pendaftaran" />
        <InputFilter options={categoryOptions} label="Gelombang" />
        <InputFilter options={categoryOptions} label="Kurikulum" />
        <InputFilter options={categoryOptions} label="Kelas Perkuliahan" />
        <InputFilter options={categoryOptions} label="Range IPK" />
        <InputFilter options={categoryOptions} label="Jenis Kelamin" />
        <InputFilter options={categoryOptions} label="Periode Masuk" />
        <InputFilter options={categoryOptions} label="Periode Keluar" />
      </div>

      {/* tabel mahasiswa */}
      <div className="border-t-2 border-primary-green bg-white mt-5 p-1 rounded-sm shadow-sm pb-4">
        <div className="my-4 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
            <select name="" id="" className="p-1 text-xs border-1 rounded w-30">
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
            />
            <ButtonClick
              icon={<Trash2 size={15} />}
              color="bg-red-400"
              text="Hapus"
              onClick={Delete}
            />
            <ButtonClick
              icon={<Printer size={15} strokeWidth={2.5} />}
              color="bg-primary-blueSoft"
              text="Cetak"
              onClick={Print}
            />
            <ButtonClick
              icon={<Settings size={15} strokeWidth={2.5} />}
              color="bg-primary-yellow"
              text="Aksi"
              onClick={Setting}
            />
          </div>
        </div>
        <TableStudent data={sampleData} />

        <Pagination
          currentPage={currentPage}
          totalPages={1000}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={65}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
      <Status />
      <div className="py-5"></div>
    </MainLayout>
  );
}
