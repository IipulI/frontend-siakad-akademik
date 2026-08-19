import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, AlertCircle } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail, useCourseRencanaPembelajaran } from "../../../hooks/lecturer/useFetchCourse";
import { useCreateSesi, useUpdateSesi, useDeleteSesi, SaveSesiPayload } from "../../../hooks/academic/useObeRencanaPembelajaran";

const emptyForm: SaveSesiPayload = {
  siakPeriodeAkademikId: "",
  sesi: 1,
  jenisPertemuan: "Kuliah",
  materiPembelajaran: "",
  indikatorPenilaian: "",
  kriteriaPenilaian: "",
  metodePembelajaranLuring: "",
  metodePembelajaranDaring: "",
  bobotPenilaian: 0,
  cpmkIds: [],
};

export default function RencanaPembelajaranLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  // FIX: sebelumnya gak ada pemilih periode -- backend defaultnya ambil periode
  // "Aktif" (semester berjalan), yang seringkali BELUM diisi rencana pembelajarannya
  // sama sekali (datanya masih di semester sebelumnya). Kelihatan "kosong" padahal
  // datanya ADA, cuma di periode lain -- sekarang dosen bisa pindah periode sendiri,
  // sama kayak halaman admin.
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const { data: rp, isLoading: isRpLoading, refetch: refetchRp } = useCourseRencanaPembelajaran(mataKuliahId || "", selectedPeriodeId || undefined);
  const resp = rp?.data || {};
  const sesiList: any[] = resp.rencanaData || [];
  const masterCpmk: any[] = resp.masterCpmk || [];
  const daftarPeriode: any[] = resp.daftarPeriode || [];
  const periodeId: string | undefined = resp.periodeTerpilihId;

  useEffect(() => {
    if (resp.periodeTerpilihId && !selectedPeriodeId) setSelectedPeriodeId(resp.periodeTerpilihId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resp.periodeTerpilihId]);

  const createMutation = useCreateSesi(mataKuliahId || "");
  const updateMutation = useUpdateSesi(mataKuliahId || "");
  const deleteMutation = useDeleteSesi(mataKuliahId || "");

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<SaveSesiPayload>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLoading = isCourseLoading || isRpLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const startAdd = () => {
    setForm({ ...emptyForm, siakPeriodeAkademikId: periodeId || "", sesi: sesiList.length + 1 });
    setEditingId("new");
    setErrorMessage("");
  };

  const startEdit = (sesi: any) => {
    setForm({
      siakPeriodeAkademikId: periodeId || "",
      sesi: sesi.sesi,
      jenisPertemuan: sesi.jenisPertemuan || "Kuliah",
      materiPembelajaran: sesi.materiPembelajaran || "",
      indikatorPenilaian: sesi.indikatorPenilaian || "",
      kriteriaPenilaian: sesi.kriteriaPenilaian || "",
      metodePembelajaranLuring: sesi.metodePembelajaranLuring || "",
      metodePembelajaranDaring: sesi.metodePembelajaranDaring || "",
      bobotPenilaian: sesi.bobotPenilaian || 0,
      cpmkIds: sesi.cpmkIdsFlat || [],
    });
    setEditingId(sesi.id);
    setErrorMessage("");
  };

  const toggleCpmk = (cpmkId: string) => {
    setForm((prev) => ({
      ...prev,
      cpmkIds: prev.cpmkIds.includes(cpmkId) ? prev.cpmkIds.filter((c) => c !== cpmkId) : [...prev.cpmkIds, cpmkId],
    }));
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!periodeId) {
      setErrorMessage("Periode akademik tidak diketahui, tidak bisa disimpan lewat menu ini.");
      return;
    }
    const onSuccess = () => {
      setSuccessMessage("Sesi rencana pembelajaran berhasil disimpan.");
      setEditingId(null);
      refetchRp();
    };
    const onError = (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan sesi.");

    if (editingId === "new") {
      createMutation.mutate(form, { onSuccess, onError });
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, payload: form }, { onSuccess, onError });
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Hapus sesi ini?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setSuccessMessage("Sesi berhasil dihapus.");
        refetchRp();
      },
      onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menghapus sesi."),
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Rencana Pembelajaran</p>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={15} /> Kembali
            </button>
            {isKoordinator && !editingId && (
              <button onClick={startAdd} className="bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                <Plus size={15} /> Tambah Sesi
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <label className="text-sm font-semibold text-gray-700 mr-3">Periode Akademik</label>
          <select
            value={selectedPeriodeId}
            onChange={(e) => setSelectedPeriodeId(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-primary-green"
          >
            {daftarPeriode.map((p: any) => (
              <option key={p.id} value={p.id}>{p.nama}{p.status === "Aktif" ? " (Aktif)" : ""}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="rencanaPembelajaran" />

            <div className="w-full md:w-[80%]">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {!isKoordinator && (
                    <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>Anda cuma bisa melihat Rencana Pembelajaran mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}
                  {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
                  {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

                  {editingId && (
                    <div className="mb-6 border border-gray-200 rounded-md p-4 bg-gray-50">
                      <h3 className="font-bold text-primary-green mb-3">{editingId === "new" ? "Tambah Sesi" : "Ubah Sesi"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <label className="flex flex-col gap-1">
                          Sesi Ke-
                          <input type="number" value={form.sesi} onChange={(e) => setForm((p) => ({ ...p, sesi: Number(e.target.value) }))} className="border border-gray-300 rounded p-2" />
                        </label>
                        <label className="flex flex-col gap-1">
                          Jenis Pertemuan
                          <input type="text" value={form.jenisPertemuan} onChange={(e) => setForm((p) => ({ ...p, jenisPertemuan: e.target.value }))} className="border border-gray-300 rounded p-2" />
                        </label>
                        <label className="flex flex-col gap-1 md:col-span-2">
                          Materi Pembelajaran
                          <textarea value={form.materiPembelajaran} onChange={(e) => setForm((p) => ({ ...p, materiPembelajaran: e.target.value }))} rows={2} className="border border-gray-300 rounded p-2" />
                        </label>
                        <label className="flex flex-col gap-1 md:col-span-2">
                          Indikator Penilaian
                          <textarea value={form.indikatorPenilaian} onChange={(e) => setForm((p) => ({ ...p, indikatorPenilaian: e.target.value }))} rows={2} className="border border-gray-300 rounded p-2" />
                        </label>
                        <label className="flex flex-col gap-1">
                          Bobot Penilaian (%)
                          <input type="number" value={form.bobotPenilaian} onChange={(e) => setForm((p) => ({ ...p, bobotPenilaian: Number(e.target.value) }))} className="border border-gray-300 rounded p-2" />
                        </label>
                      </div>
                      {masterCpmk.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-gray-600 mb-1.5">CPMK yang diuji sesi ini</p>
                          <div className="flex flex-wrap gap-3 p-2 border border-gray-200 rounded bg-white">
                            {masterCpmk.map((c: any) => (
                              <label key={c.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                <input type="checkbox" checked={form.cpmkIds.includes(c.id)} onChange={() => toggleCpmk(c.id)} />
                                {c.kode}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 mt-4">
                        <button onClick={handleSave} disabled={isSaving} className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
                          <Save size={15} /> {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                          <X size={15} /> Batal
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto border border-gray-200 rounded-sm">
                    <table className="min-w-full bg-white border-collapse text-sm">
                      <thead>
                        <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                          <th className="p-2 border border-gray-300 w-14">Sesi</th>
                          <th className="p-2 border border-gray-300 w-28">Jenis</th>
                          <th className="p-2 border border-gray-300 text-left">Materi Pembelajaran</th>
                          <th className="p-2 border border-gray-300 w-24">Bobot</th>
                          <th className="p-2 border border-gray-300 w-40">CPMK</th>
                          {isKoordinator && <th className="p-2 border border-gray-300 w-24">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {sesiList.length === 0 ? (
                          <tr>
                            <td colSpan={isKoordinator ? 6 : 5} className="p-6 text-center text-gray-400 italic">
                              Belum ada rencana pembelajaran untuk mata kuliah ini.
                            </td>
                          </tr>
                        ) : (
                          sesiList.map((sesi: any) => (
                            <tr key={sesi.id} className="hover:bg-gray-50 border-b border-gray-200 text-center">
                              <td className="p-2 border border-gray-200 font-semibold">{sesi.sesi}</td>
                              <td className="p-2 border border-gray-200">{sesi.jenisPertemuan}</td>
                              <td className="p-2 border border-gray-200 text-left">{sesi.materiPembelajaran || "-"}</td>
                              <td className="p-2 border border-gray-200">{sesi.bobotPenilaian ?? 0}%</td>
                              <td className="p-2 border border-gray-200 text-left text-xs">{(sesi.cpmkTerpilih || []).map((c: any) => c.kode).join(", ") || "-"}</td>
                              {isKoordinator && (
                                <td className="p-2 border border-gray-200">
                                  <div className="flex justify-center gap-1.5">
                                    <button onClick={() => startEdit(sesi)} className="bg-primary-blueSoft text-white p-1.5 rounded hover:opacity-90">
                                      <Pencil size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(sesi.id)} className="bg-red-500 text-white p-1.5 rounded hover:opacity-90">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}