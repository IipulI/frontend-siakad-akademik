import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { Pagination } from "../../../components/admin-academic/Pagination";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Search, Eye, Pencil, Trash2, Plus, Save, ArrowLeft, Copy, X } from "lucide-react";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import {
  useTemplateEvaluasiList,
  useTemplateEvaluasiDetail,
  useSaveTemplateEvaluasi,
  useDeleteTemplateEvaluasi,
  fetchPratinjauSalinTemplateEvaluasi,
  useSalinTemplateEvaluasi,
  PratinjauSalinTemplate,
} from "../../../hooks/academic/useObeTemplateEvaluasi";

const JENIS_MATA_KULIAH_OPTIONS = [
  "Kuliah",
  "Blok",
  "Kuliah Kerja Lapangan",
  "Kuliah Kerja Nyata (KKN)",
  "Kerja Praktik",
  "Magang Kerja",
  "Praktikum",
  "Praktik Kerja Lapangan",
  "Proposal Skripsi",
  "Skripsi",
  "Stase (Kedokteran)",
];

// Sama dengan daftar di halaman Rencana Evaluasi -- sesuai SIAKAD lama (data_rencanaevaluasi/edit)
const METODE_EVALUASI_OPTIONS = [
  "TUGAS INDIVIDU",
  "UTS",
  "UAS",
  "PRAKTIKUM",
  "DISKUSI",
  "KEHADIRAN",
  "PRILAKU",
  "TUGAS KELOMPOK",
  "SEMINAR PROPOSAL",
  "SEMINAR HASIL",
  "BIMBINGAN",
  "LAPORAN PRAKTIKUM",
  "QUIZ",
  "Komprehensif",
  "PROGRAM SANDWICH",
  "PRE-TEST",
  "POST-TEST",
  "Project Based Learning",
  "Case-Based Learning",
  "Tugas",
  "NILAI AKHIR",
  "PEMBIMBING TA",
  "PENGUJI TA",
];

const JENIS_EVALUASI_OPTIONS = [
  "Aktivitas Partisipatif",
  "Hasil Proyek",
  "Kognitif/Pengetahuan - Tugas",
  "Kognitif/Pengetahuan - Quiz",
  "Kognitif/Pengetahuan - Ujian Tengah Semester",
  "Kognitif/Pengetahuan - Ujian Akhir Semester",
];

type SyaratLulus = "TIDAK_MENJADI_SYARAT_LULUS" | "MENJADI_SYARAT_LULUS" | "LULUS_DENGAN_NILAI_MINIMUM";

const SYARAT_LULUS_OPTIONS: { value: SyaratLulus; label: string }[] = [
  { value: "TIDAK_MENJADI_SYARAT_LULUS", label: "Tidak menjadi syarat lulus" },
  { value: "MENJADI_SYARAT_LULUS", label: "Menjadi syarat lulus" },
  { value: "LULUS_DENGAN_NILAI_MINIMUM", label: "Lulus dengan nilai minimum" },
];

interface LocalKomponenRow {
  localId: string;
  komponenEvaluasi: string; // = kolom "Metode Evaluasi" di UI
  metodeEvaluasi: string; // = kolom "Jenis Evaluasi" di UI
  bobot: number;
  syaratLulus: SyaratLulus;
}

interface ActiveKey {
  kurikulumId: string;
  prodiId: string;
  jenisMk: string;
}

let uidCounter = 0;
const nextUid = () => `local-tpl-${Date.now()}-${uidCounter++}`;

type ViewMode = "list" | "form" | "detail";

const ObeTemplateEvaluasi: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [activeKey, setActiveKey] = useState<ActiveKey | null>(null);

  // --- filter & pagination daftar ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedJenis, setSelectedJenis] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();

  const { data: listResult, isLoading: isListLoading } = useTemplateEvaluasiList({
    kurikulumId: selectedCurriculum,
    prodiId: selectedProdi,
    jenisMk: selectedJenis,
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });

  const items = listResult?.items || [];
  const rowKey = (k: { kurikulumId: string; prodiId: string; jenisMataKuliah: string }) =>
    `${k.kurikulumId}|${k.prodiId}|${k.jenisMataKuliah}`;

  // --- detail / form: dipakai baik untuk mode "detail" maupun prefill mode "edit" ---
  const detailEnabled = !!activeKey && (viewMode === "detail" || (viewMode === "form" && formMode === "edit"));
  const { data: detailData, isLoading: isDetailLoading } = useTemplateEvaluasiDetail(
    activeKey?.kurikulumId || "",
    activeKey?.prodiId || "",
    activeKey?.jenisMk || "",
    detailEnabled
  );

  const saveMutation = useSaveTemplateEvaluasi();
  const deleteMutation = useDeleteTemplateEvaluasi();
  const salinMutation = useSalinTemplateEvaluasi();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --- state form tambah/ubah ---
  const [formKurikulumId, setFormKurikulumId] = useState("");
  const [formProdiId, setFormProdiId] = useState("");
  const [formJenisMk, setFormJenisMk] = useState("");
  const [komponenRows, setKomponenRows] = useState<LocalKomponenRow[]>([]);

  useEffect(() => {
    if (viewMode === "form" && formMode === "edit" && activeKey && detailData) {
      setFormKurikulumId(activeKey.kurikulumId);
      setFormProdiId(activeKey.prodiId);
      setFormJenisMk(activeKey.jenisMk);
      setKomponenRows(
        detailData.komponen.map((k) => ({
          localId: nextUid(),
          komponenEvaluasi: k.komponenEvaluasi,
          metodeEvaluasi: k.metodeEvaluasi,
          bobot: Number(k.bobot) || 0,
          syaratLulus: (k.syaratLulus as SyaratLulus) || "TIDAK_MENJADI_SYARAT_LULUS",
        }))
      );
    }
  }, [viewMode, formMode, activeKey, detailData]);

  const rowTotal = komponenRows.reduce((sum, r) => sum + (Number(r.bobot) || 0), 0);

  const resetForm = () => {
    setFormKurikulumId("");
    setFormProdiId("");
    setFormJenisMk("");
    setKomponenRows([]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleTambahData = () => {
    resetForm();
    setFormMode("add");
    setActiveKey(null);
    setViewMode("form");
  };

  const handleLihatDetail = (item: { kurikulumId: string; prodiId: string; jenisMataKuliah: string }) => {
    setActiveKey({ kurikulumId: item.kurikulumId, prodiId: item.prodiId, jenisMk: item.jenisMataKuliah });
    setErrorMessage("");
    setSuccessMessage("");
    setViewMode("detail");
  };

  const handleUbahData = (item: { kurikulumId: string; prodiId: string; jenisMataKuliah: string }) => {
    setActiveKey({ kurikulumId: item.kurikulumId, prodiId: item.prodiId, jenisMk: item.jenisMataKuliah });
    setFormMode("edit");
    setErrorMessage("");
    setSuccessMessage("");
    setViewMode("form");
  };

  const handleUbahFromDetail = () => {
    if (!activeKey) return;
    setFormMode("edit");
    setViewMode("form");
  };

  const handleHapusSatuan = async (item: { kurikulumId: string; prodiId: string; jenisMataKuliah: string }) => {
    if (!window.confirm(`Hapus template evaluasi "${item.jenisMataKuliah}" ini?`)) return;
    await deleteMutation.mutateAsync({ kurikulumId: item.kurikulumId, prodiId: item.prodiId, jenisMk: item.jenisMataKuliah });
    if (viewMode === "detail") {
      setViewMode("list");
      setActiveKey(null);
    }
  };

  const handleHapusTerpilih = async () => {
    if (selectedRowKeys.length === 0) return;
    if (!window.confirm(`Hapus ${selectedRowKeys.length} data template evaluasi terpilih?`)) return;
    for (const key of selectedRowKeys) {
      const [kurikulumId, prodiId, jenisMk] = key.split("|");
      await deleteMutation.mutateAsync({ kurikulumId, prodiId, jenisMk });
    }
    setSelectedRowKeys([]);
  };

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

  const handleBackToList = () => {
    setViewMode("list");
    setActiveKey(null);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const tambahKomponenRow = () => {
    setKomponenRows((prev) => [
      ...prev,
      { localId: nextUid(), komponenEvaluasi: "", metodeEvaluasi: "", bobot: 0, syaratLulus: "TIDAK_MENJADI_SYARAT_LULUS" },
    ]);
  };

  const hapusKomponenRow = (localId: string) => {
    setKomponenRows((prev) => prev.filter((r) => r.localId !== localId));
  };

  const updateKomponenField = (localId: string, field: "komponenEvaluasi" | "metodeEvaluasi" | "syaratLulus", value: string) => {
    setKomponenRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, [field]: value } : r)));
  };

  const updateKomponenBobot = (localId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setKomponenRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, bobot: isNaN(num) ? 0 : num } : r)));
  };

  const handleSimpanForm = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!formKurikulumId || !formProdiId || !formJenisMk) {
      setErrorMessage("Tahun Kurikulum, Program Studi, dan Jenis Mata Kuliah wajib dipilih.");
      return;
    }
    if (komponenRows.length === 0) {
      setErrorMessage("Tambahkan minimal 1 Komponen Evaluasi.");
      return;
    }
    if (komponenRows.some((r) => !r.komponenEvaluasi || !r.metodeEvaluasi)) {
      setErrorMessage("Metode Evaluasi dan Jenis Evaluasi wajib dipilih untuk semua baris.");
      return;
    }
    if (rowTotal !== 100) {
      setErrorMessage(`Total Bobot Evaluasi harus 100%, saat ini ${rowTotal}%.`);
      return;
    }

    saveMutation.mutate(
      {
        siakTahunKurikulumId: formKurikulumId,
        siakProgramStudiId: formProdiId,
        jenisMataKuliah: formJenisMk,
        komponenData: komponenRows.map((r) => ({
          komponenEvaluasi: r.komponenEvaluasi,
          jenisEvaluasi: r.metodeEvaluasi,
          bobot: Number(r.bobot),
          syaratLulus: r.syaratLulus,
        })),
      },
      {
        onSuccess: () => {
          setSuccessMessage("Template evaluasi berhasil disimpan.");
          setViewMode("list");
          setActiveKey(null);
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan template evaluasi.");
        },
      }
    );
  };

  // --- modal salin data ---
  const [showSalinModal, setShowSalinModal] = useState(false);
  const [salinProdiAsal, setSalinProdiAsal] = useState("");
  const [salinKurikulumAsal, setSalinKurikulumAsal] = useState("");
  const [salinJenisAsal, setSalinJenisAsal] = useState("");
  const [salinProdiTujuan, setSalinProdiTujuan] = useState("");
  const [salinKurikulumTujuan, setSalinKurikulumTujuan] = useState("");
  const [salinJenisTujuan, setSalinJenisTujuan] = useState("");
  const [salinPreview, setSalinPreview] = useState<PratinjauSalinTemplate | null>(null);
  const [isSalinPreviewLoading, setIsSalinPreviewLoading] = useState(false);
  const [salinError, setSalinError] = useState("");

  const openSalinModal = () => {
    setSalinProdiAsal("");
    setSalinKurikulumAsal("");
    setSalinJenisAsal("");
    setSalinProdiTujuan("");
    setSalinKurikulumTujuan("");
    setSalinJenisTujuan("");
    setSalinPreview(null);
    setSalinError("");
    setShowSalinModal(true);
  };

  const isSalinSama =
    salinProdiAsal && salinKurikulumAsal && salinJenisAsal &&
    salinProdiAsal === salinProdiTujuan && salinKurikulumAsal === salinKurikulumTujuan && salinJenisAsal === salinJenisTujuan;

  const handleLihatPratinjauSalin = async () => {
    setSalinError("");
    setSalinPreview(null);
    if (!salinProdiAsal || !salinKurikulumAsal || !salinJenisAsal || !salinProdiTujuan || !salinKurikulumTujuan || !salinJenisTujuan) {
      setSalinError("Lengkapi semua data asal dan tujuan terlebih dahulu.");
      return;
    }
    if (isSalinSama) {
      setSalinError("Pilih data asal dan tujuan yang berbeda sebelum melanjutkan.");
      return;
    }
    try {
      setIsSalinPreviewLoading(true);
      const preview = await fetchPratinjauSalinTemplateEvaluasi(salinProdiAsal, salinKurikulumAsal, salinJenisAsal);
      setSalinPreview(preview);
    } catch (error: any) {
      setSalinError(error?.response?.data?.message || "Data template asal tidak ditemukan.");
    } finally {
      setIsSalinPreviewLoading(false);
    }
  };

  const handleKonfirmasiSalin = () => {
    salinMutation.mutate(
      {
        prodiAsalId: salinProdiAsal,
        kurikulumAsalId: salinKurikulumAsal,
        jenisMkAsal: salinJenisAsal,
        prodiTujuanId: salinProdiTujuan,
        kurikulumTujuanId: salinKurikulumTujuan,
        jenisMkTujuan: salinJenisTujuan,
      },
      {
        onSuccess: (result) => {
          setShowSalinModal(false);
          setSuccessMessage(`Berhasil menyalin ${result.jumlahDisalin} komponen evaluasi.`);
        },
        onError: (error: any) => {
          setSalinError(error?.response?.data?.message || "Gagal menyalin template evaluasi.");
        },
      }
    );
  };

  const totalPages = listResult?.totalPage || 1;

  return (
    <MainLayout isGreeting={false} titlePage="Template Evaluasi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Template Evaluasi</p>
        </div>

        {successMessage && viewMode === "list" && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
        )}

        {viewMode === "list" && (
          <>
            {/* Filter */}
            <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum</label>
                  <SearchableSelect
                    value={selectedCurriculum}
                    onChange={(v) => { setSelectedCurriculum(v); setCurrentPage(1); }}
                    placeholder="-- Semua Tahun Kurikulum --"
                    searchPlaceholder="Cari tahun kurikulum..."
                    options={[
                      { value: "all", label: "-- Semua Tahun Kurikulum --" },
                      ...curriculumData.map((item: any) => ({ value: item.id, label: item.tahun })),
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Jenis Mata Kuliah</label>
                  <SearchableSelect
                    value={selectedJenis}
                    onChange={(v) => { setSelectedJenis(v); setCurrentPage(1); }}
                    placeholder="-- Semua Jenis Mata Kuliah --"
                    searchPlaceholder="Cari jenis mata kuliah..."
                    options={[
                      { value: "all", label: "-- Semua Jenis Mata Kuliah --" },
                      ...JENIS_MATA_KULIAH_OPTIONS.map((j) => ({ value: j, label: j })),
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Program Studi</label>
                  <SearchableSelect
                    value={selectedProdi}
                    onChange={(v) => { setSelectedProdi(v); setCurrentPage(1); }}
                    placeholder="-- Semua Program Studi --"
                    searchPlaceholder="Cari program studi..."
                    options={[
                      { value: "all", label: "-- Semua Program Studi --" },
                      ...prodiData.map((prodi: any) => ({ value: prodi.id, label: prodi.nama })),
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Tabel */}
            <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
                <div className="flex items-center w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Cari Template Evaluasi"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="p-2 pl-3 border border-gray-300 rounded-l-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  />
                  <button className="bg-indigo-600 text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90">
                    <Search size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    onClick={handleTambahData}
                    className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90"
                  >
                    <Plus size={16} /> Tambah Data
                  </button>
                  {selectedRowKeys.length > 0 && (
                    <button
                      onClick={handleHapusTerpilih}
                      className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90"
                    >
                      <Trash2 size={16} /> Hapus ({selectedRowKeys.length})
                    </button>
                  )}
                  <button
                    onClick={openSalinModal}
                    className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90"
                  >
                    <Copy size={16} /> Salin Data
                  </button>
                </div>
              </div>

              {isListLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-primary-green text-white text-sm">
                        <th className="border border-gray-200 px-3 py-2 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={items.length > 0 && selectedRowKeys.length === items.length}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Kurikulum</th>
                        <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Kode Prodi</th>
                        <th className="border border-gray-200 px-4 py-2 font-semibold text-left">Program Studi</th>
                        <th className="border border-gray-200 px-4 py-2 font-semibold text-center">Jenis Mata Kuliah</th>
                        <th className="border border-gray-200 px-4 py-2 font-semibold text-center w-32">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length > 0 ? (
                        items.map((item) => {
                          const key = rowKey(item);
                          return (
                            <tr key={key} className="text-sm text-gray-700 hover:bg-gray-50">
                              <td className="border border-gray-200 px-3 py-2 text-center">
                                <input type="checkbox" checked={selectedRowKeys.includes(key)} onChange={() => toggleSelectRow(key)} />
                              </td>
                              <td className="border border-gray-200 px-4 py-2">{item.tahunKurikulum}</td>
                              <td className="border border-gray-200 px-4 py-2">{item.kodeProdi}</td>
                              <td className="border border-gray-200 px-4 py-2">{item.programStudi}</td>
                              <td className="border border-gray-200 px-4 py-2 text-center">{item.jenisMataKuliah}</td>
                              <td className="border border-gray-200 px-4 py-2 text-center">
                                <div className="flex justify-center gap-2">
                                  <button onClick={() => handleLihatDetail(item)} className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded" title="Detail">
                                    <Eye size={16} />
                                  </button>
                                  <button onClick={() => handleUbahData(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded" title="Ubah">
                                    <Pencil size={16} />
                                  </button>
                                  <button onClick={() => handleHapusSatuan(item)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded" title="Hapus">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                            Tidak ada data Template Evaluasi
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {items.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      rowsPerPage={itemsPerPage}
                      totalRows={listResult?.total || 0}
                      onRowsPerPageChange={(rows) => { setItemsPerPage(rows); setCurrentPage(1); }}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === "detail" && (
          <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-800">Template Evaluasi</h3>
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleBackToList} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90">
                  <ArrowLeft size={16} /> Kembali ke Daftar
                </button>
                <button onClick={handleTambahData} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90">
                  <Plus size={16} /> Tambah
                </button>
                <button onClick={handleUbahFromDetail} className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90">
                  <Pencil size={16} /> Ubah Data
                </button>
                <button
                  onClick={() => activeKey && handleHapusSatuan({ kurikulumId: activeKey.kurikulumId, prodiId: activeKey.prodiId, jenisMataKuliah: activeKey.jenisMk })}
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>

            {isDetailLoading || !detailData ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-4 border-b border-gray-200 text-sm">
                  <div>
                    <span className="font-semibold text-gray-500">Tahun Kurikulum</span>
                    <p className="text-gray-800">{detailData.header.tahunKurikulum}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Jenis Mata Kuliah</span>
                    <p className="text-gray-800">{detailData.header.jenisMataKuliah}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Program Studi</span>
                    <p className="text-gray-800">{detailData.header.programStudi}</p>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary-green pb-1 mb-3">Komponen Evaluasi</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-sm mb-6">
                  <table className="min-w-full bg-white border-collapse">
                    <thead>
                      <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                        <th className="p-3 border border-gray-300">No.</th>
                        <th className="p-3 border border-gray-300">Metode Evaluasi</th>
                        <th className="p-3 border border-gray-300">Jenis Evaluasi</th>
                        <th className="p-3 border border-gray-300">Bobot Evaluasi</th>
                        <th className="p-3 border border-gray-300">Syarat Lulus</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 text-center">
                      {detailData.komponen.map((k, idx) => (
                        <tr key={k.id || idx} className="border-b border-gray-200">
                          <td className="p-3 border border-gray-200">{idx + 1}</td>
                          <td className="p-3 border border-gray-200">{k.komponenEvaluasi}</td>
                          <td className="p-3 border border-gray-200">{k.metodeEvaluasi}</td>
                          <td className="p-3 border border-gray-200">{k.bobot}%</td>
                          <td className="p-3 border border-gray-200">
                            {SYARAT_LULUS_OPTIONS.find((o) => o.value === k.syaratLulus)?.label || k.syaratLulus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold text-center">
                        <td colSpan={3} className="p-2 text-right border border-gray-200">Total Persentase Komponen Evaluasi</td>
                        <td className="p-2 border border-gray-200 text-green-600">
                          {detailData.komponen.reduce((s, k) => s + (Number(k.bobot) || 0), 0)}%
                        </td>
                        <td className="border border-gray-200"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary-green pb-1 mb-3">Pelaporan Metode Evaluasi</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-sm">
                  <table className="min-w-full bg-white border-collapse">
                    <thead>
                      <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                        <th className="p-3 border border-gray-300">No.</th>
                        <th className="p-3 border border-gray-300 text-left">Basis Evaluasi</th>
                        <th className="p-3 border border-gray-300 text-left">Komponen Evaluasi</th>
                        <th className="p-3 border border-gray-300">Bobot Evaluasi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 text-center">
                      {detailData.pelaporan.map((p, idx) => (
                        <tr key={idx} className="border-b border-gray-200">
                          <td className="p-3 border border-gray-200">{idx + 1}</td>
                          <td className="p-3 border border-gray-200 text-left font-normal">{p.basisEvaluasi}</td>
                          <td className="p-3 border border-gray-200 text-left font-normal">{p.komponenEvaluasi}</td>
                          <td className="p-3 border border-gray-200">{p.bobotEvaluasi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {viewMode === "form" && (
          <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-800">{formMode === "add" ? "Tambah Template Evaluasi" : "Ubah Template Evaluasi"}</h3>
              <div className="flex gap-2">
                <button onClick={handleBackToList} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
                  Batalkan
                </button>
                <button
                  onClick={handleSimpanForm}
                  disabled={saveMutation.isPending}
                  className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90 disabled:opacity-50"
                >
                  <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </div>

            {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}

            {formMode === "edit" && (isDetailLoading || !detailData) ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum<span className="text-red-500">*</span></label>
                    {formMode === "edit" ? (
                      <p className="text-gray-800 p-2 border border-gray-200 rounded-md bg-gray-50 text-sm">{detailData?.header.tahunKurikulum}</p>
                    ) : (
                      <SearchableSelect
                        value={formKurikulumId}
                        onChange={setFormKurikulumId}
                        placeholder="-- Pilih Tahun Kurikulum --"
                        searchPlaceholder="Cari tahun kurikulum..."
                        options={curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Jenis Mata Kuliah<span className="text-red-500">*</span></label>
                    {formMode === "edit" ? (
                      <p className="text-gray-800 p-2 border border-gray-200 rounded-md bg-gray-50 text-sm">{detailData?.header.jenisMataKuliah}</p>
                    ) : (
                      <SearchableSelect
                        value={formJenisMk}
                        onChange={setFormJenisMk}
                        placeholder="-- Pilih Jenis Mata Kuliah --"
                        searchPlaceholder="Cari jenis mata kuliah..."
                        options={JENIS_MATA_KULIAH_OPTIONS.map((j) => ({ value: j, label: j }))}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Program Studi<span className="text-red-500">*</span></label>
                    {formMode === "edit" ? (
                      <p className="text-gray-800 p-2 border border-gray-200 rounded-md bg-gray-50 text-sm">{detailData?.header.programStudi}</p>
                    ) : (
                      <SearchableSelect
                        value={formProdiId}
                        onChange={setFormProdiId}
                        placeholder="-- Pilih Program Studi --"
                        searchPlaceholder="Cari program studi..."
                        options={prodiData.map((prodi: any) => ({ value: prodi.id, label: prodi.nama }))}
                      />
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary-green pb-1 mb-3">Komponen Evaluasi</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-sm mb-3">
                  <table className="min-w-full bg-white border-collapse">
                    <thead>
                      <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                        <th className="p-3 border border-gray-300">No.</th>
                        <th className="p-3 border border-gray-300">Metode Evaluasi</th>
                        <th className="p-3 border border-gray-300">Jenis Evaluasi</th>
                        <th className="p-3 border border-gray-300">Bobot Evaluasi</th>
                        <th className="p-3 border border-gray-300">Syarat Lulus</th>
                        <th className="p-3 border border-gray-300">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 text-center">
                      {komponenRows.length > 0 ? (
                        komponenRows.map((row, idx) => (
                          <tr key={row.localId} className="border-b border-gray-200">
                            <td className="p-2 border border-gray-200">{idx + 1}</td>
                            <td className="p-2 border border-gray-200">
                              <select
                                value={row.komponenEvaluasi}
                                onChange={(e) => updateKomponenField(row.localId, "komponenEvaluasi", e.target.value)}
                                className="w-36 border border-gray-300 rounded p-1 text-xs"
                              >
                                <option value="">-- Pilih --</option>
                                {METODE_EVALUASI_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2 border border-gray-200">
                              <select
                                value={row.metodeEvaluasi}
                                onChange={(e) => updateKomponenField(row.localId, "metodeEvaluasi", e.target.value)}
                                className="w-52 border border-gray-300 rounded p-1 text-xs"
                              >
                                <option value="">-- Pilih --</option>
                                {JENIS_EVALUASI_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2 border border-gray-200">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={row.bobot}
                                onChange={(e) => updateKomponenBobot(row.localId, e.target.value)}
                                className="w-20 border border-gray-300 rounded p-1 text-xs text-center"
                              />
                            </td>
                            <td className="p-2 border border-gray-200">
                              <select
                                value={row.syaratLulus}
                                onChange={(e) => updateKomponenField(row.localId, "syaratLulus", e.target.value)}
                                className="border border-gray-300 rounded p-1 text-xs"
                              >
                                {SYARAT_LULUS_OPTIONS.map((o) => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2 border border-gray-200">
                              <button onClick={() => hapusKomponenRow(row.localId)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-gray-400 italic">
                            Klik "+ Tambah Komponen Evaluasi" untuk mulai.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {komponenRows.length > 0 && (
                      <tfoot>
                        <tr className="bg-gray-100 font-bold text-center">
                          <td colSpan={3} className="p-2 text-right border border-gray-200">Total Persentase Komponen Evaluasi</td>
                          <td className={`p-2 border border-gray-200 ${rowTotal === 100 ? "text-green-600" : "text-red-500"}`}>{rowTotal}%</td>
                          <td colSpan={2} className="border border-gray-200"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>

                <button
                  onClick={tambahKomponenRow}
                  className="bg-white border border-dashed border-primary-green text-primary-green px-3 py-1.5 rounded text-xs flex items-center gap-1 hover:bg-green-50 mb-6"
                >
                  <Plus size={14} /> Tambah Komponen Evaluasi
                </button>

                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
                  Syarat Lulus Mata Kuliah adalah komponen nilai wajib. Mahasiswa yang tidak memiliki komponen ini akan dinyatakan tidak lulus Mata Kuliah.
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal Salin Data */}
        {showSalinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h4 className="text-lg font-bold text-gray-800">Salin Template Evaluasi</h4>
                <button onClick={() => setShowSalinModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-xs">
                  Pilih data asal dan tujuan yang berbeda sebelum melanjutkan. Data tujuan yang sudah ada akan ditimpa (wipe & replace).
                </div>
                {salinError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{salinError}</div>}

                <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-3 items-center mb-4">
                  <label className="text-sm font-semibold text-gray-700">Program Studi</label>
                  <span></span>
                  <span></span>
                  <SearchableSelect
                    value={salinProdiAsal}
                    onChange={setSalinProdiAsal}
                    placeholder="-- Pilih Prodi Asal --"
                    searchPlaceholder="Cari program studi..."
                    options={prodiData.map((p: any) => ({ value: p.id, label: p.nama }))}
                  />
                  <span className="text-gray-400 text-center">&rarr;</span>
                  <SearchableSelect
                    value={salinProdiTujuan}
                    onChange={setSalinProdiTujuan}
                    placeholder="-- Pilih Prodi Tujuan --"
                    searchPlaceholder="Cari program studi..."
                    options={prodiData.map((p: any) => ({ value: p.id, label: p.nama }))}
                  />

                  <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum</label>
                  <span></span>
                  <span></span>
                  <SearchableSelect
                    value={salinKurikulumAsal}
                    onChange={setSalinKurikulumAsal}
                    placeholder="-- Pilih Kurikulum Asal --"
                    searchPlaceholder="Cari tahun kurikulum..."
                    options={curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))}
                  />
                  <span className="text-gray-400 text-center">&rarr;</span>
                  <SearchableSelect
                    value={salinKurikulumTujuan}
                    onChange={setSalinKurikulumTujuan}
                    placeholder="-- Pilih Kurikulum Tujuan --"
                    searchPlaceholder="Cari tahun kurikulum..."
                    options={curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))}
                  />

                  <label className="text-sm font-semibold text-gray-700">Jenis Mata Kuliah</label>
                  <span></span>
                  <span></span>
                  <SearchableSelect
                    value={salinJenisAsal}
                    onChange={setSalinJenisAsal}
                    placeholder="-- Pilih Jenis MK Asal --"
                    searchPlaceholder="Cari jenis mata kuliah..."
                    options={JENIS_MATA_KULIAH_OPTIONS.map((j) => ({ value: j, label: j }))}
                  />
                  <span className="text-gray-400 text-center">&rarr;</span>
                  <SearchableSelect
                    value={salinJenisTujuan}
                    onChange={setSalinJenisTujuan}
                    placeholder="-- Pilih Jenis MK Tujuan --"
                    searchPlaceholder="Cari jenis mata kuliah..."
                    options={JENIS_MATA_KULIAH_OPTIONS.map((j) => ({ value: j, label: j }))}
                  />
                </div>

                {salinPreview && (
                  <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
                      Pratinjau data asal: {salinPreview.header.programStudi} - {salinPreview.header.tahunKurikulum} - {salinPreview.header.jenisMataKuliah}
                    </div>
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700">
                          <th className="p-2 border border-gray-200 text-left">Metode Evaluasi</th>
                          <th className="p-2 border border-gray-200 text-left">Jenis Evaluasi</th>
                          <th className="p-2 border border-gray-200">Bobot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salinPreview.komponen.map((k, idx) => (
                          <tr key={idx}>
                            <td className="p-2 border border-gray-200">{k.komponenEvaluasi}</td>
                            <td className="p-2 border border-gray-200">{k.metodeEvaluasi}</td>
                            <td className="p-2 border border-gray-200 text-center">{k.bobot}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowSalinModal(false)} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
                    Batalkan
                  </button>
                  {!salinPreview ? (
                    <button
                      onClick={handleLihatPratinjauSalin}
                      disabled={isSalinPreviewLoading}
                      className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      {isSalinPreviewLoading ? "Memuat..." : "Lihat Pratinjau"}
                    </button>
                  ) : (
                    <button
                      onClick={handleKonfirmasiSalin}
                      disabled={salinMutation.isPending}
                      className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      {salinMutation.isPending ? "Menyalin..." : "Konfirmasi Salin"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ObeTemplateEvaluasi;
