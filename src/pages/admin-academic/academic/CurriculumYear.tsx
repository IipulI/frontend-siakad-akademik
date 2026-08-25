import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQueryClient } from "@tanstack/react-query";
import { TableCurriculumYear } from "../../../components/Table";
import { CurriculumData } from "../../../components/types.ts";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
// import { getAcademicPeriods as getPeriodeAkdemikCoba } from "../../../hooks/usePeriodeAkademik.ts";
import {
  getCurriculumYear,
  useAddCurriculumYear,
  useUpdateCurriculumYear,
  useDeleteCurriculumYear,
} from "../../../hooks/academic/useCurriculumYear.ts";
import InfoAlert from "../../../components/InfoAlert.tsx";
import { getAcademicPeriods } from "../../../hooks/useGeneral.ts";

const CurriculumYear: React.FC = () => {
  const queryClient = useQueryClient();

  // --- state ---
  // const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<CurriculumData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --- data queries ---
  const {
    data: academicPeriods,
    isLoading: isLoadingAcademicPeriods,
    error: isErrorAcademicPeriods,
  } = getAcademicPeriods();
  const {
    data: curriculumData,
    isLoading: isCurriculumLoading,
    error: curriculumError,
  } = getCurriculumYear();

  // --- mutations ---
  const createMutation = useAddCurriculumYear();
  const updateMutation = useUpdateCurriculumYear();
  const deleteMutation = useDeleteCurriculumYear();

  // --- Conditional rendering ---
  if (isLoadingAcademicPeriods || isCurriculumLoading) {
    return <LoadingSpinner />;
  }

  if (isErrorAcademicPeriods) {
    return <div className="text-red-500">Gagal memuat periode akademik</div>;
  }

  if (curriculumError) {
    return <div className="text-red-500">Gagal memuat tahun kurikulum</div>;
  }

  const filteredData = curriculumData.filter((item) =>
    item.tahun.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // --- event handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id: string) => {
    const selectedData = curriculumData.find((item) => item.id === id);
    if (selectedData) {
      setCurrentData(selectedData);
      // setSelectedPeriodeId(selectedData.siakPeriodeAkademikId);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await deleteMutation.mutateAsync(id);
        setErrorMessage("");
      } catch (error: any) {
        console.error("Gagal menghapus data:", error);
        handleMutationError(error);
      }
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      tahun: "",
      keterangan: "",
      mulaiBerlaku: "",
      siakPeriodeAkademikId: "",
      tanggalMulai: "",
      tanggalAkhir: "",
    });
    // setSelectedPeriodeId("");
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(
      (
        currentData?.tahun &&
        currentData?.keterangan &&
        currentData?.siakPeriodeAkademikId &&
        currentData?.tanggalMulai &&
        currentData?.tanggalSelesai
      ) // ✅ fix di sini
    );
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    setErrorMessage("");

    const dataToSave = {
      tahun: currentData.tahun,
      keterangan: currentData.keterangan,
      mulaiBerlaku: currentData.mulaiBerlaku,
      // siakPeriodeAkademikId: selectedPeriodeId,
      siakPeriodeAkademikId: currentData.siakPeriodeAkademikId,
      tanggalMulai: currentData.tanggalMulai,
      tanggalSelesai: currentData.tanggalSelesai,
    };

    try {
      if (isEditing && currentData.id) {
        await updateMutation.mutateAsync({
          id: currentData.id,
          data: dataToSave,
        });
        setSuccessMessage("Data berhasil diperbarui.");
      } else if (isAdding) {
        await createMutation.mutateAsync(dataToSave);
        setSuccessMessage("Data berhasil ditambahkan.");
      }

      handleReset();
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error: any) {
      console.error("Gagal menyimpan data:", error);
      handleMutationError(error);
    }
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    // setSelectedPeriodeId("");
    setErrorMessage("");
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["periodeAkademik"] });
    queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
  };

  // --- pagination logic ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Loading state
  const isLoading =
    isCurriculumLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Tahun Kurikulum" className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow">
        {/* Error message display */}
        {errorMessage && (
          <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row px-4 py-2 gap-2 sm:gap-4 border-b-2 w-full flex-wrap">
          <div className="flex w-full sm:w-auto sm:order-1">
            <input
              type="search"
              placeholder="Cari Tahun Kurikulum"
              className="px-3 py-1 w-full sm:w-72 rounded-l-md border border-black/50"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="bg-primary-yellow w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button
              onClick={handleRefresh}
              className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center"
              disabled={isLoading}
            >
              <RefreshCw
                color="white"
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="bg-primary-green rounded py-2 px-4 text-white flex items-center cursor-pointer disabled:opacity-50 w-full sm:w-auto sm:ml-auto sm:order-3"
            disabled={isLoading}
          >
            <Plus className="mr-2" size={16} />
            Tambah
          </button>
        </div>

        {successMessage && <InfoAlert title="" boldText={successMessage} />}

        <div className="mt-8">
          <TableCurriculumYear
            data={paginatedData}
            tableHead={[
              "Tahun",
              "Keterangan",
              "Mulai Berlaku",
              "Tanggal Awal",
              "Tanggal Akhir",
              "Aksi",
            ]}
            error="Data tidak ditemukan."
            onEdit={handleEdit}
            onDelete={handleDelete}
            isEditing={isEditing}
            currentData={currentData}
            onSave={handleSave}
            onReset={handleReset}
            onInputChange={handleInputChange}
            isAdding={isAdding}
            isFormValid={isFormValid}
            periodeAkademikList={academicPeriods}
            // selectedPeriodeId={selectedPeriodeId}
            // setSelectedPeriodeId={setSelectedPeriodeId}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalRows={filteredData.length}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setItemsPerPage}
        />
      </div>
    </MainLayout>
  );
};

export default CurriculumYear;
