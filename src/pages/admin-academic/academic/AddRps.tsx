import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Search, ArrowLeft, Save, Plus } from "lucide-react";

const handleSave = () => {
  console.log("Data disimpan");
};

const handleBack = () => {
  console.log("Kembali ke daftar RPS");
};

const AddRps = () => {
  const [formData, setFormData] = useState({
    mataKuliah: "",
    tanggalPenyusunan: "",
    dosenPenyusun: "",
    deskripsi: "",
    tujuan: "",
    materi: "",
    pustakaUtama: "",
    pustakaPendukung: "",
    dokumenRps: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, dokumenRps: file });
  };

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="flex items-center justify-end mb-10">
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

        <div className="bg-primary-green/10 p-4 flex gap-8 items-center justify-between rounded mb-6">
          <div className="flex items-center gap-2 w-1/3">
            <span className="font-semibold w-1/3 text-left">Kode Prodi:</span>
            <span className="w-2/3 text-left">MK001</span>
          </div>
          <div className="flex items-center gap-2 w-1/3">
            <span className="font-semibold w-1/3 text-left">Program Studi:</span>
            <span className="w-2/3 text-left">Pemrograman Lanjut</span>
          </div>
          <div className="flex items-center gap-2 w-1/3">
            <span className="font-semibold w-1/3 text-left">Ketua Prodi:</span>
            <span className="w-2/3 text-left">1</span>
          </div>
        </div>

        {/* Form Input */}
        <div className="bg-gray-50 p-4 rounded">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">
                Mata Kuliah<span className="text-red-500">*</span>:
              </label>
              <select name="mataKuliah" value={formData.mataKuliah} onChange={handleChange} className="flex-1 border p-2 rounded">
                <option value="">Pilih Mata Kuliah</option>
                <option value="MK001">MK001</option>
                <option value="MK002">MK002</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Tanggal Penyusunan:</label>
              <input type="date" name="tanggalPenyusunan" value={formData.tanggalPenyusunan} onChange={handleChange} className="flex-1 border p-2 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Dosen Penyusun:</label>
              <input type="text" name="dosenPenyusun" value={formData.dosenPenyusun} onChange={handleChange} className="flex-1 border p-2 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Deskripsi Mata Kuliah:</label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="flex-1 border p-2 rounded" rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Tujuan Mata Kuliah:</label>
              <textarea name="tujuan" value={formData.tujuan} onChange={handleChange} className="flex-1 border p-2 rounded" rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Materi Pembelajaran:</label>
              <textarea name="materi" value={formData.materi} onChange={handleChange} className="flex-1 border p-2 rounded" rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Pustaka Utama:</label>
              <input type="text" name="pustakaUtama" value={formData.pustakaUtama} onChange={handleChange} className="flex-1 border p-2 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Pustaka Pendukung:</label>
              <input type="text" name="pustakaPendukung" value={formData.pustakaPendukung} onChange={handleChange} className="flex-1 border p-2 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Dokumen RPS:</label>
              <input type="file" name="dokumenRps" onChange={handleFileChange} className="flex-1 border p-2 rounded" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddRps;
