import React, { useMemo, useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import { useDebounce } from "../../../hooks/useDebounce";
import { useCourseList } from "../../../hooks/lecturer/useFetchCourse";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { getKelompokMataKuliah } from "../../../hooks/academic/useObeManagement";
import { Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";

const JENIS_MK_OPTIONS = ["Kuliah", "Praktikum", "Praktik Lapangan", "Simulasi"];

const StatusBadge = ({ terisi }: { terisi: boolean }) =>
    terisi ? (
        <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs block text-center">Sudah Terisi</span>
    ) : (
        <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded text-xs block text-center">Belum Terisi</span>
    );

const CourseLecturer = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tempSearch, setTempSearch] = useState("");
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState<"all" | "kode" | "nama">("all");

    // --- Filter states (nyimpen ID, bukan label -- dikirim ke server) ---
    const [selectedTahunKurikulumId, setSelectedTahunKurikulumId] = useState("all");
    const [selectedProdiId, setSelectedProdiId] = useState("all");
    // Jenis Mata Kuliah & Kelompok Mata Kuliah belum didukung filter di server
    // (sama kayak Manajemen OBE) -- Jenis MK disaring di FE dari data 1
    // halaman yang lagi tampil, Kelompok MK baru sebatas dropdown pilihan.
    const [selectedJenisMk, setSelectedJenisMk] = useState("all");
    const [selectedKelompokId, setSelectedKelompokId] = useState("all");

    const debouncedSearch = useDebounce(search, 1000);

    const { data: prodiData = [] } = getProdi();
    const { data: curriculumData = [] } = getCurriculumYear();
    const { data: kelompokMataKuliahResult } = getKelompokMataKuliah();
    const kelompokMataKuliahData = kelompokMataKuliahResult?.items || [];

    // FIX 2026-08-19: sebelumnya filter (Tahun Kurikulum/Prodi) cuma nyaring
    // 1 halaman data yang udah ke-fetch (client-side), jadi kelihatan datanya
    // "ilang" (mis. cuma 1 baris) padahal total datanya tetap 90 -- yang
    // ke-filter cuma isi 1 halaman itu, bukan keseluruhan data server. Sekarang
    // prodiId/tahunKurikulumId dikirim ke server, pagination-nya jadi akurat.
    const { isPending, data, error } = useCourseList(
        currentPage,
        debouncedSearch,
        rowsPerPage,
        selectedProdiId === "all" ? undefined : selectedProdiId,
        selectedTahunKurikulumId === "all" ? undefined : selectedTahunKurikulumId,
        debouncedSearch && searchField !== "all" ? searchField : undefined
    )

    const rawTableData: any[] = isPending ? [] : data?.data || [];
    const tableData = useMemo(
        () => rawTableData.filter((row: any) => selectedJenisMk === "all" || (row.jenisMk || row.jenisMataKuliah) === selectedJenisMk),
        [rawTableData, selectedJenisMk]
    );
    const pagination = data?.pagination;
    // Backend mengembalikan "totalPage" (lihat CoursePagination di useCourseManagement.ts),
    // "totalPages" tetap dicek untuk jaga-jaga jika endpoint ini memakai nama lain.
    const totalPages = pagination?.totalPages || pagination?.totalPage || 1;
    const totalRows = pagination?.totalItems || 0;

    const handleFilterChange = (patch: { tahunKurikulumId?: string; prodiId?: string; jenisMk?: string; kelompokId?: string }) => {
        if (patch.tahunKurikulumId !== undefined) setSelectedTahunKurikulumId(patch.tahunKurikulumId);
        if (patch.prodiId !== undefined) setSelectedProdiId(patch.prodiId);
        if (patch.jenisMk !== undefined) setSelectedJenisMk(patch.jenisMk);
        if (patch.kelompokId !== undefined) setSelectedKelompokId(patch.kelompokId);
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(tempSearch);
        setCurrentPage(1);
    };

    const handleLihat = (row: any) => {
        localStorage.setItem("id_mata_kuliah", row.id);
        navigate(LecturerRoute.courses.detailCourse);
    };

    return (
        <MainLayout isGreeting={false} titlePage="Mata Kuliah">
            <div className="p-0 min-h-screen">
                <div className="mb-6 mt-[-10px]">
                    <p className="text-gray-500 text-sm">Daftar Mata Kuliah yang Diampu</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Tahun Kurikulum</label>
                            <div className="flex-1">
                                <SearchableSelect
                                    value={selectedTahunKurikulumId}
                                    onChange={(v) => handleFilterChange({ tahunKurikulumId: v })}
                                    placeholder="-- Semua Tahun Kurikulum --"
                                    searchPlaceholder="Cari tahun kurikulum..."
                                    options={[{ value: "all", label: "-- Semua Tahun Kurikulum --" }, ...curriculumData.map((c: any) => ({ value: c.id, label: c.tahun }))]}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Jenis Mata Kuliah</label>
                            <div className="flex-1">
                                <SearchableSelect
                                    value={selectedJenisMk}
                                    onChange={(v) => handleFilterChange({ jenisMk: v })}
                                    placeholder="-- Semua Jenis Mata Kuliah --"
                                    searchPlaceholder="Cari jenis mata kuliah..."
                                    options={[{ value: "all", label: "-- Semua Jenis Mata Kuliah --" }, ...JENIS_MK_OPTIONS.map((j) => ({ value: j, label: j }))]}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Prodi Pengampu</label>
                            <div className="flex-1">
                                <SearchableSelect
                                    value={selectedProdiId}
                                    onChange={(v) => handleFilterChange({ prodiId: v })}
                                    placeholder="-- Semua Program Studi --"
                                    searchPlaceholder="Cari program studi..."
                                    options={[{ value: "all", label: "-- Semua Program Studi --" }, ...prodiData.map((p: any) => ({ value: p.id, label: p.nama }))]}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Kelompok Mata Kuliah</label>
                            <div className="flex-1">
                                <SearchableSelect
                                    value={selectedKelompokId}
                                    onChange={(v) => handleFilterChange({ kelompokId: v })}
                                    placeholder="-- Semua Kelompok Mata Kuliah --"
                                    searchPlaceholder="Cari kelompok mata kuliah..."
                                    options={[{ value: "all", label: "-- Semua Kelompok Mata Kuliah --" }, ...kelompokMataKuliahData.map((k: any) => ({ value: k.id, label: k.nama }))]}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
                    <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-auto gap-2 mb-6 border-b border-gray-100 pb-4">
                        <select
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value as "all" | "kode" | "nama")}
                            className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                        >
                            <option value="all">-- Semua --</option>
                            <option value="kode">Kode Mata Kuliah</option>
                            <option value="nama">Nama Mata Kuliah</option>
                        </select>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Cari Mata Kuliah"
                                className="p-2 pl-3 border border-gray-300 rounded-l-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                                value={tempSearch}
                                onChange={(e) => setTempSearch(e.target.value)}
                            />
                            <button type="submit" className="bg-primary-green text-white p-2.5 rounded-r-md flex items-center justify-center hover:opacity-90 cursor-pointer">
                                <Search size={16} />
                            </button>
                        </div>
                    </form>

                    <div className="overflow-x-auto border border-gray-200 rounded-sm mb-4">
                        <table className="min-w-full bg-white border-collapse">
                            <thead>
                                <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                                    <th className="p-3 border border-gray-300 w-24" rowSpan={2}>Kurikulum</th>
                                    <th className="p-3 border border-gray-300 w-28" rowSpan={2}>Kode MK</th>
                                    <th className="p-3 border border-gray-300 text-left" rowSpan={2}>Nama Mata Kuliah</th>
                                    <th className="p-3 border border-gray-300 w-16" rowSpan={2}>SKS</th>
                                    <th className="p-3 border border-gray-300 w-24" rowSpan={2}>Jenis MK</th>
                                    <th className="p-3 border border-gray-300 text-left" rowSpan={2}>Prodi Pengampu</th>
                                    <th className="p-2 border border-gray-300 w-72" colSpan={3}>Status Pengisian</th>
                                    <th className="p-3 border border-gray-300 w-20" rowSpan={2}>Aksi</th>
                                </tr>
                                <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                                    <th className="p-2 border border-gray-300">RPS</th>
                                    <th className="p-2 border border-gray-300">CPL</th>
                                    <th className="p-2 border border-gray-300">CPMK</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-semibold text-gray-700 text-center">
                                {isPending ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-gray-400 italic">Memuat data...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-red-500">Gagal memuat data mata kuliah.</td>
                                    </tr>
                                ) : tableData.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-gray-400 italic">Data tidak ditemukan.</td>
                                    </tr>
                                ) : (
                                    tableData.map((row: any) => (
                                        <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-200">
                                            <td className="p-3 border border-gray-200">{row.kurikulum || row.tahunKurikulum || "-"}</td>
                                            <td className="p-3 border border-gray-200">{row.kodeMk || row.kodeMataKuliah}</td>
                                            <td className="p-3 border border-gray-200 text-left font-normal text-gray-800">{row.namaMataKuliah}</td>
                                            <td className="p-3 border border-gray-200">{row.sks ?? row.sksTatapMuka}</td>
                                            <td className="p-3 border border-gray-200">{row.jenisMk || row.jenisMataKuliah || "Kuliah"}</td>
                                            <td className="p-3 border border-gray-200 text-left font-normal">{row.prodiPengampu || row.programStudi}</td>
                                            <td className="p-2 border border-gray-200"><StatusBadge terisi={!!row.statusPengisian?.isRpsTerisi} /></td>
                                            <td className="p-2 border border-gray-200"><StatusBadge terisi={!!row.statusPengisian?.isCplTerisi} /></td>
                                            <td className="p-2 border border-gray-200"><StatusBadge terisi={!!row.statusPengisian?.isCpmkTerisi} /></td>
                                            <td className="p-3 border border-gray-200">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => handleLihat(row)}
                                                        className="bg-primary-blueSoft hover:opacity-90 text-white p-1.5 rounded flex items-center justify-center"
                                                        title="Lihat Detail Mata Kuliah"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isPending && !error && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            rowsPerPage={rowsPerPage}
                            totalRows={totalRows}
                            onRowsPerPageChange={setRowsPerPage}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

export default CourseLecturer