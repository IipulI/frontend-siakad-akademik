import React, { useState } from "react"
import { Search, RefreshCw } from "lucide-react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import TableLecturer from "../../../components/lecturer/TableLecturer";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import DetailClassLecturer from "./DetailClassLecturer";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index"

const ClassLecturer = () => {
  const [id, setId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filterOptions = [
    {
      options: [{ value: "", label: "2025 Ganjil" }],
      label: "Periode Akademik"
    },
    {
      options: [{ value: "", label: "-- Semua Status Pembimbing --" }],
      label: "Status Pembimbing"
    },
    {
      options: [{ value: "", label: "-- Semua Semester --" }],
      label: "Semester"
    },
    {
      options: [{ value: "", label: "Universitas Ibn Khaldun" }],
      label: "Unit kerja"
    },
    {
      options: [{ value: "", label: "-- Semua Status KRS --" }],
      label: "Status KRS"
    },
    {
      options: [{ value: "", label: "-- Semua Status Mahasiswa --" }],
      label: "Status Mahasiswa"
    },
    {
      options: [{ value: "", label: "-- Semua Angkatan --" }],
      label: "Angkatan"
    }
  ];

  const tableHead = ["Nama Mahasiswa", "Judul Tugas Akhir", "Topik", "Nama Pembimbing", "Tanggal Pengajuan", "Status", "Aksi"]

  // const { isPending, data, isError } = useQuery({
  //   queryKey: ['kelas-kuliah'],
  //   queryFn: async () => {
  //     // const separator = dateQuery ? "&" : ""
  //     return await Api.get(`/dosen/kelas-kuliah?page=${currentPage}`)
  //   },
  // })

  const data = [
    {
      id: 1,
      mahasiswa: "Ridho Fatan",
      judul: "Tugas Akhir",
      topik: "akademik",
      pembimbing: "Fitrah Satrya",
      tanggal: "18-05-2025",
      status: "disetujui",
      aksi: ""
    }
  ];


    const statusOptions = ["Semua Status", "Aktif", "Prioritas"]

    // const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

    return (
    <MainLayout
        titlePage={"Kelas Kuliah"}
        isGreeting={false}
    >

        {id ? 
            (
                <DetailClassLecturer setId={setId} />
            )
        :
        (
            <>
                <div className="grid xl:grid-cols-3 mb-4 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
                    {filterOptions.map((filter, index) => (
                        <InputFilter 
                            key={index}
                            options={filter.options} 
                            label={filter.label} 
                        />
                    ))}
                </div>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
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

export default ClassLecturer