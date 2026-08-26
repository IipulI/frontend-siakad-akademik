import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  getObeMataKuliahDetail,
  useUpdateObeMataKuliah,
  getKelompokMataKuliah,
  ObeMataKuliahUpdatePayload,
} from "../../../hooks/academic/useObeManagement";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getDosen } from "../../../hooks/academic/useDosen";

// Bentuk GET, POST (create), PUT (update), dan DELETE sudah dikonfirmasi Backend dan saling
// simetris (ID langsung tersedia, tidak perlu lagi menebak lewat pencocokan nama). Satu-satunya
// gap yang tersisa: rumpunMataKuliahId belum ada di Backend sama sekali, dan Pengajar Mata Kuliah
// tidak dikirim di respons GET — lihat catatan peringatan di masing-masing field.
interface FormState extends ObeMataKuliahUpdatePayload {}

const emptyForm: FormState = {
  siakProgramStudiId: "",
  siakTahunKurikulumId: "",
  kelompokMataKuliahId: null,
  rumpunMataKuliahId: null,
  kode: "",
  nama: "",
  namaEn: "",
  jenis: "",
  adaPraktikum: false,
  sksTatapMuka: 0,
  sksPraktikum: 0,
  sksPraktikLapangan: 0,
  sksSimulasi: 0,
  merupakanMku: false,
  adaSap: false,
  adaSilabus: false,
  adaBahanAjar: false,
  adaDiktat: false,
  koordinatorMkId: null,
  pengembangRpsIds: [],
  prasyaratMataKuliah1Id: null,
  prasyaratMataKuliah2Id: null,
  prasyaratMataKuliah3Id: null,
};

export default function ObeEditMataKuliah() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const navigate = useNavigate();

  const { data: detail, isLoading, error } = getObeMataKuliahDetail(mataKuliahId || "");
  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: prodiData = [] } = getProdi();
  const { data: dosenData = [] } = getDosen();
  const { data: kelompokMataKuliahResult } = getKelompokMataKuliah();
  const kelompokMataKuliahData = kelompokMataKuliahResult?.items || [];
  const updateMutation = useUpdateObeMataKuliah();


  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [rumpunNama, setRumpunNama] = useState("");
  const [kelompokNama, setKelompokNama] = useState("");
  const [pengajarDisplay, setPengajarDisplay] = useState<string>("-");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!detail) return;

    // Backend sudah menyimetriskan GET dengan PUT — semua ID sekarang dikirim langsung
    // (siakProgramStudiId, siakTahunKurikulumId, kelompokMataKuliahId, prasyaratMataKuliah1/2/3Id,
    // breakdown SKS lengkap), jadi tidak perlu lagi menebak ID dengan mencocokkan nama.
    // Satu-satunya yang masih belum tersedia dari Backend: rumpunMataKuliahId.
    const kelompokAda = detail.kelompokMataKuliah && detail.kelompokMataKuliah !== "-";
    const namaEnAda = detail.namaMataKuliahEn && detail.namaMataKuliahEn !== "-";

    setFormData({
      siakProgramStudiId: detail.siakProgramStudiId || "",
      siakTahunKurikulumId: detail.siakTahunKurikulumId || "",
      kelompokMataKuliahId: detail.kelompokMataKuliahId ?? null,
      rumpunMataKuliahId: null, // GET belum menyertakan field ini
      kode: detail.kodeMataKuliah || "",
      nama: detail.namaMataKuliahInd || "",
      namaEn: namaEnAda ? detail.namaMataKuliahEn : "",
      jenis: detail.jenisMataKuliah || "",
      adaPraktikum: (detail.sksPraktikum || 0) > 0,
      sksTatapMuka: detail.sksTatapMuka || 0,
      sksPraktikum: detail.sksPraktikum || 0,
      sksPraktikLapangan: detail.sksPraktikLapangan || 0,
      sksSimulasi: detail.sksSimulasi || 0,
      merupakanMku: !!detail.atribut?.merupakanMku,
      adaSap: !!detail.atribut?.adaSap,
      adaSilabus: !!detail.atribut?.adaSilabus,
      adaBahanAjar: !!detail.atribut?.adaBahanAjar,
      adaDiktat: !!detail.atribut?.adaDiktat,
      koordinatorMkId: detail.koordinatorMataKuliah?.id ?? null,
      pengembangRpsIds: (detail.pengembangRps || []).map((p: any) => p.id),
      prasyaratMataKuliah1Id: detail.prasyaratMataKuliah1Id ?? null,
      prasyaratMataKuliah2Id: detail.prasyaratMataKuliah2Id ?? null,
      prasyaratMataKuliah3Id: detail.prasyaratMataKuliah3Id ?? null,
    });

    setRumpunNama("");
    setKelompokNama(kelompokAda ? detail.kelompokMataKuliah : "");
    setPengajarDisplay("-");
  }, [detail]);

  const totalSks =
    (Number(formData.sksTatapMuka) || 0) +
    (Number(formData.sksPraktikum) || 0) +
    (Number(formData.sksPraktikLapangan) || 0) +
    (Number(formData.sksSimulasi) || 0);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate(`${AdminAcademicRoute.obeManagement.detailObeCourse}/${obeId || "default"}/${mataKuliahId}`);
  };

  const handleAddPengembangRps = () => {
    setFormData((prev) => ({ ...prev, pengembangRpsIds: [...prev.pengembangRpsIds, ""] }));
  };

  const handleChangePengembangRps = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pengembangRpsIds: prev.pengembangRpsIds.map((v, i) => (i === index ? value : v)),
    }));
  };

  const handleRemovePengembangRps = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pengembangRpsIds: prev.pengembangRpsIds.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    setErrorMessage("");

    if (!mataKuliahId) return;
    if (!formData.kode.trim() || !formData.nama.trim()) {
      setErrorMessage("Kode Mata Kuliah dan Nama Mata Kuliah wajib diisi.");
      return;
    }

    const payload: ObeMataKuliahUpdatePayload = {
      ...formData,
      sksTatapMuka: Number(formData.sksTatapMuka) || 0,
      sksPraktikum: Number(formData.sksPraktikum) || 0,
      sksPraktikLapangan: Number(formData.sksPraktikLapangan) || 0,
      sksSimulasi: Number(formData.sksSimulasi) || 0,
      pengembangRpsIds: formData.pengembangRpsIds.filter(Boolean),
    };

    updateMutation.mutate(
      { id: mataKuliahId, payload },
      {
        onSuccess: () => {
          navigate(`${AdminAcademicRoute.obeManagement.detailObeCourse}/${obeId || "default"}/${mataKuliahId}`);
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || "Gagal menyimpan perubahan mata kuliah.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Edit Mata Kuliah">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !detail) {
    return (
      <MainLayout isGreeting={false} titlePage="Edit Mata Kuliah">
        <div className="p-8 text-center text-red-500">
          Gagal memuat data mata kuliah. Silakan coba lagi.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Edit Mata Kuliah">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Edit Mata Kuliah
          </p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={handleBack}
              className="bg-primary-yellow text-white p-2.5 rounded-md flex items-center justify-center hover:bg-opacity-90"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button
                onClick={handleBack}
                className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
              >
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} /> {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarObeCourse obeId={obeId || "default"} mataKuliahId={mataKuliahId || ""} activeTab="data" />

            <div className="w-full md:w-[80%]">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-sm">
                {/* Kolom Kiri */}
                <div>
                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Tahun Kurikulum</label>
                    <select
                      value={formData.siakTahunKurikulumId}
                      onChange={(e) => handleChange("siakTahunKurikulumId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="">Pilih Tahun Kurikulum</option>
                      {curriculumData.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.tahun}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      Kode Mata Kuliah<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.kode}
                      onChange={(e) => handleChange("kode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      Nama Mata Kuliah (IND)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleChange("nama", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Nama Mata Kuliah (EN)</label>
                    <input
                      type="text"
                      value={formData.namaEn}
                      onChange={(e) => handleChange("namaEn", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Jenis Mata Kuliah</label>
                    <select
                      value={formData.jenis}
                      onChange={(e) => handleChange("jenis", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="">Pilih Jenis Mata Kuliah</option>
                      <option value="Kuliah">Kuliah</option>
                      <option value="Praktikum">Praktikum</option>
                      <option value="Praktik Lapangan">Praktik Lapangan</option>
                      <option value="Simulasi">Simulasi</option>
                    </select>
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      SKS Tatap Muka<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksTatapMuka}
                      onChange={(e) => handleChange("sksTatapMuka", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      SKS Praktikum<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksPraktikum}
                      onChange={(e) => handleChange("sksPraktikum", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      SKS Praktik Lapangan<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksPraktikLapangan}
                      onChange={(e) => handleChange("sksPraktikLapangan", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      SKS Simulasi<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksSimulasi}
                      onChange={(e) => handleChange("sksSimulasi", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      Total SKS<span className="text-red-500">*</span>
                    </label>
                    <input type="number" value={totalSks} readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div>
                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Unit Pengampu</label>
                    <select
                      value={formData.siakProgramStudiId}
                      onChange={(e) => handleChange("siakProgramStudiId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="">Pilih Unit Pengampu</option>
                      {prodiData.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.nama || p.namaProgramStudi}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Rumpun Mata Kuliah</label>
                    <input
                      type="text"
                      value={rumpunNama}
                      readOnly
                      placeholder="Cari Rumpun Mata Kuliah"
                      title="Belum ada endpoint pencarian Rumpun Mata Kuliah"
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Kelompok Mata Kuliah</label>
                    <select
                      value={formData.kelompokMataKuliahId || ""}
                      onChange={(e) => handleChange("kelompokMataKuliahId", e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="">-- Pilih Kelompok Mata Kuliah --</option>
                      {kelompokMataKuliahData.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama}
                        </option>
                      ))}
                      {formData.kelompokMataKuliahId &&
                        !kelompokMataKuliahData.some((k) => k.id === formData.kelompokMataKuliahId) && (
                          <option value={formData.kelompokMataKuliahId}>{kelompokNama || formData.kelompokMataKuliahId}</option>
                        )}
                    </select>
                  </div>

                  <div className="py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-[#666666]">Merupakan MKU</span>
                    <input
                      type="checkbox"
                      checked={formData.merupakanMku}
                      onChange={(e) => handleChange("merupakanMku", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-[#666666]">Ada SAP</span>
                    <input
                      type="checkbox"
                      checked={formData.adaSap}
                      onChange={(e) => handleChange("adaSap", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-[#666666]">Ada Silabus</span>
                    <input
                      type="checkbox"
                      checked={formData.adaSilabus}
                      onChange={(e) => handleChange("adaSilabus", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-[#666666]">Ada Bahan Ajar</span>
                    <input
                      type="checkbox"
                      checked={formData.adaBahanAjar}
                      onChange={(e) => handleChange("adaBahanAjar", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-[#666666]">Ada Diktat</span>
                    <input
                      type="checkbox"
                      checked={formData.adaDiktat}
                      onChange={(e) => handleChange("adaDiktat", e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Dosen Penanggung Jawab */}
              <div className="mt-8">
                <h3 className="font-bold text-lg text-primary-green border-b-2 border-primary-green pb-2 mb-4">
                  Dosen Penanggung Jawab
                </h3>

                <div className="text-sm space-y-4">
                  <div>
                    <label className="block mb-1 font-semibold text-[#666666]">Koordinator Mata Kuliah</label>
                    <div className="flex items-center gap-2">
                      <select
                        value={formData.koordinatorMkId || ""}
                        onChange={(e) => handleChange("koordinatorMkId", e.target.value || null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="">Pilih Koordinator Mata Kuliah</option>
                        {dosenData.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.nama}
                          </option>
                        ))}
                      </select>
                      {formData.koordinatorMkId && (
                        <button
                          onClick={() => handleChange("koordinatorMkId", null)}
                          className="bg-primary-yellow text-white p-2 rounded flex items-center justify-center hover:bg-opacity-90 cursor-pointer"
                          title="Hapus Koordinator"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#666666]">Pengembang RPS</label>
                    <div className="space-y-2">
                      {formData.pengembangRpsIds.map((value, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <select
                            value={value}
                            onChange={(e) => handleChangePengembangRps(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                          >
                            <option value="">Pilih Pengembang RPS</option>
                            {dosenData.map((d: any) => (
                              <option key={d.id} value={d.id}>
                                {d.nama}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemovePengembangRps(index)}
                            className="bg-red-500 text-white p-2 rounded flex items-center justify-center hover:bg-opacity-90 cursor-pointer"
                            title="Hapus"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddPengembangRps}
                      className="mt-2 border border-primary-green text-primary-green px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1 hover:bg-primary-green hover:text-white cursor-pointer"
                    >
                      <Plus size={14} /> Tambah Dosen
                    </button>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#666666]">Pengajar Mata Kuliah</label>
                    <p className="text-gray-800">{pengajarDisplay}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
