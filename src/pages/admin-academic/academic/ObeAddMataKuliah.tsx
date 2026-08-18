import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import {
  useCreateObeMataKuliah,
  getKelompokMataKuliah,
  ObeMataKuliahCreatePayload,
} from "../../../hooks/academic/useObeManagement";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getDosen } from "../../../hooks/academic/useDosen";

// Sama seperti ObeEditMataKuliah.tsx, tapi mode CREATE: payload tidak menyertakan
// prasyaratMataKuliah1/2/3Id (dikonfirmasi Backend hanya ada di UPDATE), dan sidebar
// tab lain (Pemetaan CPL/CPMK, Detail RPS, dst) dinonaktifkan karena mata kuliahnya
// belum punya ID sampai berhasil disimpan.
interface FormState extends ObeMataKuliahCreatePayload {}

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
};

const SIDEBAR_TABS = [
  { key: "data", label: "Data Mata Kuliah", active: true },
  { key: "cpl", label: "Pemetaan CPL", active: false },
  { key: "cpmk", label: "Pemetaan CPMK", active: false },
  { key: "detailRps", label: "Detail RPS", active: false },
  { key: "rencanaPembelajaran", label: "Rencana Pembelajaran", active: false },
  { key: "rencanaEvaluasi", label: "Rencana Evaluasi", active: false },
];

export default function ObeAddMataKuliah() {
  const navigate = useNavigate();

  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: prodiData = [] } = getProdi();
  const { data: dosenData = [] } = getDosen();
  const { data: kelompokMataKuliahResult } = getKelompokMataKuliah();
  const kelompokMataKuliahData = kelompokMataKuliahResult?.items || [];
  const createMutation = useCreateObeMataKuliah();

  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");

  const totalSks =
    (Number(formData.sksTatapMuka) || 0) +
    (Number(formData.sksPraktikum) || 0) +
    (Number(formData.sksPraktikLapangan) || 0) +
    (Number(formData.sksSimulasi) || 0);

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
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

    if (!formData.kode.trim() || !formData.nama.trim()) {
      setErrorMessage("Kode Mata Kuliah dan Nama Mata Kuliah wajib diisi.");
      return;
    }
    if (!formData.siakProgramStudiId || !formData.siakTahunKurikulumId) {
      setErrorMessage("Unit Pengampu dan Tahun Kurikulum wajib dipilih.");
      return;
    }

    const payload: ObeMataKuliahCreatePayload = {
      ...formData,
      sksTatapMuka: Number(formData.sksTatapMuka) || 0,
      sksPraktikum: Number(formData.sksPraktikum) || 0,
      sksPraktikLapangan: Number(formData.sksPraktikLapangan) || 0,
      sksSimulasi: Number(formData.sksSimulasi) || 0,
      pengembangRpsIds: formData.pengembangRpsIds.filter(Boolean),
    };

    createMutation.mutate(payload, {
      onSuccess: (created: any) => {
        const newId = created?.id;
        if (newId) {
          navigate(`${AdminAcademicRoute.obeManagement.detailObeCourse}/default/${newId}`);
        } else {
          navigate(AdminAcademicRoute.obeManagement.obeManagement);
        }
      },
      onError: (err: any) => {
        setErrorMessage(err?.response?.data?.message || "Gagal menambahkan mata kuliah.");
      },
    });
  };

  return (
    <MainLayout isGreeting={false} titlePage="Tambah Mata Kuliah">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Tambah Mata Kuliah
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
                disabled={createMutation.isPending}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} /> {createMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar dinonaktifkan — tab lain baru bisa diakses setelah mata kuliah tersimpan */}
            <div className="w-full md:w-[20%] bg-white border border-gray-200 rounded-sm p-0 flex-shrink-0 overflow-hidden self-start">
              <div className="flex flex-col">
                {SIDEBAR_TABS.map((tab) => (
                  <div
                    key={tab.key}
                    className={`w-full text-left px-4 py-3 text-xs font-semibold border-b border-gray-100 ${
                      tab.active
                        ? "bg-[#eef5f9] text-[#00c0ef] border-l-4 border-[#00c0ef] font-bold"
                        : "bg-white text-gray-400 border-l-4 border-transparent cursor-not-allowed"
                    }`}
                    title={tab.active ? undefined : "Simpan mata kuliah dulu untuk mengakses ini"}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-[80%]">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-sm">
                {/* Kolom Kiri */}
                <div>
                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      Tahun Kurikulum<span className="text-red-500">*</span>
                    </label>
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
                    <label className="block mb-1 font-semibold text-[#666666]">SKS Praktikum</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksPraktikum}
                      onChange={(e) => handleChange("sksPraktikum", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">SKS Praktik Lapangan</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksPraktikLapangan}
                      onChange={(e) => handleChange("sksPraktikLapangan", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">SKS Simulasi</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.sksSimulasi}
                      onChange={(e) => handleChange("sksSimulasi", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">Total SKS</label>
                    <input type="number" value={totalSks} readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100" />
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div>
                  <div className="py-3 border-b border-gray-100">
                    <label className="block mb-1 font-semibold text-[#666666]">
                      Unit Pengampu<span className="text-red-500">*</span>
                    </label>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
