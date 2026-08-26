import React, { useMemo, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Save, Plus, Trash2, RotateCcw } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement";
import { useAcademicPeriods } from "../../../hooks/usePeriodeAkademik";
import { getRencanaEvaluasi } from "../../../hooks/academic/useObeRencanaEvaluasi";
import { getPemetaanCpmk } from "../../../hooks/academic/useObeCpmkMk";
import { getCollegeClass } from "../../../hooks/useKelasKuliah";
import { getKelasNilai, useSubmitKelasNilai } from "../../../hooks/academic/useObeGradingKelas";
import {
  getCbtNilai,
  useSyncCbtNilai,
  useResetCbtNilaiSiswa,
  useSyncNilaiAkhir,
  CbtBreakdownItem,
} from "../../../hooks/academic/useObeCbt";

type TabKey = "breakdown" | "nilaiAkhir" | "kehadiran";

const KEHADIRAN_REGEX = /kehadiran|partisipasi|presensi|keaktifan|absen/i;

export default function ObeIntegrasiCbt() {
  const [tab, setTab] = useState<TabKey>("breakdown");

  const [mkSearch, setMkSearch] = useState("");
  const [mataKuliahId, setMataKuliahId] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [rencanaEvaluasiId, setRencanaEvaluasiId] = useState("");

  const [kelasSearch, setKelasSearch] = useState("");
  const [kelasId, setKelasId] = useState("");

  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 50, search: mkSearch });
  const { data: periodeList } = useAcademicPeriods();
  const { data: reData } = getRencanaEvaluasi(mataKuliahId, periodeId);
  const { data: kelasList } = getCollegeClass({});

  const mkList: any[] = Array.isArray(mkResponse?.data) ? mkResponse.data : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];
  const komponenList = reData?.rencanaEvaluasi || [];

  const filteredKelas = useMemo(() => {
    const list = Array.isArray(kelasList) ? kelasList : kelasList?.rows || [];
    if (!kelasSearch.trim()) return list;
    const q = kelasSearch.toLowerCase();
    return list.filter((k: any) => k.nama?.toLowerCase().includes(q) || k.mataKuliah?.namaMataKuliah?.toLowerCase().includes(q));
  }, [kelasList, kelasSearch]);

  return (
    <MainLayout isGreeting={false} titlePage="Integrasi CBT (Jalur D)">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Integrasi CBT</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex gap-2 mb-5 border-b border-gray-200">
            {[
              { key: "breakdown", label: "Breakdown per Sub-CPMK" },
              { key: "nilaiAkhir", label: "Nilai Akhir MK" },
              { key: "kehadiran", label: "Kehadiran" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                  tab === t.key ? "border-primary-green text-primary-green" : "border-transparent text-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Mata Kuliah</label>
              <input type="text" value={mkSearch} onChange={(e) => setMkSearch(e.target.value)} placeholder="Cari mata kuliah" className="w-full border border-gray-300 rounded p-2 text-sm mb-2" />
              <select value={mataKuliahId} onChange={(e) => setMataKuliahId(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih Mata Kuliah --</option>
                {mkList.map((mk: any) => (
                  <option key={mk.id} value={mk.id}>{mk.kode} - {mk.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Periode Akademik</label>
              <select value={periodeId} onChange={(e) => setPeriodeId(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih Periode --</option>
                {(periodeList || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Kelas Kuliah (untuk daftar mahasiswa)</label>
              <input type="text" value={kelasSearch} onChange={(e) => setKelasSearch(e.target.value)} placeholder="Cari kelas" className="w-full border border-gray-300 rounded p-2 text-sm mb-2" />
              <select value={kelasId} onChange={(e) => setKelasId(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih Kelas Kuliah --</option>
                {filteredKelas.map((k: any) => (
                  <option key={k.id} value={k.id}>{k.mataKuliah?.namaMataKuliah || k.nama} - {k.nama}</option>
                ))}
              </select>
            </div>
            {tab === "breakdown" && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Komponen Evaluasi</label>
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
            )}
          </div>

          {tab === "breakdown" && (
            <BreakdownTab rencanaEvaluasiId={rencanaEvaluasiId} kelasId={kelasId} mataKuliahId={mataKuliahId} />
          )}
          {tab === "nilaiAkhir" && <NilaiAkhirTab kelasId={kelasId} />}
          {tab === "kehadiran" && <KehadiranTab kelasId={kelasId} />}
        </div>
      </div>
    </MainLayout>
  );
}

function BreakdownTab({ rencanaEvaluasiId, kelasId, mataKuliahId }: { rencanaEvaluasiId: string; kelasId: string; mataKuliahId: string }) {
  const { data: nilaiData, isLoading: isNilaiLoading } = getKelasNilai(kelasId);
  const { data: existing } = getCbtNilai(rencanaEvaluasiId);
  const { data: cpmkMappingData } = getPemetaanCpmk(mataKuliahId);
  const syncMutation = useSyncCbtNilai(rencanaEvaluasiId);
  const resetMutation = useResetCbtNilaiSiswa(rencanaEvaluasiId);

  const [draft, setDraft] = useState<Record<string, CbtBreakdownItem[]>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const roster = nilaiData?.tabel || [];

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

  const getBreakdown = (krsId: string): CbtBreakdownItem[] => {
    if (draft[krsId]) return draft[krsId];
    return existing?.find((e) => e.krsId === krsId)?.breakdown || [];
  };

  const tambahBreakdown = (krsId: string) => {
    setDraft((prev) => ({
      ...prev,
      [krsId]: [...getBreakdown(krsId), { skorDiperoleh: 0, skorMaksimal: 0, pemetaanCpmk: [] }],
    }));
  };

  const hapusBreakdown = (krsId: string, idx: number) => {
    setDraft((prev) => ({ ...prev, [krsId]: getBreakdown(krsId).filter((_, i) => i !== idx) }));
  };

  const updateBreakdown = (krsId: string, idx: number, field: "skorDiperoleh" | "skorMaksimal", value: string) => {
    const num = Number(value) || 0;
    setDraft((prev) => ({
      ...prev,
      [krsId]: getBreakdown(krsId).map((b, i) => (i === idx ? { ...b, [field]: num } : b)),
    }));
  };

  const updateCpmkBobot = (krsId: string, idx: number, cpmkId: string, value: string) => {
    const num = Number(value) || 0;
    setDraft((prev) => ({
      ...prev,
      [krsId]: getBreakdown(krsId).map((b, i) => {
        if (i !== idx) return b;
        const others = b.pemetaanCpmk.filter((p) => p.cpmkId !== cpmkId);
        return { ...b, pemetaanCpmk: num > 0 ? [...others, { cpmkId, bobotPoin: num }] : others };
      }),
    }));
  };

  const handleSyncStudent = (krsId: string) => {
    setMessage(null);
    const breakdown = getBreakdown(krsId);
    if (breakdown.length === 0) {
      setMessage({ type: "error", text: "Tambahkan minimal satu breakdown untuk mahasiswa ini." });
      return;
    }
    syncMutation.mutate([{ krsId, breakdown }], {
      onSuccess: () => setMessage({ type: "success", text: "Breakdown berhasil disinkronkan." }),
      onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal menyinkronkan breakdown." }),
    });
  };

  const handleReset = (krsId: string) => {
    if (!window.confirm("Reset breakdown CBT mahasiswa ini untuk komponen ini?")) return;
    resetMutation.mutate(krsId, {
      onSuccess: () => setDraft((prev) => ({ ...prev, [krsId]: [] })),
    });
  };

  if (!rencanaEvaluasiId || !kelasId) {
    return (
      <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-gray-500">Pilih Mata Kuliah, Periode, Kelas, dan Komponen Evaluasi terlebih dahulu.</p>
      </div>
    );
  }

  if (isNilaiLoading) return <LoadingSpinner />;

  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
          {message.text}
        </div>
      )}
      {roster.map((r) => {
        const breakdown = getBreakdown(r.rincianKrsId);
        return (
          <div key={r.rincianKrsId} className="border border-gray-200 rounded p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">{r.nim} - {r.nama}</span>
              <div className="flex gap-2">
                <button onClick={() => handleReset(r.rincianKrsId)} className="text-xs text-red-600 flex items-center gap-1"><RotateCcw size={12} /> Reset</button>
                <button onClick={() => handleSyncStudent(r.rincianKrsId)} disabled={syncMutation.isPending} className="text-xs bg-primary-green text-white px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50">
                  <Save size={12} /> Simpan
                </button>
              </div>
            </div>
            {breakdown.map((b, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2 mb-2 text-xs bg-gray-50 p-2 rounded">
                <label>Skor Diperoleh</label>
                <input type="number" value={b.skorDiperoleh} onChange={(e) => updateBreakdown(r.rincianKrsId, idx, "skorDiperoleh", e.target.value)} className="w-16 border rounded p-1" />
                <label>Skor Maks</label>
                <input type="number" value={b.skorMaksimal} onChange={(e) => updateBreakdown(r.rincianKrsId, idx, "skorMaksimal", e.target.value)} className="w-16 border rounded p-1" />
                {cpmkColumns.map((c) => (
                  <span key={c.id} className="flex items-center gap-1 border rounded p-1">
                    <span className="font-semibold">{c.kode}</span>
                    <input
                      type="number"
                      value={b.pemetaanCpmk.find((p) => p.cpmkId === c.id)?.bobotPoin ?? 0}
                      onChange={(e) => updateCpmkBobot(r.rincianKrsId, idx, c.id, e.target.value)}
                      className="w-12 border rounded p-1"
                    />
                  </span>
                ))}
                <button onClick={() => hapusBreakdown(r.rincianKrsId, idx)} className="text-red-600"><Trash2 size={14} /></button>
              </div>
            ))}
            <button onClick={() => tambahBreakdown(r.rincianKrsId)} className="text-xs text-primary-blueDark hover:underline flex items-center gap-1">
              <Plus size={12} /> Tambah Breakdown
            </button>
          </div>
        );
      })}
      {roster.length === 0 && <p className="text-sm text-gray-500 italic">Belum ada peserta di kelas ini.</p>}
    </div>
  );
}

function NilaiAkhirTab({ kelasId }: { kelasId: string }) {
  const { data: nilaiData, isLoading } = getKelasNilai(kelasId);
  const syncMutation = useSyncNilaiAkhir();
  const [values, setValues] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const roster = nilaiData?.tabel || [];

  const handleSave = () => {
    setMessage(null);
    const daftarNilai = Object.entries(values)
      .filter(([, v]) => v !== undefined && !isNaN(v))
      .map(([krsId, nilaiAkhir]) => ({ krsId, nilaiAkhir: Number(nilaiAkhir) }));

    if (daftarNilai.length === 0) {
      setMessage({ type: "error", text: "Isi minimal satu nilai akhir." });
      return;
    }

    syncMutation.mutate(daftarNilai, {
      onSuccess: () => setMessage({ type: "success", text: "Nilai akhir berhasil disinkronkan." }),
      onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal menyinkronkan nilai akhir." }),
    });
  };

  if (!kelasId) {
    return (
      <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-gray-500">Pilih Kelas Kuliah terlebih dahulu.</p>
      </div>
    );
  }
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <div className="overflow-x-auto border border-gray-200 rounded-sm mb-4">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#0b5c77] text-white text-xs">
              <th className="p-2 border">NIM</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Nilai Akhir MK (0-100)</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((r) => (
              <tr key={r.rincianKrsId} className="text-center">
                <td className="p-2 border">{r.nim}</td>
                <td className="p-2 border text-left">{r.nama}</td>
                <td className="p-1 border">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={values[r.rincianKrsId] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [r.rincianKrsId]: Number(e.target.value) }))}
                    className="w-20 border rounded p-1 text-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleSave} disabled={syncMutation.isPending} className="bg-primary-green text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50">
        <Save size={16} /> {syncMutation.isPending ? "Menyimpan..." : "Sinkronkan Nilai Akhir"}
      </button>
    </div>
  );
}

function KehadiranTab({ kelasId }: { kelasId: string }) {
  const { data: nilaiData, isLoading } = getKelasNilai(kelasId);
  const submitMutation = useSubmitKelasNilai(kelasId);
  const [draft, setDraft] = useState<Record<string, Record<string, number>>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const headerKolom = (nilaiData?.headerKolom || []).filter((h) => KEHADIRAN_REGEX.test(h.label));
  const tabel = nilaiData?.tabel || [];

  const getValue = (krsId: string, komposisiId: string) => {
    if (draft[krsId]?.[komposisiId] !== undefined) return draft[krsId][komposisiId];
    return tabel.find((r) => r.rincianKrsId === krsId)?.nilai?.[komposisiId] ?? "";
  };

  const setValue = (krsId: string, komposisiId: string, value: string) => {
    const num = value === "" ? undefined : Number(value);
    setDraft((prev) => ({ ...prev, [krsId]: { ...(prev[krsId] || {}), [komposisiId]: num as number } }));
  };

  const handleSaveRow = (krsId: string) => {
    setMessage(null);
    const rowDraft = draft[krsId] || {};
    const nilai = headerKolom
      .filter((h) => rowDraft[h.id] !== undefined && !isNaN(rowDraft[h.id]))
      .map((h) => ({ komposisiId: h.id, skor: Number(rowDraft[h.id]) }));

    if (nilai.length === 0) {
      setMessage({ type: "error", text: "Isi nilai kehadiran untuk mahasiswa ini." });
      return;
    }
    submitMutation.mutate(
      { krsId, nilai },
      {
        onSuccess: () => setMessage({ type: "success", text: "Kehadiran berhasil disimpan." }),
        onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal menyimpan kehadiran." }),
      }
    );
  };

  if (!kelasId) {
    return (
      <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-gray-500">Pilih Kelas Kuliah terlebih dahulu.</p>
      </div>
    );
  }
  if (isLoading) return <LoadingSpinner />;

  if (headerKolom.length === 0) {
    return <p className="text-sm text-gray-500 italic">Tidak ditemukan komponen kehadiran/partisipasi pada kelas ini.</p>;
  }

  return (
    <div>
      {message && (
        <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#0b5c77] text-white text-xs text-center">
              <th className="p-2 border">NIM</th>
              <th className="p-2 border">Nama</th>
              {headerKolom.map((h) => (
                <th key={h.id} className="p-2 border">{h.label}</th>
              ))}
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tabel.map((row) => (
              <tr key={row.rincianKrsId} className="text-center">
                <td className="p-2 border">{row.nim}</td>
                <td className="p-2 border text-left">{row.nama}</td>
                {headerKolom.map((h) => (
                  <td key={h.id} className="p-1 border">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={getValue(row.rincianKrsId, h.id)}
                      onChange={(e) => setValue(row.rincianKrsId, h.id, e.target.value)}
                      className="w-16 border rounded p-1 text-center text-xs"
                    />
                  </td>
                ))}
                <td className="p-1 border">
                  <button onClick={() => handleSaveRow(row.rincianKrsId)} disabled={submitMutation.isPending} className="bg-primary-green text-white px-2 py-1 rounded text-xs disabled:opacity-50">
                    <Save size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
