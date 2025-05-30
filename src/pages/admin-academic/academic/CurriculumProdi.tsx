import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableCurriculumProdi } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash, Save } from "lucide-react";

interface CurriculumProdiData {
  id: number;
  no: number;
  kode: string;
  mataKuliah: string;
  sks: string;
  status: string;
  nilaiMin: string;
  prasyarat: string;
  konsentrasiBidang: string;
}

const CurriculumProdi: React.FC = () => {
  const [data, setData] = useState<CurriculumProdiData[]>([
    {
      id: 1,
      no: 1,
      kode: "CS101",
      mataKuliah: "Algoritma dan Pemrograman",
      sks: "3",
      status: "Wajib",
      nilaiMin: "C",
      prasyarat: "-",
      konsentrasiBidang: "Informatika",
    },
    {
      id: 2,
      no: 2,
      kode: "CS102",
      mataKuliah: "Struktur Data",
      sks: "3",
      status: "Wajib",
      nilaiMin: "C",
      prasyarat: "-",
      konsentrasiBidang: "Informatika",
    },
    {
      id: 3,
      no: 3,
      kode: "CS103",
      mataKuliah: "Matematika Diskrit",
      sks: "3",
      status: "Wajib",
      nilaiMin: "C",
      prasyarat: "-",
      konsentrasiBidang: "Informatika",
    },
  ]);

  return (
    <MainLayout isGreeting={false} titlePage="Kurikulum Prodi" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 flex flex-col items-center justify-between gap-4 md:flex-row ">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:mb-0">
          <div className="flex items-center gap-2 w-full  md:w-96 ">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">Program Studi</span>
            <select className="rounded px-3 py-2 border border-primary-brown flex-1 ">
              <option value="all">-- Semua Status --</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-72">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">Kurikulum</span>
            <select className="rounded px-3 py-2 border border-primary-brown flex-1 ">
              <option value="all">-- 2024 --</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 ">
          <button className="bg-primary-yellow text-white rounded px-6 py-2 flex items-center gap-1">
            <Save size={16} />
            Salin
          </button>
          <button className="bg-primary-blueSoft text-white rounded px-6 py-2 flex items-center gap-1">
            <Save size={16} />
            Cetak
          </button>
        </div>
      </div>

      <div className="w-full bg-white py-4 border-t-2 border-primary-green">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 px-4 md:px-8 max-w-screen-lg mx-auto">
          {/* Filter Section */}
          <div className="flex flex-col gap-4 md:flex-row w-full">
            <div className="flex flex-col gap-2 w-full md:w-96">
              <span className="text-primary-green font-semibold">Mata Kuliah</span>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold">
                  <option value="all">-- Cari Mata Kuliah --</option>
                  <option value="CS101">TIF152 - Basis data + praktikum - 3 sks</option>
                  <option value="CS102">TIF451 - Komputasi Berbasis Jaringan + praktikum - 3sks</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">Semester</span>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold">
                  <option value="all">-- 2024 --</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">Nilai</span>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold">
                  <option value="all">-- Pilih Nilai --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Checkbox & Button Section */}
          <div className="flex flex-col gap-3 md:gap-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-2 text-primary-green">
              <h3 className="font-bold">Opsi Tambahan</h3>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="showPassed" className="w-4 h-4" />
                  <label htmlFor="showPassed" className="font-semibold">
                    MK Wajib
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="showFailed" className="w-4 h-4" />
                  <label htmlFor="showFailed" className="font-semibold">
                    Paket MK
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="bg-primary-green text-white rounded px-4 py-2 flex items-center gap-1 ">
                <Plus size={16} />
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow p-8">
        {/* Table Rendering */}
        <div className="mt-8 ">
          <TableCurriculumProdi data={data} tableHead={["No", "Kode", "Mata Kuliah", "SKS", "Status", "Nilai Min", "Prasyarat", "Konsentrasi", "Aksi"]} error="Data tidak ditemukan." />
        </div>
      </div>
    </MainLayout>
  );
};

export default CurriculumProdi;
