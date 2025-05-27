import React, { useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import TableSetting from "../../../components/admin-academic/setting/TableSetting"
<<<<<<< HEAD
import { Plus, Search } from "lucide-react"
import { RefreshCw } from "lucide-react"
import { Pagination } from "../../../components/admin-academic/Pagination"

const YearAdminAcademic = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
=======
import Paging from "../../../components/admin-academic/Paging"
import { Plus, Search } from "lucide-react"
import { RefreshCw } from "lucide-react"

const YearAdminAcademic = () => {
    const [page, setPage] = useState(1)
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    const tableHead = ["Tahun", "Nama Tahun", "Aksi"]
    const data = [
        {
            id: 1,
            tahun: "2025",
            namaTahun: "2025/2026",
            aksi: ""
        },
        {
            id: 2,
            tahun: "2024",
            namaTahun: "2024/2025",
            aksi: ""
        },
        {
            id: 3,
            tahun: "2023",
            namaTahun: "2023/2024",
            aksi: ""
        },
    ]

    return (
        <MainLayout
            titlePage={"Tahun Ajaran"}
            isGreeting={false}
        >
            <div className="max-w-2xl mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-between">
                    <div className="flex gap-4 p-2">
                        <select className="rounded px-3 appearance-none text-primary-brown border-slate-300 border p-1">
                            <option value={"semua"}>-Semua-</option>
                        </select>
                        <div className="flex">
                            <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                className="px-2 py-1 w-60 text-sm rounded border border-slate-300"
                            />
                            <button className="bg-primary-yellow mx-1 w-8 rounded flex items-center justify-center">
                                <Search color="white" size={18} />
                            </button>
                            <button className="bg-primary-blueDark w-8 rounded flex items-center justify-center">
                                <RefreshCw color="white" size={20} />
                            </button>
                        </div>
                    </div>
                    <button 
                        className=" bg-primary-green cursor-pointer my-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                        >
                            <Plus color="white" size={16} className="mr-2" />
                            Tambah
                    </button>
                </div>
                <TableSetting
                    tableHead={tableHead}
                    data={data}
                    error={"error"}
                    // setId={setId}
                />
<<<<<<< HEAD
                <Pagination
                    currentPage={currentPage}
                    totalPages={1000}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    totalRows={65}
                    onRowsPerPageChange={setRowsPerPage}
                />
=======
                <Paging page={page} setPage={setPage} />
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
            </div>
        </MainLayout>

    )
}

export default YearAdminAcademic