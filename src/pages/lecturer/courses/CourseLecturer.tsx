import React, { useState } from "react"
import { Search,  ChevronLeft, Save, RefreshCw, Printer } from "lucide-react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import TableCheckbox from "../../../components/lecturer/TableCheckbox";

const CourseLecturer = () => {
  const [id, setId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    const tableHead = ["", "Kurikulum", "Kode", "Nama", "SKS", "Jenis MK", "Prodi Pengampu", "Aksi"]

    const data = [
        
      ];

    // const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

    return (
    <MainLayout
        titlePage={"Mata Kuliah"}
        isGreeting={false}
    >
        {id ? 
            (
                <div className="w-full mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex mb-4 justify-end">
                        <button
                            onClick={() => {setId(null)}}
                            className="bg-primary-yellow mx-4 flex rounded-sm pl-2 cursor-pointer pr-4 py-1 items-center ml-auto text-white"
                        >
                            <ChevronLeft size={16} className="mr-4" />
                            Kembali ke daftar
                        </button>
                    </div>
                    {/* <DetailAnnouncement data={dataDetail} /> */}
                    <div className="w-full flex justify-center items-center">
                        <h1>DETAIL</h1>
                    </div>
                    
                </div>
            )
        :
        (
            <>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-yellow">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-primary-brown border p-1">
                                <option value={"semua"}>-Semua-</option>
                            </select>
                            <div className="flex">
                                <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded shadow-md border border-black/50"
                                />
                                <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                                    <Search color="white" size={20} />
                                </button>
                                <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
                                    <RefreshCw color="white" size={20} />
                                </button>
                            </div>
                        </div>
                        <button className="bg-primary-blueSoft text-white flex items-center text-xs lg:text-base rounded px-4 py-1">
                            <Printer size={16} className="mr-2" />
                            Cetak
                        </button>
                    </div>
                    <TableCheckbox
                        tableHead={tableHead}
                        data={data}
                        error={"Data kosong"}
                        setId={setId}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={1000}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        totalRows={65}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                </div>
            </>
        )
        }
    </MainLayout>
    )
}

export default CourseLecturer