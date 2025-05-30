import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Search, Plus, CornerUpLeft } from "lucide-react";
import { TableRpsManagement } from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes.tsx";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";

interface RPSData {
  id: number;
  kodeMk: string;
  mataKuliah: string;
  dosenPenyusun: string;
  smt: string;
  sks: string;
  kelas: string;
}

const RpsManagement: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<RPSData[]>([
    {
      id: 1,
      kodeMk: "IF101",
      mataKuliah: "Algoritma dan Pemrograman",
      dosenPenyusun: "Dr. Siti Aisyah",
      smt: "1",
      sks: "3",
      kelas: "A",
    },
    {
      id: 2,
      kodeMk: "IF102",
      mataKuliah: "Struktur Data",
      dosenPenyusun: "Dr. Rahmat Hidayat",
      smt: "2",
      sks: "3",
      kelas: "B",
    },
    {
      id: 3,
      kodeMk: "IF103",
      mataKuliah: "Basis Data",
      dosenPenyusun: "Dr. Budi Santoso",
      smt: "3",
      sks: "3",
      kelas: "C",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleAdd = () => {
    navigate(AdminAcademicRoute.rpsManagement.addRps);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            { label: "Tahun Kurikulum", value: "2021" },
            { label: "Program Studi", value: "2025 Genap" },
            { label: "Jenjang", value: "S1 - Teknik Informatika" },
            { label: "Status Kelas", value: "-- Semua Status --" },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <label className="w-36 text-gray-700">{item.label}</label>
              <select className="flex-1 rounded px-2 py-1 border border-primary-brown">
                <option value="all">{item.value}</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0">
          <div className="flex flex-row">
            <input type="search" placeholder="Cari Program Studi" className="px-3 py-1 w-full md:w-72 rounded-l-md border border-black/50" />
            <button className="bg-primary-yellow rounded-r-md w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
          </div>

          <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white ml-auto w-full md:w-36 flex items-center justify-center">
            <Plus className="mr-2" size={16} />
            <span className="text-center w-full md:w-auto">Tambah</span>
          </button>
        </div>

        {/* Tabel RPS */}
        <div className="mt-4">
          <TableRpsManagement data={paginatedData} onEdit={(id) => console.log("Edit id:", id)} onDelete={(id) => setData((prev) => prev.filter((item) => item.id !== id))} />
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} onRowsPerPageChange={setItemsPerPage} />
      </div>
    </MainLayout>
  );
};

export default RpsManagement;
