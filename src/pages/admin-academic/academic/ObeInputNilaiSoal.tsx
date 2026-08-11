import React, { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import MainLayout from "../../../components/layouts/MainLayout";
import { Save } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Api } from "../../../api/Index";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement";
import { useAcademicPeriods } from "../../../hooks/usePeriodeAkademik";
import { getRencanaEvaluasi } from "../../../hooks/academic/useObeRencanaEvaluasi";
import { getCollegeClass } from "../../../hooks/useKelasKuliah";
import { getKelasNilai } from "../../../hooks/academic/useObeGradingKelas";
import { useSubmitNilaiSoal, ObeSoalItem } from "../../../hooks/academic/useObeSoalKomponen";

export default function ObeInputNilaiSoal() {
  const [mkSearch, setMkSearch] = useState("");
  const [mataKuliahId, setMataKuliahId] = useState("");
  const [periodeId, setPeriodeId] = useState("");
  const [kelasSearch, setKelasSearch] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [krsId, setKrsId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 50, search: mkSearch });
  const { data: periodeList } = useAcademicPeriods();
  const { data: reData } = getRencanaEvaluasi(mataKuliahId, periodeId);
  const { data: kelasList } = getCollegeClass({});
  const { data: nilaiData } = getKelasNilai(kelasId);
  const submitMutation = useSubmitNilaiSoal();

  const mkList: any[] = Array.isArray(mkResponse?.data) ? mkResponse.data : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];
  const komponenList = reData?.rencanaEvaluasi || [];
  const roster = nilaiData?.tabel || [];

  const filteredKelas = useMemo(() => {
    const list = Array.isArray(kelasList) ? kelasList : kelasList?.rows || [];
    if (!kelasSearch.trim()) return list;
    const q = kelasSearch.toLowerCase();
    return list.filter((k: any) => k.nama?.toLowerCase().includes(q) || k.mataKuliah?.namaMataKuliah?.toLowerCase().includes(q));
  }, [kelasList, kelasSearch]);

  const soalQueries = useQueries({
    queries: komponenList.map((k) => ({
      queryKey: ["soalKomponen", k.id],
      queryFn: async () => {
        const response = await Api.get(`/akademik/soal/komponen/${k.id}`);
        return (response.data.data?.daftarSoal || []) as ObeSoalItem[];
      },
      enabled: !!mataKuliahId && !!periodeId && komponenList.length > 0,
    })),
  });

  const isSoalLoading = soalQueries.some((q) => q.isLoading);
  const allSoal: ObeSoalItem[] = soalQueries.flatMap((q) => q.data || []);

  const handleSave = () => {
    setMessage(null);
    if (!krsId) {
      setMessage({ type: "error", text: "Pilih mahasiswa terlebih dahulu." });
      return;
    }
    const nilaiSoal = allSoal
      .filter((s) => (s.jenisUnit === "OBJEKTIF" ? !!answers[s.id] : scores[s.id] !== undefined))
      .map((s) =>
        s.jenisUnit === "OBJEKTIF"
          ? { soalId: s.id, jawabanMahasiswa: answers[s.id] }
          : { soalId: s.id, skor: Number(scores[s.id]) }
      );

    if (nilaiSoal.length === 0) {
      setMessage({ type: "error", text: "Isi minimal satu jawaban/skor soal." });
      return;
    }

    submitMutation.mutate(
      { krsId, nilaiSoal },
      {
        onSuccess: () => setMessage({ type: "success", text: "Nilai soal berhasil disimpan." }),
        onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal menyimpan nilai soal." }),
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Input Nilai per Soal (Jalur C)">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Input Nilai per Soal</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
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
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Mahasiswa (krsId)</label>
              <select value={krsId} onChange={(e) => setKrsId(e.target.value)} disabled={!kelasId} className="w-full border border-gray-300 rounded p-2 text-sm disabled:bg-gray-100">
                <option value="">-- Pilih Mahasiswa --</option>
                {roster.map((r) => (
                  <option key={r.rincianKrsId} value={r.rincianKrsId}>{r.nim} - {r.nama}</option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
              {message.text}
            </div>
          )}

          {!mataKuliahId || !periodeId ? (
            <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-500">Pilih Mata Kuliah dan Periode untuk memuat soal.</p>
            </div>
          ) : isSoalLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#0b5c77] text-white text-xs">
                      <th className="p-2 border">No</th>
                      <th className="p-2 border">Pertanyaan / Label</th>
                      <th className="p-2 border">Jenis</th>
                      <th className="p-2 border">Skor Maks</th>
                      <th className="p-2 border">Jawaban / Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSoal.length > 0 ? (
                      allSoal.map((s) => (
                        <tr key={s.id} className="text-center">
                          <td className="p-2 border">{s.nomor}</td>
                          <td className="p-2 border text-left">{s.pertanyaan || s.label || "-"}</td>
                          <td className="p-2 border">{s.jenisUnit}</td>
                          <td className="p-2 border">{s.skorMaksimal}</td>
                          <td className="p-2 border">
                            {s.jenisUnit === "OBJEKTIF" ? (
                              <select
                                value={answers[s.id] || ""}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [s.id]: e.target.value }))}
                                className="border rounded p-1 text-xs"
                                disabled={!krsId}
                              >
                                <option value="">-- Pilih Jawaban --</option>
                                {(s.opsiJawaban || []).map((o) => (
                                  <option key={o.label} value={o.label}>{o.label}. {o.teks}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="number"
                                min={0}
                                max={s.skorMaksimal}
                                value={scores[s.id] ?? ""}
                                onChange={(e) => setScores((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))}
                                disabled={!krsId}
                                className="w-20 border rounded p-1 text-xs text-center"
                              />
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500 italic">Belum ada soal untuk mata kuliah/periode ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSave}
                disabled={submitMutation.isPending || !krsId}
                className="mt-4 bg-primary-green text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50"
              >
                <Save size={16} /> {submitMutation.isPending ? "Menyimpan..." : "Simpan Nilai Soal"}
              </button>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
