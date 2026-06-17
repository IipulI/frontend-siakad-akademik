import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Plus, Trash2 } from "lucide-react";
import SearchBar from "../../../components/SearchBar";
import { Pagination } from "../../../components/admin-academic/Pagination";
import SelectOption from "../../../components/lecturer/SelectOption";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";

const ConsultationLecturer = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({
        periode: "2025 Genap",
    });

    const periodeOptions = [
        { value: "2025 Genap", label: "2025 Genap" },
        { value: "2024 Ganjil", label: "2024 Ganjil" }
    ];

    const filterOptions = [
        { label: "Periode Akademik", key: "periode", options: periodeOptions },
    ];

    // Placeholder data (Empty as shown in screenshot)
    const consultations: any[] = [];
    const isPending = false; // Mock loading state

    return (
        <MainLayout isGreeting={false} titlePage="Konsultasi Pembimbing">
            {/* Filter Section matching AdvisorLecturer */}
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
                {filterOptions.map(({ label, key, options }) => (
                    <SelectOption
                        key={key}
                        label={label}
                        options={options}
                        value={filters[key as keyof typeof filters]}
                        onChange={(val) => setFilters(prev => ({ ...prev, [key]: val }))}
                    />
                ))}
            </div>

            {/* Main Table Section */}
            <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
                        <select
                            className="rounded px-2 py-1 lg:text-base text-xs border border-black/50 shadow-md focus:outline-none w-full sm:w-32 bg-white text-gray-700 h-10"
                        >
                            <option value="Semua">-- Semua --</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Menunggu">Menunggu</option>
                        </select>
                        <div className="w-full sm:max-w-md flex-1">
                            <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari Konsultasi Pembimbing" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => navigate(LecturerRoute.guidance.addConsultation)}
                            className="flex-1 sm:flex-initial justify-center bg-primary-green hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2 transition h-10"
                        >
                            <Plus size={16} /> Tambah
                        </button>
                        <button className="flex-1 sm:flex-initial justify-center bg-[#ff6b6b] hover:bg-red-500 text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2 transition h-10">
                            <Trash2 size={16} /> Hapus
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center w-12">
                                    <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                                </th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">NIM</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nama Mahasiswa</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">NIP</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nama Pembimbing</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Topik</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Post Terakhir</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">KRS Disetujui</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Status</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultations.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-8 text-center font-semibold text-gray-500 border border-gray-500">
                                        Data kosong
                                    </td>
                                </tr>
                            ) : (
                                consultations.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        {/* Row template */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Standard Pagination Component */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={1}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    totalRows={0}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>
        </MainLayout>
    );
};

export default ConsultationLecturer;