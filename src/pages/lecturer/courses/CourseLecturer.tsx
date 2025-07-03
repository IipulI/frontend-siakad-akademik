import React, { useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";
import TableCourseLecturer from "../../../components/lecturer/TableCourseLecturer";
import SearchBar from "../../../components/SearchBar";
import { useCourseList } from "../../../hooks/lecturer/useFetchCourse";

const CourseLecturer = () => {
    const [id, setId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 1000);

    const { isPending, data, error } = useCourseList(currentPage, debouncedSearch, rowsPerPage)

    const tableData = isPending ? [] : data?.data || [];
    const pagination = data?.pagination;
    const totalPages = pagination?.totalPages || 1;
    const totalRows = pagination?.totalItems || 0;

    return (
    <MainLayout
        titlePage={"Mata Kuliah"}
        isGreeting={false}
    >
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-yellow">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            {/* <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-primary-brown border p-1">
                                <option value={"semua"}>-Semua-</option>
                            </select> */}
                            <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari mata kuliah" />
                            </div>
                    </div>
                    <div className="overflow-auto">
                        <TableCourseLecturer
                            data={tableData}
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