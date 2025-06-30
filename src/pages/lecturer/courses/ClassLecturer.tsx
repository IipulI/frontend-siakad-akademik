import React, { useEffect, useState } from "react"
import { Search, RefreshCw } from "lucide-react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index"
import TableClass from "../../../components/lecturer/TableClass";
import { useDebounce } from "../../../hooks/useDebounce";
import SelectOption from "../../../components/lecturer/SelectOption";

const ClassLecturer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const options = [{value: "Semua", label: "Semua"}]


  const debouncedSearch = useDebounce(search, 1000);

  const { data: periodeAkademikDropdown } = useQuery({
    queryKey: ["/periode-akademik/dropdown"],
    queryFn: () => Api.get(`/periode-akademik/dropdown`),
  });


  const { isPending, data } = useQuery({
    queryKey: ['dosen/kelas-kuliah', currentPage, debouncedSearch, selectedPeriode],
    queryFn: async () => {
      return await Api.get(`/dosen/kelas-kuliah?page=${currentPage}&keyword=${debouncedSearch}&periodeAkademik=${selectedPeriode}`)
    },
  })

  const periodeOptions = periodeAkademikDropdown?.data?.data?.map((item: any) => ({
    value: item.namaPeriode,
    label: item.namaPeriode,
  })) || [];

  periodeOptions.unshift({
    value: "",
    label: "Semua"
  })

    const statusOptions = ["Semua Status"]

    return (
    <MainLayout
        titlePage={"Kelas Kuliah"}
        isGreeting={false}
    >
                <div className="grid lg:grid-cols-2 mb-4 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
                    <SelectOption
                      label="Periode Akademik"
                      options={periodeOptions}
                      value={selectedPeriode}
                      onChange={setSelectedPeriode}
                    />
                    <SelectOption
                      label="Prodi Pengampu"
                      options={options}
                      value={selectedOption}
                      onChange={setSelectedOption}
                    />
                    <SelectOption
                      label="Periode Sebaran"
                      options={options}
                      value={selectedOption}
                      onChange={setSelectedOption}
                    />
                    <SelectOption
                      label="Kurikulum"
                      options={options}
                      value={selectedOption}
                      onChange={setSelectedOption}
                    />
                    <SelectOption
                      label="Sistem Kuliah"
                      options={options}
                      value={selectedOption}
                      onChange={setSelectedOption}
                    />
                    <SelectOption
                      label="Jenis Status"
                      options={options}
                      value={selectedOption}
                      onChange={setSelectedOption}
                    />
                </div>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-primary-brown border p-1">
                                {statusOptions.map(value => (
                                  <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                            <div className="flex">
                                <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded shadow-md border border-black/50"
                                />
                                <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                                    <Search color="white" size={20} />
                                </button>
                                <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
                                    <RefreshCw className={`${isPending ? "animate-spin" : ""}`} color="white" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-auto">
                      <TableClass
                          data={isPending ? [] : data?.data.data}
                          error={"Data kosong"}
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
    </MainLayout>
    )
}

export default ClassLecturer