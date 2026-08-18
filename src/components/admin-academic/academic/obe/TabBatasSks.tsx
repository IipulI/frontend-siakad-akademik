import React, { useState } from "react";
import { Plus, Pencil, Trash2, Copy, X, Save, RefreshCw } from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import SearchableSelect from "../../SearchableSelect";
import { getJenjang } from "../../../../hooks/academic/useJenjang";
import { getCurriculumYear } from "../../../../hooks/academic/useCurriculumYear";
import {
  useBatasSks,
  useSaveBatasSks,
  useDeleteBatasSks,
  fetchPratinjauSalinBatasSks,
  useSalinBatasSks,
  BatasSksRow,
} from "../../../../hooks/academic/useKurikulumProdi";

interface Props {
  jenjangId: string;
  tahunKurikulumId: string;
}

const emptyForm = { ipsMin: "", ipsMax: "", batasSks: "" };

export default function TabBatasSks({ jenjangId, tahunKurikulumId }: Props) {
  const { data, isLoading } = useBatasSks(jenjangId, tahunKurikulumId, !!jenjangId && !!tahunKurikulumId);
  const saveMutation = useSaveBatasSks();
  const deleteMutation = useDeleteBatasSks();
  const { data: jenjangData = [] } = getJenjang();
  const { data: curriculumData = [] } = getCurriculumYear();
  const salinMutation = useSalinBatasSks();

  const [editingId, setEditingId] = useState<string | null>(null); // "new" atau id row
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrorMessage("");
  };

  const handleTambah = () => {
    setForm(emptyForm);
    setEditingId("new");
    setErrorMessage("");
  };

  const handleEdit = (row: BatasSksRow) => {
    setForm({ ipsMin: String(row.ipsMin), ipsMax: String(row.ipsMax), batasSks: String(row.batasSks) });
    setEditingId(row.id);
    setErrorMessage("");
  };

  const handleSimpan = () => {
    if (form.ipsMin === "" || form.ipsMax === "" || form.batasSks === "") {
      setErrorMessage("IPS Minimal, IPS Maksimal, dan Batas SKS wajib diisi.");
      return;
    }
    setErrorMessage("");
    saveMutation.mutate(
      {
        ...(editingId && editingId !== "new" ? { id: editingId } : {}),
        siakJenjangId: jenjangId,
        siakTahunKurikulumId: tahunKurikulumId,
        ipsMin: Number(form.ipsMin),
        ipsMax: Number(form.ipsMax),
        batasSks: Number(form.batasSks),
      },
      {
        onSuccess: () => resetForm(),
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || "Gagal menyimpan data."),
      }
    );
  };

  const handleHapus = (row: BatasSksRow) => {
    if (!window.confirm(`Hapus range IPS ${row.ipsMin} - ${row.ipsMax}?`)) return;
    deleteMutation.mutate(row.id);
  };

  const [showSalinModal, setShowSalinModal] = useState(false);
  const [salinJenjangAsal, setSalinJenjangAsal] = useState("");
  const [salinKurikulumAsal, setSalinKurikulumAsal] = useState("");
  const [salinPreview, setSalinPreview] = useState<any>(null);
  const [isSalinLoading, setIsSalinLoading] = useState(false);
  const [salinError, setSalinError] = useState("");

  const openSalinModal = () => {
    setSalinJenjangAsal("");
    setSalinKurikulumAsal("");
    setSalinPreview(null);
    setSalinError("");
    setShowSalinModal(true);
  };

  const handleLihatPratinjauSalin = async () => {
    if (!salinJenjangAsal || !salinKurikulumAsal) {
      setSalinError("Pilih Jenjang dan Tahun Kurikulum asal.");
      return;
    }
    setSalinError("");
    try {
      setIsSalinLoading(true);
      const preview = await fetchPratinjauSalinBatasSks(salinJenjangAsal, salinKurikulumAsal);
      setSalinPreview(preview);
    } catch (error: any) {
      setSalinError(error?.response?.data?.message || "Data Batas SKS asal tidak ditemukan.");
    } finally {
      setIsSalinLoading(false);
    }
  };

  const handleKonfirmasiSalin = () => {
    salinMutation.mutate(
      { jenjangIdAsal: salinJenjangAsal, tahunKurikulumIdAsal: salinKurikulumAsal, jenjangIdTujuan: jenjangId, tahunKurikulumIdTujuan: tahunKurikulumId },
      { onSuccess: () => setShowSalinModal(false) }
    );
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <button onClick={openSalinModal} className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
          <Copy size={16} /> Salin Data
        </button>
        {editingId === null && (
          <button onClick={handleTambah} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
            <Plus size={16} /> Tambah
          </button>
        )}
      </div>

      {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}

      {isLoading || !data ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full bg-white border-collapse text-sm">
            <thead>
              <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                <th className="p-2 border border-gray-300">IPS Minimal</th>
                <th className="p-2 border border-gray-300">IPS Maksimal</th>
                <th className="p-2 border border-gray-300">Batas SKS</th>
                <th className="p-2 border border-gray-300 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-700">
              {editingId === "new" && (
                <tr className="bg-white">
                  <td className="p-2 border border-gray-200">
                    <input type="number" step="0.01" min={0} max={4} value={form.ipsMin} onChange={(e) => setForm({ ...form, ipsMin: e.target.value })} className="w-24 border rounded p-1 text-center" />
                  </td>
                  <td className="p-2 border border-gray-200">
                    <input type="number" step="0.01" min={0} max={4} value={form.ipsMax} onChange={(e) => setForm({ ...form, ipsMax: e.target.value })} className="w-24 border rounded p-1 text-center" />
                  </td>
                  <td className="p-2 border border-gray-200">
                    <input type="number" min={0} value={form.batasSks} onChange={(e) => setForm({ ...form, batasSks: e.target.value })} className="w-20 border rounded p-1 text-center" />
                  </td>
                  <td className="p-2 border border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button onClick={handleSimpan} disabled={saveMutation.isPending} className="bg-primary-green hover:opacity-90 text-white p-1.5 rounded disabled:opacity-50" title="Simpan">
                        <Save size={16} />
                      </button>
                      <button onClick={resetForm} className="bg-primary-yellow hover:opacity-90 text-white p-1.5 rounded" title="Batal">
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {(data.batasSks || []).map((row) =>
                editingId === row.id ? (
                  <tr key={row.id} className="bg-white">
                    <td className="p-2 border border-gray-200">
                      <input type="number" step="0.01" min={0} max={4} value={form.ipsMin} onChange={(e) => setForm({ ...form, ipsMin: e.target.value })} className="w-24 border rounded p-1 text-center" />
                    </td>
                    <td className="p-2 border border-gray-200">
                      <input type="number" step="0.01" min={0} max={4} value={form.ipsMax} onChange={(e) => setForm({ ...form, ipsMax: e.target.value })} className="w-24 border rounded p-1 text-center" />
                    </td>
                    <td className="p-2 border border-gray-200">
                      <input type="number" min={0} value={form.batasSks} onChange={(e) => setForm({ ...form, batasSks: e.target.value })} className="w-20 border rounded p-1 text-center" />
                    </td>
                    <td className="p-2 border border-gray-200">
                      <div className="flex justify-center gap-2">
                        <button onClick={handleSimpan} disabled={saveMutation.isPending} className="bg-primary-green hover:opacity-90 text-white p-1.5 rounded disabled:opacity-50" title="Simpan">
                          <Save size={16} />
                        </button>
                        <button onClick={resetForm} className="bg-primary-yellow hover:opacity-90 text-white p-1.5 rounded" title="Batal">
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 border border-gray-200">{Number(row.ipsMin).toFixed(2)}</td>
                    <td className="p-2 border border-gray-200">{Number(row.ipsMax).toFixed(2)}</td>
                    <td className="p-2 border border-gray-200">{row.batasSks}</td>
                    <td className="p-2 border border-gray-200">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(row)} className="text-primary-blueDark hover:opacity-70">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleHapus(row)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
              {(data.batasSks || []).length === 0 && editingId !== "new" && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400 italic">
                    Belum ada Batas SKS untuk jenjang ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
        <span className="font-semibold">Keterangan:</span> Batas SKS ini digunakan sebagai acuan untuk menentukan jumlah SKS yang bisa diambil mahasiswa saat melakukan KRS.
      </div>

      {showSalinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-800">Salin Batas SKS</h4>
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

              {salinPreview && (
                <div className="border border-gray-200 rounded-md overflow-hidden max-h-56 overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 sticky top-0">
                        <th className="p-2 border border-gray-200">IPS Minimal</th>
                        <th className="p-2 border border-gray-200">IPS Maksimal</th>
                        <th className="p-2 border border-gray-200">Batas SKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(salinPreview.batasSks || []).map((b: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2 border border-gray-200 text-center">{b.ipsMin}</td>
                          <td className="p-2 border border-gray-200 text-center">{b.ipsMax}</td>
                          <td className="p-2 border border-gray-200 text-center">{b.batasSks}</td>
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
                  <button onClick={handleKonfirmasiSalin} disabled={salinMutation.isPending} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50">
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
