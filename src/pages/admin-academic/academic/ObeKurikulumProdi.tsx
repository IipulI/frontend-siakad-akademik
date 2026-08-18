import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getJenjang } from "../../../hooks/academic/useJenjang";
import { useRekapSks } from "../../../hooks/academic/useKurikulumProdi";
import { Pagination } from "../../../components/admin-academic/Pagination";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Eye, ChevronDown, LineChart } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const MONITORING_OPTIONS = [
  { value: "cpl-prodi", label: "CPL per Program Studi" },
  { value: "cpl-mahasiswa", label: "CPL per Mahasiswa" },
  { value: "cpl-mata-kuliah", label: "CPL per Mata Kuliah" },
  { value: "mk-mahasiswa", label: "Mata Kuliah per Mahasiswa" },
  { value: "transkrip-obe", label: "Transkrip OBE Mahasiswa" },
  { value: "cpmk-mahasiswa", label: "CPMK per Mahasiswa" },
];

const ObeKurikulumProdi: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [showMonitoringMenu, setShowMonitoringMenu] = useState(false);
  const monitoringMenuRef = useRef<HTMLDivElement>(null);

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: jenjangData = [] } = getJenjang();

  const { data: rekapResult, isLoading } = useRekapSks({
    jenjangId: selectedLevel,
    prodiId: selectedProdi,
    tahunKurikulumId: selectedCurriculum,
    page: currentPage,
    limit: itemsPerPage,
  });

  const items = rekapResult?.items || [];
  const totalPages = rekapResult?.totalPage || 1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (monitoringMenuRef.current && !monitoringMenuRef.current.contains(e.target as Node)) {
        setShowMonitoringMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLihatDetail = (item: { prodiId: string; tahunKurikulumId: string }) => {
    navigate(`${AdminAcademicRoute.obeManagement.kurikulumProdiDetail}?prodiId=${item.prodiId}&tahunKurikulumId=${item.tahunKurikulumId}`);
  };

  const handlePilihMonitoring = (jenis: string) => {
    setShowMonitoringMenu(false);
    navigate(`${AdminAcademicRoute.obeManagement.monitoring}?jenis=${jenis}`);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Kurikulum Prodi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Kurikulum Prodi</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum</label>
              <SearchableSelect
                value={selectedCurriculum}
                onChange={(v) => { setSelectedCurriculum(v); setCurrentPage(1); }}
                placeholder="-- Semua Tahun Kurikulum --"
                searchPlaceholder="Cari tahun kurikulum..."
                options={[{ value: "all", label: "-- Semua Tahun Kurikulum --" }, ...curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Jenjang Pendidikan</label>
              <SearchableSelect
                value={selectedLevel}
                onChange={(v) => { setSelectedLevel(v); setCurrentPage(1); }}
                placeholder="-- Semua Jenjang Pendidikan --"
                searchPlaceholder="Cari jenjang..."
                options={[{ value: "all", label: "-- Semua Jenjang Pendidikan --" }, ...jenjangData.map((j: any) => ({ value: j.id, label: j.jenjang || j.nama }))]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Program Studi</label>
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
            <div className="relative" ref={monitoringMenuRef}>
              <button
                onClick={() => setShowMonitoringMenu((prev) => !prev)}
                className="bg-primary-blueDark text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
              >
                <LineChart size={16} /> Monitoring <ChevronDown size={14} className={`transition-transform ${showMonitoringMenu ? "rotate-180" : ""}`} />
              </button>
              {showMonitoringMenu && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                  {MONITORING_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => handlePilihMonitoring(o.value)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-primary-green text-white text-sm">
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-12" rowSpan={2}>No</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Kurikulum</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Kode Prodi</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Program Studi</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" colSpan={3}>Distribusi SKS</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-24" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-primary-green text-white text-sm">
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">Wajib</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">Pilihan</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <tr key={`${item.tahunKurikulumId}-${item.prodiId}`} className="text-sm text-gray-700 hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.tahun}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.kodeProdi}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.programStudi}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.sksWajib}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.sksPilihan}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">{item.totalSks}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleLihatDetail(item)}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded"
                              title="Detail"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                        Tidak ada data Kurikulum Prodi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {items.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  rowsPerPage={itemsPerPage}
                  totalRows={rekapResult?.total || 0}
                  onRowsPerPageChange={(rows) => { setItemsPerPage(rows); setCurrentPage(1); }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeKurikulumProdi;
