import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableOBE } from "../../../components/Table";
import { Search } from "lucide-react";

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
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Program Studi</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Jenjang</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-Semua-</option>
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
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm flex items-center gap-2">
            <div className="flex items-center bg-sky-100 mr-3">
              <div className="w-2 h-7 bg-blue-500 mr-3 "></div>
              <span className="pr-3">
                Hal {currentPage} / {totalPages} ({data.length} data, 0,031 Detik)
              </span>
            </div>

            {/* Dropdown for items per page */}
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="rounded px-3 py-2 border border-primary-brown">
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>

          <div className="flex items-center">
            {/* Pagination buttons */}
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center">
              &lt;&lt;
            </button>
            <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center">
              &lt;
            </button>

            {/* Page numbers */}
            {pageNumbers.map((number) => (
              <button key={number} onClick={() => setCurrentPage(number)} className={`w-8 h-8 ${currentPage === number ? "bg-primary-green text-white" : "bg-white border border-gray-300"}`}>
                {number}
              </button>
            ))}

            <button onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)} disabled={currentPage === totalPages} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center">
              &gt;
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center">
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OBEManagement;
