import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Eye, Search, RefreshCw } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useRekapTahunKurikulum } from "../../../hooks/academic/useRekapTahunKurikulum";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

type SearchField = "all" | "tahun" | "tanggalAwal" | "tanggalAkhir" | "mulaiBerlaku" | "keterangan";

const SEARCH_FIELD_OPTIONS: { value: SearchField; label: string }[] = [
  { value: "all", label: "-- Semua --" },
  { value: "tahun", label: "Tahun" },
  { value: "tanggalAwal", label: "Tanggal Awal" },
  { value: "tanggalAkhir", label: "Tanggal Akhir" },
  { value: "mulaiBerlaku", label: "Mulai Berlaku" },
  { value: "keterangan", label: "Keterangan" },
];

const ObeTahunKurikulum: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchField, setSearchField] = useState<SearchField>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: result, isLoading } = useRekapTahunKurikulum({ page: currentPage, limit: itemsPerPage });

  const allItems = result?.items || [];
  const items = allItems.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (searchField === "all") {
      return (
        item.tahun?.toLowerCase().includes(term) ||
        item.tanggalAwal?.toLowerCase().includes(term) ||
        item.tanggalAkhir?.toLowerCase().includes(term) ||
        item.mulaiBerlaku?.toLowerCase().includes(term) ||
        item.keterangan?.toLowerCase().includes(term)
      );
    }
    return String(item[searchField] || "").toLowerCase().includes(term);
  });
  const totalPages = result?.totalPage || 1;

  return (
    <MainLayout isGreeting={false} titlePage="Tahun Kurikulum">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Tahun Kurikulum</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-0 mb-4 w-full md:w-auto">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as SearchField)}
              className="border border-gray-300 rounded-l-md p-2 text-sm bg-white w-full md:w-40"
            >
              {SEARCH_FIELD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Cari Tahun Kurikulum"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border-t border-b border-gray-300 text-sm outline-none focus:ring-1 focus:ring-primary-green w-full md:w-72"
            />
            <button className="bg-primary-green text-white p-2.5 flex items-center justify-center">
              <Search size={16} />
            </button>
            <button
              onClick={() => { setSearchTerm(""); setSearchField("all"); }}
              className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-primary-green text-white text-sm">
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center" rowSpan={2}>Tahun</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center" rowSpan={2}>Tanggal Awal</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center" rowSpan={2}>Tanggal Akhir</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center" rowSpan={2}>Mulai Berlaku</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left" rowSpan={2}>Keterangan</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center" colSpan={2}>Program Studi</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center w-20" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-primary-green text-white text-sm">
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center">OBE</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center">Non OBE</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.tahun}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.tanggalAwal}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.tanggalAkhir}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.mulaiBerlaku}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.keterangan}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.prodiObe}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.prodiNonObe}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <button
                            onClick={() => navigate(`${AdminAcademicRoute.obeManagement.tahunKurikulumDetail}/${item.id}`)}
                            className="bg-primary-blueSoft hover:opacity-90 text-white p-1.5 rounded"
                            title="Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                        Tidak ada data Tahun Kurikulum
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  rowsPerPage={itemsPerPage}
                  totalRows={result?.total || 0}
                  onRowsPerPageChange={(rows) => { setItemsPerPage(rows); setCurrentPage(1); }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeTahunKurikulum;
