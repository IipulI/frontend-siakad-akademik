import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Plus, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ObeTahunKurikulum: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: curriculumData = [], isLoading } = getCurriculumYear();

  const totalPages = Math.ceil(curriculumData.length / itemsPerPage);
  const currentData = curriculumData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  return (
    <MainLayout isGreeting={false} titlePage="Tahun Kurikulum">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Tahun Kurikulum</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Tahun Kurikulum</h2>
            <button className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Plus size={16} />
              Tambah Data
            </button>
          </div>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm">
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-12" rowSpan={2}>No</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" rowSpan={2}>Tahun</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" rowSpan={2}>Tanggal Awal</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" rowSpan={2}>Tanggal Akhir</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" rowSpan={2}>Mulai Berlaku</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Keterangan</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" colSpan={2}>Program Studi</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-24" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-gray-50 text-gray-700 text-sm">
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">OBE</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">Non OBE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.tahun}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{formatDate(item.tanggalMulai)}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{formatDate(item.tanggalAkhir)}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{formatDate(item.mulaiBerlaku)}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.keterangan || "-"}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center text-blue-600 font-medium cursor-pointer hover:underline">S1 - Teknik Informatika (1)</td>
                        <td className="border border-gray-200 px-4 py-2 text-center text-blue-600 font-medium cursor-pointer hover:underline">S1 - Rekayasa Perangkat Lunak (1)</td>
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
                      <td colSpan={9} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                        Tidak ada data Tahun Kurikulum
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {curriculumData.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeTahunKurikulum;
