import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Search, Eye, Edit, Trash2 } from "lucide-react";

const ObeTemplateEvaluasi: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedJenis, setSelectedJenis] = useState("all");

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();

  // Dummy data since endpoint is not available
  const dummyData = [
    { id: 1, kurikulum: "S1 - Teknik Informatika 2024", kodeProdi: "55201", programStudi: "S1 - Teknik Informatika", jenis: "Kuliah" },
    { id: 2, kurikulum: "S1 - Teknik Mesin 2024", kodeProdi: "22201", programStudi: "S1 - Teknik Mesin", jenis: "Praktikum" },
    { id: 3, kurikulum: "S1 - Manajemen 2023", kodeProdi: "61201", programStudi: "S1 - Manajemen", jenis: "Kuliah" },
  ];

  const filteredData = dummyData.filter(item => {
    if (selectedJenis !== "all" && item.jenis !== selectedJenis) return false;
    // other filters can be added here if needed for dummy data
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <MainLayout isGreeting={false} titlePage="Template Evaluasi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Template Evaluasi</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum</label>
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
              <label className="text-sm font-semibold text-gray-700">Jenis Mata Kuliah</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedJenis}
                onChange={(e) => { setSelectedJenis(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                <option value="Kuliah">Kuliah</option>
                <option value="Praktikum">Praktikum</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Program Studi</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedProdi}
                onChange={(e) => { setSelectedProdi(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                {prodiData.map((prodi) => (
                  <option key={prodi.id} value={prodi.id}>{prodi.nama}</option>
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
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Kurikulum</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Kode Prodi</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Program Studi</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-center">Jenis Mata Kuliah</th>
                  <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-32">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{item.kurikulum}</td>
                      <td className="border border-gray-200 px-4 py-2">{item.kodeProdi}</td>
                      <td className="border border-gray-200 px-4 py-2">{item.programStudi}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{item.jenis}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded" title="Detail">
                            <Eye size={16} />
                          </button>
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
                    <td colSpan={6} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                      Tidak ada data Template Evaluasi
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

export default ObeTemplateEvaluasi;
