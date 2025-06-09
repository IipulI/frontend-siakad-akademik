import React, { useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import TableSetting from "../../../components/admin-academic/setting/TableSetting"
import { Plus, Search } from "lucide-react"
import { RefreshCw } from "lucide-react"
import { Pagination } from "../../../components/admin-academic/Pagination"

const PeriodAdminAcademic = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const tableHead = ["Tahun", "Kode Periode", "Nama Periode", "Tanggal Mulai", "Tanggal Selesai", "Status", "Aksi"]
    const data = [
        {
            id: 1,
            tahun: "2024",
            kodePeriode: "20242",
            namaPeriode: "2024 Genap",
            tanggalMulai: "1 Sep 2024",
            tanggalSelesai: "31 Des 2024",
            status: "Aktif",
            aksi: ""
        },
        {
            id: 2,
            tahun: "2024",
            kodePeriode: "20242",
            namaPeriode: "2024 Genap",
            tanggalMulai: "1 Sep 2024",
            tanggalSelesai: "31 Des 2024",
            status: "Nonaktif",
            aksi: ""
        },
        {
            id: 3,
            tahun: "2024",
            kodePeriode: "20242",
            namaPeriode: "2024 Genap",
            tanggalMulai: "1 Sep 2024",
            tanggalSelesai: "31 Des 2024",
            status: "Nonaktif",
            aksi: ""
        },
        {
            id: 4,
            tahun: "2024",
            kodePeriode: "20242",
            namaPeriode: "2024 Genap",
            tanggalMulai: "1 Sep 2024",
            tanggalSelesai: "31 Des 2024",
            status: "Nonaktif",
            aksi: ""
        }
    ]

    return (
        <MainLayout
            titlePage={"Periode Akademik"}
            isGreeting={false}
        >
            <div className="w-full mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-between">
                    <div className="flex gap-4 p-2">
                        <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-slate-300 border p-1">
                            <option value={"semua"}>-Semua-</option>
                        </select>
                        <div className="flex">
                            <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded border border-slate-300"
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
                <div className="overflow-auto">
                    <TableSetting
                        tableHead={tableHead}
                        data={data}
                        error={"error"}
                        // setId={setId}
                    />
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={1000}
                    onPageChange={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    totalRows={65}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>
        </MainLayout>

    )
}

export default PeriodAdminAcademic