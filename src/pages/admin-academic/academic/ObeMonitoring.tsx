import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useSearchParams } from "react-router-dom";
import { Eye, ExternalLink } from "lucide-react";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement";
import { useStudentData } from "../../../hooks/admin-akademik/useMahasiswa";
import { exportMonitoringPdf, MonitoringJenis, MonitoringFilters, REQUIRED_FILTERS } from "../../../hooks/academic/useObeMonitoring";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const JENIS_OPTIONS: { value: MonitoringJenis; label: string }[] = [
  { value: "cpl-prodi", label: "CPL per Program Studi" },
  { value: "cpl-mahasiswa", label: "CPL per Mahasiswa" },
  { value: "cpl-mata-kuliah", label: "CPL per Mata Kuliah" },
  { value: "mk-mahasiswa", label: "Mata Kuliah per Mahasiswa" },
  { value: "transkrip-obe", label: "Transkrip OBE Mahasiswa" },
  { value: "cpmk-mahasiswa", label: "CPMK per Mahasiswa" },
];

export default function ObeMonitoring() {
  const [searchParams] = useSearchParams();
  const jenisFromUrl = searchParams.get("jenis") as MonitoringJenis | null;

  const [jenis, setJenis] = useState<MonitoringJenis>(jenisFromUrl && JENIS_OPTIONS.some((o) => o.value === jenisFromUrl) ? jenisFromUrl : "cpl-prodi");
  const [filters, setFilters] = useState<MonitoringFilters>({ kop: true });
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [mhsKeyword, setMhsKeyword] = useState("");

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 100, prodiId: filters.prodiId, tahunKurikulumId: filters.tahunKurikulumId });
  const { data: mhsResponse } = useStudentData(1, 50, mhsKeyword, filters.prodiId || "", "", "", filters.angkatan || "");

  const mkList: any[] = Array.isArray(mkResponse?.data) ? mkResponse.data : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];
  const mhsList: any[] = mhsResponse?.data || [];

  const showAngkatan = jenis !== "transkrip-obe";
  const showMetode = jenis === "cpl-prodi" || jenis === "cpl-mahasiswa" || jenis === "cpl-mata-kuliah";
  const showCpl = jenis === "mk-mahasiswa";
  const showMataKuliah = jenis === "cpmk-mahasiswa";
  const showMahasiswa = jenis === "transkrip-obe";
  const showProdi = true;

  const updateFilter = (patch: Partial<MonitoringFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleJenisChange = (value: string) => {
    setJenis(value as MonitoringJenis);
    setFilters({ kop: filters.kop });
  };

  const isFilterLengkap = REQUIRED_FILTERS[jenis].every((key) => !!filters[key]);

  const handleTampilkan = () => {
    setExportError("");
    if (!isFilterLengkap) {
      setExportError("Lengkapi dulu filter yang wajib diisi (bertanda *).");
      return;
    }
    const params = new URLSearchParams({ jenis });
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    window.open(`${AdminAcademicRoute.obeManagement.monitoringCetak}?${params.toString()}`, "_blank");
  };

  const handleLihatDiTabBaru = async () => {
    setExportError("");
    if (!isFilterLengkap) {
      setExportError("Lengkapi dulu filter yang wajib diisi (bertanda *).");
      return;
    }
    setIsExporting(true);
    try {
      await exportMonitoringPdf(jenis, filters);
    } catch (error: any) {
      setExportError(error?.message || "Gagal membuka pratinjau PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <MainLayout isGreeting={false} titlePage="Monitoring OBE">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Monitoring OBE</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="divide-y divide-gray-100">
            <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
              <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">Jenis Laporan</label>
              <div className="flex-1">
                <SearchableSelect
                  value={jenis}
                  onChange={handleJenisChange}
                  options={JENIS_OPTIONS}
                  searchPlaceholder="Cari jenis laporan..."
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
              <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">Tahun Kurikulum</label>
              <div className="flex-1">
                <SearchableSelect
                  value={filters.tahunKurikulumId || ""}
                  onChange={(v) => updateFilter({ tahunKurikulumId: v })}
                  placeholder="-- Pilih Tahun Kurikulum --"
                  searchPlaceholder="Cari tahun kurikulum..."
                  options={curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))}
                />
              </div>
            </div>

            {showProdi && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
                <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">
                  Program Studi<span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <SearchableSelect
                    value={filters.prodiId || ""}
                    onChange={(v) => updateFilter({ prodiId: v })}
                    placeholder="-- Pilih Program Studi --"
                    searchPlaceholder="Cari program studi..."
                    options={prodiData.map((p: any) => ({ value: p.id, label: p.nama }))}
                  />
                </div>
              </div>
            )}

            {showMataKuliah && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
                <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">
                  Mata Kuliah<span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <SearchableSelect
                    value={filters.mataKuliahId || ""}
                    onChange={(v) => updateFilter({ mataKuliahId: v })}
                    placeholder="-- Cari Mata Kuliah --"
                    searchPlaceholder="Cari mata kuliah..."
                    options={mkList.map((mk: any) => ({ value: mk.id, label: `${mk.kode} - ${mk.nama}` }))}
                  />
                </div>
              </div>
            )}

            {showCpl && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
                <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">
                  CPL<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={filters.cpl || ""}
                  onChange={(e) => updateFilter({ cpl: e.target.value })}
                  placeholder="mis. CPL01"
                  className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            )}

            {showMahasiswa && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
                <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">
                  Nama Mahasiswa<span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <SearchableSelect
                    value={filters.mahasiswaId || ""}
                    onChange={(v) => updateFilter({ mahasiswaId: v })}
                    placeholder="-- Cari Nama Mahasiswa --"
                    searchPlaceholder="Ketik nama/NPM mahasiswa..."
                    options={mhsList.map((m: any) => ({ value: m.id, label: `${m.npm} - ${m.nama}` }))}
                  />
                </div>
              </div>
            )}

            {showAngkatan && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 py-3">
                <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">Angkatan</label>
                <input
                  type="number"
                  value={filters.angkatan || ""}
                  onChange={(e) => updateFilter({ angkatan: e.target.value })}
                  placeholder="mis. 2025"
                  className="w-full md:w-40 border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            )}

            {showMetode && (
              <div className="flex flex-col md:flex-row gap-2 py-3">
                <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48 pt-1">Metode Perhitungan</label>
                <div>
                  <div className="flex items-center gap-5">
                    <label className="flex items-center gap-1.5 text-sm text-gray-700">
                      <input
                        type="radio"
                        checked={(filters.metode || "rerata") === "rerata"}
                        onChange={() => updateFilter({ metode: "rerata" })}
                      />
                      Rerata
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="radio" checked={filters.metode === "progresif"} onChange={() => updateFilter({ metode: "progresif" })} />
                      Progresif
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {filters.metode === "progresif"
                      ? "Nilai diambil dari capaian tertinggi (progresif) tiap mahasiswa."
                      : "Nilai dihitung dari rerata capaian pembelajaran."}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 py-3">
              <label className="text-sm font-semibold text-primary-blueDark w-full md:w-48">KOP</label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700">
                <input type="checkbox" checked={filters.kop !== false} onChange={(e) => updateFilter({ kop: e.target.checked })} />
                Gunakan KOP
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleTampilkan}
              className="bg-primary-blueDark text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
            >
              <Eye size={16} /> Tampilkan
            </button>
            <button
              onClick={handleLihatDiTabBaru}
              disabled={isExporting}
              className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <ExternalLink size={16} /> {isExporting ? "Memuat..." : "Lihat di Tab Baru"}
            </button>
          </div>
        </div>

        {exportError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{exportError}</div>}
      </div>
    </MainLayout>
  );
}
