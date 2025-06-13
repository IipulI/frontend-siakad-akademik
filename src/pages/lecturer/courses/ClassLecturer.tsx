import React, { useState } from "react"
import { Search, RefreshCw } from "lucide-react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import TableLecturer from "../../../components/lecturer/TableLecturer";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import DetailClassLecturer from "./DetailClassLecturer";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index"
import TableCheckbox from "../../../components/lecturer/TableCheckbox";
import TableClass from "../../../components/lecturer/TableClass";

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
      options: [{ value: "", label: "S1 Teknik Informatika" }],
      label: "Prodi Pengampu"
    },
    {
      options: [{ value: "", label: "-- Semua Semester --" }],
      label: "Prodi Sebaran"
    },
    {
      options: [{ value: "", label: "-- Semua Kurikulum --" }],
      label: "Kurikulum"
    },
    {
      options: [{ value: "", label: "-- Semua Sistem Kuliah --" }],
      label: "Sistem Kuliah"
    },
    {
      options: [{ value: "", label: "-- Semua Jenis Status --" }],
      label: "Jenis Status"
    },

  ];

  const { isPending, data } = useQuery({
    queryKey: ['dosen/kelas-kuliah'],
    queryFn: async () => {
      // const separator = dateQuery ? "&" : ""
      return await Api.get(`/dosen/kelas-kuliah?page=${currentPage}`)
    },
  })



    const statusOptions = ["Semua Status", "Aktif", "Prioritas"]

    // const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

    return (
    <MainLayout
        titlePage={"Kelas Kuliah"}
        isGreeting={false}
    >

        {id ? 
            (
                <DetailClassLecturer id={id} setId={setId} />
            )
        :
        (
            <>
                <div className="grid lg:grid-cols-2 mb-4 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
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
                    <div className="overflow-auto">
                      <TableClass
                          data={isPending ? [] : data?.data.data}
                          error={"Data kosong"}
                          setId={setId}
                      />
                    </div>
                    {isPending ? (
                        <div className="flex px-4 w-full items-center justify-between">
                            <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
                            <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
                        </div>
                    )
                  : (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={data?.data.pagination.totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        totalRows={data?.data.pagination.totalItems}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                  )}
                </div>
            </>
        )
        }
    </MainLayout>
    )
}

export default ClassLecturer