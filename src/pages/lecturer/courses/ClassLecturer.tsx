import React, { useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import TableClass from "../../../components/lecturer/TableClass";
import { useDebounce } from "../../../hooks/useDebounce";
import SelectOption from "../../../components/lecturer/SelectOption";
import SearchBar from "../../../components/SearchBar";
import { useClassList } from "../../../hooks/lecturer/useFetchClass";
import { useAcademicPeriodDropdown, useStudyProgramDropdown } from "../../../hooks/lecturer/useFetchDropdown";
import { IStudyProgram } from "../../../types/dropdown";
import { IAcademicPeriod } from "../../../types/common.types";

const ClassLecturer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    periode: "",
    prodi: "",
    kurikulum: "",
    sistem: ""
  });
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  
  const { data: periodeAkademikDropdown } = useAcademicPeriodDropdown()
  const { data: programStudiDropdown } = useStudyProgramDropdown()

  const { isPending, data } = useClassList(debouncedSearch, filters.periode, filters.prodi, filters.sistem, currentPage, rowsPerPage)
  
  const periodeOptions = periodeAkademikDropdown?.data?.map((item: IAcademicPeriod) => ({
    value: item.id,
    label: item.nama || item.namaPeriode,
  })) || [];

  const studyProgramOptions = programStudiDropdown?.data?.map((item: IStudyProgram) => ({
    value: item.id,
    label: item.namaProgramStudi,
  })) || [];
  
  periodeOptions.unshift({
    value: "",
    label: "Semua"
  })

  studyProgramOptions.unshift({
    value: "",
    label: "Semua"
  })
  
  const options = [{value: "", label: "Semua"}]
  const courseSystemOptions = [{value: "", label: "Semua"}, {value: "Reguler", label: "Reguler"}, {value: "Karyawan", label: "Karyawan"},]


  const filterOptions = [
    { label: "Periode Akademik", key: "periode", options: periodeOptions },
    { label: "Program Studi", key: "prodi", options: studyProgramOptions },
    { label: "Kurikulum", key: "kurikulum", options },
    { label: "Sistem Kuliah", key: "sistem", options: courseSystemOptions },
  ];

    // const statusOptions = ["Semua Status"]

    return (
    <MainLayout
        titlePage={"Kelas Kuliah"}
        isGreeting={false}
    >
                <div className="grid lg:grid-cols-2 mb-4 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
                {filterOptions.map(({label, key, options}) => (
                  <SelectOption
                    key={key}
                    label={label}
                    options={options}
                    value={filters[key]}
                    onChange={(val) => setFilters(prev => ({ ...prev, [key]: val }))}
                  />
                ))}
                </div>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            {/* <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-primary-brown border p-1">
                                {statusOptions.map(value => (
                                  <option key={value} value={value}>{value}</option>
                                ))}
                            </select> */}
                            <SearchBar search={search} setSearch={setSearch} isPending={isPending} placeholder="Cari mata kuliah" />
                        </div>
                    </div>
                    <div className="overflow-auto">
                      <TableClass
                          data={isPending ? [] : data?.data}
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
                        totalPages={data?.pagination.totalPages}
                        onPageChange={setCurrentPage}
                        rowsPerPage={rowsPerPage}
                        totalRows={data?.pagination.totalItems}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                  )}
                </div>
    </MainLayout>
    )
}

export default ClassLecturer