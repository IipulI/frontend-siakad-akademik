import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, RefreshCw, Pencil, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import { useCourseDetail, useCourseRencanaEvaluasi } from "../../../hooks/lecturer/useFetchCourse";
import { useSaveRencanaEvaluasi, SyaratLulus } from "../../../hooks/academic/useObeRencanaEvaluasi";
import { getPemetaanCpmk } from "../../../hooks/academic/useObeCpmkMk";

interface CpmkColumn {
  id: string;
  kode: string;
}

interface CpmkGroup {
  id: string;
  kode: string;
  subs: CpmkColumn[];
}

// Taksonomi tetap untuk tabel "Pelaporan Metode Evaluasi" -- dihitung dari data Rencana Evaluasi
// yang sudah ada (dicocokkan lewat jenisEvaluasi), sama persis dengan halaman admin.
const PELAPORAN_METODE_EVALUASI_GROUPS: {
  basis: string;
  items: { komponen: string | null; jenisMatch: string; deskripsi: string }[];
}[] = [
  {
    basis: "Aktivitas Partisipatif",
    items: [{ komponen: null, jenisMatch: "Aktivitas Partisipatif", deskripsi: "Kehadiran" }],
  },
  {
    basis: "Hasil Proyek",
    items: [{ komponen: null, jenisMatch: "Hasil Proyek", deskripsi: "Proyek" }],
  },
  {
    basis: "Kognitif / Pengetahuan",
    items: [
      { komponen: "Tugas", jenisMatch: "Kognitif/Pengetahuan - Tugas", deskripsi: "Tugas" },
      { komponen: "Quiz", jenisMatch: "Kognitif/Pengetahuan - Quiz", deskripsi: "Quiz" },
      { komponen: "Ujian Tengah Semester", jenisMatch: "Kognitif/Pengetahuan - Ujian Tengah Semester", deskripsi: "UTS" },
      { komponen: "Ujian Akhir Semester", jenisMatch: "Kognitif/Pengetahuan - Ujian Akhir Semester", deskripsi: "UAS" },
    ],
  },
];

interface LocalEvaluasiRow {
  localId: string;
  metodeEvaluasi: string;
  jenisEvaluasi: string;
  cpmkBobot: Record<string, number>;
  syaratLulus: SyaratLulus;
}

const SYARAT_LULUS_OPTIONS: { value: SyaratLulus; label: string }[] = [
  { value: "TIDAK_MENJADI_SYARAT_LULUS", label: "Tidak menjadi syarat lulus" },
  { value: "MENJADI_SYARAT_LULUS", label: "Menjadi syarat lulus" },
  { value: "LULUS_DENGAN_NILAI_MINIMUM", label: "Lulus dengan nilai minimum" },
];

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

let uidCounter = 0;
const nextUid = () => `local-eval-${Date.now()}-${uidCounter++}`;

export default function RencanaEvaluasiLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  // Sumber data & default periode dari endpoint dosen (bukan useAcademicPeriods/useActivePeriod
  // punya admin -- dosen tidak butuh itu, endpoint ini sudah balikin daftarPeriode +
  // periodeTerpilihId sendiri).
  const [periodeId, setPeriodeId] = useState<string>("");
  const { data: re, isLoading: isReLoading } = useCourseRencanaEvaluasi(mataKuliahId || "", periodeId || undefined);
  const reData = re?.data;
  const daftarPeriode: any[] = reData?.daftarPeriode || [];

  useEffect(() => {
    if (reData?.periodeTerpilihId && !periodeId) setPeriodeId(reData.periodeTerpilihId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reData?.periodeTerpilihId]);

  const { data: cpmkMappingData, refetch: refetchCpmk, isFetching: isCpmkFetching } = getPemetaanCpmk(mataKuliahId || "");
  const saveMutation = useSaveRencanaEvaluasi();

  const [rows, setRows] = useState<LocalEvaluasiRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditingKomponen, setIsEditingKomponen] = useState(false);

  const existing = reData?.rencanaEvaluasi || [];

  const cpmkGroups = useMemo<CpmkGroup[]>(() => {
    if (!cpmkMappingData) return [];
    return cpmkMappingData.cpmkData
      .filter((c) => c.id)
      .map((c) => ({
        id: c.id as string,
        kode: c.kode,
        subs:
          cpmkMappingData.levelPemetaan === "Sub-CPMK"
            ? (c.subCpmk || []).filter((s) => s.id).map((s) => ({ id: s.id as string, kode: s.kode }))
            : [],
      }));
  }, [cpmkMappingData]);

  const cpmkLeafColumns = cpmkGroups.reduce((sum, g) => sum + (g.subs.length > 0 ? g.subs.length : 1), 0);
  const hasSubCpmkGroup = cpmkGroups.some((g) => g.subs.length > 0);
  const existingTotalBobot = existing.reduce((sum, item: any) => sum + (Number(item.bobotEvaluasi) || 0), 0);

  const isLoading = isCourseLoading || isReLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const rowBobot = (row: LocalEvaluasiRow) =>
    Object.values(row.cpmkBobot).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const grandTotal = rows.reduce((sum, r) => sum + rowBobot(r), 0);

  const tambahEvaluasiRow = () => {
    setRows((prev) => [
      ...prev,
      { localId: nextUid(), metodeEvaluasi: "", jenisEvaluasi: "", cpmkBobot: {}, syaratLulus: "TIDAK_MENJADI_SYARAT_LULUS" },
    ]);
  };

  const hapusEvaluasiRow = (localId: string) => {
    if (!window.confirm("Hapus baris evaluasi ini?")) return;
    setRows((prev) => prev.filter((r) => r.localId !== localId));
  };

  const updateRowField = (localId: string, field: "metodeEvaluasi" | "jenisEvaluasi" | "syaratLulus", value: string) => {
    setRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, [field]: value } : r)));
  };

  const updateRowBobot = (localId: string, cpmkId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setRows((prev) =>
      prev.map((r) =>
        r.localId === localId ? { ...r, cpmkBobot: { ...r.cpmkBobot, [cpmkId]: isNaN(num) ? 0 : num } } : r
      )
    );
  };

  const handleStartEdit = () => {
    setRows(
      existing.map((item: any) => ({
        localId: nextUid(),
        metodeEvaluasi: item.metodeEvaluasi,
        jenisEvaluasi: item.jenisEvaluasi,
        cpmkBobot: { ...(item.mappingBobotCpmk || {}) },
        syaratLulus: item.syaratLulus,
      }))
    );
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditingKomponen(true);
  };

  const handleCancelEdit = () => {
    setRows([]);
    setErrorMessage("");
    setIsEditingKomponen(false);
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!periodeId) {
      setErrorMessage("Pilih Periode Akademik terlebih dahulu.");
      return;
    }
    if (rows.some((r) => !r.metodeEvaluasi.trim() || !r.jenisEvaluasi.trim())) {
      setErrorMessage("Metode Evaluasi dan Jenis Evaluasi wajib diisi untuk semua baris.");
      return;
    }

    const evaluasiList = rows.map((row) => ({
      metodeEvaluasi: row.metodeEvaluasi.trim(),
      jenisEvaluasi: row.jenisEvaluasi.trim(),
      bobotEvaluasi: rowBobot(row),
      cpmkData: Object.entries(row.cpmkBobot)
        .filter(([, bobot]) => Number(bobot) > 0)
        .map(([cpmkId, bobot]) => ({ cpmkId, bobotCpmk: Number(bobot) })),
      syaratLulus: row.syaratLulus,
    }));

    saveMutation.mutate(
      { mataKuliahId: mataKuliahId!, siakPeriodeAkademikId: periodeId, evaluasiList },
      {
        onSuccess: () => {
          setSuccessMessage("Rencana evaluasi berhasil disimpan.");
          setIsEditingKomponen(false);
          setRows([]);
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan rencana evaluasi.");
        },
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Rencana Evaluasi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Rencana Evaluasi</p>
          {reData?.mataKuliah && (
            <h2 className="text-lg font-bold text-gray-800 mt-1">
              {reData.mataKuliah.kode} - {reData.mataKuliah.nama}
            </h2>
          )}
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button onClick={handleBack} className="bg-primary-yellow text-white p-2.5 rounded-md flex items-center justify-center hover:bg-opacity-90">
                <ArrowLeft size={16} />
              </button>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Periode Akademik</label>
                <select
                  value={periodeId}
                  onChange={(e) => setPeriodeId(e.target.value)}
                  className="border border-gray-300 rounded p-2 text-sm w-64"
                >
                  <option value="">-- Pilih Periode Akademik --</option>
                  {daftarPeriode.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}{p.status === "Aktif" ? " (Aktif)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="rencanaEvaluasi" />

            <div className="w-full md:w-[80%]">
              {!periodeId ? (
                <div className="flex items-center justify-center h-40 border border-gray-200 rounded-md bg-gray-50">
                  <p className="text-gray-500">Pilih Periode Akademik untuk melihat Rencana Evaluasi.</p>
                </div>
              ) : isLoading ? (
                <div className="flex justify-center p-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {!isKoordinator && (
                    <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-md mb-4 flex items-start gap-3 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>Anda cuma bisa melihat Rencana Evaluasi mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
                  )}

                  <div className="flex items-center justify-between border-b-2 border-primary-green pb-1 mb-3">
                    <h3 className="text-base font-bold text-gray-800">Komponen Evaluasi</h3>
                    {isKoordinator && !isEditingKomponen && (
                      <button
                        onClick={handleStartEdit}
                        className="bg-primary-yellow text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer"
                      >
                        <Pencil size={14} /> Ubah Data
                      </button>
                    )}
                  </div>
                  {isReLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-sm mb-4">
                      <table className="min-w-full bg-white border-collapse">
                        <thead>
                          <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                            <th className="p-3 border border-gray-300" rowSpan={2}>No.</th>
                            <th className="p-3 border border-gray-300" rowSpan={2}>Metode Evaluasi</th>
                            <th className="p-3 border border-gray-300" rowSpan={2}>Jenis Evaluasi</th>
                            {cpmkGroups.map((g) =>
                              g.subs.length > 0 ? (
                                <th key={g.id} className="p-3 border border-gray-300" colSpan={g.subs.length}>
                                  {g.kode}
                                </th>
                              ) : (
                                <th key={g.id} className="p-3 border border-gray-300" rowSpan={2}>
                                  {g.kode}
                                </th>
                              )
                            )}
                            <th className="p-3 border border-gray-300" rowSpan={2}>Bobot Evaluasi</th>
                            <th className="p-3 border border-gray-300" rowSpan={2}>Syarat Lulus</th>
                            {isEditingKomponen && <th className="p-3 border border-gray-300" rowSpan={2}>Aksi</th>}
                          </tr>
                          {hasSubCpmkGroup && (
                            <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                              {cpmkGroups.flatMap((g) =>
                                g.subs.length > 0
                                  ? g.subs.map((s) => (
                                      <th key={s.id} className="p-2 border border-gray-300 min-w-[70px]">
                                        {s.kode}
                                      </th>
                                    ))
                                  : []
                              )}
                            </tr>
                          )}
                        </thead>
                        <tbody className="text-sm text-gray-700 text-center font-semibold">
                          {isEditingKomponen ? (
                            rows.length > 0 ? (
                              rows.map((row, idx) => (
                                <tr key={row.localId} className="hover:bg-gray-50 border-b border-gray-200">
                                  <td className="p-2 border border-gray-200">{idx + 1}</td>
                                  <td className="p-2 border border-gray-200">
                                    <select
                                      value={row.metodeEvaluasi}
                                      onChange={(e) => updateRowField(row.localId, "metodeEvaluasi", e.target.value)}
                                      className="w-32 border border-gray-300 rounded p-1 text-xs"
                                    >
                                      <option value="">-- Pilih --</option>
                                      {METODE_EVALUASI_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-2 border border-gray-200">
                                    <select
                                      value={row.jenisEvaluasi}
                                      onChange={(e) => updateRowField(row.localId, "jenisEvaluasi", e.target.value)}
                                      className="w-48 border border-gray-300 rounded p-1 text-xs"
                                    >
                                      <option value="">-- Pilih --</option>
                                      {JENIS_EVALUASI_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  {cpmkGroups.flatMap((g) =>
                                    (g.subs.length > 0 ? g.subs : [{ id: g.id, kode: g.kode }]).map((leaf) => (
                                      <td key={leaf.id} className="p-2 border border-gray-200">
                                        <input
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={row.cpmkBobot[leaf.id] ?? 0}
                                          onChange={(e) => updateRowBobot(row.localId, leaf.id, e.target.value)}
                                          className="w-14 border border-gray-300 rounded p-1 text-xs text-center"
                                        />
                                      </td>
                                    ))
                                  )}
                                  <td className="p-2 border border-gray-200" title="Dihitung otomatis dari bobot CPMK/Sub-CPMK di baris ini">
                                    {rowBobot(row)}%
                                  </td>
                                  <td className="p-2 border border-gray-200">
                                    <select
                                      value={row.syaratLulus}
                                      onChange={(e) => updateRowField(row.localId, "syaratLulus", e.target.value)}
                                      className="border border-gray-300 rounded p-1 text-xs"
                                    >
                                      {SYARAT_LULUS_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                          {o.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="p-2 border border-gray-200">
                                    <button onClick={() => hapusEvaluasiRow(row.localId)} className="text-red-600 hover:text-red-800">
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6 + cpmkLeafColumns} className="p-8 text-center text-gray-400 italic">
                                  Klik "+ Tambah Baris" untuk mulai.
                                </td>
                              </tr>
                            )
                          ) : existing.length === 0 ? (
                            <tr>
                              <td colSpan={5 + cpmkLeafColumns} className="p-8 text-center text-gray-400 italic">
                                Belum ada Rencana Evaluasi untuk periode ini.
                              </td>
                            </tr>
                          ) : (
                            existing.map((item: any, idx: number) => (
                              <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-200">
                                <td className="p-3 border border-gray-200">{idx + 1}</td>
                                <td className="p-3 border border-gray-200">{item.metodeEvaluasi}</td>
                                <td className="p-3 border border-gray-200">{item.jenisEvaluasi}</td>
                                {cpmkGroups.flatMap((g) =>
                                  (g.subs.length > 0 ? g.subs : [{ id: g.id, kode: g.kode }]).map((leaf) => (
                                    <td key={leaf.id} className="p-3 border border-gray-200">
                                      {item.mappingBobotCpmk?.[leaf.id] ?? "-"}
                                    </td>
                                  ))
                                )}
                                <td className="p-3 border border-gray-200">{item.bobotEvaluasi}%</td>
                                <td className="p-3 border border-gray-200 text-xs font-normal">
                                  {SYARAT_LULUS_OPTIONS.find((o) => o.value === item.syaratLulus)?.label || item.syaratLulus}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {isEditingKomponen
                          ? rows.length > 0 && (
                              <tfoot>
                                <tr className="bg-gray-100 font-bold text-center">
                                  <td colSpan={3 + cpmkLeafColumns} className="p-2 text-right border border-gray-200">
                                    Total Bobot Evaluasi
                                  </td>
                                  <td className={`p-2 border border-gray-200 ${grandTotal === 100 ? "text-green-600" : "text-red-500"}`}>
                                    {grandTotal}%
                                  </td>
                                  <td colSpan={2} className="border border-gray-200"></td>
                                </tr>
                              </tfoot>
                            )
                          : existing.length > 0 && (
                              <tfoot>
                                <tr className="bg-gray-100 font-bold text-center">
                                  <td colSpan={3 + cpmkLeafColumns} className="p-2 text-right border border-gray-200">
                                    Total Persentase Komponen Evaluasi
                                  </td>
                                  <td className={`p-2 border border-gray-200 ${existingTotalBobot === 100 ? "text-green-600" : "text-red-500"}`}>
                                    {existingTotalBobot}%
                                  </td>
                                  <td className="border border-gray-200"></td>
                                </tr>
                              </tfoot>
                            )}
                      </table>
                    </div>
                  )}

                  {isEditingKomponen && (
                    <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={tambahEvaluasiRow}
                          className="bg-gray-200 border border-dashed border-gray-400 px-3 py-1.5 rounded text-xs flex items-center gap-1 hover:bg-gray-300"
                        >
                          <Plus size={14} /> Tambah Baris
                        </button>
                        <button
                          onClick={() => refetchCpmk()}
                          disabled={isCpmkFetching}
                          className="bg-gray-200 border border-gray-400 px-3 py-1.5 rounded text-xs flex items-center gap-1 hover:bg-gray-300"
                        >
                          <RefreshCw size={12} className={isCpmkFetching ? "animate-spin" : ""} /> Refresh Kolom CPMK
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-400 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saveMutation.isPending}
                          className="bg-primary-green text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer disabled:opacity-50"
                        >
                          <Save size={14} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
                    Syarat Lulus Mata Kuliah adalah komponen nilai wajib. Mahasiswa yang tidak memiliki komponen ini akan
                    dinyatakan tidak lulus Mata Kuliah.
                  </div>

                  <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary-green pb-1 mb-3">
                    Pelaporan Metode Evaluasi
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-sm mb-2">
                    <table className="min-w-full bg-white border-collapse">
                      <thead>
                        <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                          <th className="p-3 border border-gray-300">No.</th>
                          <th className="p-3 border border-gray-300 text-left">Basis Evaluasi</th>
                          <th className="p-3 border border-gray-300 text-left">Komponen Evaluasi</th>
                          <th className="p-3 border border-gray-300">Bobot Evaluasi</th>
                          <th className="p-3 border border-gray-300 text-left">Deskripsi</th>
                          <th className="p-3 border border-gray-300 text-left">Deskripsi (Inggris)</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700 text-center font-semibold">
                        {PELAPORAN_METODE_EVALUASI_GROUPS.map((group, gIdx) =>
                          group.items.map((item, iIdx) => {
                            const match = existing.find((e: any) => e.jenisEvaluasi === item.jenisMatch);
                            return (
                              <tr key={`${gIdx}-${iIdx}`} className="hover:bg-gray-50 border-b border-gray-200">
                                {iIdx === 0 && (
                                  <td className="p-3 border border-gray-200" rowSpan={group.items.length}>
                                    {gIdx + 1}
                                  </td>
                                )}
                                {iIdx === 0 && (
                                  <td className="p-3 border border-gray-200 text-left font-normal" rowSpan={group.items.length}>
                                    {group.basis}
                                  </td>
                                )}
                                <td className="p-3 border border-gray-200">{item.komponen || "-"}</td>
                                <td className="p-3 border border-gray-200">{match ? `${match.bobotEvaluasi}%` : "-"}</td>
                                <td className="p-3 border border-gray-200 text-left font-normal">
                                  {match ? item.deskripsi : "-"}
                                </td>
                                <td className="p-3 border border-gray-200 text-left font-normal">-</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
                    Bobot metode evaluasi diambil dari total persentase metode evaluasi yang ada pada Rencana Evaluasi.
                  </div>

                  {isEditingKomponen && (
                    <p className="text-xs text-gray-500 mb-6">
                      Hanya syarat "Menjadi syarat lulus" yang benar-benar berlaku di backend (skor &lt;60 = huruf E). Menyimpan
                      baris dengan Metode+Jenis yang sama seperti data existing akan MENIMPA baris tersebut, bukan menduplikasi.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}