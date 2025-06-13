import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import RichTextEditor from "../../../components/admin-academic/RichTextEditor";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { Api } from "../../../api/Index";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { CourseData, CurriculumData, DosenData, RpsData } from "../../../components/types.ts";

// --- fetching data ---
const fetchCourseData = async ({ queryKey }: { queryKey: [string, number, number] }): Promise<CourseData[]> => {
  const [_, page, size] = queryKey;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah?page=${page}&size=${size}&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;
  console.log("🔍 Raw matkul API data:", apiData);

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
          programStudi: item.programStudi,
          tahunKurikulum: item.tahunKurikulum,
          siakProgramStudiId: item.siakProgramStudiId,
          siakTahunKurikulumId: item.siakTahunKurikulumId,
          semester: item.semester,
          nilaiMin: item.nilaiMin,
          sksTatapMuka: item.sksTatapMuka,
          sksPraktikum: item.sksPraktikum,
          adaPraktikum: item.adaPraktikum,
          opsiMataKuliah: item.opsiMataKuliah,
          kodeMataKuliah: item.kodeMataKuliah,
          namaMataKuliah: item.namaMataKuliah,
          jenisMataKuliah: item.jenisMataKuliah,
          prasyaratMataKuliah1: item.prasyaratMataKuliah1 || "",
          prasyaratMataKuliah2: item.prasyaratMataKuliah2 || "",
          prasyaratMataKuliah3: item.prasyaratMataKuliah3 || "",
        };

        return formatted;
      })
    : [];

  return formattedData;
};

const fetchDosenData = async (): Promise<DosenData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/dosen", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  console.log("🔍 Raw dosen API data:", data);

  let dosenData: DosenData[] = [];

  if (Array.isArray(data)) {
    dosenData = data as DosenData[];
  } else if (typeof data === "object" && data !== null) {
    dosenData = Object.values(data as Record<string, unknown>).filter((item): item is DosenData => typeof item === "object" && item !== null && "id" in item);
  }

  return dosenData;
};

// --- create rps ---
const createRps = async (data: Omit<RpsData, "id">): Promise<RpsData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakPeriodeAkademikId: data.siakPeriodeAkademikId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    siakMataKuliahId: data.siakMataKuliahId,
    tanggalPenyusun: data.tanggalPenyusun,
    deskripsiMataKuliah: data.deskripsiMataKuliah,
    tujuanMataKuliah: data.tujuanMataKuliah,
    materiPembelajaran: data.materiPembelajaran,
    pustakaUtama: data.pustakaUtama,
    pustakaPendukung: data.pustakaPendukung,
    dosenIds: data.dosenIds,
  };

  const response = await Api.post("/akademik/mata-kuliah", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const newItemData = response.data?.data || response.data;
  return {
    id: newItemData.id,
    programStudi: data.programStudi,

    periodeAkademik: data.periodeAkademik,
    tahunKurikulum: data.tahunKurikulum,
    mataKuliah: data.mataKuliah,
    tanggalPenyusun: data.tanggalPenyusun,
    deskripsiMataKuliah: data.deskripsiMataKuliah,
    tujuanMataKuliah: data.tujuanMataKuliah,
    materiPembelajaran: data.materiPembelajaran,
    pustakaUtama: data.pustakaUtama,
    pustakaPendukung: data.pustakaPendukung,
    dosenIds: data.dosenIds,
  };
};

const AddRps = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
  };

  const [formData, setFormData] = useState({
    mataKuliah: "",
    tanggalPenyusunan: "",
    dosenPenyusun: "",
    capaianMataKuliah: "",
    topikMataKuliah: "",
    materiPerkuliahan: "",
    pustakaUtama: "",
    pustakaPendukung: "",
    dokumenRps: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, dokumenRps: file }));
  };

  const handleEditorChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Data disimpan:", formData);
    // TODO: Simpan data ke backend di sini
  };

  return (
    <MainLayout isGreeting={false} titlePage="Tambah RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5 relative">
        <div className="flex items-center justify-end mb-6 mt-4">
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center">
              <Save className="mr-2" size={16} />
              Simpan
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex  mb-6 mt-8 ">
          {/* Garis hijau di kiri */}
          <div className="bg-primary-green w-2"></div>

          {/* Konten kanan */}
          <div className="flex flex-col justify-between bg-[#F5FFF9] p-4 flex-1 md:flex-row md:gap-4">
            {/* Kolom 1 */}
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">Tahun Kurikulum:</div>
                <div>2023</div>
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">Periode Akademik:</div>
                <div>2025 Genap</div>
              </div>
            </div>

            {/* Kolom 3 */}
            <div className="flex-1">
              <div className="flex justify-between  md:justify-normal">
                <div className="font-semibold text-primary-green">Program Studi:</div>
                <div>SI - Teknik Informatika</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Mata Kuliah */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Mata Kuliah<span className="text-red-500">*</span>
            </label>
            <select name="mataKuliah" value={formData.mataKuliah} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded w-full" required>
              <option value="" disabled>
                -- Pilih Mata Kuliah --
              </option>
              <option value="MK001">Pemrograman Web</option>
              <option value="MK002">Basis Data</option>
              <option value="MK003">Algoritma dan Struktur Data</option>
            </select>
          </div>

          {/* Tanggal Perkuliahan */}
          <div className="form-group flex flex-col  items-start md:items-center md:flex-row gap-4">
            <label className="w-48 font-medium">
              Tanggal Perkuliahan<span className="text-red-500">*</span>
            </label>
            <input type="date" name="tanggalPenyusunan" value={formData.tanggalPenyusunan} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded w-full" required />
          </div>

          {/* Dosen Pengajar */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Dosen Penyusun<span className="text-red-500">*</span>
            </label>
            <select name="dosenPenyusun" value={formData.dosenPenyusun} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded w-full" required>
              <option value="" disabled>
                -- Pilih Dosen --
              </option>
              <option value="DSN001">Prof. Dr. Bambang Sutejo</option>
              <option value="DSN002">Dr. Siti Aminah</option>
              <option value="DSN003">Ir. Hadi Santoso</option>
            </select>
          </div>

          {/* RichText Fields */}
          {[
            { name: "capaianMataKuliah", label: "Deskripsi Mata Kuliah" },
            { name: "topikMataKuliah", label: "Tujuan Mata Kuliah" },
            { name: "materiPerkuliahan", label: "Materi Pembelajaran" },
            { name: "pustakaUtama", label: "Pustaka Utama" },
            { name: "pustakaPendukung", label: "Pustaka Pendukung" },
          ].map((field) => (
            <div key={field.name} className="form-group flex flex-col items-start gap-4 md:flex-row">
              <label className="w-48 font-medium pt-2">{field.label}</label>
              <div className="flex-1">
                <RichTextEditor name={field.name} value={formData[field.name]} onChange={handleEditorChange} />
              </div>
            </div>
          ))}

          {/* Upload Dokumen */}
          <div className="form-group flex flex-col items-start gap-4 mb-4  md:flex-row">
            {/* Label kiri */}
            <label htmlFor="dokumenRps" className="w-48 font-medium text-gray-700 pt-2">
              Dokumen RPS
            </label>

            {/* Konten kanan */}
            <div className="flex flex-col flex-1">
              {/* Nama file muncul kalau ada */}
              {formData.dokumenRps && <div className="text-primary-green text-sm font-semibold mb-1">{formData.dokumenRps}</div>}

              {/* Input file dengan border */}
              <input id="dokumenRps" type="file" name="dokumenRps" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} className="border border-gray-300 rounded px-3 py-2" />

              {/* Info format file */}
              <p className="text-sm text-blue-500 mt-1">.pdf, .doc, .docx, .xls, .xlsx (maxsize: 10 MB)</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddRps;
