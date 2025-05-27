import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TableCourseManagement } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash, Settings } from "lucide-react";

interface CourseData {
  id: number;
  kurikulum: string;
  kode: string;
  mataKuliah: string;
  sks: number;
  jenisMK: string;
  prodiPengampu: string;
}

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CourseData[]>([
    {
      id: 1,
      kurikulum: "2024",
      kode: "CS101",
      mataKuliah: "Algoritma dan Pemrograman",
      sks: 3,
      jenisMK: "Wajib",
      prodiPengampu: "Informatika",
    },
    {
      id: 2,
      kurikulum: "2025",
      kode: "CS102",
      mataKuliah: "Struktur Data",
      sks: 3,
      jenisMK: "Wajib",
      prodiPengampu: "Informatika",
    },
    {
      id: 3,
      kurikulum: "2026",
      kode: "CS103",
      mataKuliah: "Matematika Diskrit",
      sks: 3,
      jenisMK: "Pilihan",
      prodiPengampu: "Informatika",
    },
  ]);

  // State checkbox selected ids
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<CourseData | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Handler toggle select all checkbox di header
  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item.id));
    }
  };

  // Handler toggle checkbox per baris
  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleEdit = (id: number) => {
    const selectedData = data.find((item) => item.id === id);
    if (selectedData) {
      setCurrentData(selectedData);
      setIsEditing(true);
    }
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    // juga hapus dari selectedIds kalau ada
    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleAdd = () => {
    navigate(AdminAcademicRoute.courseManagement.addCourse);
  };

  const handleSave = () => {
    if (currentData) {
      if (isAdding) {
        setData([...data, currentData]);
        setIsAdding(false);
      } else {
        const updatedData = data.map((item) => (item.id === currentData.id ? currentData : item));
        setData(updatedData);
      }
      setIsEditing(false);
      setCurrentData(null);
    }
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentData) {
      if (name === "sks") {
        const sksValue = parseInt(value);
        if (!isNaN(sksValue)) {
          setCurrentData({ ...currentData, [name]: sksValue });
        }
      } else {
        setCurrentData({ ...currentData, [name]: value });
      }
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <MainLayout isGreeting={false} titlePage="Mata Kuliah" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">2025 Ganjil</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Jenis Mata Kuliah</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">Kuliah</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Kelompok Mata Kuliah</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">MKK</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Unit / Prodi Pengampu</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-- Universitas Ibn Khaldun --</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-green mt-8">
        <div className="flex px-4 py-2 gap-4 border-b-2">
          <select className="rounded px-3 py-1 border border-primary-brown w-35">
            <option value="all">-Semua-</option>
          </select>
          <div className="flex">
            <input type="search" placeholder="Cari Kelas Kuliah" className="px-3 py-1 w-72 rounded-l-md border border-black/50" />
            <button className="bg-primary-yellow w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
              <RefreshCw color="white" size={20} />
            </button>
          </div>
          <div className="flex ml-auto gap-2">
            <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white flex items-center cursor-pointer">
              <Plus className="mr-2" size={16} />
              Tambah
            </button>

            <button
              onClick={() => {
                setData(data.filter((item) => !selectedIds.includes(item.id)));
                setSelectedIds([]);
              }}
              className="bg-red-500 rounded py-2 px-4 text-white flex items-center"
            >
              <Trash className="mr-2" size={16} />
              Hapus
            </button>

            <button className="bg-primary-yellow rounded py-2 px-4 text-white flex items-center">
              <Settings className="mr-2" size={16} />
              Aksi
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="mt-8">
          <TableCourseManagement
            data={paginatedData}
            tableHead={["Combo BOX", "Kurikulum", "Kode", "Mata Kuliah", "SKS", "Jenis MK", "Prodi Pengampu", "Aksi"]}
            error="Data tidak ditemukan."
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelect={(id) => {
              if (id === -1) {
                toggleSelectAll();
              } else {
                toggleSelectOne(id);
              }
            }}
            isEditing={isEditing}
            currentData={currentData}
            onSave={handleSave}
            onReset={handleReset}
            onInputChange={handleInputChange}
            isAdding={isAdding}
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

            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="rounded px-3 py-2 border border-primary-brown">
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

export default CourseManagement;
