import React, { useState } from "react";
import { Plus, Pencil, Trash2, Copy, X, Save } from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import SearchableSelect from "../../SearchableSelect";
import { getJenjang } from "../../../../hooks/academic/useJenjang";
import { getCurriculumYear } from "../../../../hooks/academic/useCurriculumYear";
import {
  usePredikatKelulusan,
  useSavePredikat,
  useDeletePredikat,
  fetchPratinjauSalinPredikat,
  useSalinPredikat,
  PredikatRow,
} from "../../../../hooks/academic/useKurikulumProdi";

interface Props {
  jenjangId: string;
  tahunKurikulumId: string;
  prodiId?: string;
}

const emptyForm = { kode: "", namaInd: "", namaEn: "", ipkMin: "", ipkMax: "", masaStudi: "" };

export default function TabPredikatKelulusan({ jenjangId, tahunKurikulumId, prodiId }: Props) {
  const { data, isLoading } = usePredikatKelulusan(
    tahunKurikulumId,
    { prodiId, jenjangId: prodiId ? undefined : jenjangId },
    !!tahunKurikulumId && !!(prodiId || jenjangId)
  );
  const saveMutation = useSavePredikat();
  const deleteMutation = useDeletePredikat();
  const { data: jenjangData = [] } = getJenjang();
  const { data: curriculumData = [] } = getCurriculumYear();
  const salinMutation = useSalinPredikat();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowFormModal(true);
  };

  const openEditModal = (row: PredikatRow) => {
    setEditingId(row.id);
    setForm({
      kode: row.kode,
      namaInd: row.nama,
      namaEn: row.namaEn,
      ipkMin: String(row.ipkMin),
      ipkMax: String(row.ipkMax),
      masaStudi: String(row.masaStudi),
    });
    setFormError("");
    setShowFormModal(true);
  };

  const handleSimpanForm = () => {
    setFormError("");
    if (!form.kode || !form.namaInd || !form.ipkMin || !form.ipkMax || !form.masaStudi) {
      setFormError("Semua field wajib diisi.");
      return;
    }
    saveMutation.mutate(
      {
        id: editingId || undefined,
        siakTahunKurikulumId: tahunKurikulumId,
        siakJenjangId: jenjangId,
        kode: form.kode,
        namaInd: form.namaInd,
        namaEng: form.namaEn,
        ipkMin: Number(form.ipkMin),
        ipkMax: Number(form.ipkMax),
        masaStudi: Number(form.masaStudi),
      },
      {
        onSuccess: () => setShowFormModal(false),
        onError: (error: any) => setFormError(error?.response?.data?.message || "Gagal menyimpan Predikat Kelulusan."),
      }
    );
  };

  const handleHapus = (row: PredikatRow) => {
    if (!window.confirm(`Hapus predikat "${row.nama}"?`)) return;
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
      const preview = await fetchPratinjauSalinPredikat(salinJenjangAsal, salinKurikulumAsal);
      setSalinPreview(preview);
    } catch (error: any) {
      setSalinError(error?.response?.data?.message || "Data Predikat Kelulusan asal tidak ditemukan.");
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
        <button onClick={openAddModal} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
          <Plus size={16} /> Tambah
        </button>
      </div>

      {isLoading || !data ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full bg-white border-collapse text-sm">
            <thead>
              <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                <th className="p-2 border border-gray-300">Kode</th>
                <th className="p-2 border border-gray-300 text-left">Nama Predikat (IND)</th>
                <th className="p-2 border border-gray-300 text-left">Nama Predikat (ENG)</th>
                <th className="p-2 border border-gray-300">IPK Minimal</th>
                <th className="p-2 border border-gray-300">IPK Maksimal</th>
                <th className="p-2 border border-gray-300">Masa Studi</th>
                <th className="p-2 border border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-700">
              {(data.tabel || []).map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 border border-gray-200 font-semibold">{row.kode}</td>
                  <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
                  <td className="p-2 border border-gray-200 text-left">{row.namaEn}</td>
                  <td className="p-2 border border-gray-200">{Number(row.ipkMin).toFixed(2)}</td>
                  <td className="p-2 border border-gray-200">{Number(row.ipkMax).toFixed(2)}</td>
                  <td className="p-2 border border-gray-200">{row.masaStudi}</td>
                  <td className="p-2 border border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEditModal(row)} className="text-primary-blueDark hover:opacity-70">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleHapus(row)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data.tabel || []).length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-400 italic">
                    Belum ada Predikat Kelulusan untuk kurikulum ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah/Ubah */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-800">{editingId ? "Ubah" : "Tambah"} Predikat Kelulusan</h4>
              <button onClick={() => setShowFormModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {formError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{formError}</div>}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Kode</label>
                <input type="text" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="mis. CL" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Nama Predikat (IND)</label>
                <input type="text" value={form.namaInd} onChange={(e) => setForm({ ...form, namaInd: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="mis. Cumlaude" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Nama Predikat (ENG)</label>
                <input type="text" value={form.namaEn} onChange={(e) => setForm({ ...form, namaEn: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="mis. Cumlaude" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">IPK Minimal</label>
                  <input type="number" step="0.01" min={0} max={4} value={form.ipkMin} onChange={(e) => setForm({ ...form, ipkMin: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">IPK Maksimal</label>
                  <input type="number" step="0.01" min={0} max={4} value={form.ipkMax} onChange={(e) => setForm({ ...form, ipkMax: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Masa Studi (semester)</label>
                <input type="number" min={1} value={form.masaStudi} onChange={(e) => setForm({ ...form, masaStudi: e.target.value })} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowFormModal(false)} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
                  Batalkan
                </button>
                <button
                  onClick={handleSimpanForm}
                  disabled={saveMutation.isPending}
                  className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
                >
                  <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Salin Data */}
      {showSalinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-800">Salin Predikat Kelulusan</h4>
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
                        <th className="p-2 border border-gray-200">Kode</th>
                        <th className="p-2 border border-gray-200 text-left">Nama</th>
                        <th className="p-2 border border-gray-200">IPK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(salinPreview.tabel || []).map((p: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2 border border-gray-200 text-center">{p.kode}</td>
                          <td className="p-2 border border-gray-200">{p.nama}</td>
                          <td className="p-2 border border-gray-200 text-center">{p.ipkMin} - {p.ipkMax}</td>
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
