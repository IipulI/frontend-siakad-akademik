import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { ArrowLeft, Search, Plus, Trash2, Settings, Sparkles, Eye, X, Upload, Copy, Download, Pencil } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import CpmkChecklistTree, { MasterCpmkItem } from "../../../components/admin-academic/academic/obe/CpmkChecklistTree";
import {
  SaveSesiPayload,
  useCreateSesi,
  useUpdateSesi,
  useDeleteSesi,
  fetchDetailSesi,
  downloadTemplateRencanaPembelajaran,
  useImportRencanaPembelajaran,
  fetchPratinjauSalinRencanaPembelajaran,
  useSalinRencanaPembelajaran,
  PratinjauSalinRencanaPembelajaran,
} from "../../../hooks/academic/useObeRencanaPembelajaran";

const JENIS_PERTEMUAN_OPTIONS = [
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

interface SesiItem {
  id: string;
  sesi: number;
  jenisPertemuan: string;
  materiPembelajaran: string;
  materiPembelajaranEng: string;
  indikatorPenilaian: string;
  kriteriaPenilaian: string;
  metodePembelajaranLuring: string;
  metodePembelajaranDaring: string;
  bobotPenilaian: number;
  cpmkTerpilih: Array<{ id: string; kode: string; deskripsi: string; subCpmk?: Array<{ id: string; kode: string; deskripsi: string }> }>;
  cpmkIdsFlat: string[];
}

interface RencanaPembelajaranResponse {
  mataKuliah: {
    id: string;
    kode: string;
    nama: string;
    totalSks: number;
    jenis: string;
    tahunKurikulum: string;
    unitPengampu: string;
  };
  daftarPeriode: Array<{ id: string; nama: string; status: string }>;
  periodeTerpilihId: string;
  masterCpmk: MasterCpmkItem[];
  rencanaData: SesiItem[];
}

const emptyForm: SaveSesiPayload = {
  siakPeriodeAkademikId: "",
  sesi: 1,
  jenisPertemuan: "Kuliah",
  materiPembelajaran: "",
  materiPembelajaranEng: "",
  indikatorPenilaian: "",
  kriteriaPenilaian: "",
  metodePembelajaranLuring: "",
  metodePembelajaranDaring: "",
  bobotPenilaian: 0,
  cpmkIds: [],
};

export default function ObeRencanaPembelajaran() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const navigate = useNavigate();
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");
  const [showAksiMenu, setShowAksiMenu] = useState(false);
  const aksiMenuRef = useRef<HTMLDivElement>(null);

  // Modal Tambah/Ubah Sesi
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSesiId, setEditingSesiId] = useState<string | null>(null);
  const [form, setForm] = useState<SaveSesiPayload>(emptyForm);
  const [formError, setFormError] = useState("");

  // Modal Detail (view-only)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState<SesiItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Modal Import
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState("");
  const [importResult, setImportResult] = useState<{ jumlahDiimport: number; detail: any[] } | null>(null);

  // Modal Salin
  const [showSalinModal, setShowSalinModal] = useState(false);
  const [periodeAsal, setPeriodeAsal] = useState("");
  const [previewSalin, setPreviewSalin] = useState<PratinjauSalinRencanaPembelajaran | null>(null);
  const [isLoadingPreviewSalin, setIsLoadingPreviewSalin] = useState(false);
  const [salinError, setSalinError] = useState("");

  const { data, isLoading, error, refetch } = useQuery<RencanaPembelajaranResponse>({
    queryKey: ["obeRencanaPembelajaran", mataKuliahId, selectedPeriode],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const url = `/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran`;
      const response = await Api.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: selectedPeriode !== "all" ? { periodeId: selectedPeriode } : {},
      });
      return response.data.data;
    },
    enabled: !!mataKuliahId,
  });

  const createMutation = useCreateSesi(mataKuliahId || "");
  const updateMutation = useUpdateSesi(mataKuliahId || "");
  const deleteMutation = useDeleteSesi(mataKuliahId || "");
  const importMutation = useImportRencanaPembelajaran(mataKuliahId || "");
  const salinMutation = useSalinRencanaPembelajaran(mataKuliahId || "");

  // Backend menunjukkan periode yang relevan lewat periodeTerpilihId; ikuti itu selama
  // user belum memilih periode lain secara manual, supaya data yang tepat langsung termuat.
  useEffect(() => {
    if (data?.periodeTerpilihId && selectedPeriode === "all") {
      setSelectedPeriode(data.periodeTerpilihId);
    }
  }, [data?.periodeTerpilihId, selectedPeriode]);

  // Klik di luar dropdown Aksi -> tutup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aksiMenuRef.current && !aksiMenuRef.current.contains(e.target as Node)) {
        setShowAksiMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const periodeAktifId = () => data?.daftarPeriode?.find((p) => p.status === "Aktif")?.id || "";
  const periodeTujuanSaatIni = () => (selectedPeriode !== "all" ? selectedPeriode : periodeAktifId());

  // ==================== TAMBAH / UBAH SESI ====================
  const openTambahModal = () => {
    const periodeTujuan = periodeTujuanSaatIni();
    setEditingSesiId(null);
    setForm({ ...emptyForm, siakPeriodeAkademikId: periodeTujuan });
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = async (sesiId: string) => {
    setFormError("");
    setEditingSesiId(sesiId);
    setShowFormModal(true);
    try {
      const detail = await fetchDetailSesi(sesiId);
      setForm({
        siakPeriodeAkademikId: periodeTujuanSaatIni(),
        sesi: detail.sesi,
        jenisPertemuan: detail.jenisPertemuan || "Kuliah",
        materiPembelajaran: detail.materiPembelajaran || "",
        materiPembelajaranEng: detail.materiPembelajaranEng || "",
        indikatorPenilaian: detail.indikatorPenilaian || "",
        kriteriaPenilaian: detail.kriteriaPenilaian || "",
        metodePembelajaranLuring: detail.metodePembelajaranLuring || "",
        metodePembelajaranDaring: detail.metodePembelajaranDaring || "",
        bobotPenilaian: detail.bobotPenilaian || 0,
        cpmkIds: detail.cpmkIdsFlat || [],
      });
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Gagal memuat detail sesi.");
    }
  };

  const validateForm = (): string | null => {
    if (!form.siakPeriodeAkademikId) return "Periode akademik wajib dipilih.";
    if (!form.sesi || form.sesi < 1 || form.sesi > 16) return "Sesi (Pertemuan Ke-) harus angka 1-16.";
    if (!form.jenisPertemuan) return "Jenis Pertemuan wajib dipilih.";
    if (!form.materiPembelajaran.trim()) return "Materi Pembelajaran (IND) wajib diisi.";
    if (form.bobotPenilaian < 0 || form.bobotPenilaian > 100) return "Bobot Penilaian harus 0-100.";
    if (form.cpmkIds.length === 0) return "Pilih minimal 1 CPMK/Sub-CPMK.";
    return null;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const validationMsg = validateForm();
    if (validationMsg) {
      setFormError(validationMsg);
      return;
    }
    setFormError("");

    if (editingSesiId) {
      updateMutation.mutate(
        { id: editingSesiId, payload: form },
        {
          onSuccess: () => {
            setShowFormModal(false);
            refetch();
          },
          onError: (err: any) => setFormError(err?.response?.data?.message || "Gagal menyimpan perubahan."),
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          setShowFormModal(false);
          refetch();
        },
        onError: (err: any) => setFormError(err?.response?.data?.message || "Gagal menambahkan sesi."),
      });
    }
  };

  // ==================== DETAIL (VIEW) ====================
  const openDetailModal = async (sesiId: string) => {
    setShowDetailModal(true);
    setIsLoadingDetail(true);
    setDetailData(null);
    try {
      const detail = await fetchDetailSesi(sesiId);
      setDetailData(detail);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal memuat detail sesi.");
      setShowDetailModal(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // ==================== HAPUS ====================
  const handleDelete = (sesiId: string, nomorSesi: number) => {
    if (!window.confirm(`Yakin mau hapus Rencana Pembelajaran sesi ke-${nomorSesi}? Tindakan ini tidak bisa dibatalkan.`)) return;
    deleteMutation.mutate(sesiId, {
      onSuccess: () => refetch(),
      onError: (err: any) => alert(err?.response?.data?.message || "Gagal menghapus sesi."),
    });
  };

  // ==================== IMPORT ====================
  const openImportModal = () => {
    setImportFile(null);
    setImportError("");
    setImportResult(null);
    setShowImportModal(true);
    setShowAksiMenu(false);
  };

  const handleDownloadTemplate = () => {
    if (!mataKuliahId || !data?.mataKuliah?.nama) return;
    downloadTemplateRencanaPembelajaran(mataKuliahId, data.mataKuliah.nama);
  };

  const handleSubmitImport = () => {
    const periodeTujuan = periodeTujuanSaatIni();
    if (!periodeTujuan) {
      setImportError("Pilih periode di dropdown \"Berlaku Sejak Periode\" pada halaman utama dulu.");
      return;
    }
    if (!importFile) {
      setImportError("Pilih file .xlsx dulu.");
      return;
    }
    setImportError("");
    importMutation.mutate(
      { file: importFile, siakPeriodeAkademikId: periodeTujuan },
      {
        onSuccess: (result) => {
          setImportResult(result);
          refetch();
        },
        onError: (err: any) => setImportError(err?.response?.data?.message || "Gagal mengimpor data."),
      }
    );
  };

  // ==================== SALIN ====================
  const openSalinModal = () => {
    setPeriodeAsal("");
    setPreviewSalin(null);
    setSalinError("");
    setShowSalinModal(true);
    setShowAksiMenu(false);
  };

  const handlePilihPeriodeAsal = async (id: string) => {
    setPeriodeAsal(id);
    setPreviewSalin(null);
    setSalinError("");
    if (!id || !mataKuliahId) return;
    setIsLoadingPreviewSalin(true);
    try {
      const preview = await fetchPratinjauSalinRencanaPembelajaran(mataKuliahId, id);
      setPreviewSalin(preview);
    } catch (err: any) {
      setSalinError(err?.response?.data?.message || "Periode asal belum punya data Rencana Pembelajaran.");
    } finally {
      setIsLoadingPreviewSalin(false);
    }
  };

  const handleKonfirmasiSalin = () => {
    const periodeTujuan = periodeTujuanSaatIni();
    if (!periodeTujuan) {
      setSalinError("Pilih periode di dropdown \"Berlaku Sejak Periode\" pada halaman utama dulu.");
      return;
    }
    if (!periodeAsal) {
      setSalinError("Pilih periode asal dulu.");
      return;
    }
    salinMutation.mutate(
      { periodeAsalId: periodeAsal, periodeTujuanId: periodeTujuan },
      {
        onSuccess: () => {
          setShowSalinModal(false);
          refetch();
        },
        onError: (err: any) => setSalinError(err?.response?.data?.message || "Gagal menyalin Rencana Pembelajaran."),
      }
    );
  };

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !data?.mataKuliah) {
    return (
      <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
        <div className="p-8 text-center text-red-500">
          Gagal memuat data Rencana Pembelajaran. Silakan coba lagi.
        </div>
      </MainLayout>
    );
  }

  const { mataKuliah: header, daftarPeriode = [], rencanaData = [], masterCpmk = [] } = data;
  const namaPeriodeTujuan = daftarPeriode.find((p) => p.id === periodeTujuanSaatIni())?.nama || "(pilih periode dulu)";

  return (
    <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Rencana Pembelajaran
          </p>
        </div>

        {/* Action Header */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <button
                onClick={handleBack}
                className="bg-primary-yellow text-white p-2.5 rounded-l-md flex items-center justify-center hover:bg-opacity-90"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Cari Kursus"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  defaultValue={header.nama}
                  readOnly
                />
                <button className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90">
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              <button onClick={openTambahModal} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Plus size={16} /> Menambahkan
              </button>

              <div className="relative" ref={aksiMenuRef}>
                <button
                  onClick={() => setShowAksiMenu((v) => !v)}
                  className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
                >
                  <Settings size={16} /> Tindakan <span className="text-[10px]">▼</span>
                </button>
                {showAksiMenu && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={openImportModal}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={14} /> Import Data
                    </button>
                    <button
                      onClick={openSalinModal}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Copy size={14} /> Salin Data
                    </button>
                  </div>
                )}
              </div>

              <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Sparkles size={16} /> Hasilkan AI
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">

            {/* Sidebar */}
            <SidebarObeCourse
              obeId={obeId!}
              mataKuliahId={mataKuliahId!}
              activeTab="rencanaPembelajaran"
            />

            {/* Main Table Content */}
            <div className="w-full md:w-[80%]">

              {/* Header Box (Green Accent) */}
              <div className="flex mb-6 w-full rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-primary-green w-2 flex-shrink-0"></div>
                <div className="flex-1 bg-[#F5FFF9] p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-gray-700">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kode Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{header.kode}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">SKS</span>
                    <span className="flex-1 text-gray-800">{header.totalSks}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{header.nama}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Jenis Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{header.jenis}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Tahun Kurikulum</span>
                    <span className="flex-1 text-gray-800">{header.tahunKurikulum}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Unit Pengampu</span>
                    <span className="flex-1 text-gray-800">{header.unitPengampu}</span>
                  </div>
                </div>
              </div>

              {/* Periode Dropdown */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-semibold text-gray-700">Berlaku Sejak Periode</label>
                <select
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600 w-64"
                >
                  <option value="all">Periode Kurikulum Awal</option>
                  {daftarPeriode.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} {p.status === "Aktif" ? "(Aktif)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto border border-gray-200 rounded-sm mb-4">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                      <th className="p-3 border border-gray-300 w-16">Sesi</th>
                      <th className="p-3 border border-gray-300 text-left w-72">CPMK & Sub-CPMK</th>
                      <th className="p-3 border border-gray-300 text-left">Materi Kuliah</th>
                      <th className="p-3 border border-gray-300 text-left">Indikator Evaluasi</th>
                      <th className="p-3 border border-gray-300 text-left">Metode pembelajaran</th>
                      <th className="p-3 border border-gray-300 w-24">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 text-center font-semibold">
                    {rencanaData.length > 0 ? (
                      [...rencanaData].sort((a, b) => a.sesi - b.sesi).map((sesi) => (
                        <tr key={sesi.id} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="p-3 border border-gray-200">{sesi.sesi}</td>

                          {/* CPMK & Sub CPMK List */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            <div className="space-y-2">
                              {sesi.cpmkTerpilih.map((cpmk) => (
                                <div key={cpmk.id} className="border-l-2 border-primary-green pl-2">
                                  <p className="font-semibold text-gray-800">{cpmk.kode}</p>
                                  <p className="text-xs text-gray-500 line-clamp-2">{cpmk.deskripsi}</p>
                                  {cpmk.subCpmk && cpmk.subCpmk.length > 0 && (
                                    <div className="ml-2 mt-1 space-y-1">
                                      {cpmk.subCpmk.map((sub) => (
                                        <div key={sub.id} className="text-xs text-gray-600">
                                          <strong>{sub.kode}:</strong> {sub.deskripsi}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Materi Kuliah */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            {sesi.materiPembelajaran || <span className="text-gray-400 italic">-</span>}
                          </td>

                          {/* Indikator Penilaian */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            {sesi.indikatorPenilaian || <span className="text-gray-400 italic">-</span>}
                          </td>

                          {/* Metode Pembelajaran */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            {sesi.metodePembelajaranLuring && (
                              <p className="text-xs"><strong>Luring:</strong> {sesi.metodePembelajaranLuring}</p>
                            )}
                            {sesi.metodePembelajaranDaring && (
                              <p className="text-xs"><strong>Daring:</strong> {sesi.metodePembelajaranDaring}</p>
                            )}
                            {!sesi.metodePembelajaranLuring && !sesi.metodePembelajaranDaring && (
                              <span className="text-gray-400 italic">-</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 border border-gray-200">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                onClick={() => openDetailModal(sesi.id)}
                                className="bg-[#00c0ef] hover:bg-opacity-90 text-white p-1.5 rounded transition cursor-pointer"
                                title="Lihat Sesi"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => openEditModal(sesi.id)}
                                className="bg-primary-yellow hover:bg-opacity-90 text-white p-1.5 rounded transition cursor-pointer"
                                title="Ubah"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(sesi.id, sesi.sesi)}
                                className="bg-red-500 hover:bg-opacity-90 text-white p-1.5 rounded transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                          Belum ada rencana pembelajaran untuk periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ==================== MODAL TAMBAH / UBAH SESI ==================== */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">{editingSesiId ? "Ubah Rencana Pembelajaran" : "Tambah Rencana Pembelajaran"}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-4 space-y-4">
              {formError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{formError}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pertemuan Ke- (Sesi)</label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={form.sesi}
                    onChange={(e) => setForm((f) => ({ ...f, sesi: Number(e.target.value) }))}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Pertemuan</label>
                  <select
                    value={form.jenisPertemuan}
                    onChange={(e) => setForm((f) => ({ ...f, jenisPertemuan: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  >
                    {JENIS_PERTEMUAN_OPTIONS.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Materi Pembelajaran (IND)</label>
                <textarea
                  value={form.materiPembelajaran}
                  onChange={(e) => setForm((f) => ({ ...f, materiPembelajaran: e.target.value }))}
                  rows={2}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Materi Pembelajaran (EN)</label>
                <textarea
                  value={form.materiPembelajaranEng}
                  onChange={(e) => setForm((f) => ({ ...f, materiPembelajaranEng: e.target.value }))}
                  rows={2}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Indikator Penilaian</label>
                <textarea
                  value={form.indikatorPenilaian}
                  onChange={(e) => setForm((f) => ({ ...f, indikatorPenilaian: e.target.value }))}
                  rows={2}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bentuk & Kriteria Penilaian</label>
                <textarea
                  value={form.kriteriaPenilaian}
                  onChange={(e) => setForm((f) => ({ ...f, kriteriaPenilaian: e.target.value }))}
                  rows={2}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Metode Pembelajaran Luring</label>
                  <input
                    type="text"
                    value={form.metodePembelajaranLuring}
                    onChange={(e) => setForm((f) => ({ ...f, metodePembelajaranLuring: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Metode Pembelajaran Daring</label>
                  <input
                    type="text"
                    value={form.metodePembelajaranDaring}
                    onChange={(e) => setForm((f) => ({ ...f, metodePembelajaranDaring: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bobot Penilaian (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.bobotPenilaian}
                  onChange={(e) => setForm((f) => ({ ...f, bobotPenilaian: Number(e.target.value) }))}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full md:w-48"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mapping CPMK & Sub-CPMK</label>
                <CpmkChecklistTree
                  masterCpmk={masterCpmk}
                  checkedIds={form.cpmkIds}
                  onChange={(ids) => setForm((f) => ({ ...f, cpmkIds: ids }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL DETAIL (VIEW) ==================== */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Detail Rencana Pembelajaran Tiap Sesi</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {isLoadingDetail || !detailData ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="p-4">
                <div className="border border-gray-200 rounded-sm overflow-hidden text-sm mb-6">
                  <div className="divide-y divide-gray-200">
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Pertemuan (Sesi) Ke-</span>
                      <span className="md:col-span-3">{detailData.sesi}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Jenis Pertemuan</span>
                      <span className="md:col-span-3">{detailData.jenisPertemuan}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Materi Perkuliahan (IND)</span>
                      <span className="md:col-span-3 whitespace-pre-line">{detailData.materiPembelajaran || <span className="text-gray-400 italic">-</span>}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Materi Perkuliahan (EN)</span>
                      <span className="md:col-span-3 whitespace-pre-line">{detailData.materiPembelajaranEng || <span className="text-gray-400 italic">-</span>}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Indikator Penilaian</span>
                      <span className="md:col-span-3 whitespace-pre-line">{detailData.indikatorPenilaian || <span className="text-gray-400 italic">-</span>}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Bentuk & Kriteria Penilaian</span>
                      <span className="md:col-span-3 whitespace-pre-line">{detailData.kriteriaPenilaian || <span className="text-gray-400 italic">-</span>}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Metode Pembelajaran Luring</span>
                      <span className="md:col-span-3">{detailData.metodePembelajaranLuring || <span className="text-gray-400 italic">-</span>}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Metode Pembelajaran Daring</span>
                      <span className="md:col-span-3">{detailData.metodePembelajaranDaring || <span className="text-gray-400 italic">-</span>}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="font-semibold text-gray-600">Bobot Penilaian (%)</span>
                      <span className="md:col-span-3">{detailData.bobotPenilaian}</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-primary-green mb-2">Mapping CPMK</h4>
                <CpmkChecklistTree masterCpmk={masterCpmk} checkedIds={detailData.cpmkIdsFlat} readOnly />
              </div>
            )}

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL IMPORT ==================== */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Import Data Rencana Pembelajaran</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Mengimpor ke periode: <span className="font-semibold text-gray-800">{namaPeriodeTujuan}</span>
              </p>
              <p className="text-xs text-gray-500">
                Data yang diimpor akan <strong>ditambahkan</strong> ke sesi yang sudah ada (tidak menghapus data lama). Pastikan total bobot seluruh sesi tidak melebihi 100%.
              </p>

              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1 text-sm text-primary-blueDark hover:underline cursor-pointer"
              >
                <Download size={14} /> Download Template Excel
              </button>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">File Excel (.xlsx)</label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="text-sm"
                />
              </div>

              {importError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{importError}</div>}

              {importResult && (
                <div className="p-3 bg-green-50 border border-green-300 rounded text-sm space-y-1">
                  <p className="font-semibold text-green-800">Berhasil impor {importResult.jumlahDiimport} sesi.</p>
                  {importResult.detail?.map((d, i) => (
                    <p key={i} className="text-xs text-gray-600">
                      Sesi {d.sesi}: {d.jumlahCpmkDipetakan} CPMK dipetakan
                      {d.kodeCpmkTidakDitemukan?.length > 0 && (
                        <span className="text-orange-600"> (kode tidak ditemukan: {d.kodeCpmkTidakDitemukan.join(", ")})</span>
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                {importResult ? "Tutup" : "Batal"}
              </button>
              {!importResult && (
                <button
                  onClick={handleSubmitImport}
                  disabled={importMutation.isPending}
                  className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {importMutation.isPending ? "Mengimpor..." : "Import"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL SALIN ==================== */}
      {showSalinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Salin Rencana Pembelajaran dari Periode Lain</h3>
              <button onClick={() => setShowSalinModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Menyalin ke periode: <span className="font-semibold text-gray-800">{namaPeriodeTujuan}</span>
              </p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Salin dari periode</label>
                <select
                  value={periodeAsal}
                  onChange={(e) => handlePilihPeriodeAsal(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-700 w-full"
                >
                  <option value="">Pilih periode asal</option>
                  {daftarPeriode.filter((p) => p.id !== periodeTujuanSaatIni()).map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              {isLoadingPreviewSalin && (
                <div className="flex justify-center p-6">
                  <LoadingSpinner />
                </div>
              )}

              {previewSalin && !isLoadingPreviewSalin && (
                <div className="border border-gray-200 rounded-sm p-4 bg-gray-50 text-sm">
                  <p className="font-semibold text-gray-700 mb-2">Pratinjau: {previewSalin.jumlahSesi} sesi akan disalin dari {previewSalin.periodeAsal}</p>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {previewSalin.sesi.map((s, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        Sesi {s.sesi} ({s.jenisPertemuan}) — {s.materiPembelajaran} — bobot {s.bobotPenilaian}% — CPMK: {s.cpmk.join(", ") || "-"}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {salinError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{salinError}</div>}

              <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2">
                ⚠ Menyalin akan MENGHAPUS seluruh Rencana Pembelajaran yang sudah ada di periode tujuan, lalu menggantinya dengan data dari periode asal.
              </p>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowSalinModal(false)}
                className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleKonfirmasiSalin}
                disabled={!periodeAsal || salinMutation.isPending}
                className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {salinMutation.isPending ? "Menyalin..." : "Salin Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
