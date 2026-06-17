import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import SearchBar from "../../../components/SearchBar";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Printer } from "lucide-react";

const SupporterLecturer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    // Placeholder data
    const supporters: any[] = [];
    const isPending = false;

    return (
        <MainLayout isGreeting={false} titlePage="Kegiatan Pendukung">
            {/* Main Table Section */}
            <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
                        <select
                            className="rounded px-2 py-1 lg:text-base text-xs border border-black/50 shadow-md focus:outline-none w-full sm:w-32 bg-white text-gray-700 h-10"
                        >
                            <option value="Semua">-- Semua --</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Selesai">Selesai</option>
                        </select>
                        <div className="w-full sm:max-w-md flex-1">
                            <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari Kegiatan Pendukung" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-initial justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded flex items-center gap-2 transition h-10 shadow-sm">
                            <Printer size={16} /> Cetak
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
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Periode</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Jenis</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Nama Kegiatan</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Unit</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Instansi</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Mulai</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">Selesai</th>
                                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supporters.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center font-semibold text-gray-500 border border-gray-500">
                                        Data kosong
                                    </td>
                                </tr>
                            ) : (
                                supporters.map((item, index) => (
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

export default SupporterLecturer;
