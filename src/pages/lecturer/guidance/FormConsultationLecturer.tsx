import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { ChevronLeft, Save, Settings } from "lucide-react";
import SearchBar from "../../../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";

const FormConsultationLecturer = () => {
    const navigate = useNavigate();
    
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        mahasiswa: "",
        tanggal: "",
        topik: "",
        keterangan: "",
        pesan: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validation check
        if (!formData.tanggal || !formData.topik) {
            alert("Harap isi Tanggal Konsultasi dan Topik!");
            return;
        }
        alert("Simpan berhasil (UI only)!");
        navigate(LecturerRoute.guidance.consultation);
    };

    return (
        <MainLayout isGreeting={false} titlePage="Detail Konsultasi Pembimbing">
            <div className="w-full bg-white min-h-[50vh] p-6 rounded-sm shadow-sm mt-4 mb-20">
                {/* Title Section */}
                <div className="mb-6 flex items-end gap-2">
                    <h2 className="text-2xl font-bold text-gray-800">Konsultasi Pembimbing</h2>
                    <span className="text-gray-400 text-sm mb-1">Detail Konsultasi Pembimbing</span>
                </div>

                {/* Top Action Bar */}
                <div className="border-t-2 border-primary-green pt-4 flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div className="flex">
                        <SearchBar search={search} setSearch={setSearch} isPending={false} placeholder="Cari Konsultasi Pembimbing" />
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate(LecturerRoute.guidance.consultation)}
                            className="bg-[#00b4d8] hover:bg-[#0096c7] text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2 transition"
                        >
                            <ChevronLeft size={16} /> Kembali ke Daftar
                        </button>
                        <button 
                            onClick={handleSave}
                            className="bg-primary-green hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2 transition"
                        >
                            <Save size={16} /> Simpan
                        </button>
                        <div className="flex bg-primary-yellow items-center rounded overflow-hidden">
                            <div className="px-2">
                                <Settings color="white" size={16} />
                            </div>
                            <select className="bg-primary-yellow text-white font-semibold text-sm py-2 pr-2 outline-none cursor-pointer">
                                <option value="">Aksi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="max-w-4xl border border-gray-200 rounded p-4">
                    <div className="space-y-4">
                        {/* Periode Akademik */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                            <label className="font-semibold text-blue-900 md:w-1/4 text-sm">Periode Akademik</label>
                            <div className="md:w-3/4 text-sm text-gray-700">
                                2025 Genap
                            </div>
                        </div>

                        {/* Mahasiswa */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                            <label className="font-semibold text-blue-900 md:w-1/4 text-sm">Mahasiswa</label>
                            <div className="md:w-3/4">
                                <select 
                                    name="mahasiswa"
                                    value={formData.mahasiswa}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                                >
                                    <option value=""></option>
                                    <option value="1">Andi - 12345</option>
                                    <option value="2">Budi - 67890</option>
                                </select>
                            </div>
                        </div>

                        {/* Tanggal Konsultasi */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                            <label className="font-semibold text-blue-900 md:w-1/4 text-sm flex items-center">
                                Tanggal Konsultasi<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="md:w-3/4">
                                <input 
                                    type="date"
                                    name="tanggal"
                                    value={formData.tanggal}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                        </div>

                        {/* Topik */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                            <label className="font-semibold text-blue-900 md:w-1/4 text-sm flex items-center">
                                Topik<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="md:w-3/4">
                                <input 
                                    type="text"
                                    name="topik"
                                    value={formData.topik}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                        </div>

                        {/* Keterangan */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-100 pb-4">
                            <label className="font-semibold text-blue-900 md:w-1/4 text-sm">Keterangan</label>
                            <div className="md:w-3/4">
                                <input 
                                    type="text"
                                    name="keterangan"
                                    value={formData.keterangan}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                        </div>

                        {/* Pesan */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2 pb-2">
                            <label className="font-semibold text-blue-900 md:w-1/4 text-sm">Pesan</label>
                            <div className="md:w-3/4">
                                <input 
                                    type="text"
                                    name="pesan"
                                    value={formData.pesan}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default FormConsultationLecturer;
