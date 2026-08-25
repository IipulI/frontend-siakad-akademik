import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getJenjang } from "../../../hooks/academic/useJenjang";
import { useManajemenCapaian, exportLaporanLengkapPdf } from "../../../hooks/academic/useObeManajemenCapaian";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Eye, Printer, X } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const ObeManajemenCapaian: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: jenjangData = [] } = getJenjang();

  const { data: result, isLoading } = useManajemenCapaian({
    tahunKurikulumId: selectedCurriculum,
    prodiId: selectedProdi,
    jenjangId: selectedLevel,
    page: currentPage,
    limit: itemsPerPage,
  });

  const items = result?.items || [];
  const totalPages = result?.totalPage || 1;
  const rowKey = (item: (typeof items)[number]) => item.idObe || `${item.kurikulum}-${item.kodeProdi}`;

  const toggleSelectRow = (key: string) => {
    setSelectedRowKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleSelectAll = () => {
    if (selectedRowKeys.length === items.length) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(items.map((item) => rowKey(item)));
    }
  };

  const handleCetakLaporan = async () => {
    const idObeList = items.filter((item) => selectedRowKeys.includes(rowKey(item)) && item.idObe).map((item) => item.idObe as string);
    if (idObeList.length === 0) {
      setShowInfoModal(true);
      return;
    }
    setExportError("");
    setIsExporting(true);
    try {
      await exportLaporanLengkapPdf(idObeList);
    } catch (error: any) {
      setExportError(error?.message || "Gagal mencetak laporan.");
    } finally {
      setIsExporting(false);
    }
  };

  const badge = (value: number | null, suffix = "") => {
    if (value === null) return <span className="text-gray-400">-</span>;
    const isPositive = value > 0;
    return (
      <span
        className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
          isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
        }`}
      >
        {value}
        {suffix}
      </span>
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen Capaian">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Manajemen Capaian</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary-yellow">Tahun Kurikulum</label>
              <SearchableSelect
                value={selectedCurriculum}
                onChange={(v) => { setSelectedCurriculum(v); setCurrentPage(1); }}
                placeholder="-- Semua Tahun Kurikulum --"
                searchPlaceholder="Cari tahun kurikulum..."
                options={[{ value: "all", label: "-- Semua Tahun Kurikulum --" }, ...curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary-yellow">Jenjang Pendidikan</label>
              <SearchableSelect
                value={selectedLevel}
                onChange={(v) => { setSelectedLevel(v); setCurrentPage(1); }}
                placeholder="-- Semua Jenjang Pendidikan --"
                searchPlaceholder="Cari jenjang..."
                options={[{ value: "all", label: "-- Semua Jenjang Pendidikan --" }, ...jenjangData.map((j: any) => ({ value: j.id, label: `${j.jenjang} - ${j.nama}` }))]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary-yellow">Program Studi</label>
              <SearchableSelect
                value={selectedProdi}
                onChange={(v) => { setSelectedProdi(v); setCurrentPage(1); }}
                placeholder="-- Semua Program Studi --"
                searchPlaceholder="Cari program studi..."
                options={[{ value: "all", label: "-- Semua Program Studi --" }, ...prodiData.map((p: any) => ({ value: p.id, label: p.nama }))]}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCetakLaporan}
              disabled={isExporting}
              className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Printer size={16} /> {isExporting ? "Mencetak..." : "Cetak Laporan"}
            </button>
          </div>

          {exportError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{exportError}</div>}

          {isLoading ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-primary-green text-white text-sm">
                    <th className="border border-gray-300 px-3 py-2 text-center w-10" rowSpan={2}>
                      <input type="checkbox" checked={items.length > 0 && selectedRowKeys.length === items.length} onChange={toggleSelectAll} />
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left" rowSpan={2}>Kurikulum</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left" rowSpan={2}>Program Studi</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left" rowSpan={2}>Ketua Program Studi</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center" colSpan={4}>Status Pengisian</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center w-20" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-primary-green text-white text-xs">
                    <th className="border border-gray-300 px-2 py-2 font-semibold text-center">PL</th>
                    <th className="border border-gray-300 px-2 py-2 font-semibold text-center">CPL</th>
                    <th className="border border-gray-300 px-2 py-2 font-semibold text-center">PL &rarr; CPL</th>
                    <th className="border border-gray-300 px-2 py-2 font-semibold text-center">CPL &rarr; MK</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => {
                      const key = rowKey(item);
                      return (
                        <tr key={key} className="text-sm text-gray-700 hover:bg-gray-50">
                          <td className="border border-gray-200 px-3 py-2 text-center">
                            <input type="checkbox" checked={selectedRowKeys.includes(key)} onChange={() => toggleSelectRow(key)} disabled={!item.idObe} />
                          </td>
                          <td className="border border-gray-200 px-4 py-2">{item.kurikulum}</td>
                          <td className="border border-gray-200 px-4 py-2">{item.programStudi}</td>
                          <td className="border border-gray-200 px-4 py-2">{item.ketuaProgramStudi}</td>
                          <td className="border border-gray-200 px-2 py-2 text-center">{badge(item.statusPengisian.pl)}</td>
                          <td className="border border-gray-200 px-2 py-2 text-center">{badge(item.statusPengisian.cpl)}</td>
                          <td className="border border-gray-200 px-2 py-2 text-center">{badge(item.statusPengisian.persentasePlCpl, "%")}</td>
                          <td className="border border-gray-200 px-2 py-2 text-center">{badge(item.statusPengisian.persentaseCplMk, "%")}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Detail"
                              disabled={!item.idObe}
                              onClick={() => item.idObe && navigate(`${AdminAcademicRoute.obeManagement.detailOBE}/${item.idObe}`)}
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                        Tidak ada data Manajemen Capaian
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {items.length > 0 && (
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
              )}
            </div>
          )}
        </div>
      </div>

      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button onClick={() => setShowInfoModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary-yellow text-white flex items-center justify-center font-bold mb-3">i</div>
            <h4 className="text-lg font-bold text-gray-800 mb-1">Informasi</h4>
            <p className="text-sm text-gray-600 mb-4">Silakan pilih data yang akan dicetak</p>
            <button
              onClick={() => setShowInfoModal(false)}
              className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold w-full hover:opacity-90"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ObeManajemenCapaian;
