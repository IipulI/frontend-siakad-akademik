import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { ToastNotif, showToast } from "../../../components/admin-finance/Toastify.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Save } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { getCourseData, useAddCourse } from "../../../hooks/academic/useCourseManagement.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- State Management ---
  const [formData, setFormData] = useState({
    tahunKurikulum: "",
    programStudi: "",
    siakProgramStudiId: "",
    siakTahunKurikulumId: "",
    sksTatapMuka: "",
    sksPraktikum: "",
    semester: "",
    adaPraktikum: false,
    nilaiMin: "",
    kodeMataKuliah: "",
    namaMataKuliah: "",
    jenisMataKuliah: "",
    opsiMataKuliah: null,
    prasyaratMataKuliah1Id: "",
    prasyaratMataKuliah2Id: "",
    prasyaratMataKuliah3Id: "",
  });

  // --- Derived State ---
  const totalSks = Number(formData.sksTatapMuka || 0) + Number(formData.sksPraktikum || 0);

  // --- React Query Hooks ---
  const { data: courseData = [] } = getCourseData({
    tahunKurikulum: "",
    jenisMataKuliah: "",
    programStudi: "",
  });
  const { data: curriculumData = [] } = getCurriculumYear();
  const { data: programStudiData = [] } = getProdi();
  const createMutation = useAddCourse();

  // --- Event Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  // --- Form Validation ---
  const isFormValid = () => {
    const { siakTahunKurikulumId, siakProgramStudiId, kodeMataKuliah, namaMataKuliah } = formData;
    if (!siakTahunKurikulumId || !siakProgramStudiId || !kodeMataKuliah || !namaMataKuliah) {
      showToast.error("Mohon isi semua kolom yang ditandai bintang (*).");
      return false;
    }
    if (totalSks <= 0) {
      showToast.error("Total SKS harus lebih dari 0.");
      return false;
    }
    return true;
  };

  // --- Save Handler ---
  const handleSave = async () => {
    if (!isFormValid()) {
      return;
    }

    const dataToSave = {
      ...formData,
      sksTatapMuka: Number(formData.sksTatapMuka || 0),
      sksPraktikum: Number(formData.sksPraktikum || 0),
      adaPraktikum: Number(formData.sksPraktikum || 0) > 0,
      semester: Number(formData.semester || 0),
    };

    createMutation.mutate(dataToSave, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courseData"] });
        showToast.success("Mata kuliah berhasil ditambahkan!", {
          autoClose: 2000,
          onClose: () => navigate(AdminAcademicRoute.courseManagement.courseManagement),
        });
      },
      onError: (error: any) => {
        console.error("Error tambah mata kuliah:", error);
        showToast.error(error?.response?.data?.message || "Gagal menambahkan mata kuliah.");
      },
    });
  };

  return (
    <MainLayout isGreeting={false} titlePage="Tambah Mata Kuliah">
      <ToastNotif />

      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        {/* --- Header & Action Buttons --- */}
        <div className="flex flex-col items-center justify-end mb-10 md:flex-row gap-4">
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center cursor-pointer disabled:opacity-50" disabled={createMutation.isPending}>
              <Save className="mr-2" size={16} />
              {createMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* --- Sidebar Menu --- */}
          <div className="w-full h-50 p-3 space-y-2 md:w-[20%]">
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer">
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p className="text-black font-semibold">Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-not-allowed">
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-not-allowed">
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>RPS</p>
            </div>
          </div>

          {/* --- Form Data Mata Kuliah --- */}
          <div className="w-full bg-white py-2 px-5 md:w-[80%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Tahun Kurikulum */}
              <div>
                <label className="block mb-2 font-medium">
                  Tahun Kurikulum <span className="text-red-500">*</span>
                </label>
                <select name="siakTahunKurikulumId" value={formData.siakTahunKurikulumId} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Pilih Tahun Kurikulum --</option>
                  {curriculumData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.tahun}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Pengampu */}
              <div>
                <label className="block mb-2 font-medium">
                  Unit Pengampu <span className="text-red-500">*</span>
                </label>
                <select name="siakProgramStudiId" value={formData.siakProgramStudiId} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Pilih Unit Pengampu --</option>
                  {programStudiData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.namaProgramStudi}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kode Mata Kuliah */}
              <div>
                <label className="block mb-2 font-medium">
                  Kode Mata Kuliah <span className="text-red-500">*</span>
                </label>
                <input type="text" name="kodeMataKuliah" value={formData.kodeMataKuliah} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>

              {/* Prasyarat 1 */}
              <div>
                <label className="block mb-2 font-medium">Prasyarat 1</label>
                <select name="prasyaratMataKuliah1Id" value={formData.prasyaratMataKuliah1Id} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Pilih Mata Kuliah --</option>
                  {courseData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kodeMataKuliah} - {item.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Mata Kuliah */}
              <div>
                <label className="block mb-2 font-medium">
                  Nama Mata Kuliah <span className="text-red-500">*</span>
                </label>
                <input type="text" name="namaMataKuliah" value={formData.namaMataKuliah} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>

              {/* Prasyarat 2 */}
              <div>
                <label className="block mb-2 font-medium">Prasyarat 2</label>
                <select name="prasyaratMataKuliah2Id" value={formData.prasyaratMataKuliah2Id} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Pilih Mata Kuliah --</option>
                  {courseData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kodeMataKuliah} - {item.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKS Praktikum */}
              <div>
                <label className="block mb-2 font-medium">SKS Praktikum</label>
                <input type="number" name="sksPraktikum" value={formData.sksPraktikum} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>

              {/* Prasyarat 3 */}
              <div>
                <label className="block mb-2 font-medium">Prasyarat 3</label>
                <select name="prasyaratMataKuliah3Id" value={formData.prasyaratMataKuliah3Id} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Pilih Mata Kuliah --</option>
                  {courseData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kodeMataKuliah} - {item.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKS Tatap Muka */}
              <div>
                <label className="block mb-2 font-medium">
                  SKS Tatap Muka <span className="text-red-500">*</span>
                </label>
                <input type="number" name="sksTatapMuka" value={formData.sksTatapMuka} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>

              {/* Total SKS */}
              <div>
                <label className="block mb-2 font-medium">Total SKS</label>
                <input type="number" value={totalSks} className="w-full px-3 py-2 border border-black/50 rounded bg-gray-200" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCourse;
