import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TableCourseManagement } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash, Filter } from "lucide-react";
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
    <MainLayout isGreeting={false} titlePage="Mata Kuliah" subTitle="Kurikulum & Mata Kuliah" className="">
      {/* Filter Card */}
      <div className="w-full bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-yellow mb-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-xs md:text-sm">
          <Filter size={16} className="text-primary-yellow shrink-0" />
          <span>Filter Mata Kuliah</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight">Tahun Kurikulum</label>
            <select
              className="w-full bg-white border border-slate-300 text-slate-700 font-medium text-xs rounded-lg focus:ring-1 focus:ring-primary-green focus:border-primary-green px-2.5 py-1.5 transition-all shadow-2xs hover:border-slate-400"
              value={selectedCurriculum}
              onChange={handleCurriculumChange}
            >
              <option value="all">-- Semua Tahun --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.tahun}>
                  {item.tahun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight">Jenis Mata Kuliah</label>
            <select
              className="w-full bg-white border border-slate-300 text-slate-700 font-medium text-xs rounded-lg focus:ring-1 focus:ring-primary-green focus:border-primary-green px-2.5 py-1.5 transition-all shadow-2xs hover:border-slate-400"
              value={selectedCourseType}
              onChange={handleCourseTypeChange}
            >
              <option value="all">-- Semua Jenis --</option>
              <option value="Wajib">Wajib</option>
              <option value="Pilihan">Pilihan</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight">Unit / Prodi Pengampu</label>
            <select
              className="w-full bg-white border border-slate-300 text-slate-700 font-medium text-xs rounded-lg focus:ring-1 focus:ring-primary-green focus:border-primary-green px-2.5 py-1.5 transition-all shadow-2xs hover:border-slate-400"
              value={selectedProdi}
              onChange={handleProdiChange}
            >
              <option value="all">-- Semua Program Studi --</option>
              {programStudiData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="w-full bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center">
            <input
              type="search"
              placeholder="Cari Mata Kuliah..."
              className="border border-slate-300 px-3 py-1.5 rounded-l-lg text-xs w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary-green h-[34px]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="button"
              className="bg-primary-yellow hover:bg-[#e89012] text-white px-3.5 h-[34px] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-primary-blueDark hover:bg-[#2e42a8] text-white px-3.5 h-[34px] rounded-r-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="bg-primary-green hover:bg-[#0d5950] text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Tambah</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedIds.length > 0 && window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`)) {
                  selectedIds.forEach((id) => deleteMutation.mutate(id));
                  setSelectedIds([]);
                }
              }}
              disabled={selectedIds.length === 0}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Trash size={15} strokeWidth={2.5} />
              <span>Hapus</span>
              {selectedIds.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {selectedIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {errorMessage && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">{errorMessage}</div>}

        <div className="mt-8 overflow-x-auto">
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
