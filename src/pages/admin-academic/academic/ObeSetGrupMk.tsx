import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Edit, Trash2 } from "lucide-react";

const ObeSetGrupMk: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");

  const { data: curriculumData = [] } = getCurriculumYear();

  // Dummy data since endpoint is not available
  const dummyData = [
    { id: 1, kurikulumId: "all", grup: "Matematika", mataKuliah: "5520101 - Matematika Diskrit" },
    { id: 2, kurikulumId: "all", grup: "Pemrograman Dasar", mataKuliah: "5520102 - Algoritma dan Pemrograman" },
    { id: 3, kurikulumId: "all", grup: "Rekayasa Perangkat Lunak", mataKuliah: "5520103 - Analisis dan Desain Sistem" },
  ];

  const filteredData = dummyData.filter(item => {
    if (selectedGroup !== "all" && item.grup !== selectedGroup) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Get unique groups for the filter dropdown
  const uniqueGroups = Array.from(new Set(dummyData.map(item => item.grup)));

  return (
    <MainLayout isGreeting={false} titlePage="Set Grup Mata Kuliah Wajib Pilihan">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Set Grup Mata Kuliah Wajib Pilihan</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Kurikulum</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedCurriculum}
                onChange={(e) => { setSelectedCurriculum(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                {curriculumData.map((item) => (
                  <option key={item.id} value={item.id}>{item.tahun}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Grup Mata Kuliah</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedGroup}
                onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                {uniqueGroups.map((grup, idx) => (
                  <option key={idx} value={grup}>{grup}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm">
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-12">No</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Grup MK</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Mata Kuliah</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{item.grup}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs border border-gray-200">
                          {item.mataKuliah}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                      Tidak ada data Grup Mata Kuliah
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {filteredData.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeSetGrupMk;
