import React, { useState, useMemo } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TableCourseManagement } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash } from "lucide-react"; // Make sure Eye and Pencil are imported if used in TableCourseManagement
import { Eye, Pencil, Trash2 } from "lucide-react"; // Add these imports
import { getCourseData, useDeleteCourse } from "../../../hooks/academic/useCourseManagement.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import FilterDropdown from "../../../components/admin-academic/FilterDropdown.tsx";
import { ToastNotif, showToast } from "../../../components/admin-finance/Toastify.tsx";

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
    data: courseData = [],
    isLoading: isCourseLoading,
    error: courseError,
  } = getCourseData({
    tahunKurikulum: selectedCurriculum,
    jenisMataKuliah: selectedCourseType,
    programStudi: selectedProdi,
  });
  const { data: curriculumData = [], isLoading: isCurriculumLoading, error: curriculumError } = getCurriculumYear();
  const { data: programStudiData = [], isLoading: isProdiLoading, error: prodiError } = getProdi();

  const deleteMutation = useDeleteCourse();

  // --- filtered function ---
  const filteredData = useMemo(() => {
    return courseData
      .filter((item) => {
        return selectedCurriculum === "all" || item.tahunKurikulum === selectedCurriculum;
      })
      .filter((item) => {
        return selectedProdi === "all" || item.programStudi === selectedProdi;
      })
      .filter((item) => {
        if (selectedCourseType === "all") return true;
        if (selectedCourseType === "Wajib") return item.opsiMataKuliah === true;
        if (selectedCourseType === "Pilihan") return item.opsiMataKuliah === false;
        return true;
      })

      .filter((item) => {
        return item.namaMataKuliah.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [courseData, selectedCurriculum, selectedCourseType, selectedProdi, searchTerm]);

  // --- select handler ---
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((item) => item.id));
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
  const handleDelete = async (id: string) => {
    if (!id) {
      showToast.error("ID tidak valid.");
      return;
    }

    const confirm = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirm) return;

    try {
      const toastId = showToast.loading("Menghapus data...");

      await deleteMutation.mutateAsync(id);

      showToast.update(toastId, {
        render: "Berhasil menghapus data.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Refresh data setelah delete
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
    } catch (error) {
      showToast.dismiss();
      showToast.error("Gagal menghapus data.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showToast.info("Tidak ada data yang dipilih untuk dihapus.");
      return;
    }

    const confirm = window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`);
    if (!confirm) return;

    const toastId = showToast.loading(`Menghapus ${selectedIds.length} data...`);
    try {
      // Create an array of promises for each deletion
      const deletePromises = selectedIds.map((id) => deleteMutation.mutateAsync(id));

      // Wait for all promises to resolve
      await Promise.all(deletePromises);

      showToast.update(toastId, {
        render: `Berhasil menghapus ${selectedIds.length} data.`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setSelectedIds([]); // Clear selection after successful deletion
      queryClient.invalidateQueries({ queryKey: ["courseData"] }); // Refresh data
    } catch (error: any) {
      showToast.dismiss();
      handleMutationError(error); // Use your existing error handler for better messages
      showToast.error("Gagal menghapus beberapa data. Periksa konsol untuk detail.");
      // You might want to invalidate queries even on partial failure or show a specific error
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
    }
  };

  const handleAdd = () => {
    navigate(AdminAcademicRoute.courseManagement.addCourse);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
    queryClient.refetchQueries({ queryKey: ["courseData"] });
  };

  // --- Pagination logic ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <MainLayout isGreeting={false} titlePage="Mata Kuliah" className="">
      <ToastNotif />
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
                <option key={item.id} value={item.namaProgramStudi}>
                  {item.namaProgramStudi}
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
              onClick={handleBulkDelete} // Call the new handler
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
            data={paginatedData}
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
          totalRows={filteredData.length}
          totalPages={totalPages}
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
