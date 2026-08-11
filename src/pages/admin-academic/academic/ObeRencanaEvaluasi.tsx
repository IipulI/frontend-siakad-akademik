import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, RefreshCw } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useAcademicPeriods } from "../../../hooks/usePeriodeAkademik";
import {
  getRencanaEvaluasi,
  useSaveRencanaEvaluasi,
  SyaratLulus,
} from "../../../hooks/academic/useObeRencanaEvaluasi";
import { getPemetaanCpmk } from "../../../hooks/academic/useObeCpmkMk";

interface CpmkColumn {
  id: string;
  kode: string;
}

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

let uidCounter = 0;
const nextUid = () => `local-eval-${Date.now()}-${uidCounter++}`;

export default function ObeRencanaEvaluasi() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const navigate = useNavigate();

  const { data: periodeList, isLoading: isPeriodeLoading } = useAcademicPeriods();
  const [periodeId, setPeriodeId] = useState<string>("");

  const { data: reData, isLoading: isReLoading } = getRencanaEvaluasi(mataKuliahId || "", periodeId);
  const { data: cpmkMappingData, refetch: refetchCpmk, isFetching: isCpmkFetching } = getPemetaanCpmk(mataKuliahId || "");
  const saveMutation = useSaveRencanaEvaluasi();

  const [cpmkColumns, setCpmkColumns] = useState<CpmkColumn[]>([]);
  const [rows, setRows] = useState<LocalEvaluasiRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const existing = reData?.rencanaEvaluasi || [];
  const masterCpmk = reData?.masterCpmk || [];

  useEffect(() => {
    if (!cpmkMappingData) return;
    if (cpmkMappingData.levelPemetaan === "Sub-CPMK") {
      const cols: CpmkColumn[] = [];
      cpmkMappingData.cpmkData.forEach((c) => {
        (c.subCpmk || []).forEach((s) => {
          if (s.id) cols.push({ id: s.id, kode: `${c.kode}.${s.kode}` });
        });
      });
      setCpmkColumns(cols);
    } else {
      setCpmkColumns(
        cpmkMappingData.cpmkData.filter((c) => c.id).map((c) => ({ id: c.id as string, kode: c.kode }))
      );
    }
  }, [cpmkMappingData]);

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.obeManagement);

  const kodeCpmkFor = (cpmkId: string) => {
    const found = masterCpmk.find((m) => m.id === cpmkId) || cpmkColumns.find((c) => c.id === cpmkId);
    return found?.kode || cpmkId.slice(0, 8);
  };

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

  const salinDariExisting = () => {
    setRows(
      existing.map((item) => ({
        localId: nextUid(),
        metodeEvaluasi: item.metodeEvaluasi,
        jenisEvaluasi: item.jenisEvaluasi,
        cpmkBobot: { ...(item.mappingBobotCpmk || {}) },
        syaratLulus: item.syaratLulus,
      }))
    );
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
        onSuccess: () => setSuccessMessage("Rencana evaluasi berhasil disimpan."),
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
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Rencana Evaluasi</p>
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
                  disabled={isPeriodeLoading}
                >
                  <option value="">-- Pilih Periode Akademik --</option>
                  {(periodeList || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending || !periodeId}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarObeCourse obeId={obeId || "default"} mataKuliahId={mataKuliahId || ""} activeTab="rencanaEvaluasi" />

            <div className="w-full md:w-[80%]">
              {!periodeId ? (
                <div className="flex items-center justify-center h-40 border border-gray-200 rounded-md bg-gray-50">
                  <p className="text-gray-500">Pilih Periode Akademik untuk melihat/mengisi Rencana Evaluasi.</p>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
                  )}

                  <h3 className="text-sm font-bold mb-2">📋 Data yang sudah ada di server</h3>
                  {isReLoading ? (
                    <LoadingSpinner />
                  ) : existing.length === 0 ? (
                    <div className="p-4 mb-6 text-center text-gray-500 italic border border-gray-200 rounded text-sm">
                      Belum ada Rencana Evaluasi untuk periode ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-sm mb-6">
                      <table className="min-w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-700 text-white text-xs">
                            <th className="p-2 border">Metode</th>
                            <th className="p-2 border">Jenis</th>
                            <th className="p-2 border">Bobot Evaluasi</th>
                            <th className="p-2 border">Pemetaan CPMK</th>
                            <th className="p-2 border">Syarat Lulus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {existing.map((item) => (
                            <tr key={item.id} className="text-center">
                              <td className="p-2 border">{item.metodeEvaluasi}</td>
                              <td className="p-2 border">{item.jenisEvaluasi}</td>
                              <td className="p-2 border font-semibold">{item.bobotEvaluasi}%</td>
                              <td className="p-2 border text-left text-xs">
                                {Object.entries(item.mappingBobotCpmk || {})
                                  .map(([cpmkId, bobot]) => `${kodeCpmkFor(cpmkId)}: ${bobot}`)
                                  .join(", ") || "-"}
                              </td>
                              <td className="p-2 border text-xs">
                                {SYARAT_LULUS_OPTIONS.find((o) => o.value === item.syaratLulus)?.label || item.syaratLulus}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <h3 className="text-sm font-bold mb-2">✏️ Tambah / Ubah</h3>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <button
                      onClick={() => refetchCpmk()}
                      disabled={isCpmkFetching}
                      className="bg-gray-200 border border-gray-400 px-3 py-1.5 rounded text-xs flex items-center gap-1 hover:bg-gray-300"
                    >
                      <RefreshCw size={12} className={isCpmkFetching ? "animate-spin" : ""} /> Refresh kolom CPMK
                    </button>
                    <button
                      onClick={salinDariExisting}
                      disabled={existing.length === 0}
                      className="bg-gray-200 border border-gray-400 px-3 py-1.5 rounded text-xs hover:bg-gray-300 disabled:opacity-50"
                    >
                      ⬇️ Salin dari data existing
                    </button>
                  </div>

                  {cpmkColumns.length === 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-sm">
                      Belum ada kolom CPMK. Lengkapi Pemetaan CPMK terlebih dahulu di menu sebelah.
                    </div>
                  )}

                  <div className="overflow-x-auto border border-gray-200 rounded-sm">
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#0b5c77] text-white text-xs text-center">
                          <th className="p-2 border">Metode Evaluasi</th>
                          <th className="p-2 border">Jenis Evaluasi</th>
                          {cpmkColumns.map((c) => (
                            <th key={c.id} className="p-2 border min-w-[70px]">{c.kode}</th>
                          ))}
                          <th className="p-2 border">Bobot Evaluasi</th>
                          <th className="p-2 border">Syarat Lulus</th>
                          <th className="p-2 border">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length > 0 ? (
                          rows.map((row) => (
                            <tr key={row.localId} className="text-center">
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={row.metodeEvaluasi}
                                  onChange={(e) => updateRowField(row.localId, "metodeEvaluasi", e.target.value)}
                                  className="w-28 border rounded p-1 text-xs"
                                  placeholder="UTS/UAS/TUGAS/KEHADIRAN"
                                />
                              </td>
                              <td className="p-1 border">
                                <input
                                  type="text"
                                  value={row.jenisEvaluasi}
                                  onChange={(e) => updateRowField(row.localId, "jenisEvaluasi", e.target.value)}
                                  className="w-32 border rounded p-1 text-xs"
                                  placeholder="Kognitif/Pengetahuan"
                                />
                              </td>
                              {cpmkColumns.map((c) => (
                                <td key={c.id} className="p-1 border">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={row.cpmkBobot[c.id] ?? 0}
                                    onChange={(e) => updateRowBobot(row.localId, c.id, e.target.value)}
                                    className="w-14 border rounded p-1 text-xs text-center"
                                  />
                                </td>
                              ))}
                              <td className="p-1 border font-semibold">{rowBobot(row)}</td>
                              <td className="p-1 border">
                                <select
                                  value={row.syaratLulus}
                                  onChange={(e) => updateRowField(row.localId, "syaratLulus", e.target.value)}
                                  className="border rounded p-1 text-xs"
                                >
                                  {SYARAT_LULUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-1 border">
                                <button onClick={() => hapusEvaluasiRow(row.localId)} className="text-red-600 hover:text-red-800">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5 + cpmkColumns.length} className="p-4 text-center text-gray-500 italic">
                              Klik "+ Tambah Metode Evaluasi" untuk mulai.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {rows.length > 0 && (
                        <tfoot>
                          <tr className="bg-gray-100 font-bold text-center">
                            <td colSpan={2 + cpmkColumns.length} className="p-2 text-right border">Total Bobot Evaluasi</td>
                            <td className={`p-2 border ${grandTotal === 100 ? "text-green-600" : "text-red-500"}`}>{grandTotal}%</td>
                            <td colSpan={2} className="border"></td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Hanya syarat "Menjadi syarat lulus" yang benar-benar berlaku di backend (skor &lt;60 = huruf E). Menyimpan
                    baris dengan Metode+Jenis yang sama seperti data existing akan MENIMPA baris tersebut, bukan menduplikasi.
                  </p>

                  <button onClick={tambahEvaluasiRow} className="mt-3 bg-gray-200 border border-dashed border-gray-400 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-gray-300">
                    <Plus size={14} /> Tambah Metode Evaluasi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
