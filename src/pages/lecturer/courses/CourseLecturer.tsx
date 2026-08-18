import React, { useMemo, useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";
import TableCourseLecturer from "../../../components/lecturer/TableCourseLecturer";
import SearchBar from "../../../components/SearchBar";
import { useCourseList } from "../../../hooks/lecturer/useFetchCourse";

const getKurikulum = (row: any) => row.tahunKurikulum || row.kurikulum || "";
const getJenisMk = (row: any) => row.jenisMataKuliah || row.jenisMk || "";
const getProdi = (row: any) => row.programStudi || row.prodiPengampu || "";

const CourseLecturer = () => {
    const [id, setId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    // --- Filter states ---
    const [selectedTahunKurikulum, setSelectedTahunKurikulum] = useState("all");
    const [selectedJenisMk, setSelectedJenisMk] = useState("all");
    const [selectedProdi, setSelectedProdi] = useState("all");
    const [selectedKelompok, setSelectedKelompok] = useState("all");

    const debouncedSearch = useDebounce(search, 1000);

    const { isPending, data, error } = useCourseList(currentPage, debouncedSearch, rowsPerPage)

    const tableData = isPending ? [] : data?.data || [];
    const pagination = data?.pagination;
    // Backend mengembalikan "totalPage" (lihat CoursePagination di useCourseManagement.ts),
    // "totalPages" tetap dicek untuk jaga-jaga jika endpoint ini memakai nama lain.
    const totalPages = pagination?.totalPages || pagination?.totalPage || 1;
    const totalRows = pagination?.totalItems || 0;

    // Opsi filter diturunkan dari data yang sudah di-fetch di halaman berjalan
    const tahunKurikulumOptions = useMemo<string[]>(
        () => Array.from<string>(new Set<string>(tableData.map(getKurikulum).filter(Boolean))),
        [tableData]
    );
    const jenisMkOptions = useMemo<string[]>(
        () => Array.from<string>(new Set<string>(tableData.map(getJenisMk).filter(Boolean))),
        [tableData]
    );
    const prodiOptions = useMemo<string[]>(
        () => Array.from<string>(new Set<string>(tableData.map(getProdi).filter(Boolean))),
        [tableData]
    );

    const filteredData = useMemo(
        () =>
            tableData.filter((row: any) => {
                const matchesTahunKurikulum =
                    selectedTahunKurikulum === "all" || getKurikulum(row) === selectedTahunKurikulum;
                const matchesJenisMk = selectedJenisMk === "all" || getJenisMk(row) === selectedJenisMk;
                const matchesProdi = selectedProdi === "all" || getProdi(row) === selectedProdi;
                return matchesTahunKurikulum && matchesJenisMk && matchesProdi;
            }),
        [tableData, selectedTahunKurikulum, selectedJenisMk, selectedProdi]
    );

    return (
    <MainLayout
        titlePage={"Mata Kuliah"}
        isGreeting={false}
    >
                <div className="w-full bg-white p-5 rounded-sm border-t-2 border-primary-yellow mb-4">
                    <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Tahun Kurikulum</label>
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                                value={selectedTahunKurikulum}
                                onChange={(e) => setSelectedTahunKurikulum(e.target.value)}
                            >
                                <option value="all">-- Semua Tahun Kurikulum --</option>
                                {tahunKurikulumOptions.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Jenis Mata Kuliah</label>
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                                value={selectedJenisMk}
                                onChange={(e) => setSelectedJenisMk(e.target.value)}
                            >
                                <option value="all">-- Semua Jenis Mata Kuliah --</option>
                                {jenisMkOptions.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Prodi Pengampu</label>
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                                value={selectedProdi}
                                onChange={(e) => setSelectedProdi(e.target.value)}
                            >
                                <option value="all">-- Semua Program Studi --</option>
                                {prodiOptions.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-semibold text-gray-700 w-36">Kelompok Mata Kuliah</label>
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                                value={selectedKelompok}
                                onChange={(e) => setSelectedKelompok(e.target.value)}
                            >
                                <option value="all">-- Semua Kelompok Mata Kuliah --</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari mata kuliah" />
                            </div>
                    </div>
                    <div className="overflow-auto">
                        <TableCourseLecturer
                            data={filteredData}
                            error={error ? "Gagal memuat data" : "Data kosong"}
                        />
                    </div>
                    {isPending ? (
                        <div className="flex px-4 w-full items-center justify-between">
                            <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
                            <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
                        </div>
                    ) : (
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
    </MainLayout>
    )
}

export default CourseLecturer