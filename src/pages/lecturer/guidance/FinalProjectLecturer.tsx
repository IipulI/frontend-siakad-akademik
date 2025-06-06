import React, { useState } from "react"
import { Search,  ChevronLeft, Save, RefreshCw } from "lucide-react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import TableLecturer from "../../../components/lecturer/TableLecturer";

const FinalProjectLecturer = () => {
  const [id, setId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    const tableHead = ["Nama Mahasiswa", "Prodi dan Periode Masuk", "Judul Tugas Akhir", "Dosen Pembimbing dan Penguji", "Tahap Tugas Akhir", "Nilai", "Status", "Aksi"]

    const data = [
        {
          id: 1,
          mahasiswa: "Ridho Fatan",
          prodi: "Teknik Informatika",
          judul: "Tugas Akhir",
          dosen: "Fitrah Satrya",
          tahap: "Tahap 1",
          nilai: "80",
          status: "disetujui",
          aksi: ""
        }
      ];

    const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

    return (
    <MainLayout
        titlePage={"Tugas Akhir"}
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
                            <select className="rounded px-3 text-primary-brown border-primary-brown border p-1">
                                <option value={"semua"}>-Semua-</option>
                            </select>
                            <div className="flex">
                                <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                className="px-2 py-1 w-70 rounded shadow-md border border-black/50"
                                />
                                <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                                    <Search color="white" size={20} />
                                </button>
                                <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
                                    <RefreshCw color="white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <TableLecturer
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

export default FinalProjectLecturer