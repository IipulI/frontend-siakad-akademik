import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Edit, AlertCircle, X } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail, useCourseRPS } from "../../../hooks/lecturer/useFetchCourse";
import { useSaveDetailRps } from "../../../hooks/academic/useObeDetailRps";

const FIELD_LABELS: { key: keyof FormState; label: string }[] = [
  { key: "tujuanMataKuliah", label: "Tujuan Mata Kuliah" },
  { key: "deskripsiMataKuliah", label: "Deskripsi Mata Kuliah" },
  { key: "materiPembelajaran", label: "Materi Pembelajaran" },
  { key: "pustakaUtama", label: "Pustaka Utama" },
  { key: "pustakaPendukung", label: "Pustaka Pendukung" },
  { key: "mediaPerangkatLunak", label: "Media Perangkat Lunak" },
  { key: "mediaPerangkatKeras", label: "Media Perangkat Keras" },
];

interface FormState {
  tujuanMataKuliah: string;
  deskripsiMataKuliah: string;
  materiPembelajaran: string;
  pustakaUtama: string;
  pustakaPendukung: string;
  mediaPerangkatLunak: string;
  mediaPerangkatKeras: string;
}

const emptyForm: FormState = {
  tujuanMataKuliah: "",
  deskripsiMataKuliah: "",
  materiPembelajaran: "",
  pustakaUtama: "",
  pustakaPendukung: "",
  mediaPerangkatLunak: "",
  mediaPerangkatKeras: "",
};

export default function DetailRpsLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  // FIX: sama kayak Rencana Pembelajaran/Evaluasi -- tambah pemilih periode,
  // biar dosen bisa pindah ke periode yang beneran ada RPS-nya (default "Aktif"
  // bisa aja belum diisi RPS-nya untuk semester berjalan).
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const { data: rps, isLoading: isRpsLoading, refetch: refetchRps } = useCourseRPS(mataKuliahId || "", selectedPeriodeId || undefined);
  const r = rps?.data;
  const daftarPeriode: any[] = r?.daftarPeriode || [];
  const saveMutation = useSaveDetailRps(mataKuliahId || "");

  useEffect(() => {
    if (r?.rpsData?.siakPeriodeAkademikId && !selectedPeriodeId) setSelectedPeriodeId(r.rpsData.siakPeriodeAkademikId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r?.rpsData?.siakPeriodeAkademikId]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setForm({
      tujuanMataKuliah: r?.rpsData?.tujuanMataKuliah || r?.tujuanMataKuliah || "",
      deskripsiMataKuliah: r?.rpsData?.deskripsiMataKuliah || r?.deskripsiMataKuliah || "",
      materiPembelajaran: r?.rpsData?.materiPembelajaran || r?.materiPembelajaran || "",
      pustakaUtama: r?.rpsData?.pustakaUtama || r?.pustakaUtama || "",
      pustakaPendukung: r?.rpsData?.pustakaPendukung || r?.pustakaPendukung || "",
      mediaPerangkatLunak: r?.rpsData?.mediaPerangkatLunak || r?.mediaPerangkatLunak || "",
      mediaPerangkatKeras: r?.rpsData?.mediaPerangkatKeras || r?.mediaPerangkatKeras || "",
    });
  }, [rps]);

  const isLoading = isCourseLoading || isRpsLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const periodeId = r?.rpsData?.periode?.id || r?.periodeAkademik?.id || r?.siakPeriodeAkademikId;

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!periodeId) {
      setErrorMessage("Periode akademik RPS ini tidak diketahui, tidak bisa disimpan lewat menu ini. Hubungi Admin Akademik.");
      return;
    }
    saveMutation.mutate(
      {
        siakPeriodeAkademikId: periodeId,
        tanggalPenyusunan: r?.rpsData?.tanggalPenyusunan || new Date().toISOString().slice(0, 10),
        ...form,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Detail RPS berhasil disimpan.");
          setIsEditMode(false);
          refetchRps();
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan Detail RPS."),
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Detail RPS">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Detail RPS</p>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={15} /> Kembali
            </button>
            {isKoordinator && !isEditMode && (
              <button onClick={() => setIsEditMode(true)} className="bg-primary-yellow text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                <Edit size={15} /> Ubah Data
              </button>
            )}
            {isKoordinator && isEditMode && (
              <>
                <button onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
                  <Save size={15} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
                <button onClick={() => setIsEditMode(false)} className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                  <X size={15} /> Batal
                </button>
              </>
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
              <option key={p.id} value={p.id}>{p.nama}{p.status === "Aktif" ? " (Aktif)" : ""}{!p.adaDataRps ? " -- belum ada RPS" : ""}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="detailRps" />

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
                      <p>Anda cuma bisa melihat Detail RPS mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}
                  {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
                  {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

                  <div className="space-y-4 text-sm">
                    {FIELD_LABELS.map(({ key, label }) => (
                      <div key={key} className="border-b border-gray-100 pb-4">
                        <p className="font-semibold text-[#666666] mb-1.5">{label}</p>
                        {isEditMode ? (
                          <textarea
                            value={form[key]}
                            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-1 focus:ring-primary-green"
                          />
                        ) : (
                          <p className="text-gray-800 whitespace-pre-line">{form[key] || "-"}</p>
                        )}
                      </div>
                    ))}
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