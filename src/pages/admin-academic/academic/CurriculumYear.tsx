import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableCurriculumYear } from "../../../components/Table";
import { RefreshCw, Search, Plus, Save, Trash2, Edit } from "lucide-react";

interface CurriculumData {
  id: number;
  tahun: string;
  Keterangan: string;
  mulaiBerlaku: string;
  tanggalAwal: string;
  tanggalAkhir: string;
}

const CurriculumYear: React.FC = () => {
  const [data, setData] = useState<CurriculumData[]>([
    {
      id: 1,
      tahun: "2024",
      Keterangan: "Kurikulum 2024",
      mulaiBerlaku: "2024 Ganjil",
      tanggalAwal: "2024-01-01",
      tanggalAkhir: "2024-12-31",
    },
    {
      id: 2,
      tahun: "2025",
      Keterangan: "Kurikulum 2025",
      mulaiBerlaku: "2024 Ganjil",
      tanggalAwal: "2025-01-01",
      tanggalAkhir: "2025-12-31",
    },
    {
      id: 3,
      tahun: "2026",
      Keterangan: "Kurikulum 2026",
      mulaiBerlaku: "2024 Ganjil",
      tanggalAwal: "2026-01-01",
      tanggalAkhir: "2026-12-31",
    },
  ]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<CurriculumData | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleEdit = (id: number) => {
    const selectedData = data.find((item) => item.id === id);
    if (selectedData) {
      setCurrentData(selectedData);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    setErrorMessage("");
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: Date.now(),
      tahun: "",
      Keterangan: "",
      mulaiBerlaku: "",
      tanggalAwal: "",
      tanggalAkhir: "",
    });
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(currentData?.tahun && currentData?.Keterangan && currentData?.mulaiBerlaku && currentData?.tanggalAwal && currentData?.tanggalAkhir);
  };

  const handleSave = () => {
    if (!currentData) return;

    if (!isFormValid()) {
      setErrorMessage("Semua kolom harus diisi sebelum menyimpan.");
      return;
    }

    setErrorMessage("");

    if (isEditing) {
      const updatedData = data.map((item) => (item.id === currentData.id ? currentData : item));
      setData(updatedData);
      setIsEditing(false);
    } else if (isAdding) {
      setData([currentData, ...data]);
      setIsAdding(false);
    }

    setCurrentData(null);
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Page numbers array
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <MainLayout isGreeting={false} titlePage="Tahun Kurikulum" className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow">
        <div className="flex px-4 py-2 gap-4 border-b-2">
          <select className="rounded px-3 py-1 border border-primary-brown w-35">
            <option value="all">-Semua-</option>
          </select>

          <div className="flex">
            <input type="search" placeholder="Cari Tahun Kurikulum" className="px-3 py-1 w-72 rounded-l-md border border-black/50" />
            <button className="bg-primary-yellow w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
              <RefreshCw color="white" size={20} />
            </button>
          </div>

          <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white ml-auto flex items-center cursor-pointer ">
            <Plus className="mr-2" size={16} />
            Tambah
          </button>
        </div>

        {/* Tampilkan error validasi */}
        {errorMessage && <p className="text-red-600 mt-4 mx-4">{errorMessage}</p>}

        {/* Tabel */}
        <div className="mt-8">
          <TableCurriculumYear
            data={paginatedData}
            tableHead={["Tahun", "Keterangan", "Mulai Berlaku", "Tanggal Awal", "Tanggal Akhir", "Aksi"]}
            error="Data tidak ditemukan."
            onEdit={handleEdit}
            onDelete={handleDelete}
            isEditing={isEditing}
            currentData={currentData}
            onSave={handleSave}
            onReset={handleReset}
            onInputChange={handleInputChange}
            isAdding={isAdding}
            isFormValid={isFormValid} // pass isFormValid ke table
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm flex items-center gap-2">
            <div className="flex items-center bg-sky-100 mr-3">
              <div className="w-2 h-7 bg-blue-500 mr-3 "></div>
              <span className="pr-3">
                Hal {currentPage} / {totalPages} ({data.length} data, 0,031 Detik)
              </span>
            </div>

            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="rounded px-3 py-1 border border-primary-brown">
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>

          <div className="flex items-center">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center">
              &lt;&lt;
            </button>
            <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center">
              &lt;
            </button>

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

export default CurriculumYear;
