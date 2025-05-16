import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableCurriculumProdi } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash } from "lucide-react";

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
      prasyarat: "Algoritma dan Pemrograman",
      konsentrasiBidang: "Informatika",
    },
    {
      id: 3,
      no: 3,
      kode: "CS103",
      mataKuliah: "Matematika Diskrit",
      sks: "3",
      status: "Pilihan",
      nilaiMin: "C",
      prasyarat: "-",
      konsentrasiBidang: "Informatika",
    },
  ]);

  return (
    <MainLayout isGreeting={false} titlePage="Mata Kuliah" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-64">
            <span>Program Studi</span>
            <select className="rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 w-64">
            <span>Kurikulum</span>
            <select className="rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-primary-yellow text-white rounded px-4 py-2 flex items-center gap-1">
            <Plus size={16} />
            Salin
          </button>
          <button className="bg-primary-blueSoft text-white rounded px-4 py-2 flex items-center gap-1">
            <RefreshCw size={16} />
            Cetak
          </button>
        </div>
      </div>

      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-64">
            <span>Mata Kuliah</span>
            <select className="rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 w-64">
            <span>Semester</span>
            <select className="rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 w-64">
            <span>Nilai</span>
            <select className="rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>
        </div>

        {/* Checkbox Section */}
        <div className="flex flex-col gap-2 text-primary-green">
          <h3 className="font-bold">Opsi Tambahan</h3>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showPassed" className="w-4 h-4" />
            <label htmlFor="showPassed" className="font-semibold">
              MK Wajib
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showFailed" className="w-4 h-4 " />
            <label htmlFor="showFailed" className="font-semibold">
              Paket MK
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-primary-green text-white rounded px-4 py-2 flex items-center gap-1">
            <Plus size={16} />
            Tambah
          </button>
        </div>
      </div>

      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow p-8">
        {/* Table Rendering */}
        <div className="mt-4">
          <TableCurriculumProdi data={data} tableHead={["No", "Kode", "Mata Kuliah", "SKS", "Status", "Nilai Min", "Prasyarat", "Konsentrasi", "Aksi"]} error="Data tidak ditemukan." />
        </div>
      </div>
    </MainLayout>
  );
};

export default CurriculumProdi;
