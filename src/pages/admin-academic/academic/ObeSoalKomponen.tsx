import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Plus, Trash2, Save, Pencil, X } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement";
import { useAcademicPeriods } from "../../../hooks/usePeriodeAkademik";
import { getRencanaEvaluasi } from "../../../hooks/academic/useObeRencanaEvaluasi";
import { getPemetaanCpmk } from "../../../hooks/academic/useObeCpmkMk";
import {
  getSoalKomponen,
  useBatchCreateSoal,
  useUpdateSoal,
  useDeleteSoal,
  DraftSoalItem,
  JenisUnit,
} from "../../../hooks/academic/useObeSoalKomponen";

interface DraftRow {
  localId: string;
  nomor: number;
  jenisUnit: JenisUnit;
  label: string;
  pertanyaan: string;
  kunciJawaban: string;
  skorMaksimal: number;
  opsi: { label: string; teks: string }[];
  cpmkBobot: Record<string, number>;
  parentSoalNomor?: number;
  parentSoalId?: string;
}

let uid = 0;
const nextUid = () => `soal-${Date.now()}-${uid++}`;

export default function ObeSoalKomponen() {
  const [mkSearch, setMkSearch] = useState("");
  const [mataKuliahId, setMataKuliahId] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [rencanaEvaluasiId, setRencanaEvaluasiId] = useState("");
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [editingSoal, setEditingSoal] = useState<DraftRow | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 50, search: mkSearch });
  const { data: periodeList } = useAcademicPeriods();
  const { data: reData } = getRencanaEvaluasi(mataKuliahId, periodeId);
  const { data: cpmkMappingData } = getPemetaanCpmk(mataKuliahId);
  const { data: soalData, isLoading: isSoalLoading } = getSoalKomponen(rencanaEvaluasiId);

  const batchMutation = useBatchCreateSoal(rencanaEvaluasiId);
  const updateMutation = useUpdateSoal();
  const deleteMutation = useDeleteSoal();

  const mkList: any[] = Array.isArray(mkResponse?.data)
    ? mkResponse.data
    : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];
  const komponenList = reData?.rencanaEvaluasi || [];
  const existingSoal = soalData?.daftarSoal || [];

  const cpmkColumns = useMemo(() => {
    if (!cpmkMappingData) return [];
    if (cpmkMappingData.levelPemetaan === "Sub-CPMK") {
      const cols: { id: string; kode: string }[] = [];
      cpmkMappingData.cpmkData.forEach((c) => {
        (c.subCpmk || []).forEach((s) => {
          if (s.id) cols.push({ id: s.id, kode: `${c.kode}.${s.kode}` });
        });
      });
      return cols;
    }
    return cpmkMappingData.cpmkData.filter((c) => c.id).map((c) => ({ id: c.id as string, kode: c.kode }));
  }, [cpmkMappingData]);

  useEffect(() => {
    setRencanaEvaluasiId("");
  }, [mataKuliahId, periodeId]);

  const emptyDraft = (): DraftRow => ({
    localId: nextUid(),
    nomor: draftRows.length + 1,
    jenisUnit: "RUBRIK",
    label: "",
    pertanyaan: "",
    kunciJawaban: "",
    skorMaksimal: 0,
    opsi: [],
    cpmkBobot: {},
  });

  const tambahSoal = () => setDraftRows((prev) => [...prev, { ...emptyDraft(), nomor: prev.length + 1 }]);

  const hapusDraft = (localId: string) =>
    setDraftRows((prev) => prev.filter((r) => r.localId !== localId).map((r, idx) => ({ ...r, nomor: idx + 1 })));

  const updateDraft = (localId: string, patch: Partial<DraftRow>) => {
    setDraftRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, ...patch } : r)));
  };

  const updateCpmkBobot = (localId: string, cpmkId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setDraftRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, cpmkBobot: { ...r.cpmkBobot, [cpmkId]: isNaN(num) ? 0 : num } } : r))
    );
  };

  const addOpsi = (localId: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, opsi: [...r.opsi, { label: "", teks: "" }] } : r))
    );
  };

  const updateOpsi = (localId: string, idx: number, field: "label" | "teks", value: string) => {
    setDraftRows((prev) =>
      prev.map((r) =>
        r.localId === localId
          ? { ...r, opsi: r.opsi.map((o, i) => (i === idx ? { ...o, [field]: value } : o)) }
          : r
      )
    );
  };

  const removeOpsi = (localId: string, idx: number) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, opsi: r.opsi.filter((_, i) => i !== idx) } : r))
    );
  };

  const toDraftSoalItem = (row: DraftRow): DraftSoalItem => ({
    nomor: row.nomor,
    label: row.label || undefined,
    jenisUnit: row.jenisUnit,
    skorMaksimal: Number(row.skorMaksimal) || 0,
    pertanyaan: row.pertanyaan || undefined,
    kunciJawaban: row.kunciJawaban || undefined,
    opsiJawaban: row.jenisUnit === "OBJEKTIF" ? row.opsi : undefined,
    pemetaanCpmk: Object.entries(row.cpmkBobot)
      .filter(([, v]) => Number(v) > 0)
      .map(([cpmkId, bobotPoin]) => ({ cpmkId, bobotPoin: Number(bobotPoin) })),
    parentSoalNomor: row.parentSoalNomor,
    parentSoalId: row.parentSoalId,
  });

  const handleSaveBatch = () => {
    setMessage(null);
    if (draftRows.length === 0) return;
    if (draftRows.some((r) => (r.jenisUnit === "OBJEKTIF" && r.opsi.length === 0) || (!r.pertanyaan.trim() && !r.label.trim()))) {
      setMessage({ type: "error", text: "Setiap soal butuh Pertanyaan/Label, dan soal PG butuh minimal 1 opsi jawaban." });
      return;
    }
    for (const row of draftRows) {
      const totalPoin = Object.values(row.cpmkBobot).reduce((s, v) => s + (Number(v) || 0), 0);
      if (totalPoin > Number(row.skorMaksimal)) {
        setMessage({ type: "error", text: `Soal no. ${row.nomor}: total bobot poin CPMK (${totalPoin}) melebihi Skor Maksimal (${row.skorMaksimal}).` });
        return;
      }
    }

    batchMutation.mutate(
      draftRows.map(toDraftSoalItem),
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "Soal berhasil disimpan." });
          setDraftRows([]);
        },
        onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal menyimpan soal." }),
      }
    );
  };

  const openEdit = (soal: any) => {
    setEditingSoal({
      localId: soal.id,
      nomor: soal.nomor,
      jenisUnit: soal.jenisUnit,
      label: soal.label || "",
      pertanyaan: soal.pertanyaan || "",
      kunciJawaban: soal.kunciJawaban || "",
      skorMaksimal: soal.skorMaksimal || 0,
      opsi: soal.opsiJawaban || [],
      cpmkBobot: (soal.pemetaanCpmk || []).reduce((acc: Record<string, number>, p: any) => {
        acc[p.cpmkId] = p.bobotPoin;
        return acc;
      }, {}),
    });
  };

  const handleUpdateSoal = () => {
    if (!editingSoal) return;
    const payload = toDraftSoalItem(editingSoal);
    delete (payload as any).parentSoalNomor;
    updateMutation.mutate(
      { soalId: editingSoal.localId, rencanaEvaluasiId, payload },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "Soal berhasil diperbarui." });
          setEditingSoal(null);
        },
        onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal memperbarui soal." }),
      }
    );
  };

  const handleDelete = (soalId: string) => {
    if (!window.confirm("Hapus soal ini? Tindakan ini tidak dapat dibatalkan.")) return;
    deleteMutation.mutate({ soalId, rencanaEvaluasiId });
  };

  return (
    <MainLayout isGreeting={false} titlePage="Soal per Komponen Evaluasi (Jalur C)">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Soal per Komponen</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Cari Mata Kuliah</label>
              <input
                type="text"
                value={mkSearch}
                onChange={(e) => setMkSearch(e.target.value)}
                placeholder="Nama/kode mata kuliah"
                className="w-full border border-gray-300 rounded p-2 text-sm"
              />
              <select
                value={mataKuliahId}
                onChange={(e) => setMataKuliahId(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm mt-2"
              >
                <option value="">-- Pilih Mata Kuliah --</option>
                {mkList.map((mk: any) => (
                  <option key={mk.id} value={mk.id}>
                    {mk.kode} - {mk.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Periode Akademik</label>
              <select
                value={periodeId}
                onChange={(e) => setPeriodeId(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              >
                <option value="">-- Pilih Periode --</option>
                {(periodeList || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Komponen Evaluasi (rencanaEvaluasiId)</label>
              <select
                value={rencanaEvaluasiId}
                onChange={(e) => setRencanaEvaluasiId(e.target.value)}
                disabled={!mataKuliahId || !periodeId}
                className="w-full border border-gray-300 rounded p-2 text-sm disabled:bg-gray-100"
              >
                <option value="">-- Pilih Komponen --</option>
                {komponenList.map((k) => (
                  <option key={k.id} value={k.id}>{k.metodeEvaluasi} - {k.jenisEvaluasi}</option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
              {message.text}
            </div>
          )}

          {!rencanaEvaluasiId ? (
            <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-500">Pilih Mata Kuliah, Periode, dan Komponen Evaluasi terlebih dahulu.</p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold mb-2">Daftar Soal Tersimpan</h3>
              {isSoalLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-sm mb-6">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-700 text-white text-xs">
                        <th className="p-2 border">No</th>
                        <th className="p-2 border">Jenis</th>
                        <th className="p-2 border">Pertanyaan/Label</th>
                        <th className="p-2 border">Skor Maks</th>
                        <th className="p-2 border">Induk</th>
                        <th className="p-2 border">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {existingSoal.length > 0 ? (
                        existingSoal.map((s) => (
                          <tr key={s.id} className="text-center">
                            <td className="p-2 border">{s.nomor}</td>
                            <td className="p-2 border">{s.jenisUnit}</td>
                            <td className="p-2 border text-left">{s.pertanyaan || s.label || "-"}</td>
                            <td className="p-2 border">{s.skorMaksimal}</td>
                            <td className="p-2 border">{s.parentSoalId ? "Ya" : "-"}</td>
                            <td className="p-2 border">
                              <div className="flex gap-2 justify-center">
                                <button onClick={() => openEdit(s)} className="text-yellow-600 hover:text-yellow-800"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500 italic">Belum ada soal di komponen ini.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {editingSoal && (
                <div className="border border-yellow-300 bg-yellow-50 rounded p-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold">Edit Soal #{editingSoal.nomor}</h4>
                    <button onClick={() => setEditingSoal(null)}><X size={16} /></button>
                  </div>
                  <SoalForm
                    row={editingSoal}
                    cpmkColumns={cpmkColumns}
                    onChange={(patch) => setEditingSoal((prev) => (prev ? { ...prev, ...patch } : prev))}
                    onCpmkChange={(cpmkId, v) => setEditingSoal((prev) => (prev ? { ...prev, cpmkBobot: { ...prev.cpmkBobot, [cpmkId]: Number(v) || 0 } } : prev))}
                    onOpsiAdd={() => setEditingSoal((prev) => (prev ? { ...prev, opsi: [...prev.opsi, { label: "", teks: "" }] } : prev))}
                    onOpsiChange={(idx, field, v) =>
                      setEditingSoal((prev) => (prev ? { ...prev, opsi: prev.opsi.map((o, i) => (i === idx ? { ...o, [field]: v } : o)) } : prev))
                    }
                    onOpsiRemove={(idx) => setEditingSoal((prev) => (prev ? { ...prev, opsi: prev.opsi.filter((_, i) => i !== idx) } : prev))}
                  />
                  <button onClick={handleUpdateSoal} disabled={updateMutation.isPending} className="mt-3 bg-primary-green text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 disabled:opacity-50">
                    <Save size={14} /> {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              )}

              <h3 className="text-sm font-bold mb-2">Tambah Soal Baru (Batch)</h3>
              <div className="space-y-4">
                {draftRows.map((row) => (
                  <div key={row.localId} className="border border-gray-200 rounded p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold">Soal #{row.nomor}</span>
                      <button onClick={() => hapusDraft(row.localId)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                    </div>
                    <SoalForm
                      row={row}
                      cpmkColumns={cpmkColumns}
                      draftRows={draftRows}
                      existingSoal={existingSoal}
                      onChange={(patch) => updateDraft(row.localId, patch)}
                      onCpmkChange={(cpmkId, v) => updateCpmkBobot(row.localId, cpmkId, v)}
                      onOpsiAdd={() => addOpsi(row.localId)}
                      onOpsiChange={(idx, field, v) => updateOpsi(row.localId, idx, field, v)}
                      onOpsiRemove={(idx) => removeOpsi(row.localId, idx)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={tambahSoal} className="bg-gray-200 border border-dashed border-gray-400 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-gray-300">
                  <Plus size={14} /> Tambah Soal
                </button>
                {draftRows.length > 0 && (
                  <button onClick={handleSaveBatch} disabled={batchMutation.isPending} className="bg-primary-green text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 disabled:opacity-50">
                    <Save size={14} /> {batchMutation.isPending ? "Menyimpan..." : "Simpan Batch Soal"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function SoalForm({
  row,
  cpmkColumns,
  draftRows,
  existingSoal,
  onChange,
  onCpmkChange,
  onOpsiAdd,
  onOpsiChange,
  onOpsiRemove,
}: {
  row: DraftRow;
  cpmkColumns: { id: string; kode: string }[];
  draftRows?: DraftRow[];
  existingSoal?: any[];
  onChange: (patch: Partial<DraftRow>) => void;
  onCpmkChange: (cpmkId: string, value: string) => void;
  onOpsiAdd: () => void;
  onOpsiChange: (idx: number, field: "label" | "teks", value: string) => void;
  onOpsiRemove: (idx: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Jenis</label>
        <select value={row.jenisUnit} onChange={(e) => onChange({ jenisUnit: e.target.value as JenisUnit })} className="w-full border rounded p-2 text-sm">
          <option value="RUBRIK">RUBRIK (Esai / Presentasi / Tugas)</option>
          <option value="OBJEKTIF">OBJEKTIF (Pilihan Ganda)</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Skor Maksimal</label>
        <input type="number" min={0} value={row.skorMaksimal} onChange={(e) => onChange({ skorMaksimal: Number(e.target.value) || 0 })} className="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Label (untuk kriteria non-tertulis, mis. "Penguasaan Materi")</label>
        <input type="text" value={row.label} onChange={(e) => onChange({ label: e.target.value })} className="w-full border rounded p-2 text-sm" />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Induk soal (kalau ini soal beranak)</label>
        {draftRows ? (
          <select
            value={row.parentSoalNomor ?? ""}
            onChange={(e) => onChange({ parentSoalNomor: e.target.value ? Number(e.target.value) : undefined, parentSoalId: undefined })}
            className="w-full border rounded p-2 text-sm"
          >
            <option value="">-- Tidak ada --</option>
            {(draftRows || []).filter((r) => r.localId !== row.localId).map((r) => (
              <option key={r.localId} value={r.nomor}>Soal draft #{r.nomor}</option>
            ))}
            {(existingSoal || []).map((s: any) => (
              <option key={s.id} value={`existing-${s.id}`} disabled>{`(server) ${s.nomor}. ${s.pertanyaan || s.label}`}</option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-gray-400">Tidak berlaku saat mengedit soal tersimpan</span>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Pertanyaan</label>
        <textarea value={row.pertanyaan} onChange={(e) => onChange({ pertanyaan: e.target.value })} className="w-full border rounded p-2 text-sm" rows={2} />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-gray-600 block mb-1">
          {row.jenisUnit === "OBJEKTIF" ? "Kunci Jawaban (label opsi yang benar)" : "Jawaban Acuan / Rubrik (opsional, catatan dosen)"}
        </label>
        <input type="text" value={row.kunciJawaban} onChange={(e) => onChange({ kunciJawaban: e.target.value })} className="w-full border rounded p-2 text-sm" />
      </div>

      {row.jenisUnit === "OBJEKTIF" && (
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Opsi Jawaban</label>
          {row.opsi.map((o, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="text" placeholder="A" value={o.label} onChange={(e) => onOpsiChange(idx, "label", e.target.value)} className="w-16 border rounded p-1 text-sm" />
              <input type="text" placeholder="Teks opsi" value={o.teks} onChange={(e) => onOpsiChange(idx, "teks", e.target.value)} className="flex-1 border rounded p-1 text-sm" />
              <button onClick={() => onOpsiRemove(idx)} className="text-red-600"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={onOpsiAdd} className="text-xs text-primary-blueDark hover:underline flex items-center gap-1 mt-1">
            <Plus size={12} /> Tambah Opsi
          </button>
        </div>
      )}

      {cpmkColumns.length > 0 && (
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-gray-600 block mb-1">Pemetaan ke CPMK (bobot poin)</label>
          <div className="flex flex-wrap gap-2">
            {cpmkColumns.map((c) => (
              <div key={c.id} className="flex items-center gap-1 border rounded p-1">
                <span className="text-xs font-semibold">{c.kode}</span>
                <input
                  type="number"
                  min={0}
                  value={row.cpmkBobot[c.id] ?? 0}
                  onChange={(e) => onCpmkChange(c.id, e.target.value)}
                  className="w-14 border rounded p-1 text-xs text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
