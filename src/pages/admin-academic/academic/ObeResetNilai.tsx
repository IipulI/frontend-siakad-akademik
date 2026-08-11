import React, { useMemo, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AlertTriangle, Trash2 } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getCollegeClass } from "../../../hooks/useKelasKuliah";
import { getKelasNilai } from "../../../hooks/academic/useObeGradingKelas";
import { useResetNilaiBeberapa, useResetNilaiSemua } from "../../../hooks/academic/useObeResetNilai";

export default function ObeResetNilai() {
  const [kelasSearch, setKelasSearch] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [selectedKrsIds, setSelectedKrsIds] = useState<Set<string>>(new Set());
  const [confirmText, setConfirmText] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: kelasList } = getCollegeClass({});
  const { data: nilaiData, isLoading } = getKelasNilai(kelasId);
  const resetBeberapaMutation = useResetNilaiBeberapa(kelasId);
  const resetSemuaMutation = useResetNilaiSemua(kelasId);

  const filteredKelas = useMemo(() => {
    const list = Array.isArray(kelasList) ? kelasList : kelasList?.rows || [];
    if (!kelasSearch.trim()) return list;
    const q = kelasSearch.toLowerCase();
    return list.filter((k: any) => k.nama?.toLowerCase().includes(q) || k.mataKuliah?.namaMataKuliah?.toLowerCase().includes(q));
  }, [kelasList, kelasSearch]);

  const selectedKelas = filteredKelas.find((k: any) => k.id === kelasId) || (Array.isArray(kelasList) ? kelasList : kelasList?.rows || []).find((k: any) => k.id === kelasId);
  const roster = nilaiData?.tabel || [];
  const requiredConfirmText = selectedKelas?.nama || "";

  const toggle = (krsId: string, checked: boolean) => {
    setSelectedKrsIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(krsId);
      else next.delete(krsId);
      return next;
    });
  };

  const handleResetBeberapa = () => {
    setMessage(null);
    if (selectedKrsIds.size === 0) {
      setMessage({ type: "error", text: "Pilih minimal satu mahasiswa." });
      return;
    }
    if (confirmText.trim() !== requiredConfirmText) {
      setMessage({ type: "error", text: `Ketik nama kelas ("${requiredConfirmText}") persis untuk konfirmasi.` });
      return;
    }
    resetBeberapaMutation.mutate(Array.from(selectedKrsIds), {
      onSuccess: () => {
        setMessage({ type: "success", text: "Nilai mahasiswa terpilih berhasil direset." });
        setSelectedKrsIds(new Set());
        setConfirmText("");
      },
      onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal mereset nilai." }),
    });
  };

  const handleResetSemua = () => {
    if (!window.confirm(`Reset SEMUA nilai kelas "${requiredConfirmText}"? Semua nilai evaluasi, sub-CPMK, dan CPMK mahasiswa di kelas ini akan dihapus.`)) return;
    if (!window.confirm("Tindakan ini TIDAK DAPAT DIBATALKAN. Lanjutkan reset semua nilai?")) return;

    resetSemuaMutation.mutate(undefined, {
      onSuccess: () => setMessage({ type: "success", text: "Seluruh nilai kelas berhasil direset." }),
      onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal mereset semua nilai." }),
    });
  };

  return (
    <MainLayout isGreeting={false} titlePage="Reset Nilai (Dev/Admin Tool)">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Reset Nilai</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-red-500 shadow-sm mb-6">
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-4 mb-6 flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              Alat ini menghapus nilai evaluasi, nilai Sub-CPMK/CPMK mahasiswa untuk kelas yang dipilih dan{" "}
              <b>tidak dapat dibatalkan</b>. Gunakan hanya untuk keperluan pengujian/perbaikan data.
            </p>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Cari Kelas Kuliah</label>
            <input type="text" value={kelasSearch} onChange={(e) => setKelasSearch(e.target.value)} placeholder="Cari nama mata kuliah / kelas" className="w-full md:w-96 border border-gray-300 rounded p-2 text-sm mb-2" />
            <select value={kelasId} onChange={(e) => { setKelasId(e.target.value); setSelectedKrsIds(new Set()); setConfirmText(""); setMessage(null); }} className="w-full md:w-96 border border-gray-300 rounded p-2 text-sm">
              <option value="">-- Pilih Kelas Kuliah --</option>
              {filteredKelas.map((k: any) => (
                <option key={k.id} value={k.id}>{k.mataKuliah?.namaMataKuliah || k.nama} - {k.nama}</option>
              ))}
            </select>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
              {message.text}
            </div>
          )}

          {!kelasId ? (
            <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-500">Pilih kelas kuliah terlebih dahulu.</p>
            </div>
          ) : isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <h3 className="text-sm font-bold mb-2">Reset Nilai Mahasiswa Terpilih</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-sm mb-3">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white text-xs">
                      <th className="p-2 border w-12">Pilih</th>
                      <th className="p-2 border">NIM</th>
                      <th className="p-2 border">Nama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((r) => (
                      <tr key={r.rincianKrsId} className="text-center">
                        <td className="p-2 border">
                          <input type="checkbox" checked={selectedKrsIds.has(r.rincianKrsId)} onChange={(e) => toggle(r.rincianKrsId, e.target.checked)} />
                        </td>
                        <td className="p-2 border">{r.nim}</td>
                        <td className="p-2 border text-left">{r.nama}</td>
                      </tr>
                    ))}
                    {roster.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500 italic">Belum ada peserta di kelas ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Ketik nama kelas (<b>{requiredConfirmText}</b>) untuk konfirmasi reset mahasiswa terpilih
                </label>
                <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full md:w-96 border border-gray-300 rounded p-2 text-sm" />
              </div>

              <button
                onClick={handleResetBeberapa}
                disabled={resetBeberapaMutation.isPending || selectedKrsIds.size === 0}
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50 hover:bg-red-700"
              >
                <Trash2 size={16} /> {resetBeberapaMutation.isPending ? "Mereset..." : `Reset Nilai ${selectedKrsIds.size} Mahasiswa Terpilih`}
              </button>

              <hr className="my-6" />

              <h3 className="text-sm font-bold mb-2 text-red-700">Zona Berbahaya: Reset SEMUA Nilai Kelas</h3>
              <p className="text-xs text-gray-500 mb-3">Menghapus nilai seluruh peserta di kelas ini. Tidak dapat dibatalkan.</p>
              <button
                onClick={handleResetSemua}
                disabled={resetSemuaMutation.isPending}
                className="bg-red-800 text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50 hover:bg-red-900"
              >
                <Trash2 size={16} /> {resetSemuaMutation.isPending ? "Mereset..." : "Reset SEMUA Nilai Kelas Ini"}
              </button>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
