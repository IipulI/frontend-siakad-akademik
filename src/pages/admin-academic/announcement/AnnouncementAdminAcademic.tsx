import React, { useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import FilterDropdown from "../../../components/admin-academic/FilterDropdown"
import { Search, Plus, Trash, ChevronLeft, ChevronRight, ArrowLeft, Save } from "lucide-react"
import { TableAnnouncement } from "../../../components/admin-academic/announcement/TableAnnouncement"
import DetailAnnouncement from "../../../components/schedule/DetailAnnouncement"
import FormAddAnnouncement from "../../../components/admin-academic/announcement/FormAddAnnouncement"
import { Pagination } from "../../../components/admin-academic/Pagination"

const AnnouncementAdminAcademic = () => {
  const [id, setId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);

    const data = [
        {
          id: 1,
          tanggal: "6 Mar 2025, 08:53:10",
          penulis: "Shesil Varista Dea Wulandari",
          judul: "[NEW] Cara Bayar Kuliah Melalui Shopee",
          aktif: true,
          prioritas: true,
        },
        {
          id: 2,
          tanggal: "19 Nov 2024, 14:54:13",
          penulis: "Shesil Varista Dea Wulandari",
          judul: "Cara bayar kuliah melalui Tokopedia",
          aktif: true,
          prioritas: false,
        },
        {
          id: 3,
          tanggal: "13 Nov 2024, 18:25:06",
          penulis: "Shesil Varista Dea Wulandari",
          judul: "Cara bayar kuliah melalui Bank Muamalat",
          aktif: false,
          prioritas: false,
        },
      ];

    const statusOptions = ["Semua Status", "Aktif", "Prioritas"]

    const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

    return (
    <MainLayout
        titlePage={"Pengumuman"}
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
                      <FormAddAnnouncement
                        onCancel={() => setShowAddForm(false)}
                        onSubmit={() => setShowAddForm(false)}
                      />
                    ) : (
                      <DetailAnnouncement data={dataDetail} />
                    )}
                </div>
            )
        :
        (
            <>
                <FilterDropdown title={"Status"} options={statusOptions} />
                <div className="w-full mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex px-4 justify-between">
                        <div className="flex">
                            <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded shadow-md border border-slate-300"
                            />
                            <button className="ml-2 bg-primary-yellow w-8 rounded flex items-center justify-center">
                                <Search color="white" size={18} />
                            </button>
                        </div>
                        <div className="flex">
                            <button 
                              className="ml-2 bg-primary-green cursor-pointer text-sm text-white  px-4 rounded flex items-center justify-center"
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
                    <div className="overflow-auto">
                        <TableAnnouncement
                            data={data}
                            error={"error"}
                            setId={setId}
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
            </>
        )
        }
    </MainLayout>
    )
}

export default AnnouncementAdminAcademic