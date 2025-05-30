import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableOBE } from "../../../components/Table";
import { Search } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";

interface OBEData {
  id: number;
  kodeProdi: string;
  programStudi: string;
  ketuaProdi: string;
  pl: boolean;
  cpl: boolean;
  plToCpl: boolean;
  cpmk: boolean;
}

const OBEManagement: React.FC = () => {
  const [data, setData] = useState<OBEData[]>([
    { id: 1, kodeProdi: "IF001", programStudi: "Informatika", ketuaProdi: "Dr. Siti Aisyah", pl: true, cpl: false, plToCpl: true, cpmk: true },
    { id: 2, kodeProdi: "SI001", programStudi: "Sistem Informasi", ketuaProdi: "Dr. Rahmat Hidayat", pl: false, cpl: true, plToCpl: false, cpmk: false },
    { id: 3, kodeProdi: "TI001", programStudi: "Teknik Industri", ketuaProdi: "Dr. Budi Santoso", pl: true, cpl: true, plToCpl: true, cpmk: false },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const tableHead = ["Kode Prodi", "Program Studi", "Ketua Prodi", "PL", "CPL", "PL → CPL", "CPMK", "Aksi"];

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen OBE">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">2025</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Program Studi</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-- Semua Program Studi --</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Jenjang</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-- Semua Jenjang --</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex">
          <input type="search" placeholder="Cari Program Studi" className="px-3 py-1 w-72 rounded-l-md border border-black/50" />
          <button className="bg-primary-yellow rounded-r-md w-10 flex items-center justify-center">
            <Search color="white" size={20} />
          </button>
        </div>

        {/* Tabel OBE */}
        <div className="mt-4">
          <TableOBE data={paginatedData} tableHead={tableHead} />
        </div>

        {/* Pagination info and controls */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} onRowsPerPageChange={setItemsPerPage} />
      </div>
    </MainLayout>
  );
};

export default OBEManagement;
