import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import SearchBar from "../../../components/SearchBar";
import { Pagination } from "../../../components/admin-academic/Pagination";
import SelectOption from "../../../components/lecturer/SelectOption";

const ProposalLecturer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    
    const [filters, setFilters] = useState({
        jenisTa: "Tugas Akhir",
        prodi: "",
        status: "Aktif",
        angkatan: ""
    });

    const filterOptions = [
        { label: "Jenis TA", key: "jenisTa", options: [{ value: "Tugas Akhir", label: "Tugas Akhir" }] },
        { label: "Status", key: "status", options: [{ value: "Aktif", label: "Aktif" }, { value: "Tidak Aktif", label: "Tidak Aktif" }] },
        { label: "Program Studi", key: "prodi", options: [{ value: "", label: "-- Semua Program Studi --" }] },
        { label: "Angkatan", key: "angkatan", options: [{ value: "", label: "-- Semua Angkatan --" }] },
    ];

    // Placeholder data (Empty as shown in screenshot)
    const proposals: any[] = []; 
    const isPending = false;

    return (
        <MainLayout isGreeting={false} titlePage="Proposal Tugas Akhir">
            {/* Filter Section */}
            <div className="grid sm:grid-cols-2 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
                {filterOptions.map(({label, key, options}) => (
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
                            <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari Proposal Tugas Akhir" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nama Mahasiswa</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Judul Tugas Akhir</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Topik</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nama Pembimbing</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Tgl. Pengajuan</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Status</th>
                                <th className="bg-primary-yellow text-white border border-gray-500 font-semibold p-2 text-center w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposals.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center font-semibold text-gray-500 border border-gray-500">
                                        Data kosong
                                    </td>
                                </tr>
                            ) : (
                                proposals.map((item, index) => (
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

export default ProposalLecturer;
