import { Check, RefreshCw, Search, Settings, X } from "lucide-react";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import Table from "../../../components/admin-finance/Tabel";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";

export default function StudentBill() {
  const periode = [{ value: "", label: "2025 Ganjil" }];
  const semester = [{ value: "", label: "7" }];
  const angkatan = [{ value: "", label: "-- Pilih Angkatan --" }];
  const fakultas = [{ value: "", label: "-- Pilih Fakultas --" }];
  const programStudi = [{ value: "", label: "-- Pilih Program Studi --" }];

  const usenavigate = useNavigate();
  function SearchSubmit() {
    alert("oke search");
  }

  function Refres() {
    window.location.reload();
  }

  const headers = [
    "Kode Tagihan",
    "NIM",
    "Nama",
    "Nominal",
    "Tanggal Tenggat",
    "Tanggal Bayar",
    "Lunas",
  ];

  const studentData = [
    {
      id: 1,
      kodeTagihan: "INV/20242/0000001",
      NIM: "221106041234",
      nama: "MUHAMMAD RIDHO FATHAN",
      nominal: "Rp 2.000.000",
      tanggalTenggat: "Senin, 28 Maret 2024",
      tanggalBayar: "-",
      lunas: (
        <div className="flex justify-center">
          <X color="red" size={16} />
        </div>
      ),
    },
    {
      id: 2,
      kodeTagihan: "2211060642918",
      NIM: "Maraginda Pangabean",
      nama: "MUHAMMAD RIDHO FATHAN",
      nominal: "Rp 900.000",
      tanggalTenggat: "Senin, 28 Maret 2024",
      tanggalBayar: "Senin, 28 Maret 2024",
      lunas: (
        <div className="flex justify-center">
          <Check color="green" size={16} />
        </div>
      ),
    },
  ];

  function handleView() {
    usenavigate(AdminFinanceRoute.detailStudentBill);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <MainLayout isGreeting={false} titlePage="Tagihan Mahasiswa">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-10 p-5 rounded-sm shadow-md gap-2 bg-white">
        <h1 className="text-lg sm:text-2xl col-span-1 md:col-span-3 mb-2 font-semibold">
          Urutkan Berdasarkan
        </h1>
        <InputFilter options={periode} label="Periode Akademik" />
        <InputFilter
          options={periode}
          label="NIM"
          select={false}
          placeholder="Masukkan NIM"
        />
        <InputFilter options={fakultas} label="Fakultas" />
        <InputFilter options={semester} label="Semester" />
        <InputFilter
          options={periode}
          label="Nama"
          select={false}
          placeholder="Masukkan Nama Mahasiswa"
        />
        <InputFilter options={programStudi} label="Program Studi" />
        <InputFilter options={angkatan} label="Angkatan" />
      </div>

      <div className="rounded-sm bg-white shadow-md p-2 mt-2">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Data Tagihan Mahasiswa
        </h1>

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

          <div className="flex bg-primary-yellow items-center rounded p-1 px-2 w-fit">
            <Settings color="white" size={17} />
            <select
              name=""
              id=""
              className=" text-white rounded font-semibold text-sm w-16"
            >
              <option value="" className="bg-white text-black">
                Aksi
              </option>
              <option value="" className="bg-white text-black">
                Tandai Lunas
              </option>
            </select>
          </div>
        </div>
        <Table
          headers={headers}
          data={studentData}
          actions={{
            view: () => handleView(),
          }}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1000}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={65}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </MainLayout>
  );
}
