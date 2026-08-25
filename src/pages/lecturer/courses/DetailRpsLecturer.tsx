import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Printer, Copy, Edit, Sparkles, X, Trash2, Save, AlertCircle } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail, useCourseRPS } from "../../../hooks/lecturer/useFetchCourse";
import {
  useSaveDetailRps,
  fetchPratinjauSalinDetailRps,
  useSalinDetailRps,
  useDeleteDetailRps,
} from "../../../hooks/academic/useObeDetailRps";

interface FormState {
  tanggalPenyusunan: string;
  deskripsiMataKuliah: string;
  deskripsiMataKuliahEng: string;
  tujuanMataKuliah: string;
  materiPembelajaran: string;
  pustakaUtama: string;
  pustakaPendukung: string;
  mediaPerangkatLunak: string;
  mediaPerangkatKeras: string;
}

const emptyForm: FormState = {
  tanggalPenyusunan: new Date().toISOString().slice(0, 10),
  deskripsiMataKuliah: "",
  deskripsiMataKuliahEng: "",
  tujuanMataKuliah: "",
  materiPembelajaran: "",
  pustakaUtama: "",
  pustakaPendukung: "",
  mediaPerangkatLunak: "",
  mediaPerangkatKeras: "",
};

function daftarPeriodeAktifId(daftarPeriode: any[]): string {
  return daftarPeriode?.find((p) => p.status === "Aktif")?.id || "";
}

export default function DetailRpsLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");
  const { data: rps, isLoading: isRpsLoading, refetch: refetchRps } = useCourseRPS(
    mataKuliahId || "",
    selectedPeriode !== "all" ? selectedPeriode : undefined
  );
  const r = rps?.data;
  const mataKuliah = r?.mataKuliah;
  const daftarPeriode: any[] = r?.daftarPeriode || [];
  const rpsData = r?.rpsData || null;

  const saveMutation = useSaveDetailRps(mataKuliahId || "");
  const salinMutation = useSalinDetailRps(mataKuliahId || "");
  const deleteMutation = useDeleteDetailRps(mataKuliahId || "");

  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showSalinModal, setShowSalinModal] = useState(false);
  const [periodeAsal, setPeriodeAsal] = useState<string>("");
  const [previewSalin, setPreviewSalin] = useState<any | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [salinError, setSalinError] = useState("");

  const isLoading = isCourseLoading || isRpsLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const periodeTujuanSaatIni = () => (selectedPeriode !== "all" ? selectedPeriode : daftarPeriodeAktifId(daftarPeriode));

  const handleOpenDocument = () => {
    if (rpsData?.dokumenRpsUrl) {
      window.open(rpsData.dokumenRpsUrl, "_blank");
    } else {
      alert("Dokumen RPS belum diunggah.");
    }
  };

  const startEdit = () => {
    setForm({
      tanggalPenyusunan: rpsData?.tanggalPenyusunan ? String(rpsData.tanggalPenyusunan).slice(0, 10) : new Date().toISOString().slice(0, 10),
      deskripsiMataKuliah: rpsData?.deskripsiMataKuliah || "",
      deskripsiMataKuliahEng: rpsData?.deskripsiMataKuliahEng || "",
      tujuanMataKuliah: rpsData?.tujuanMataKuliah || "",
      materiPembelajaran: rpsData?.materiPembelajaran || "",
      pustakaUtama: rpsData?.pustakaUtama || "",
      pustakaPendukung: rpsData?.pustakaPendukung || "",
      mediaPerangkatLunak: rpsData?.mediaPerangkatLunak || "",
      mediaPerangkatKeras: rpsData?.mediaPerangkatKeras || "",
    });
    setDokumenFile(null);
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditMode(true);
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const periodeTujuan = periodeTujuanSaatIni();
    if (!periodeTujuan) {
      setErrorMessage('Pilih periode di dropdown "Berlaku Sejak Periode" dulu.');
      return;
    }
    saveMutation.mutate(
      { siakPeriodeAkademikId: periodeTujuan, ...form, dokumenRps: dokumenFile },
      {
        onSuccess: () => {
          setSuccessMessage("Detail RPS berhasil disimpan.");
          setIsEditMode(false);
          refetchRps();
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan Detail RPS."),
      }
    );
  };

  const handleHapusRps = () => {
    if (!rpsData?.id) return;
    if (!window.confirm("Yakin mau hapus Detail RPS untuk periode ini? Tindakan ini tidak bisa dibatalkan.")) return;
    deleteMutation.mutate(rpsData.id, {
      onSuccess: () => refetchRps(),
      onError: (err: any) => alert(err?.response?.data?.message || "Gagal menghapus Detail RPS."),
    });
  };

  const openSalinModal = () => {
    setPeriodeAsal("");
    setPreviewSalin(null);
    setSalinError("");
    setShowSalinModal(true);
  };

  const handlePilihPeriodeAsal = async (id: string) => {
    setPeriodeAsal(id);
    setPreviewSalin(null);
    setSalinError("");
    if (!id || !mataKuliahId) return;
    setIsLoadingPreview(true);
    try {
      const preview = await fetchPratinjauSalinDetailRps(mataKuliahId, id);
      setPreviewSalin(preview);
    } catch (err: any) {
      setSalinError(err?.response?.data?.message || "Gagal memuat pratinjau RPS periode asal.");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleKonfirmasiSalin = () => {
    const periodeTujuan = periodeTujuanSaatIni();
    if (!periodeTujuan) {
      setSalinError('Pilih periode tujuan (dropdown "Berlaku Sejak Periode") dulu sebelum menyalin.');
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
          refetchRps();
        },
        onError: (err: any) => setSalinError(err?.response?.data?.message || "Gagal menyalin Detail RPS."),
      }
    );
  };

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (!mataKuliah) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="p-8 text-center text-red-500">
          Gagal memuat data Detail RPS. Silakan coba lagi.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Detail RPS">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Detail RPS</p>
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
                  placeholder="Cari Mata Kuliah"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  defaultValue={mataKuliah.nama}
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
              {isKoordinator && !isEditMode && (
                <button onClick={startEdit} className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                  <Edit size={16} /> Ubah RPS
                </button>
              )}
              {isKoordinator && (
                <button onClick={openSalinModal} className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                  <Copy size={16} /> Salin Data
                </button>
              )}
              {isKoordinator && rpsData?.id && (
                <button
                  onClick={handleHapusRps}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={16} /> {deleteMutation.isPending ? "Menghapus..." : "Hapus RPS"}
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
              >
                <Printer size={16} /> Cetak
              </button>
              {isKoordinator && (
                <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                  <Sparkles size={16} /> Generate AI
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="detailRps" />

            <div className="w-full md:w-[80%]">
              {!isKoordinator && (
                <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Anda cuma bisa melihat Detail RPS mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                </div>
              )}
              {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
              {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

              {/* Header Box (Green Accent) */}
              <div className="flex mb-6 w-full rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-primary-green w-2 flex-shrink-0"></div>
                <div className="flex-1 bg-[#F5FFF9] p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-gray-700">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kode Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.kode}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">SKS</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.totalSks}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.nama}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Jenis Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.jenis}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Tahun Kurikulum</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.tahunKurikulum}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Unit Pengampu</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.unitPengampu}</span>
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
                  <option value="all">Periode Awal Kurikulum</option>
                  {daftarPeriode.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} {p.adaDataRps ? "(Data Tersedia)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {isEditMode ? (
                <div className="border border-gray-200 rounded-sm overflow-hidden text-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="font-bold text-primary-green">Ubah Detail RPS</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Penyusunan</label>
                      <input
                        type="date"
                        value={form.tanggalPenyusunan}
                        onChange={(e) => setForm((f) => ({ ...f, tanggalPenyusunan: e.target.value }))}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full md:w-64"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Mata Kuliah (IND)</label>
                      <textarea
                        value={form.deskripsiMataKuliah}
                        onChange={(e) => setForm((f) => ({ ...f, deskripsiMataKuliah: e.target.value }))}
                        rows={3}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Mata Kuliah (ENG)</label>
                      <textarea
                        value={form.deskripsiMataKuliahEng}
                        onChange={(e) => setForm((f) => ({ ...f, deskripsiMataKuliahEng: e.target.value }))}
                        rows={3}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Tujuan Mata Kuliah</label>
                      <textarea
                        value={form.tujuanMataKuliah}
                        onChange={(e) => setForm((f) => ({ ...f, tujuanMataKuliah: e.target.value }))}
                        rows={3}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Materi Pembelajaran</label>
                      <textarea
                        value={form.materiPembelajaran}
                        onChange={(e) => setForm((f) => ({ ...f, materiPembelajaran: e.target.value }))}
                        rows={3}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Pustaka Utama</label>
                      <textarea
                        value={form.pustakaUtama}
                        onChange={(e) => setForm((f) => ({ ...f, pustakaUtama: e.target.value }))}
                        rows={2}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Pustaka Pendukung</label>
                      <textarea
                        value={form.pustakaPendukung}
                        onChange={(e) => setForm((f) => ({ ...f, pustakaPendukung: e.target.value }))}
                        rows={2}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Media Perangkat Lunak</label>
                      <textarea
                        value={form.mediaPerangkatLunak}
                        onChange={(e) => setForm((f) => ({ ...f, mediaPerangkatLunak: e.target.value }))}
                        rows={2}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Media Perangkat Keras</label>
                      <textarea
                        value={form.mediaPerangkatKeras}
                        onChange={(e) => setForm((f) => ({ ...f, mediaPerangkatKeras: e.target.value }))}
                        rows={2}
                        className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Dokumen RPS (opsional)</label>
                      <input
                        type="file"
                        onChange={(e) => setDokumenFile(e.target.files?.[0] || null)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="px-4 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      <Save size={15} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-sm overflow-hidden text-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-bold text-primary-green">Detail RPS</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <span className="font-semibold text-gray-600">Tanggal Penyusunan</span>
                      <span className="md:col-span-3 text-gray-800">
                        {rpsData?.tanggalPenyusunan ? new Date(rpsData.tanggalPenyusunan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Deskripsi Mata Kuliah (IND)</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.deskripsiMataKuliah || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Deskripsi Mata Kuliah (ENG)</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.deskripsiMataKuliahEng || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Tujuan Mata Kuliah</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.tujuanMataKuliah || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Materi Pembelajaran</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.materiPembelajaran || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Pustaka Utama</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.pustakaUtama || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Pustaka Pendukung</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.pustakaPendukung || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Media Perangkat Lunak</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.mediaPerangkatLunak || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <span className="font-semibold text-gray-600">Media Perangkat Keras</span>
                      <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                        {rpsData?.mediaPerangkatKeras || <span className="text-gray-400 italic">Belum diisi</span>}
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <span className="font-semibold text-gray-600">Dokumen RPS</span>
                      <div className="md:col-span-3">
                        {rpsData?.dokumenRpsUrl ? (
                          <button
                            onClick={handleOpenDocument}
                            className="bg-primary-green hover:bg-opacity-90 text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                          >
                            Lihat Dokumen
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">Belum diisi</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Salin Data */}
      {isKoordinator && showSalinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Salin Data RPS dari Periode Lain</h3>
              <button onClick={() => setShowSalinModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Menyalin ke periode:{" "}
                <span className="font-semibold text-gray-800">
                  {daftarPeriode.find((p: any) => p.id === periodeTujuanSaatIni())?.nama || '(pilih dulu di dropdown "Berlaku Sejak Periode" di halaman utama)'}
                </span>
              </p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Salin dari periode</label>
                <select
                  value={periodeAsal}
                  onChange={(e) => handlePilihPeriodeAsal(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-700 w-full"
                >
                  <option value="">Pilih periode asal</option>
                  {daftarPeriode
                    .filter((p: any) => p.adaDataRps && p.id !== periodeTujuanSaatIni())
                    .map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                </select>
                {daftarPeriode.filter((p: any) => p.adaDataRps).length === 0 && (
                  <p className="text-xs text-gray-400 italic mt-1">Belum ada periode lain yang punya data RPS untuk mata kuliah ini.</p>
                )}
              </div>

              {isLoadingPreview && (
                <div className="flex justify-center p-6">
                  <LoadingSpinner />
                </div>
              )}

              {previewSalin && !isLoadingPreview && (
                <div className="border border-gray-200 rounded-sm p-4 bg-gray-50 text-sm space-y-2">
                  <p className="font-semibold text-gray-700 mb-2">Pratinjau data yang akan disalin:</p>
                  <p><span className="font-semibold text-gray-600">Deskripsi (IND):</span> {previewSalin.deskripsiMataKuliah || "-"}</p>
                  <p><span className="font-semibold text-gray-600">Tujuan:</span> {previewSalin.tujuanMataKuliah || "-"}</p>
                  <p><span className="font-semibold text-gray-600">Materi:</span> {previewSalin.materiPembelajaran || "-"}</p>
                </div>
              )}

              {salinError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{salinError}</div>
              )}

              {rpsData && (
                <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2">
                  ⚠ Periode tujuan sudah punya Detail RPS. Menyalin akan MENIMPA data yang sudah ada di periode tujuan.
                </p>
              )}
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