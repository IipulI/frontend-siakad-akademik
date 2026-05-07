import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import SearchBar from "../../../components/SearchBar";
import { Pagination } from "../../../components/admin-academic/Pagination";
import SelectOption from "../../../components/lecturer/SelectOption";

const FinalProjectLecturer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({
        unit: "",
        periodeMulai: "",
        periodeMasuk: "",
        kelengkapan: "",
        status: "Aktif",
        tahap: ""
    });

    const filterOptions = [
        { label: "Unit", key: "unit", options: [{ value: "", label: "-- Semua Program Studi --" }] },
        { label: "Periode Mulai Berlaku", key: "periodeMulai", options: [{ value: "", label: "-- Pilih Periode --" }] },
        { label: "Periode Masuk", key: "periodeMasuk", options: [{ value: "", label: "-- Semua Periode Masuk --" }] },
        { label: "Kelengkapan Tugas Akhir", key: "kelengkapan", options: [{ value: "", label: "-- Pilih Kelengkapan Tugas Akhir --" }] },
        { label: "Status Tugas Akhir", key: "status", options: [{ value: "Aktif", label: "Aktif" }, { value: "Tidak Aktif", label: "Tidak Aktif" }] },
        { label: "Tahap Tugas Akhir", key: "tahap", options: [{ value: "", label: "-- Pilih Semua Tahap --" }] },
    ];

    // Placeholder data
    const finalProjects: any[] = [];
    const isPending = false;

    return (
        <MainLayout isGreeting={false} titlePage="Tugas Akhir">
            {/* Filter Section - 2 Columns grid */}
            <div className="grid sm:grid-cols-2 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
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
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex gap-4 items-center">
                        <select
                            className="rounded px-2 py-1 lg:text-base text-xs border border-black/50 shadow-md focus:outline-none w-32 bg-white text-gray-700"
                        >
                            <option value="Semua">-- Semua --</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Menunggu">Menunggu</option>
                        </select>
                        <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari Tugas Akhir" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nama Mahasiswa</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Prodi dan Periode Masuk</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Judul Tugas Akhir</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Dosen Pembimbing dan Penguji</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Tahap Tugas Akhir</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nilai</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Status</th>
                                <th className="bg-primary-yellow text-white border border-gray-500 font-semibold p-2 text-center w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center font-semibold text-gray-500 border border-gray-500">
                                        Data kosong
                                    </td>
                                </tr>
                            ) : (
                                finalProjects.map((item, index) => (
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

export default FinalProjectLecturer;
