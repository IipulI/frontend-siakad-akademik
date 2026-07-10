import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TableCourseManagement } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash } from "lucide-react";
import { getCourseData, useDeleteCourse } from "../../../hooks/academic/useCourseManagement.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import FilterDropdown from "../../../components/admin-academic/FilterDropdown.tsx";

const CourseManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- State Management ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedCourseType, setSelectedCourseType] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");

  // --- queries ---
  const {
    data: courseResponse,
    isLoading: isCourseLoading,
    error: courseError,
  } = getCourseData({
    page: currentPage,
    size: itemsPerPage,
    tahunKurikulum: selectedCurriculum,
    programStudi: selectedProdi,
    jenisMataKuliah: selectedCourseType,
    search: searchTerm,
  });
  const courseData = courseResponse?.data ?? [];
  const coursePagination = courseResponse?.pagination;

  const { data: curriculumData = [], isLoading: isCurriculumLoading, error: curriculumError } = getCurriculumYear();
  const { data: programStudiData = [], isLoading: isProdiLoading, error: prodiError } = getProdi();

  // --- mutation ---
  const deleteMutation = useDeleteCourse();


  // --- select handler ---
  const toggleSelectAll = () => {
    if (selectedIds.length === courseData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(courseData.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- error handling ---
  const handleMutationError = (error: any) => {
    if (error.response?.status === 400) {
      setErrorMessage("Data tidak valid. Periksa kembali input Anda.");
    } else if (error.response?.status === 401) {
      setErrorMessage("Token tidak valid. Silakan login ulang.");
    } else if (error.response?.data?.message) {
      setErrorMessage(`Error: ${error.response.data.message}`);
    } else if (error.message) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  // --- Event Handlers ---
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    navigate(AdminAcademicRoute.courseManagement.addCourse);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // --- Filter Handlers ---
  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurriculum(e.target.value);
    setCurrentPage(1);
  };

  const handleCourseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseType(e.target.value);
    setCurrentPage(1);
  };

  const handleProdiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProdi(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedCurriculum("all");
    setSelectedCourseType("all");
    setSelectedProdi("all");
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ["courseData"] });
  };

  // --- Pagination logic (server-side) ---
  const totalPages = coursePagination?.totalPage ?? 1;
  const totalItems = coursePagination?.totalItems ?? 0;

  return (
    <MainLayout isGreeting={false} titlePage="Mata Kuliah" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown" value={selectedCurriculum} onChange={handleCurriculumChange}>
              <option value="all">-- Semua --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.tahun}>
                  {item.tahun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Jenis Mata Kuliah</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown" value={selectedCourseType} onChange={handleCourseTypeChange}>
              <option value="all">-- Semua --</option>
              <option value="Wajib">Wajib</option>
              <option value="Pilihan">Pilihan</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Unit / Prodi Pengampu</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown md:w-10 w-10" value={selectedProdi} onChange={handleProdiChange}>
              <option value="all">-- Semua --</option>
              {programStudiData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* <FilterDropdown title="Unit / Prodi Pengampu" options={programStudiData.map((item) => item.namaProgramStudi)} /> */}
        </div>
      </div>

      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-green mt-8 ">
        <div className="flex flex-col md:flex-row px-4 py-2 gap-4 border-b-2">
          <div className="flex">
            <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-1 w-72 rounded-l-md border border-black/50" value={searchTerm} onChange={handleSearchChange} />
            <button className="bg-primary-yellow w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button onClick={handleRefresh} className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
              <RefreshCw color="white" size={20} />
            </button>
          </div>
          <div className="flex ml-auto gap-2">
            <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white flex items-center cursor-pointer">
              <Plus className="mr-2" size={16} />
              Tambah
            </button>

            <button
              onClick={() => {
                if (selectedIds.length > 0 && window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`)) {
                  selectedIds.forEach((id) => deleteMutation.mutate(id));
                  setSelectedIds([]);
                }
              }}
              className="bg-red-500 rounded py-2 px-4 text-white flex items-center cursor-pointer disabled:opacity-50"
              disabled={selectedIds.length === 0}
            >
              <Trash className="mr-2" size={16} />
              Hapus
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {errorMessage && <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}

        <div className="mt-8">
          <TableCourseManagement
            data={courseData}
            tableHead={["Combo BOX", "Kurikulum", "Kode", "Mata Kuliah", "SKS", "Jenis MK", "Prodi Pengampu", "Aksi"]}
            error="Data tidak ditemukan."
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelect={(id) => {
              if (id === "-1") {
                toggleSelectAll();
              } else {
                toggleSelectOne(id);
              }
            }}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalRows={totalItems}
          totalPages={totalPages}
          rowsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </MainLayout>
  );
};

export default CourseManagement;
