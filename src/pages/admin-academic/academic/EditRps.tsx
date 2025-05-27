import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import RichTextEditor from "../../../components/admin-academic/RichTextEditor";

const EditRps = () => {
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
    <MainLayout isGreeting={false} titlePage="Edit RPS">
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
        <div className="flex mb-6 mt-8">
          {/* Garis hijau di kiri */}
          <div className="bg-primary-green w-2"></div>

          {/* Konten kanan */}
          <div className="flex justify-between bg-[#F5FFF9] p-4 flex-1">
            {/* Kolom 1 */}
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="font-semibold text-primary-green">Tahun Kurikulum:</div>
                <div>2023</div>
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="font-semibold text-primary-green">Periode Akademik:</div>
                <div>2025 Genap</div>
              </div>
            </div>

            {/* Kolom 3 */}
            <div className="flex-1">
              <div className="flex gap-2">
                <div className="font-semibold text-primary-green">Program Studi:</div>
                <div>SI - Teknik Informatika</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Mata Kuliah */}
          <div className="form-group flex items-center gap-4">
            <label className="w-48 font-medium">
              Mata Kuliah<span className="text-red-500">*</span>
            </label>
            <select name="mataKuliah" value={formData.mataKuliah} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded" required>
              <option value="" disabled>
                -- Pilih Mata Kuliah --
              </option>
              <option value="MK001">Pemrograman Web</option>
              <option value="MK002">Basis Data</option>
              <option value="MK003">Algoritma dan Struktur Data</option>
            </select>
          </div>

          {/* Tanggal Perkuliahan */}
          <div className="form-group flex items-center gap-4">
            <label className="w-48 font-medium">
              Tanggal Perkuliahan<span className="text-red-500">*</span>
            </label>
            <input type="date" name="tanggalPenyusunan" value={formData.tanggalPenyusunan} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded" required />
          </div>

          {/* Dosen Pengajar */}
          <div className="form-group flex items-center gap-4">
            <label className="w-48 font-medium">
              Dosen Penyusun<span className="text-red-500">*</span>
            </label>
            <select name="dosenPenyusun" value={formData.dosenPenyusun} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded" required>
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
            <div key={field.name} className="form-group flex items-start gap-4">
              <label className="w-48 font-medium pt-2">{field.label}</label>
              <div className="flex-1">
                <RichTextEditor name={field.name} value={formData[field.name]} onChange={handleEditorChange} />
              </div>
            </div>
          ))}

          {/* Upload Dokumen */}
          <div className="form-group flex items-start gap-4 mb-4">
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

export default EditRps;
