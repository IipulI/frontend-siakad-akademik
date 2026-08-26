import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { ArrowLeft, Save } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useSaveDetailRps } from "../../../hooks/academic/useObeDetailRps";

interface RpsDetailResponse {
  mataKuliah: {
    id: string;
    kode: string;
    nama: string;
  };
  daftarPeriode: Array<{
    id: string;
    nama: string;
    status: string;
    adaDataRps: boolean;
  }>;
  rpsData: {
    tanggalPenyusunan: string;
    deskripsiMataKuliah: string;
    deskripsiMataKuliahEng: string;
    tujuanMataKuliah: string;
    materiPembelajaran: string;
    pustakaUtama: string;
    pustakaPendukung: string;
    mediaPerangkatLunak: string;
    mediaPerangkatKeras: string;
    dokumenRpsNamaFile: string | null;
  } | null;
}

const emptyForm = {
  tanggalPenyusunan: "",
  deskripsiMataKuliah: "",
  deskripsiMataKuliahEng: "",
  tujuanMataKuliah: "",
  materiPembelajaran: "",
  pustakaUtama: "",
  pustakaPendukung: "",
  mediaPerangkatLunak: "",
  mediaPerangkatKeras: "",
};

export default function ObeEditRps() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const [searchParams] = useSearchParams();
  const periodeIdFromUrl = searchParams.get("periodeId") || "";
  const navigate = useNavigate();

  const [selectedPeriode, setSelectedPeriode] = useState<string>(periodeIdFromUrl);
  const [form, setForm] = useState(emptyForm);
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading } = useQuery<RpsDetailResponse>({
    queryKey: ["obeDetailRps", mataKuliahId, selectedPeriode],
    queryFn: async () => {
      const response = await Api.get(`/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/detail-rps`, {
        params: selectedPeriode ? { periodeId: selectedPeriode } : {},
      });
      return response.data.data;
    },
    enabled: !!mataKuliahId,
  });

  const saveMutation = useSaveDetailRps(mataKuliahId || "");

  // Kalau belum ada periode dipilih (dari URL), default ke periode yang statusnya Aktif
  useEffect(() => {
    if (!periodeIdFromUrl && data?.daftarPeriode?.length) {
      const aktif = data.daftarPeriode.find((p) => p.status === "Aktif");
      if (aktif) setSelectedPeriode(aktif.id);
    }
  }, [data, periodeIdFromUrl]);

  // Prefill form begitu data RPS untuk periode terpilih kebaca
  useEffect(() => {
    if (data?.rpsData) {
      setForm({
        tanggalPenyusunan: data.rpsData.tanggalPenyusunan ? data.rpsData.tanggalPenyusunan.slice(0, 10) : "",
        deskripsiMataKuliah: data.rpsData.deskripsiMataKuliah || "",
        deskripsiMataKuliahEng: data.rpsData.deskripsiMataKuliahEng || "",
        tujuanMataKuliah: data.rpsData.tujuanMataKuliah || "",
        materiPembelajaran: data.rpsData.materiPembelajaran || "",
        pustakaUtama: data.rpsData.pustakaUtama || "",
        pustakaPendukung: data.rpsData.pustakaPendukung || "",
        mediaPerangkatLunak: data.rpsData.mediaPerangkatLunak || "",
        mediaPerangkatKeras: data.rpsData.mediaPerangkatKeras || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [data?.rpsData]);

  const updateField = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate(`${AdminAcademicRoute.obeManagement.detailRps}/${obeId}/${mataKuliahId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedPeriode) {
      setErrorMessage("Periode akademik wajib dipilih.");
      return;
    }
    if (!form.tanggalPenyusunan || !form.deskripsiMataKuliah.trim() || !form.tujuanMataKuliah.trim() || !form.materiPembelajaran.trim() || !form.pustakaUtama.trim() || !form.pustakaPendukung.trim()) {
      setErrorMessage("Tanggal Penyusunan, Deskripsi, Tujuan, Materi, Pustaka Utama, dan Pustaka Pendukung wajib diisi.");
      return;
    }

    saveMutation.mutate(
      { siakPeriodeAkademikId: selectedPeriode, ...form, dokumenRps: dokumenFile },
      {
        onSuccess: () => {
          setSuccessMessage("Detail RPS berhasil disimpan.");
          setDokumenFile(null);
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan Detail RPS.");
        },
      }
    );
  };

  if (isLoading && !data) {
    return (
      <MainLayout isGreeting={false} titlePage="Ubah RPS">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  const mataKuliah = data?.mataKuliah;
  const daftarPeriode = data?.daftarPeriode || [];

  return (
    <MainLayout isGreeting={false} titlePage="Ubah RPS">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Detail RPS &gt; Ubah RPS
          </p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">{mataKuliah?.kode} — {mataKuliah?.nama}</h3>
            </div>
            <button
              onClick={handleBack}
              className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
            >
              <ArrowLeft size={16} /> Kembali ke Detail RPS
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarObeCourse obeId={obeId!} mataKuliahId={mataKuliahId!} activeTab="detailRps" />

            <div className="w-full md:w-[80%]">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Berlaku Sejak Periode</label>
                  <select
                    value={selectedPeriode}
                    onChange={(e) => setSelectedPeriode(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-700 w-full md:w-96"
                  >
                    <option value="" disabled>Pilih periode</option>
                    {daftarPeriode.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama} {p.status === "Aktif" ? "(Aktif)" : ""} {p.adaDataRps ? "— sudah ada data" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Penyusunan</label>
                  <input
                    type="date"
                    value={form.tanggalPenyusunan}
                    onChange={(e) => updateField("tanggalPenyusunan", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full md:w-96"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Mata Kuliah (IND)</label>
                  <textarea
                    value={form.deskripsiMataKuliah}
                    onChange={(e) => updateField("deskripsiMataKuliah", e.target.value)}
                    rows={3}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Mata Kuliah (ENG)</label>
                  <textarea
                    value={form.deskripsiMataKuliahEng}
                    onChange={(e) => updateField("deskripsiMataKuliahEng", e.target.value)}
                    rows={3}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tujuan Mata Kuliah</label>
                  <textarea
                    value={form.tujuanMataKuliah}
                    onChange={(e) => updateField("tujuanMataKuliah", e.target.value)}
                    rows={3}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Materi Pembelajaran</label>
                  <textarea
                    value={form.materiPembelajaran}
                    onChange={(e) => updateField("materiPembelajaran", e.target.value)}
                    rows={3}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pustaka Utama</label>
                  <textarea
                    value={form.pustakaUtama}
                    onChange={(e) => updateField("pustakaUtama", e.target.value)}
                    rows={2}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pustaka Pendukung</label>
                  <textarea
                    value={form.pustakaPendukung}
                    onChange={(e) => updateField("pustakaPendukung", e.target.value)}
                    rows={2}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Media Perangkat Lunak</label>
                  <textarea
                    value={form.mediaPerangkatLunak}
                    onChange={(e) => updateField("mediaPerangkatLunak", e.target.value)}
                    rows={2}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Media Perangkat Keras</label>
                  <textarea
                    value={form.mediaPerangkatKeras}
                    onChange={(e) => updateField("mediaPerangkatKeras", e.target.value)}
                    rows={2}
                    className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dokumen RPS (opsional)</label>
                  {data?.rpsData?.dokumenRpsNamaFile && !dokumenFile && (
                    <p className="text-xs text-gray-500 mb-1">File saat ini: {data.rpsData.dokumenRpsNamaFile} — pilih file baru untuk mengganti.</p>
                  )}
                  <input
                    type="file"
                    onChange={(e) => setDokumenFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
