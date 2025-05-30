import React, { useState } from "react"
import { Search, Plus, Trash, ChevronLeft, ChevronRight, ArrowLeft, Save, RefreshCw } from "lucide-react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import TableCheckbox from "../../../components/lecturer/TableCheckbox";

const ConsultationLecturer = () => {
  const [id, setId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);

  const tableHead = ["", "NIM", "Nama Mahasiswa", "NIP", "Nama Pembimbing", "Topik", "Post Terakhir", "KRS disetujui", "Status", "Aksi"]
    const data = [
        {
          id: 1,
          checked: "",
          nim: "221106042",
          mahasiswa: "Ridho Fatan",
          nip: "119123123",
          pembimbing: "Fitrah Satrya",
          topik: "akademik",
          post: "kemaren",
          krs: "disetujui",
          status: "aktif",
          aksi: ""
        },
        {
          id: 2,
          checked: "",
          nim: "221106042",
          mahasiswa: "Ridho Fatan",
          nip: "119123123",
          pembimbing: "Fitrah Satrya",
          topik: "akademik",
          post: "kemaren",
          krs: "disetujui",
          status: "aktif",
          aksi: ""
        }
      ];

    const statusOptions = ["Semua", "disetujui", "ditolak"]

    const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

    return (
    <MainLayout
        titlePage={"Konsultasi Pembimbing"}
        isGreeting={false}
    >
        {id || showAddForm ? 
            (
                <div className="w-full mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex mb-4 justify-end">
                        <div className="flex px-4 gap-4">
                            <button
                                onClick={() => {setId(null); setShowAddForm(false)}}
                                className="bg-primary-yellow flex rounded-sm pl-2 cursor-pointer pr-4 py-1 items-center ml-auto text-white"
                            >
                                <ChevronLeft size={16} className="mr-4" />
                                Kembali ke daftar
                            </button>
                            <button
                                onClick={() => {setId(null); setShowAddForm(false)}}
                                className="bg-primary-blueSoft flex rounded-sm pl-2 cursor-pointer pr-4 py-1 items-center ml-auto text-white"
                            >
                                <Save size={16} className="mr-4" />
                                Simpan
                            </button>
                        </div>
                    </div>
                    {showAddForm ? (
                    //   <FormAddAnnouncement
                    //     onCancel={() => setShowAddForm(false)}
                    //     onSubmit={() => setShowAddForm(false)}
                    //   />
                    <div className="w-full flex justify-center items-center">
                        FORM
                    </div>
                    ) : (
                    //   <DetailAnnouncement data={dataDetail} />
                    <div className="w-full flex justify-center items-center">
                        <h1>DETAIL</h1>
                    </div>
                    )}
                </div>
            )
        :
        (
            <>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            <select className="rounded px-3 text-primary-brown border-primary-brown border p-1">
                                {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>
                            <div className="flex">
                                <input
                                type="search"
                                placeholder="Cari..."
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
                        <div className="flex">
                            <button 
                              className="ml-2 bg-primary-blueSoft cursor-pointer text-sm text-white  px-4 rounded flex items-center justify-center"
                              onClick={() => setShowAddForm(true)}
                            >
                                <Plus color="white" size={16} className="mr-2" />
                                Tambah
                            </button>
                            <button onClick={() => confirm("Apakah anda yakin ingin menghapus pengumuman ini?")} className="ml-2 cursor-pointer bg-red-400 text-sm text-white  px-4 rounded flex items-center justify-center">
                                <Trash color="white" size={16} className="mr-2" />
                                Hapus
                            </button>
                        </div>
                    </div>
                    <TableCheckbox
                        tableHead={tableHead}
                        data={data}
                        error={"Data Kosong"}
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

export default ConsultationLecturer