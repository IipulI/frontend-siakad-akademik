import React, { useState } from "react";
import { Plus, Trash2, Copy, X } from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import SearchableSelect from "../../SearchableSelect";
import { getObeMataKuliah } from "../../../../hooks/academic/useObeManagement";
import { getCurriculumYear } from "../../../../hooks/academic/useCurriculumYear";
import {
  useMataKuliahPerSemester,
  useAssignMataKuliahKurikulum,
  useDeleteMataKuliahKurikulum,
  fetchPratinjauSalinMataKuliahKurikulum,
  useSalinMataKuliahKurikulum,
} from "../../../../hooks/academic/useKurikulumProdi";

const NILAI_MIN_OPTIONS = ["A", "AB", "B", "BC", "C", "CD", "D", "E"];

interface Props {
  prodiId: string;
  tahunKurikulumId: string;
}

export default function TabMataKuliahKurikulum({ prodiId, tahunKurikulumId }: Props) {
  const { data, isLoading } = useMataKuliahPerSemester(prodiId, tahunKurikulumId, !!prodiId && !!tahunKurikulumId);
  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 200, prodiId, tahunKurikulumId });
  const { data: curriculumData = [] } = getCurriculumYear();
  const assignMutation = useAssignMataKuliahKurikulum();
  const deleteMutation = useDeleteMataKuliahKurikulum();
  const salinMutation = useSalinMataKuliahKurikulum();

  const [mataKuliahId, setMataKuliahId] = useState("");
  const [semester, setSemester] = useState("1");
  const [nilaiMin, setNilaiMin] = useState("D");
  const [statusMk, setStatusMk] = useState<"Wajib" | "Pilihan">("Wajib");
  const [mkPaket, setMkPaket] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSalinModal, setShowSalinModal] = useState(false);
  const [salinTahunAsal, setSalinTahunAsal] = useState("");
  const [salinPreview, setSalinPreview] = useState<any>(null);
  const [isSalinLoading, setIsSalinLoading] = useState(false);
  const [salinError, setSalinError] = useState("");

  const mkList: any[] = Array.isArray(mkResponse?.data) ? mkResponse.data : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];

  const alreadyAssignedIds = new Set((data?.semesterData || []).flatMap((s) => s.mataKuliah.map((mk) => mk.id)));
  const availableMk = mkList.filter((mk) => !alreadyAssignedIds.has(mk.id));

  const handleTambah = () => {
    setErrorMessage("");
    if (!mataKuliahId) {
      setErrorMessage("Pilih Mata Kuliah terlebih dahulu.");
      return;
    }
    assignMutation.mutate(
      { mataKuliahId, semester: Number(semester), nilaiMin, statusMk, mkPaket },
      {
        onSuccess: () => {
          setMataKuliahId("");
          setMkPaket(false);
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menambahkan Mata Kuliah."),
      }
    );
  };

  const handleHapus = (id: string, nama: string) => {
    if (!window.confirm(`Hapus "${nama}" dari kurikulum ini?`)) return;
    deleteMutation.mutate(id);
  };

  const openSalinModal = () => {
    setSalinTahunAsal("");
    setSalinPreview(null);
    setSalinError("");
    setShowSalinModal(true);
  };

  const handleLihatPratinjauSalin = async () => {
    if (!salinTahunAsal) {
      setSalinError("Pilih Tahun Kurikulum asal terlebih dahulu.");
      return;
    }
    setSalinError("");
    try {
      setIsSalinLoading(true);
      const preview = await fetchPratinjauSalinMataKuliahKurikulum(prodiId, salinTahunAsal);
      setSalinPreview(preview);
    } catch (error: any) {
      setSalinError(error?.response?.data?.message || "Data kurikulum asal tidak ditemukan.");
    } finally {
      setIsSalinLoading(false);
    }
  };

  const handleKonfirmasiSalin = () => {
    salinMutation.mutate(
      { prodiId, tahunKurikulumIdAsal: salinTahunAsal, tahunKurikulumIdTujuan: tahunKurikulumId },
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
      <div className="flex justify-end mb-4">
        <button
          onClick={openSalinModal}
          className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
        >
          <Copy size={16} /> Salin Data
        </button>
      </div>

      {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}

      {/* Form tambah */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Mata Kuliah<span className="text-red-500">*</span>
            </label>
            <SearchableSelect
              value={mataKuliahId}
              onChange={setMataKuliahId}
              placeholder="-- Pilih Mata Kuliah --"
              searchPlaceholder="Cari mata kuliah..."
              options={availableMk.map((mk: any) => ({ value: mk.id, label: `${mk.kode} - ${mk.nama}` }))}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
              {Array.from({ length: 14 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Nilai Min.</label>
            <select value={nilaiMin} onChange={(e) => setNilaiMin(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
              {NILAI_MIN_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleTambah}
              disabled={assignMutation.isPending}
              className="w-full bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600">Status MK</span>
            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input type="radio" checked={statusMk === "Wajib"} onChange={() => setStatusMk("Wajib")} /> Wajib
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input type="radio" checked={statusMk === "Pilihan"} onChange={() => setStatusMk("Pilihan")} /> Pilihan
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600">MK Paket</span>
            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input type="radio" checked={mkPaket} onChange={() => setMkPaket(true)} /> Ya
            </label>
            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input type="radio" checked={!mkPaket} onChange={() => setMkPaket(false)} /> Tidak
            </label>
          </div>
        </div>
      </div>

      {/* Tabel per semester */}
      {data.semesterData
        .filter((sem) => sem.mataKuliah.length > 0)
        .map((sem) => (
          <div key={sem.semester} className="mb-6">
            <h4 className="font-bold text-gray-800 mb-2">Semester {sem.semester}</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="min-w-full bg-white border-collapse text-sm">
                <thead>
                  <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                    <th className="p-2 border border-gray-300">No</th>
                    <th className="p-2 border border-gray-300">Kode</th>
                    <th className="p-2 border border-gray-300 text-left">Mata Kuliah</th>
                    <th className="p-2 border border-gray-300">SKS</th>
                    <th className="p-2 border border-gray-300">Status</th>
                    <th className="p-2 border border-gray-300">Nilai Min.</th>
                    <th className="p-2 border border-gray-300">Prasyarat</th>
                    <th className="p-2 border border-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-center text-gray-700">
                  {sem.mataKuliah.map((mk, idx) => (
                    <tr key={mk.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2 border border-gray-200">{idx + 1}</td>
                      <td className="p-2 border border-gray-200">{mk.kode}</td>
                      <td className="p-2 border border-gray-200 text-left">{mk.nama}</td>
                      <td className="p-2 border border-gray-200">{mk.totalSks}</td>
                      <td className="p-2 border border-gray-200">
                        <span className={`px-2 py-0.5 rounded text-xs text-white ${mk.statusMk === "Wajib" ? "bg-primary-blueDark" : "bg-primary-yellow"}`}>
                          {mk.statusMk}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-200">{mk.nilaiMin}</td>
                      <td className="p-2 border border-gray-200">{mk.prasyarat}</td>
                      <td className="p-2 border border-gray-200">
                        <button onClick={() => handleHapus(mk.id, mk.nama)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={3} className="p-2 border border-gray-200 text-right">Total SKS</td>
                    <td className="p-2 border border-gray-200">{sem.totalSksSemester}</td>
                    <td colSpan={4} className="border border-gray-200"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {data.semesterData.every((sem) => sem.mataKuliah.length === 0) && (
        <div className="p-6 text-center text-gray-400 italic border border-gray-200 rounded-md">
          Belum ada Mata Kuliah di kurikulum ini. Tambahkan lewat form di atas.
        </div>
      )}

      {/* Modal Salin Data */}
      {showSalinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-800">Salin Mata Kuliah Kurikulum</h4>
              <button onClick={() => setShowSalinModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-xs">
                Data Mata Kuliah Kurikulum tahun tujuan akan ditimpa (wipe &amp; replace) dengan data dari tahun asal yang dipilih.
              </div>
              {salinError && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{salinError}</div>}

              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Dari Kurikulum</label>
                  <SearchableSelect
                    value={salinTahunAsal}
                    onChange={setSalinTahunAsal}
                    placeholder="-- Pilih Tahun Kurikulum --"
                    searchPlaceholder="Cari tahun kurikulum..."
                    options={curriculumData.filter((c: any) => c.id !== tahunKurikulumId).map((c: any) => ({ value: c.id, label: c.tahun }))}
                  />
                </div>
                <span className="text-gray-400 pb-2">&rarr;</span>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Ke Kurikulum</label>
                  <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-700">
                    {curriculumData.find((c: any) => c.id === tahunKurikulumId)?.tahun || "-"}
                  </p>
                </div>
              </div>

              {salinPreview && (
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden max-h-64 overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 sticky top-0">
                        <th className="p-2 border border-gray-200 text-left">Kode</th>
                        <th className="p-2 border border-gray-200 text-left">Mata Kuliah</th>
                        <th className="p-2 border border-gray-200">Semester</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(salinPreview.semesterData || []).flatMap((s: any) =>
                        s.mataKuliah.map((mk: any) => (
                          <tr key={mk.id}>
                            <td className="p-2 border border-gray-200">{mk.kode}</td>
                            <td className="p-2 border border-gray-200">{mk.nama}</td>
                            <td className="p-2 border border-gray-200 text-center">{s.semester}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowSalinModal(false)} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
                  Batalkan
                </button>
                {!salinPreview ? (
                  <button
                    onClick={handleLihatPratinjauSalin}
                    disabled={isSalinLoading}
                    className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {isSalinLoading ? "Memuat..." : "Lihat Pratinjau"}
                  </button>
                ) : (
                  <button
                    onClick={handleKonfirmasiSalin}
                    disabled={salinMutation.isPending}
                    className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
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
