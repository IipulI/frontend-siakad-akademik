import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { FileDown } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement";
import { useStudentData } from "../../../hooks/admin-akademik/useMahasiswa";
import { getMonitoring, exportMonitoringPdf, MonitoringJenis, MonitoringFilters } from "../../../hooks/academic/useObeMonitoring";

const JENIS_OPTIONS: { value: MonitoringJenis; label: string }[] = [
  { value: "cpl-prodi", label: "CPL per Program Studi" },
  { value: "cpl-mahasiswa", label: "CPL per Mahasiswa" },
  { value: "cpl-mata-kuliah", label: "CPL per Mata Kuliah" },
  { value: "mk-mahasiswa", label: "Mata Kuliah per Mahasiswa" },
  { value: "transkrip-obe", label: "Transkrip OBE" },
  { value: "cpmk-mahasiswa", label: "CPMK per Mahasiswa" },
];

export default function ObeMonitoring() {
  const [jenis, setJenis] = useState<MonitoringJenis>("cpl-prodi");
  const [filters, setFilters] = useState<MonitoringFilters>({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 50, prodiId: filters.prodiId, tahunKurikulumId: filters.tahunKurikulumId });
  const { data: mhsResponse } = useStudentData(1, 50, "", filters.prodiId || "", "", "", filters.angkatan || "");

  const { data: results, isLoading, isFetching } = getMonitoring(jenis, filters);

  const mkList: any[] = Array.isArray(mkResponse?.data) ? mkResponse.data : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];
  const mhsList = mhsResponse?.data || [];

  const showMetode = jenis !== "transkrip-obe";
  const showAngkatan = jenis !== "transkrip-obe";
  const showCpl = jenis === "mk-mahasiswa";
  const showMataKuliah = jenis === "cpmk-mahasiswa";
  const showMahasiswa = jenis === "transkrip-obe";

  const updateFilter = (patch: Partial<MonitoringFilters>) => setFilters((prev) => ({ ...prev, ...patch }));

  const handleJenisChange = (value: MonitoringJenis) => {
    setJenis(value);
    setFilters({});
  };

  const handleExport = async () => {
    setExportError("");
    setIsExporting(true);
    try {
      await exportMonitoringPdf(jenis, filters);
    } catch (error: any) {
      setExportError(error?.message || "Gagal mengunduh PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const rows: any[] = results || [];
  const columns = rows.length > 0 ? Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== "object") : [];

  return (
    <MainLayout isGreeting={false} titlePage="Monitoring & Export PDF OBE">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Monitoring &amp; Export</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex gap-2 mb-5 border-b border-gray-200 flex-wrap">
            {JENIS_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => handleJenisChange(o.value)}
                className={`px-3 py-2 text-xs md:text-sm font-semibold border-b-2 ${
                  jenis === o.value ? "border-primary-green text-primary-green" : "border-transparent text-gray-500"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Tahun Kurikulum</label>
              <select value={filters.tahunKurikulumId || ""} onChange={(e) => updateFilter({ tahunKurikulumId: e.target.value })} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih --</option>
                {curriculumData.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.tahun}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Program Studi</label>
              <select value={filters.prodiId || ""} onChange={(e) => updateFilter({ prodiId: e.target.value })} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih --</option>
                {prodiData.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.namaProgramStudi}</option>
                ))}
              </select>
            </div>
            {showAngkatan && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Angkatan</label>
                <input type="text" value={filters.angkatan || ""} onChange={(e) => updateFilter({ angkatan: e.target.value })} placeholder="mis. 2023" className="w-full border border-gray-300 rounded p-2 text-sm" />
              </div>
            )}
            {showMetode && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Metode</label>
                <select value={filters.metode || ""} onChange={(e) => updateFilter({ metode: e.target.value as "rerata" | "progresif" })} className="w-full border border-gray-300 rounded p-2 text-sm">
                  <option value="">-- Pilih --</option>
                  <option value="rerata">Rerata</option>
                  <option value="progresif">Progresif</option>
                </select>
              </div>
            )}
            {showCpl && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Kode CPL</label>
                <input type="text" value={filters.cpl || ""} onChange={(e) => updateFilter({ cpl: e.target.value })} placeholder="mis. CPL01" className="w-full border border-gray-300 rounded p-2 text-sm" />
              </div>
            )}
            {showMataKuliah && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Mata Kuliah</label>
                <select value={filters.mataKuliahId || ""} onChange={(e) => updateFilter({ mataKuliahId: e.target.value })} className="w-full border border-gray-300 rounded p-2 text-sm">
                  <option value="">-- Pilih --</option>
                  {mkList.map((mk: any) => (
                    <option key={mk.id} value={mk.id}>{mk.kode} - {mk.nama}</option>
                  ))}
                </select>
              </div>
            )}
            {showMahasiswa && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Mahasiswa</label>
                <select value={filters.mahasiswaId || ""} onChange={(e) => updateFilter({ mahasiswaId: e.target.value })} className="w-full border border-gray-300 rounded p-2 text-sm">
                  <option value="">-- Pilih --</option>
                  {mhsList.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.npm} - {m.nama}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={handleExport}
              disabled={isExporting || rows.length === 0}
              className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50 hover:bg-purple-700"
            >
              <FileDown size={16} /> {isExporting ? "Mengunduh..." : "Export PDF"}
            </button>
          </div>

          {exportError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{exportError}</div>}

          {isLoading || isFetching ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-500">Lengkapi filter di atas untuk menampilkan data monitoring.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0b5c77] text-white text-xs">
                    {columns.map((col) => (
                      <th key={col} className="p-2 border capitalize">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.id || idx} className="text-center">
                      {columns.map((col) => (
                        <td key={col} className="p-2 border">{String(row[col] ?? "-")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
