import React, { useMemo, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Save, Search } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getCollegeClass } from "../../../hooks/useKelasKuliah";
import { getKelasNilai, useSubmitKelasNilai } from "../../../hooks/academic/useObeGradingKelas";

export default function ObeInputNilaiKelas() {
  const [search, setSearch] = useState("");
  const [kelasId, setKelasId] = useState("");
  const [draft, setDraft] = useState<Record<string, Record<string, number>>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: kelasList, isLoading: isKelasLoading } = getCollegeClass({});
  const { data: nilaiData, isLoading: isNilaiLoading } = getKelasNilai(kelasId);
  const submitMutation = useSubmitKelasNilai(kelasId);

  const filteredKelas = useMemo(() => {
    const list = Array.isArray(kelasList) ? kelasList : kelasList?.rows || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (k: any) =>
        k.nama?.toLowerCase().includes(q) || k.mataKuliah?.namaMataKuliah?.toLowerCase().includes(q)
    );
  }, [kelasList, search]);

  const headerKolom = nilaiData?.headerKolom || [];
  const tabel = nilaiData?.tabel || [];

  const getValue = (krsId: string, komposisiId: string) => {
    if (draft[krsId]?.[komposisiId] !== undefined) return draft[krsId][komposisiId];
    return tabel.find((r) => r.rincianKrsId === krsId)?.nilai?.[komposisiId] ?? "";
  };

  const setValue = (krsId: string, komposisiId: string, value: string) => {
    const num = value === "" ? undefined : Number(value);
    setDraft((prev) => ({
      ...prev,
      [krsId]: { ...(prev[krsId] || {}), [komposisiId]: num as number },
    }));
  };

  const handleSaveRow = (krsId: string) => {
    setMessage(null);
    const rowDraft = draft[krsId] || {};
    const nilai = headerKolom
      .filter((h) => rowDraft[h.id] !== undefined && rowDraft[h.id] !== null && !isNaN(rowDraft[h.id]))
      .map((h) => ({ komposisiId: h.id, skor: Number(rowDraft[h.id]) }));

    if (nilai.length === 0) {
      setMessage({ type: "error", text: "Isi minimal satu komponen nilai untuk mahasiswa ini." });
      return;
    }

    submitMutation.mutate(
      { krsId, nilai },
      {
        onSuccess: () => setMessage({ type: "success", text: "Nilai berhasil disimpan." }),
        onError: (error: any) =>
          setMessage({ type: "error", text: error?.response?.data?.message || "Gagal menyimpan nilai." }),
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Input Nilai per Komponen (Jalur A)">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Input Nilai per Komponen
          </p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="bg-[#fffbeb] border border-[#fbbf24] rounded-md p-4 mb-6 text-sm">
            <p className="font-semibold mb-1">Kalau MK ini pakai Jalur D (CBT), halaman ini cukup untuk Kehadiran saja.</p>
            <p>
              Isi baris <b>Kehadiran/Partisipasi</b> di sini. Jangan isi baris UTS/UAS/Tugas kalau nilainya sudah/akan
              dikirim lewat breakdown CBT (menu Integrasi CBT) — nilai CPMK dari komponen itu sudah dihitung akurat dari
              sana.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Cari Kelas Kuliah</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama mata kuliah / kelas"
                  className="p-2 pl-3 border border-gray-300 text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                />
                <div className="bg-primary-yellow text-white p-2.5 flex items-center justify-center">
                  <Search size={16} />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Kelas Kuliah</label>
              <select
                value={kelasId}
                onChange={(e) => setKelasId(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
                disabled={isKelasLoading}
              >
                <option value="">-- Pilih Kelas Kuliah --</option>
                {filteredKelas.map((k: any) => (
                  <option key={k.id} value={k.id}>
                    {k.mataKuliah?.namaMataKuliah || k.nama} - {k.nama} ({k.periodeAkademik?.nama || k.periodeAkademik})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded border ${
                message.type === "success"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {!kelasId ? (
            <div className="flex items-center justify-center h-40 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-500">Pilih kelas kuliah untuk menampilkan peserta dan komponen nilai.</p>
            </div>
          ) : isNilaiLoading ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0b5c77] text-white text-xs text-center">
                    <th className="p-2 border">NIM</th>
                    <th className="p-2 border">Nama</th>
                    {headerKolom.map((h) => (
                      <th key={h.id} className="p-2 border min-w-[90px]">
                        {h.label} ({h.bobot}%)
                      </th>
                    ))}
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tabel.length > 0 ? (
                    tabel.map((row) => (
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
                          <button
                            onClick={() => handleSaveRow(row.rincianKrsId)}
                            disabled={submitMutation.isPending}
                            className="bg-primary-green text-white px-2 py-1 rounded text-xs flex items-center gap-1 mx-auto disabled:opacity-50"
                          >
                            <Save size={12} /> Simpan
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3 + headerKolom.length} className="p-4 text-center text-gray-500 italic">
                        Belum ada peserta di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
