import React, { useEffect, useState } from "react";
import { Pencil, Copy, X, Save } from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import SearchableSelect from "../../SearchableSelect";
import { getJenjang } from "../../../../hooks/academic/useJenjang";
import { getCurriculumYear } from "../../../../hooks/academic/useCurriculumYear";
import {
  useSkalaNilai,
  useSaveSkalaNilai,
  fetchPratinjauSalinSkalaNilai,
  useSalinSkalaNilai,
  SkalaNilaiRow,
} from "../../../../hooks/academic/useKurikulumProdi";

let uidCounter = 0;
const nextUid = () => `local-skala-${Date.now()}-${uidCounter++}`;

interface LocalRow extends SkalaNilaiRow {
  localId: string;
}

interface Props {
  jenjangId: string;
  tahunKurikulumId: string;
}

export default function TabSkalaNilai({ jenjangId, tahunKurikulumId }: Props) {
  const [periodeId, setPeriodeId] = useState("");
  const { data, isLoading } = useSkalaNilai(jenjangId, tahunKurikulumId, periodeId, !!jenjangId && !!tahunKurikulumId);
  const saveMutation = useSaveSkalaNilai();
  const { data: jenjangData = [] } = getJenjang();
  const { data: curriculumData = [] } = getCurriculumYear();
  const salinMutation = useSalinSkalaNilai();

  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState<LocalRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data?.daftarPeriode?.length && !periodeId) {
      const aktif = data.daftarPeriode.find((p) => p.status === "Aktif");
      if (aktif) setPeriodeId(aktif.id);
    }
  }, [data, periodeId]);

  const handleStartEdit = () => {
    setRows((data?.skalaNilai || []).map((s) => ({ ...s, localId: nextUid() })));
    setErrorMessage("");
    setIsEditing(true);
  };

  const updateRow = (localId: string, field: keyof SkalaNilaiRow, value: any) => {
    setRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, [field]: value } : r)));
  };

  const handleSimpan = () => {
    setErrorMessage("");
    if (!periodeId) {
      setErrorMessage("Pilih Berlaku Sejak Periode terlebih dahulu.");
      return;
    }
    saveMutation.mutate(
      {
        tahunKurikulumId,
        jenjangId,
        periodeId,
        dataSkala: rows.map((r) => ({
          grade: r.grade,
          bobot: Number(r.bobot),
          nilaiBawah: Number(r.nilaiBawah),
          nilaiAtas: Number(r.nilaiAtas),
          keterangan: r.keterangan,
          nilaiDefault: r.nilaiDefault,
        })),
      },
      {
        onSuccess: () => setIsEditing(false),
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan Skala Nilai."),
      }
    );
  };

  const [showSalinModal, setShowSalinModal] = useState(false);
  const [salinJenjangAsal, setSalinJenjangAsal] = useState("");
  const [salinKurikulumAsal, setSalinKurikulumAsal] = useState("");
  const [salinPeriodeAsal, setSalinPeriodeAsal] = useState("");
  const [salinPreview, setSalinPreview] = useState<any>(null);
  const [isSalinLoading, setIsSalinLoading] = useState(false);
  const [salinError, setSalinError] = useState("");

  const openSalinModal = () => {
    setSalinJenjangAsal("");
    setSalinKurikulumAsal("");
    setSalinPeriodeAsal("");
    setSalinPreview(null);
    setSalinError("");
    setShowSalinModal(true);
  };

  const handleLihatPratinjauSalin = async () => {
    if (!salinJenjangAsal || !salinKurikulumAsal || !salinPeriodeAsal) {
      setSalinError("Lengkapi Jenjang, Tahun Kurikulum, dan Periode asal.");
      return;
    }
    setSalinError("");
    try {
      setIsSalinLoading(true);
      const preview = await fetchPratinjauSalinSkalaNilai(salinJenjangAsal, salinKurikulumAsal, salinPeriodeAsal);
      setSalinPreview(preview);
    } catch (error: any) {
      setSalinError(error?.response?.data?.message || "Data Skala Nilai asal tidak ditemukan.");
    } finally {
      setIsSalinLoading(false);
    }
  };

  const handleKonfirmasiSalin = () => {
    salinMutation.mutate(
      {
        jenjangIdAsal: salinJenjangAsal,
        tahunKurikulumIdAsal: salinKurikulumAsal,
        periodeIdAsal: salinPeriodeAsal,
        jenjangIdTujuan: jenjangId,
        tahunKurikulumIdTujuan: tahunKurikulumId,
        periodeIdTujuan: periodeId,
      },
      { onSuccess: () => setShowSalinModal(false) }
    );
  };

  if (isLoading || !data) {
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <label className="text-sm font-semibold text-gray-700 mr-2">Berlaku Sejak Periode</label>
          <select
            value={periodeId}
            onChange={(e) => { setPeriodeId(e.target.value); setIsEditing(false); }}
            className="border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">-- Periode Awal Kurikulum --</option>
            {(data.daftarPeriode || []).map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <button onClick={openSalinModal} className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <Copy size={16} /> Salin Data
            </button>
          )}
          {!isEditing ? (
            <button onClick={handleStartEdit} className="bg-primary-blueDark text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <Pencil size={16} /> Ubah Data
            </button>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
                Batal
              </button>
              <button
                onClick={handleSimpan}
                disabled={saveMutation.isPending}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
              >
                <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </>
          )}
        </div>
      </div>

      {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
        Periode ini menggunakan skala nilai {!periodeId || data.usingFallbackAwal ? "yang sama dengan periode awal kurikulum" : "khusus periode terpilih"}. Anda dapat menyesuaikannya jika diperlukan.
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full bg-white border-collapse text-sm">
          <thead>
            <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
              <th className="p-2 border border-gray-300">Grade</th>
              <th className="p-2 border border-gray-300">Bobot</th>
              <th className="p-2 border border-gray-300">Nilai Bawah</th>
              <th className="p-2 border border-gray-300">Nilai Atas</th>
              <th className="p-2 border border-gray-300 text-left">Keterangan</th>
              <th className="p-2 border border-gray-300">Nilai Default</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-700">
            {(isEditing ? rows : (data.skalaNilai || []).map((s) => ({ ...s, localId: s.id || s.grade }))).map((row) => (
              <tr key={row.localId} className="border-b border-gray-100">
                <td className="p-2 border border-gray-200 font-semibold">
                  {isEditing ? (
                    <input type="text" value={row.grade} onChange={(e) => updateRow(row.localId, "grade", e.target.value)} className="w-16 border rounded p-1 text-center" />
                  ) : (
                    row.grade
                  )}
                </td>
                <td className="p-2 border border-gray-200">
                  {isEditing ? (
                    <input type="number" step="0.01" value={row.bobot} onChange={(e) => updateRow(row.localId, "bobot", e.target.value)} className="w-20 border rounded p-1 text-center" />
                  ) : (
                    Number(row.bobot).toFixed(2)
                  )}
                </td>
                <td className="p-2 border border-gray-200">
                  {isEditing ? (
                    <input type="number" step="0.01" value={row.nilaiBawah} onChange={(e) => updateRow(row.localId, "nilaiBawah", e.target.value)} className="w-20 border rounded p-1 text-center" />
                  ) : (
                    Number(row.nilaiBawah).toFixed(2)
                  )}
                </td>
                <td className="p-2 border border-gray-200">
                  {isEditing ? (
                    <input type="number" step="0.01" value={row.nilaiAtas} onChange={(e) => updateRow(row.localId, "nilaiAtas", e.target.value)} className="w-20 border rounded p-1 text-center" />
                  ) : (
                    Number(row.nilaiAtas).toFixed(2)
                  )}
                </td>
                <td className="p-2 border border-gray-200 text-left">
                  {isEditing ? (
                    <input type="text" value={row.keterangan} onChange={(e) => updateRow(row.localId, "keterangan", e.target.value)} className="w-full border rounded p-1" />
                  ) : (
                    row.keterangan
                  )}
                </td>
                <td className="p-2 border border-gray-200">
                  <input
                    type="checkbox"
                    checked={row.nilaiDefault}
                    disabled={!isEditing}
                    onChange={(e) => updateRow(row.localId, "nilaiDefault", e.target.checked)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
        Pengaturan nilai default pada skala nilai bersifat opsional. Nilai ini digunakan saat proses pemutihan nilai, di mana sistem akan otomatis
        menerapkannya kepada seluruh mahasiswa dalam kelas yang belum memiliki nilai hingga akhir semester.
      </div>

      {showSalinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-800">Salin Skala Nilai</h4>
              <button onClick={() => setShowSalinModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {salinError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{salinError}</div>}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Jenjang Asal</label>
                <SearchableSelect
                  value={salinJenjangAsal}
                  onChange={setSalinJenjangAsal}
                  placeholder="-- Pilih Jenjang --"
                  searchPlaceholder="Cari jenjang..."
                  options={jenjangData.map((j: any) => ({ value: j.id, label: j.jenjang || j.nama }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Tahun Kurikulum Asal</label>
                <SearchableSelect
                  value={salinKurikulumAsal}
                  onChange={setSalinKurikulumAsal}
                  placeholder="-- Pilih Tahun Kurikulum --"
                  searchPlaceholder="Cari tahun kurikulum..."
                  options={curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Periode Asal</label>
                <input
                  type="text"
                  value={salinPeriodeAsal}
                  onChange={(e) => setSalinPeriodeAsal(e.target.value)}
                  placeholder="ID Periode asal"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>

              {salinPreview && (
                <div className="border border-gray-200 rounded-md overflow-hidden max-h-56 overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 sticky top-0">
                        <th className="p-2 border border-gray-200">Grade</th>
                        <th className="p-2 border border-gray-200">Bobot</th>
                        <th className="p-2 border border-gray-200">Rentang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(salinPreview.skalaNilai || salinPreview.dataSkala || []).map((s: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2 border border-gray-200 text-center">{s.grade}</td>
                          <td className="p-2 border border-gray-200 text-center">{s.bobot}</td>
                          <td className="p-2 border border-gray-200 text-center">{s.nilaiBawah} - {s.nilaiAtas}</td>
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
                  <button onClick={handleLihatPratinjauSalin} disabled={isSalinLoading} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                    {isSalinLoading ? "Memuat..." : "Lihat Pratinjau"}
                  </button>
                ) : (
                  <button onClick={handleKonfirmasiSalin} disabled={salinMutation.isPending || !periodeId} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                    {salinMutation.isPending ? "Menyalin..." : "Konfirmasi Salin"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
